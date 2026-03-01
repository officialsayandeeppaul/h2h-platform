/**
 * H2H Healthcare - Doctor Prescriptions API
 * GET: list prescriptions written by this doctor
 * POST: create prescription for one of doctor's appointments
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDoctorFromRequest } from '@/lib/doctor-api';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const doctor = await getDoctorFromRequest();
    if (!doctor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));
    const patientId = searchParams.get('patientId') || undefined;
    const appointmentId = searchParams.get('appointmentId') || undefined;

    const adminClient = createAdminClient();

    let query = adminClient
      .from('prescriptions')
      .select(`
        id, appointment_id, doctor_id, patient_id, file_url, file_name, notes, created_at,
        patient:patient_id(id, full_name, email),
        appointment:appointment_id(appointment_date, start_time, service:service_id(name))
      `, { count: 'exact' })
      .eq('doctor_id', doctor.doctorId);

    if (patientId) query = query.eq('patient_id', patientId);
    if (appointmentId) query = query.eq('appointment_id', appointmentId);
    query = query.order('created_at', { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Doctor prescriptions GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const list = (data || []).map((row: any) => ({
      id: row.id,
      appointmentId: row.appointment_id,
      patientId: row.patient_id,
      fileUrl: row.file_url,
      fileName: row.file_name,
      notes: row.notes,
      createdAt: row.created_at,
      patient: row.patient ? { id: row.patient.id, fullName: row.patient.full_name, email: row.patient.email } : null,
      appointment: row.appointment
        ? {
            date: row.appointment.appointment_date,
            startTime: row.appointment.start_time,
            serviceName: row.appointment.service?.name,
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      data: list,
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize),
    });
  } catch (e) {
    console.error('Doctor prescriptions error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const doctor = await getDoctorFromRequest();
    if (!doctor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { appointmentId, notes, fileUrl, fileName } = body as {
      appointmentId: string;
      notes?: string;
      fileUrl?: string;
      fileName?: string;
    };

    if (!appointmentId) return NextResponse.json({ error: 'appointmentId is required' }, { status: 400 });

    const adminClient = createAdminClient();

    const { data: appointment, error: aptErr } = await adminClient
      .from('appointments')
      .select('id, patient_id, doctor_id')
      .eq('id', appointmentId)
      .eq('doctor_id', doctor.doctorId)
      .single();

    if (aptErr || !appointment) {
      return NextResponse.json({ error: 'Appointment not found or not yours' }, { status: 404 });
    }

    const { data: inserted, error: insertErr } = await (adminClient.from('prescriptions') as any).insert({
      appointment_id: appointmentId,
      doctor_id: doctor.doctorId,
      patient_id: (appointment as any).patient_id,
      file_url: fileUrl || '',
      file_name: fileName || null,
      notes: notes ?? null,
    }).select().single();

    if (insertErr) {
      console.error('Doctor prescriptions POST error:', insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: inserted });
  } catch (e) {
    console.error('Doctor prescriptions POST error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
