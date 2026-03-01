/**
 * H2H Healthcare - Create Razorpay Order API
 * Creates a payment order for an appointment booking
 */

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Lazy initialization to prevent build errors
let razorpayInstance: Razorpay | null = null;

function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials not configured');
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

interface AppointmentData {
  id: string;
  amount: number;
  patient_id: string;
  service: {
    name: string;
  };
}

interface UserData {
  full_name: string;
  email: string;
  phone: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { appointmentId } = body;

    if (!appointmentId) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Fetch appointment with service details (use admin client to bypass RLS)
    const { data: appointment, error: appointmentError } = await adminClient
      .from('appointments')
      .select(`
        id, amount, patient_id,
        service:services(name)
      `)
      .eq('id', appointmentId)
      .single() as { data: AppointmentData | null; error: any };

    if (appointmentError || !appointment) {
      console.error('Appointment fetch error:', appointmentError);
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Verify the logged-in user owns this appointment (match by email since IDs may differ)
    const { data: patientUser } = await adminClient
      .from('users')
      .select('id, email')
      .eq('id', appointment.patient_id)
      .single() as { data: { id: string; email: string } | null; error: any };

    if (!patientUser || (patientUser.email !== user.email && appointment.patient_id !== user.id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch user details for prefill
    const { data: userData } = await adminClient
      .from('users')
      .select('full_name, email, phone')
      .eq('id', appointment.patient_id)
      .single() as { data: UserData | null; error: any };

    const options = {
      amount: Math.round(Number(appointment.amount) * 100), // Convert to paise
      currency: 'INR',
      receipt: `h2h_${appointmentId.slice(0, 8)}`,
      notes: {
        appointmentId,
        userId: user.id,
        service: appointment.service?.name || 'Healthcare Service',
      },
    };

    const order = await getRazorpay().orders.create(options);

    // Update appointment with order ID
    await (adminClient
      .from('appointments') as any)
      .update({ razorpay_order_id: order.id })
      .eq('id', appointmentId);

    // Create payment record
    await (adminClient
      .from('payments') as any)
      .insert({
        appointment_id: appointmentId,
        user_id: appointment.patient_id,
        amount: appointment.amount,
        razorpay_order_id: order.id,
        status: 'pending',
      });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      prefill: {
        name: userData?.full_name || '',
        email: userData?.email || user.email || '',
        contact: userData?.phone || '',
      },
      notes: {
        service: appointment.service?.name || 'Healthcare Service',
      },
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
