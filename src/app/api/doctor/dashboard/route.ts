/**
 * H2H Healthcare - Doctor Dashboard API
 * GET /api/doctor/dashboard
 * Returns stats, recent appointments, prescriptions count, week trends, upcoming appointments.
 */

import { NextResponse } from 'next/server';
import { getDoctorFromRequest } from '@/lib/doctor-api';
import { createAdminClient } from '@/lib/supabase/server';

function getWeekBounds() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  const lastMonday = new Date(monday);
  lastMonday.setDate(monday.getDate() - 7);
  const lastSunday = new Date(lastMonday);
  lastSunday.setDate(lastMonday.getDate() + 6);
  lastSunday.setHours(23, 59, 59, 999);
  return {
    thisWeekStart: monday.toISOString().split('T')[0],
    thisWeekEnd: sunday.toISOString().split('T')[0],
    lastWeekStart: lastMonday.toISOString().split('T')[0],
    lastWeekEnd: lastSunday.toISOString().split('T')[0],
  };
}

export async function GET() {
  try {
    const doctor = await getDoctorFromRequest();
    if (!doctor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = createAdminClient();
    const today = new Date().toISOString().split('T')[0];
    const { thisWeekStart, thisWeekEnd, lastWeekStart, lastWeekEnd } = getWeekBounds();

    const [
      appointmentsRes,
      todayCountRes,
      completedRes,
      pendingRes,
      cancelledRes,
      recentAppointmentsRes,
      servicesRes,
      thisWeekRes,
      lastWeekRes,
      upcomingRes,
    ] = await Promise.all([
      adminClient
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('doctor_id', doctor.doctorId),
      adminClient
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('doctor_id', doctor.doctorId)
        .eq('appointment_date', today),
      adminClient
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('doctor_id', doctor.doctorId)
        .eq('status', 'completed'),
      adminClient
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('doctor_id', doctor.doctorId)
        .in('status', ['confirmed', 'pending']),
      adminClient
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('doctor_id', doctor.doctorId)
        .in('status', ['cancelled', 'no_show']),
      adminClient
        .from('appointments')
        .select(`
          id, appointment_date, start_time, end_time, status, amount, mode,
          payment_status, google_meet_link, metadata, created_at,
          patient:patient_id(id, full_name, email, phone),
          service:service_id(id, name),
          location:location_id(id, city, name)
        `)
        .eq('doctor_id', doctor.doctorId)
        .order('appointment_date', { ascending: false })
        .order('start_time', { ascending: false })
        .limit(20),
      adminClient
        .from('doctor_services')
        .select('service_id', { count: 'exact', head: true })
        .eq('doctor_id', doctor.doctorId),
      adminClient
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('doctor_id', doctor.doctorId)
        .gte('appointment_date', thisWeekStart)
        .lte('appointment_date', thisWeekEnd),
      adminClient
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('doctor_id', doctor.doctorId)
        .gte('appointment_date', lastWeekStart)
        .lte('appointment_date', lastWeekEnd),
      adminClient
        .from('appointments')
        .select(`
          id, appointment_date, start_time, status,
          patient:patient_id(full_name),
          service:service_id(name),
          location:location_id(name, city)
        `)
        .eq('doctor_id', doctor.doctorId)
        .gte('appointment_date', today)
        .in('status', ['confirmed', 'pending'])
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true })
        .limit(5),
    ]);

    let totalPrescriptions = 0;
    try {
      const prescriptionsRes = await adminClient
        .from('prescriptions')
        .select('id', { count: 'exact', head: true })
        .eq('doctor_id', doctor.doctorId);
      totalPrescriptions = prescriptionsRes.count ?? 0;
    } catch {
      // prescriptions table may not exist yet; dashboard still works
    }

    const totalAppointments = appointmentsRes.count ?? 0;
    const todayAppointments = todayCountRes.count ?? 0;
    const completedCount = completedRes.count ?? 0;
    const pendingCount = pendingRes.count ?? 0;
    const cancelledCount = cancelledRes.count ?? 0;
    const totalServices = servicesRes.count ?? 0;
    const thisWeekCount = thisWeekRes.count ?? 0;
    const lastWeekCount = lastWeekRes.count ?? 0;
    const rawAppointments = (recentAppointmentsRes.data || []) as any[];

    const enrichedAppointments = rawAppointments.map((raw) => ({
      id: raw.id,
      date: raw.appointment_date,
      time: raw.start_time,
      status: raw.status,
      amount: raw.amount ?? 0,
      mode: raw.mode ?? 'offline',
      patient: raw.patient?.full_name ?? raw.metadata?.patient_name ?? 'Unknown',
      patientEmail: raw.patient?.email ?? '',
      patientPhone: raw.patient?.phone ?? raw.metadata?.patient_phone ?? '',
      doctor: doctor.fullName,
      service: raw.service?.name ?? 'Unknown Service',
      location: raw.location?.city ?? raw.location?.name ?? 'N/A',
      googleMeetLink: raw.metadata?.doctor_video_url ?? raw.google_meet_link ?? null,
    }));

    const { data: allPatientIds } = await adminClient
      .from('appointments')
      .select('patient_id')
      .eq('doctor_id', doctor.doctorId);
    const uniquePatientIds = [...new Set((allPatientIds ?? []).map((r: { patient_id: string }) => r.patient_id))];
    const totalPatients = uniquePatientIds.length;

    const upcomingRaw = (upcomingRes.data || []) as any[];
    const upcomingAppointments = upcomingRaw.map((raw) => ({
      id: raw.id,
      date: raw.appointment_date,
      time: raw.start_time,
      status: raw.status,
      patient: raw.patient?.full_name ?? 'Unknown',
      service: raw.service?.name ?? 'N/A',
      location: raw.location?.name ?? raw.location?.city ?? 'N/A',
    }));

    const weekTrend = lastWeekCount > 0
      ? Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100)
      : (thisWeekCount > 0 ? 100 : 0);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalAppointments,
          todayAppointments,
          completedCount,
          pendingCount,
          cancelledCount,
          totalPatients,
          totalServices,
          totalPrescriptions,
          thisWeekAppointments: thisWeekCount,
          lastWeekAppointments: lastWeekCount,
          weekTrend,
        },
        recentAppointments: enrichedAppointments,
        upcomingAppointments,
      },
    });
  } catch (error) {
    console.error('Doctor dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
