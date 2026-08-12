/**
 * H2H Healthcare - Admin Payments API
 * Appointment payments + Quick Booking payments (Razorpay)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/payments - Get all payments with appointment + quick booking details
 */
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData } = await (adminClient.from('users') as any)
      .select('role')
      .eq('email', user.email)
      .single();

    if (!userData || !['super_admin', 'admin'].includes((userData as any).role)) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const [appointmentsRes, quickBookingsRes] = await Promise.all([
      (adminClient.from('appointments') as any)
        .select(
          `
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
      `
        )
        .order('created_at', { ascending: false }),
      (adminClient.from('quick_bookings') as any)
        .select(
          `
        id,
        service_name,
        patient_name,
        patient_phone,
        patient_email,
        status,
        amount,
        payment_status,
        payment_required,
        razorpay_payment_id,
        razorpay_order_id,
        created_at,
        updated_at
      `
        )
        .neq('payment_status', 'not_required')
        .order('created_at', { ascending: false })
        .limit(500),
    ]);

    if (appointmentsRes.error) {
      console.error('Error fetching appointment payments:', appointmentsRes.error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch payments' },
        { status: 500 }
      );
    }

    // Quick bookings table may be missing on older DBs — don't fail the whole payments page
    if (quickBookingsRes.error) {
      const missing = /schema cache|does not exist|Could not find the table/i.test(
        quickBookingsRes.error.message || ''
      );
      if (!missing) {
        console.error('Error fetching quick booking payments:', quickBookingsRes.error);
      }
    }

    const appointmentPayments = (appointmentsRes.data || []).map((apt: any) => ({
      id: apt.id,
      source: 'appointment' as const,
      appointment_id: apt.id,
      amount: Number(apt.amount) || 0,
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

    const mapQuickPaymentStatus = (ps: string): string => {
      // Keep waived distinct so revenue stats don't treat free leads as paid revenue
      if (ps === 'waived') return 'waived';
      if (ps === 'paid' || ps === 'pending' || ps === 'failed' || ps === 'refunded') return ps;
      return 'pending';
    };

    const quickPayments = (quickBookingsRes.data || []).map((qb: any) => ({
      id: `qb_${qb.id}`,
      source: 'quick_booking' as const,
      appointment_id: null,
      quick_booking_id: qb.id,
      amount: Number(qb.amount) || 0,
      currency: 'INR',
      status: mapQuickPaymentStatus(qb.payment_status),
      payment_method: qb.razorpay_payment_id
        ? 'razorpay'
        : qb.payment_status === 'waived'
          ? 'waived'
          : 'pending',
      razorpay_payment_id: qb.razorpay_payment_id,
      razorpay_order_id: qb.razorpay_order_id,
      lead_status: qb.status,
      created_at: qb.created_at,
      updated_at: qb.updated_at,
      appointment: {
        id: qb.id,
        appointment_date: null,
        start_time: null,
        mode: 'quick_booking',
        patient: {
          full_name: qb.patient_name,
          email: qb.patient_email || '',
          phone: qb.patient_phone,
        },
        doctor: null,
        service: { name: qb.service_name },
      },
    }));

    const transformedPayments = [...appointmentPayments, ...quickPayments].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ success: true, data: transformedPayments });
  } catch (error) {
    console.error('Error in payments API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
