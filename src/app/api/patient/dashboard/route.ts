/**
 * H2H Healthcare - Patient Dashboard API
 * Fetch dashboard data for logged-in patient
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data - look up by email since auth ID may differ from users table ID
    let { data: userData } = await (adminClient.from('users') as any)
      .select('id, full_name, email, phone, avatar_url, role')
      .eq('email', user.email)
      .single();

    // Fallback: try by auth ID
    if (!userData) {
      const { data: fallback } = await (adminClient.from('users') as any)
        .select('id, full_name, email, phone, avatar_url, role')
        .eq('id', user.id)
        .single();
      userData = fallback;
    }

    if (!userData || userData.role !== 'patient') {
      return NextResponse.json({ success: false, error: 'Not a patient account' }, { status: 403 });
    }

    const patientId = userData.id;

    // Get upcoming appointments (future dates, not cancelled)
    const today = new Date().toISOString().split('T')[0];
    const { data: upcomingAppointments } = await (adminClient.from('appointments') as any)
      .select(`
        id,
        appointment_date,
        start_time,
        end_time,
        mode,
        status,
        amount,
        doctor:doctor_id(
          id,
          users:user_id(full_name, avatar_url)
        ),
        service:service_id(id, name),
        location:location_id(id, name, city, address)
      `)
      .eq('patient_id', patientId)
      .gte('appointment_date', today)
      .not('status', 'eq', 'cancelled')
      .order('appointment_date', { ascending: true })
      .order('start_time', { ascending: true })
      .limit(5);

    // Get completed appointments count
    const { count: completedCount } = await (adminClient.from('appointments') as any)
      .select('id', { count: 'exact', head: true })
      .eq('patient_id', patientId)
      .eq('status', 'completed');

    // Get upcoming appointments count
    const { count: upcomingCount } = await (adminClient.from('appointments') as any)
      .select('id', { count: 'exact', head: true })
      .eq('patient_id', patientId)
      .gte('appointment_date', today)
      .not('status', 'eq', 'cancelled');

    // Get medical records count
    const { count: recordsCount } = await (adminClient.from('medical_records') as any)
      .select('id', { count: 'exact', head: true })
      .eq('patient_id', patientId);

    // Get total spent (sum of paid appointments)
    const { data: paidAppointments } = await (adminClient.from('appointments') as any)
      .select('amount')
      .eq('patient_id', patientId)
      .eq('payment_status', 'paid');

    const totalSpent = paidAppointments?.reduce((sum: number, apt: any) => sum + (apt.amount || 0), 0) || 0;

    // Get recent payments (last 5 paid appointments)
    const { data: recentPayments } = await (adminClient.from('appointments') as any)
      .select(`
        id,
        amount,
        payment_status,
        razorpay_payment_id,
        created_at,
        service:service_id(name)
      `)
      .eq('patient_id', patientId)
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false })
      .limit(5);

    // Transform data for frontend
    const transformedAppointments = (upcomingAppointments || []).map((apt: any) => ({
      id: apt.id,
      service: apt.service?.name || 'Consultation',
      doctor: apt.doctor?.users?.full_name || 'Doctor',
      doctorAvatar: apt.doctor?.users?.avatar_url,
      date: apt.appointment_date,
      time: apt.start_time,
      endTime: apt.end_time,
      mode: apt.mode,
      status: apt.status,
      amount: apt.amount,
      location: apt.mode === 'online' ? 'Online' : (apt.location?.name || 'Clinic'),
      address: apt.location?.address,
    }));

    const transformedPayments = (recentPayments || []).map((payment: any) => ({
      id: payment.id,
      amount: payment.amount || 0,
      date: payment.created_at,
      status: payment.payment_status === 'paid' ? 'success' : payment.payment_status,
      service: payment.service?.name || 'Consultation',
      transactionId: payment.razorpay_payment_id,
    }));

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: userData.id,
          name: userData.full_name,
          email: userData.email,
          phone: userData.phone,
          avatar: userData.avatar_url,
        },
        stats: {
          upcoming: upcomingCount || 0,
          completed: completedCount || 0,
          records: recordsCount || 0,
          totalSpent: totalSpent,
        },
        upcomingAppointments: transformedAppointments,
        recentPayments: transformedPayments,
      },
    });
  } catch (error) {
    console.error('Error fetching patient dashboard:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
