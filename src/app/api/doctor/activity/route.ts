/**
 * H2H Healthcare - Doctor Activity API
 * GET: merged activity feed (prescriptions + status changes + prescription edits)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDoctorFromRequest } from '@/lib/doctor-api';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const doctor = await getDoctorFromRequest();
    if (!doctor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminClient = createAdminClient();
    const pageSize = Math.min(100, Math.max(1, parseInt(request.nextUrl.searchParams.get('pageSize') || '50', 10)));

    const items: {
      id: string;
      type: 'prescription' | 'appointment_status_changed' | 'prescription_edited';
      createdAt: string;
      patientName: string;
      details: string;
      appointmentId: string | null;
      entityId: string;
      meta?: Record<string, unknown>;
    }[] = [];

    const prescriptionsRes = await adminClient
      .from('prescriptions')
      .select(
        `
        id, appointment_id, created_at,
        patient:patient_id(full_name),
        appointment:appointment_id(appointment_date, start_time, service:service_id(name))
      `
      )
      .eq('doctor_id', doctor.doctorId)
      .order('created_at', { ascending: false })
      .limit(pageSize);

    let activityRes: { data: any[] | null; error: unknown } = { data: null, error: null };
    try {
      activityRes = await adminClient
        .from('doctor_activity_log')
        .select('id, action_type, entity_id, appointment_id, patient_name, details, created_at')
        .eq('doctor_id', doctor.doctorId)
        .order('created_at', { ascending: false })
        .limit(pageSize);
    } catch {
      activityRes = { data: null, error: 'table may not exist' };
    }

    const prescriptions = (prescriptionsRes.data || []) as any[];
    for (const row of prescriptions) {
      items.push({
        id: `rx-${row.id}`,
        type: 'prescription',
        createdAt: row.created_at,
        patientName: row.patient?.full_name ?? row.patient?.fullName ?? 'Unknown',
        details: row.appointment
          ? `${row.appointment.appointment_date ?? ''} ${(row.appointment.start_time ?? '').slice(0, 5)} — ${row.appointment.service?.name ?? ''}`
          : '',
        appointmentId: row.appointment_id ?? null,
        entityId: row.id,
      });
    }

    if (!activityRes.error && activityRes.data && Array.isArray(activityRes.data) && activityRes.data.length) {
      const logs = activityRes.data as any[];
      for (const row of logs) {
        if (row.action_type === 'prescription_edited') {
          items.push({
            id: `log-${row.id}`,
            type: 'prescription_edited',
            createdAt: row.created_at,
            patientName: row.patient_name ?? 'Unknown',
            details: 'Prescription updated',
            appointmentId: row.appointment_id ?? null,
            entityId: row.entity_id,
            meta: row.details,
          });
        } else if (row.action_type === 'appointment_status_changed') {
          const d = row.details || {};
          const fromS = d.fromStatus ?? '?';
          const toS = d.toStatus ?? '?';
          items.push({
            id: `log-${row.id}`,
            type: 'appointment_status_changed',
            createdAt: row.created_at,
            patientName: row.patient_name ?? 'Unknown',
            details: `Status: ${fromS} → ${toS}`,
            appointmentId: row.appointment_id ?? null,
            entityId: row.entity_id,
            meta: row.details,
          });
        }
      }
    }

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const limited = items.slice(0, pageSize);

    return NextResponse.json({ success: true, data: limited });
  } catch (e) {
    console.error('Doctor activity GET error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
