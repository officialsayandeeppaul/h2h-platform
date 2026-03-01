/**
 * H2H Healthcare - Doctor Single Appointment API
 * GET /api/doctor/appointments/[appointmentId] - fetch one (must be this doctor's)
 * PATCH /api/doctor/appointments/[appointmentId] - update status/notes (e.g. completed)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDoctorFromRequest } from '@/lib/doctor-api';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  try {
    const doctor = await getDoctorFromRequest();
    if (!doctor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { appointmentId } = await params;
    const adminClient = createAdminClient();

    const { data: appointment, error } = await adminClient
      .from('appointments')
      .select(
        `
        id, appointment_date, start_time, end_time, status, amount, mode,
        payment_status, google_meet_link, notes, metadata, created_at,
        patient:patient_id(id, full_name, email, phone),
        service:service_id(id, name, duration_minutes),
        location:location_id(id, name, city, address)
      `
      )
      .eq('id', appointmentId)
      .eq('doctor_id', doctor.doctorId)
      .single();

    if (error || !appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const raw = appointment as any;
    return NextResponse.json({
      success: true,
      data: {
        id: raw.id,
        date: raw.appointment_date,
        startTime: raw.start_time,
        endTime: raw.end_time,
        status: raw.status,
        amount: raw.amount ?? 0,
        mode: raw.mode ?? 'offline',
        paymentStatus: raw.payment_status,
        googleMeetLink: raw.metadata?.doctor_video_url ?? raw.google_meet_link ?? null,
        notes: raw.notes ?? null,
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
        service: raw.service
          ? { id: raw.service.id, name: raw.service.name, durationMinutes: raw.service.duration_minutes }
          : null,
        location: raw.location
          ? { id: raw.location.id, name: raw.location.name, city: raw.location.city, address: raw.location.address }
          : null,
        createdAt: raw.created_at,
      },
    });
  } catch (error) {
    console.error('Doctor appointment GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  try {
    const doctor = await getDoctorFromRequest();
    if (!doctor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { appointmentId } = await params;
    const adminClient = createAdminClient();
    const body = await request.json();
    const { status, notes } = body;

    const { data: existing, error: fetchError } = await adminClient
      .from('appointments')
      .select('id, status, patient:patient_id(full_name)')
      .eq('id', appointmentId)
      .eq('doctor_id', doctor.doctorId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const existingData = existing as any;
    const patientName = existingData?.patient?.full_name ?? existingData?.patient?.fullName ?? 'Unknown';

    const updateData: Record<string, unknown> = {};
    const allowedStatuses = ['confirmed', 'completed', 'cancelled', 'no_show'];
    const newStatus = typeof status === 'string' && allowedStatuses.includes(status) ? status : null;
    if (newStatus) {
      updateData.status = newStatus;
    }
    if (notes !== undefined) {
      updateData.notes = typeof notes === 'string' ? notes : null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data: updated, error: updateError } = await (adminClient
      .from('appointments') as any)
      .update(updateData)
      .eq('id', appointmentId)
      .eq('doctor_id', doctor.doctorId)
      .select()
      .single();

    if (updateError) {
      console.error('Doctor appointment PATCH error:', updateError);
      return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
    }

    if (newStatus) {
      try {
        await adminClient.from('doctor_activity_log').insert({
          doctor_id: doctor.doctorId,
          action_type: 'appointment_status_changed',
          entity_type: 'appointment',
          entity_id: appointmentId,
          appointment_id: appointmentId,
          patient_name: patientName,
          details: { fromStatus: existingData?.status ?? null, toStatus: newStatus },
        });
      } catch (logErr) {
        console.warn('Activity log insert failed:', logErr);
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Doctor appointment PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
