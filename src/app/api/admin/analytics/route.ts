/**
 * Admin Analytics API - Detailed analysis for super admin
 * Returns appointments by day, by service, revenue trends, top doctors, etc.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let { data: userData } = await (adminClient.from('users') as any)
      .select('role')
      .eq('email', user.email)
      .single();
    if (!userData) {
      const fallback = await (adminClient.from('users') as any)
        .select('role')
        .eq('id', user.id)
        .single();
      userData = fallback.data;
    }

    const userRole = (userData as any)?.role;
    if (!userRole || !['super_admin', 'admin', 'location_admin'].includes(userRole)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const days = Math.min(90, Math.max(7, parseInt(searchParams.get('days') || '30', 10)));

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    // Appointments by date (last N days) + created_at for booking funnel
    const { data: appointmentsByDate } = await (adminClient.from('appointments') as any)
      .select('id, appointment_date, amount, payment_status, status, mode, service_id, doctor_id, patient_id, created_at')
      .gte('appointment_date', startDateStr)
      .order('appointment_date', { ascending: true });

    // Appointments created (booked) in period - for funnel
    const { data: appointmentsBookedInPeriod } = await (adminClient.from('appointments') as any)
      .select('id, payment_status, status, created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    const dateMap: Record<string, { appointments: number; revenue: number; completed: number }> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      dateMap[key] = { appointments: 0, revenue: 0, completed: 0 };
    }
    (appointmentsByDate || []).forEach((a: any) => {
      if (!dateMap[a.appointment_date]) return;
      dateMap[a.appointment_date].appointments += 1;
      if (a.payment_status === 'paid') dateMap[a.appointment_date].revenue += parseFloat(a.amount || 0);
      if (a.status === 'completed') dateMap[a.appointment_date].completed += 1;
    });
    const appointmentsTrend = Object.entries(dateMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({ date, ...v }));

    // By service
    const serviceIds = [...new Set((appointmentsByDate || []).map((a: any) => a.service_id).filter(Boolean))];
    let services: any[] = [];
    if (serviceIds.length > 0) {
      const { data } = await adminClient.from('services').select('id, name').in('id', serviceIds);
      services = data || [];
    }
    const serviceMap: Record<string, string> = {};
    services.forEach((s: any) => { serviceMap[s.id] = s.name; });
    const byService: Record<string, { count: number; revenue: number }> = {};
    (appointmentsByDate || []).forEach((a: any) => {
      const name = serviceMap[a.service_id] || 'Unknown';
      if (!byService[name]) byService[name] = { count: 0, revenue: 0 };
      byService[name].count += 1;
      if (a.payment_status === 'paid') byService[name].revenue += parseFloat(a.amount || 0);
    });
    const serviceBreakdown = Object.entries(byService)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.count - a.count);

    // By mode (online/offline)
    const byMode: Record<string, number> = { online: 0, offline: 0, home_visit: 0 };
    (appointmentsByDate || []).forEach((a: any) => {
      const m = (a.mode || 'offline') as string;
      byMode[m] = (byMode[m] || 0) + 1;
    });
    const modeBreakdown = Object.entries(byMode).map(([mode, count]) => ({ mode, count }));

    // Top doctors by appointments
    const doctorIds = [...new Set((appointmentsByDate || []).map((a: any) => a.doctor_id).filter(Boolean))];
    let doctorRows: any[] = [];
    if (doctorIds.length > 0) {
      const { data } = await adminClient.from('doctors').select('id, user_id').in('id', doctorIds);
      doctorRows = data || [];
    }
    const userIds = doctorRows.map((d: any) => d.user_id).filter(Boolean) as string[];
    const { data: userNames } = userIds.length
      ? await adminClient.from('users').select('id, full_name').in('id', userIds)
      : { data: [] };
    const userMap: Record<string, string> = {};
    ((userNames as any[]) || []).forEach((u: any) => { userMap[u.id] = u.full_name || 'Unknown'; });
    const docUserMap: Record<string, string> = {};
    doctorRows.forEach((d: any) => {
      docUserMap[d.id] = userMap[d.user_id] || 'Unknown';
    });
    const byDoctor: Record<string, { count: number; revenue: number }> = {};
    (appointmentsByDate || []).forEach((a: any) => {
      const name = docUserMap[a.doctor_id] || 'Unknown';
      if (!byDoctor[name]) byDoctor[name] = { count: 0, revenue: 0 };
      byDoctor[name].count += 1;
      if (a.payment_status === 'paid') byDoctor[name].revenue += parseFloat(a.amount || 0);
    });
    const topDoctors = Object.entries(byDoctor)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Summary
    const totalAppointments = (appointmentsByDate || []).length;
    const totalRevenue = (appointmentsByDate || [])
      .filter((a: any) => a.payment_status === 'paid')
      .reduce((s: number, a: any) => s + parseFloat(a.amount || 0), 0);
    const completedCount = (appointmentsByDate || []).filter((a: any) => a.status === 'completed').length;
    const onlineCount = (appointmentsByDate || []).filter((a: any) => a.mode === 'online').length;
    const paidCount = (appointmentsByDate || []).filter((a: any) => a.payment_status === 'paid').length;
    const cancelledCount = (appointmentsByDate || []).filter((a: any) => a.status === 'cancelled').length;
    const noShowCount = (appointmentsByDate || []).filter((a: any) => a.status === 'no_show').length;

    // User / Patient metrics
    const { count: totalPatientsCount } = await adminClient
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'patient');
    const { data: newPatientsInPeriod } = await adminClient
      .from('users')
      .select('id, created_at')
      .eq('role', 'patient')
      .gte('created_at', startDate.toISOString());
    const newPatients = (newPatientsInPeriod || []).length;
    const patientIdsInPeriod = [...new Set((appointmentsByDate || []).map((a: any) => a.patient_id).filter(Boolean))];
    const activePatientsInPeriod = patientIdsInPeriod.length;
    const patientApptCounts: Record<string, number> = {};
    (appointmentsByDate || []).forEach((a: any) => {
      if (a.patient_id) patientApptCounts[a.patient_id] = (patientApptCounts[a.patient_id] || 0) + 1;
    });
    const repeatPatients = Object.values(patientApptCounts).filter((c) => c >= 2).length;

    // Lead conversion funnel (bookings in period)
    const bookedInPeriod = (appointmentsBookedInPeriod || []).length;
    const paidInPeriod = (appointmentsBookedInPeriod || []).filter((a: any) => a.payment_status === 'paid').length;
    const completedInPeriod = (appointmentsBookedInPeriod || []).filter((a: any) => a.status === 'completed').length;
    const bookToPaidRate = bookedInPeriod > 0 ? Math.round((paidInPeriod / bookedInPeriod) * 100) : 0;
    const paidToCompletedRate = paidInPeriod > 0 ? Math.round((completedInPeriod / paidInPeriod) * 100) : 0;

    // User signups by day
    const signupDateMap: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      signupDateMap[d.toISOString().split('T')[0]] = 0;
    }
    (newPatientsInPeriod || []).forEach((u: any) => {
      const key = (u.created_at || '').split('T')[0];
      if (signupDateMap[key] !== undefined) signupDateMap[key]++;
    });
    const userGrowthTrend = Object.entries(signupDateMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, newUsers: count }));

    // Sales KPIs
    const avgOrderValue = paidCount > 0 ? Math.round(totalRevenue / paidCount) : 0;
    const cancellationRate = totalAppointments > 0 ? Math.round((cancelledCount / totalAppointments) * 100) : 0;
    const noShowRate = totalAppointments > 0 ? Math.round((noShowCount / totalAppointments) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalAppointments,
          totalRevenue,
          completedCount,
          onlineCount,
          days,
          totalPatients: totalPatientsCount || 0,
          newPatients,
          activePatientsInPeriod,
          repeatPatients,
          bookedInPeriod,
          paidInPeriod,
          completedInPeriod,
          bookToPaidRate,
          paidToCompletedRate,
          avgOrderValue,
          cancellationRate,
          noShowRate,
        },
        appointmentsTrend,
        serviceBreakdown,
        modeBreakdown,
        topDoctors,
        userGrowthTrend,
      },
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
