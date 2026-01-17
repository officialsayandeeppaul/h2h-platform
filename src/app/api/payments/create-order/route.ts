import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

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

    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('id, amount, patient_id')
      .eq('id', appointmentId)
      .single() as { data: { id: string; amount: number; patient_id: string } | null; error: any };

    if (appointmentError || !appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    if (appointment.patient_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const options = {
      amount: Math.round(Number(appointment.amount) * 100),
      currency: 'INR',
      receipt: `receipt_${appointmentId}`,
      notes: {
        appointmentId,
        userId: user.id,
      },
    };

    const order = await razorpay.orders.create(options);

    await (supabase as any)
      .from('appointments')
      .update({ razorpay_order_id: order.id })
      .eq('id', appointmentId);

    await (supabase as any)
      .from('payments')
      .insert({
        appointment_id: appointmentId,
        user_id: user.id,
        amount: appointment.amount,
        razorpay_order_id: order.id,
        status: 'pending',
      });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
