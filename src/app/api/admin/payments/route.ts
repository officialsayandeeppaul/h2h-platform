/**
 * H2H Healthcare - Admin Payments API
 * Fetch and manage payment transactions
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/payments - Get all payments with appointment details
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Check if user is super admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData } = await (adminClient
      .from('users') as any)
      .select('role')
      .eq('email', user.email)
      .single();

    if (!userData || !['super_admin', 'admin'].includes((userData as any).role)) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    // Fetch all appointments as payment records (payment data lives in appointments table)
    const { data: appointments, error } = await (adminClient
      .from('appointments') as any)
      .select(`
        id,
        appointment_date,
        start_time,
        mode,
        amount,
        status,
        payment_status,
        razorpay_payment_id,
        razorpay_order_id,
        created_at,
        updated_at,
        patient:patient_id(id, full_name, email, phone),
        doctor:doctor_id(id, users:user_id(full_name, email)),
        service:service_id(id, name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch payments' }, { status: 500 });
    }

    // Transform appointments to payment format expected by frontend
    const transformedPayments = (appointments || []).map((apt: any) => ({
      id: apt.id,
      appointment_id: apt.id,
      amount: apt.amount || 0,
      currency: 'INR',
      status: apt.payment_status || 'pending',
      payment_method: apt.razorpay_payment_id ? 'razorpay' : 'pending',
      razorpay_payment_id: apt.razorpay_payment_id,
      razorpay_order_id: apt.razorpay_order_id,
      created_at: apt.created_at,
      updated_at: apt.updated_at,
      appointment: {
        id: apt.id,
        appointment_date: apt.appointment_date,
        start_time: apt.start_time,
        mode: apt.mode,
        patient: apt.patient,
        doctor: apt.doctor,
        service: apt.service,
      },
    }));

    return NextResponse.json({ success: true, data: transformedPayments });
  } catch (error) {
    console.error('Error in payments API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
