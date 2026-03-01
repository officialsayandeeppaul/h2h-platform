/**
 * H2H Healthcare - Patient Payments API
 * Fetch payment history for logged-in patient
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();
    const searchParams = request.nextUrl.searchParams;
    
    const status = searchParams.get('status'); // paid, pending, refunded, all
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Look up user by email since auth ID may differ from users table ID
    const { data: userData } = await (adminClient.from('users') as any)
      .select('id')
      .eq('email', user.email)
      .single();
    const patientId = userData?.id || user.id;

    let query = (adminClient.from('appointments') as any)
      .select(`
        id,
        appointment_date,
        start_time,
        amount,
        payment_status,
        razorpay_payment_id,
        razorpay_order_id,
        created_at,
        service:service_id(id, name),
        doctor:doctor_id(users:user_id(full_name))
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    // Apply status filter
    if (status && status !== 'all') {
      query = query.eq('payment_status', status);
    }

    // Pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: payments, error } = await query;

    if (error) {
      console.error('Error fetching payments:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch payments' }, { status: 500 });
    }

    // Calculate totals
    const { data: allPayments } = await (adminClient.from('appointments') as any)
      .select('amount, payment_status')
      .eq('patient_id', patientId);

    const stats = {
      totalPaid: allPayments?.filter((p: any) => p.payment_status === 'paid').reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0,
      totalPending: allPayments?.filter((p: any) => p.payment_status === 'pending').reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0,
      totalRefunded: allPayments?.filter((p: any) => p.payment_status === 'refunded').reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0,
      count: allPayments?.length || 0,
    };

    // Transform data
    const transformedPayments = (payments || []).map((payment: any) => ({
      id: payment.id,
      date: payment.created_at,
      appointmentDate: payment.appointment_date,
      time: payment.start_time,
      amount: payment.amount || 0,
      status: payment.payment_status,
      transactionId: payment.razorpay_payment_id,
      orderId: payment.razorpay_order_id,
      service: payment.service?.name || 'Consultation',
      doctor: payment.doctor?.users?.full_name || 'Doctor',
    }));

    return NextResponse.json({
      success: true,
      data: transformedPayments,
      stats,
      pagination: {
        page,
        limit,
        total: stats.count,
      },
    });
  } catch (error) {
    console.error('Error in patient payments API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
