/**
 * Admin Dashboard API - Stats and overview (fully dynamic, no mock data)
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

    // Look up by email first since auth ID may differ from users table ID
    let { data: userData } = await (adminClient.from('users') as any)
      .select('role, location_id')
      .eq('email', user.email)
      .single();
    if (!userData) {
      const fallback = await (adminClient.from('users') as any)
        .select('role, location_id')
        .eq('id', user.id)
        .single();
      userData = fallback.data;
    }

    const userRole = (userData as any)?.role;
    if (!userRole || !['super_admin', 'admin', 'location_admin'].includes(userRole)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const today = new Date().toISOString().split('T')[0];

    // Get counts using admin client to bypass RLS
    const [servicesRes, doctorsRes, appointmentsRes, usersRes, revenueRes, locationsRes] = await Promise.all([
      adminClient.from('services').select('id', { count: 'exact', head: true }).eq('is_active', true),
      adminClient.from('doctors').select('id', { count: 'exact', head: true }).eq('is_active', true),
      adminClient.from('appointments').select('id', { count: 'exact', head: true }),
      adminClient.from('users').select('id', { count: 'exact', head: true }).eq('role', 'patient'),
      (adminClient.from('appointments') as any).select('amount, payment_status').eq('payment_status', 'paid'),
      adminClient.from('locations').select('id, name, city').eq('is_active', true),
    ]);

    // Calculate revenue from appointments (where actual payment data lives)
    const paidAppointments = revenueRes.data || [];
    const totalRevenue = paidAppointments
      .reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);

    // Today's appointments count
    const { count: todayAppointmentsCount } = await adminClient
      .from('appointments')
      .select('id', { count: 'exact', head: true })
      .eq('appointment_date', today);

    // Recent appointments with joined data
    const { data: recentAppointments } = await adminClient
      .from('appointments')
      .select(`
        id, appointment_date, start_time, end_time, status, amount, mode,
        payment_status, google_meet_link, metadata, created_at,
        patient:patient_id(id, full_name, email, phone),
        doctor:doctor_id(id, user_id),
        service:service_id(id, name),
        location:location_id(id, city, name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    // Enrich appointments with doctor names
    const enrichedAppointments = [];
    for (const rawApt of (recentAppointments || []) as any[]) {
      let doctorName = 'Unknown Doctor';
      if (rawApt.doctor?.user_id) {
        const { data: doctorUser } = await adminClient
          .from('users')
          .select('full_name')
          .eq('id', rawApt.doctor.user_id)
          .single();
        if (doctorUser) doctorName = (doctorUser as any).full_name;
      }
      enrichedAppointments.push({
        id: rawApt.id,
        date: rawApt.appointment_date,
        time: rawApt.start_time,
        status: rawApt.status,
        amount: rawApt.amount || 0,
        mode: rawApt.mode,
        paymentStatus: rawApt.payment_status,
        patient: rawApt.patient?.full_name || rawApt.metadata?.patient_name || 'Unknown',
        patientEmail: rawApt.patient?.email || '',
        patientPhone: rawApt.patient?.phone || rawApt.metadata?.patient_phone || '',
        doctor: doctorName,
        service: rawApt.service?.name || 'Unknown Service',
        location: rawApt.location?.city || 'N/A',
        googleMeetLink: rawApt.google_meet_link || null,
      });
    }

    // Location performance stats
    const { data: allAppointments } = await adminClient
      .from('appointments')
      .select('location_id, amount, payment_status');
    const { data: allDoctors } = await adminClient
      .from('doctors')
      .select('location_id')
      .eq('is_active', true);

    const locations = locationsRes.data || [];
    const locationStats = locations.map((loc: any) => {
      const locAppointments = (allAppointments || []).filter((a: any) => a.location_id === loc.id);
      const locDoctors = (allDoctors || []).filter((d: any) => d.location_id === loc.id);
      const locRevenue = locAppointments
        .filter((a: any) => a.payment_status === 'paid')
        .reduce((sum: number, a: any) => sum + (parseFloat(a.amount) || 0), 0);
      return {
        id: loc.id,
        city: loc.city,
        name: loc.name,
        appointments: locAppointments.length,
        doctors: locDoctors.length,
        revenue: locRevenue,
      };
    }).sort((a: any, b: any) => b.appointments - a.appointments);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalServices: servicesRes.count || 0,
          totalDoctors: doctorsRes.count || 0,
          totalAppointments: appointmentsRes.count || 0,
          todayAppointments: todayAppointmentsCount || 0,
          totalPatients: usersRes.count || 0,
          totalRevenue,
        },
        recentAppointments: enrichedAppointments,
        locationStats,
      }
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
