/**
 * GET single prescription (doctor - own only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDoctorFromRequest } from '@/lib/doctor-api';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const doctor = await getDoctorFromRequest();
    if (!doctor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from('prescriptions')
      .select(`
        id, appointment_id, doctor_id, patient_id, file_url, file_name, notes, created_at,
        patient:patient_id(id, full_name, email, phone),
        appointment:appointment_id(appointment_date, start_time, service:service_id(name))
      `)
      .eq('id', id)
      .eq('doctor_id', doctor.doctorId)
      .single();

    if (error || !data) return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });

    const row = data as any;
    const patient = row.patient;
    const apt = row.appointment;
    return NextResponse.json({
      success: true,
      data: {
        id: row.id,
        appointmentId: row.appointment_id,
        patientId: row.patient_id,
        fileUrl: row.file_url,
        fileName: row.file_name,
        notes: row.notes,
        createdAt: row.created_at,
        patient: patient ? {
          id: patient.id,
          fullName: patient.full_name ?? patient.fullName,
          email: patient.email,
          phone: patient.phone,
        } : null,
        appointment: apt ? {
          date: apt.appointment_date ?? apt.date,
          startTime: apt.start_time ?? apt.startTime,
          serviceName: apt.service?.name ?? apt.serviceName,
        } : null,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const doctor = await getDoctorFromRequest();
    if (!doctor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const adminClient = createAdminClient();
    const body = await request.json();
    const { notes, fileUrl, fileName } = body;

    const { data: existingRow, error: fetchErr } = await adminClient
      .from('prescriptions')
      .select('id, appointment_id, patient:patient_id(full_name)')
      .eq('id', id)
      .eq('doctor_id', doctor.doctorId)
      .single();

    if (fetchErr || !existingRow) return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });

    const existing = existingRow as any;

    const update: Record<string, unknown> = {};
    if (notes !== undefined) update.notes = notes;
    if (fileUrl !== undefined) update.file_url = fileUrl;
    if (fileName !== undefined) update.file_name = fileName;

    if (Object.keys(update).length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

    const { data: updated, error: updateErr } = await (adminClient.from('prescriptions') as any)
      .update(update)
      .eq('id', id)
      .eq('doctor_id', doctor.doctorId)
      .select()
      .single();

    if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

    if (notes !== undefined) {
      try {
        await adminClient.from('doctor_activity_log').insert({
          doctor_id: doctor.doctorId,
          action_type: 'prescription_edited',
          entity_type: 'prescription',
          entity_id: id,
          appointment_id: existing.appointment_id ?? null,
          patient_name: existing.patient?.full_name ?? existing.patient?.fullName ?? 'Unknown',
        });
      } catch (logErr) {
        console.warn('Activity log insert failed:', logErr);
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
