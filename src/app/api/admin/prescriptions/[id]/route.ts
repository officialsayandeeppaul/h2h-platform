/**
 * GET single prescription (admin)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function checkAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const adminClient = createAdminClient();
  const { data } = await (adminClient.from('users') as any).select('role').eq('email', user.email).single();
  const role = (data as any)?.role;
  return !!role && ['super_admin', 'admin', 'location_admin'].includes(role);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    if (!(await checkAdmin(supabase))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from('prescriptions')
      .select(`
        id, appointment_id, doctor_id, patient_id, file_url, file_name, notes, created_at,
        patient:patient_id(id, full_name, email, phone),
        doctor:doctors(id, user_id, users:user_id(full_name)),
        appointment:appointment_id(appointment_date, start_time, service:service_id(name))
      `)
      .eq('id', id)
      .single();

    if (error || !data) return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });

    const row = data as any;
    return NextResponse.json({
      success: true,
      data: {
        id: row.id,
        appointmentId: row.appointment_id,
        doctorId: row.doctor_id,
        patientId: row.patient_id,
        fileUrl: row.file_url,
        fileName: row.file_name,
        notes: row.notes,
        createdAt: row.created_at,
        patient: row.patient,
        doctor: row.doctor?.users ? { fullName: row.doctor.users.full_name } : null,
        appointment: row.appointment,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
