/**
 * H2H Healthcare - Doctor Appointments API
 * GET /api/doctor/appointments
 * List appointments for the logged-in doctor with optional filters.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDoctorFromRequest } from '@/lib/doctor-api';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const doctor = await getDoctorFromRequest();
    if (!doctor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const mode = searchParams.get('mode') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;
    const date = searchParams.get('date') || undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '10', 10)));

    const adminClient = createAdminClient();

    let query = adminClient
      .from('appointments')
      .select(
        `
        id, appointment_date, start_time, end_time, status, amount, mode,
        payment_status, google_meet_link, metadata, created_at,
        patient:patient_id(id, full_name, email, phone),
        service:service_id(id, name),
        location:location_id(id, name, city, address)
      `,
        { count: 'exact' }
      )
      .eq('doctor_id', doctor.doctorId);

    if (status) query = query.eq('status', status);
    if (mode) query = query.eq('mode', mode);
    if (date) query = query.eq('appointment_date', date);
    if (dateFrom) query = query.gte('appointment_date', dateFrom);
    if (dateTo) query = query.lte('appointment_date', dateTo);

    query = query
      .order('appointment_date', { ascending: false })
      .order('start_time', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Doctor appointments list error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const list = (data || []).map((raw: any) => ({
      id: raw.id,
      date: raw.appointment_date,
      startTime: raw.start_time,
      endTime: raw.end_time,
      status: raw.status,
      amount: raw.amount ?? 0,
      mode: raw.mode ?? 'offline',
      paymentStatus: raw.payment_status,
      googleMeetLink: raw.metadata?.doctor_video_url ?? raw.google_meet_link ?? null,
      patient: raw.patient
        ? {
            id: raw.patient.id,
            fullName: raw.patient.full_name,
            email: raw.patient.email ?? '',
            phone: raw.patient.phone ?? '',
          }
        : {
            id: null,
            fullName: raw.metadata?.patient_name ?? 'Unknown',
            email: raw.metadata?.patient_email ?? '',
            phone: raw.metadata?.patient_phone ?? '',
          },
      service: raw.service ? { id: raw.service.id, name: raw.service.name } : { id: null, name: 'Unknown' },
      location: raw.location
        ? { id: raw.location.id, name: raw.location.name, city: raw.location.city, address: raw.location.address }
        : null,
      createdAt: raw.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: list,
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize),
    });
  } catch (error) {
    console.error('Doctor appointments API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
