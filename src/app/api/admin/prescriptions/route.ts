/**
 * H2H Healthcare - Admin Prescriptions API
 * GET: list prescriptions (filter by patient, doctor, date)
 * POST: create prescription and assign to patient (via appointment)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function checkAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, user: null };
  const adminClient = createAdminClient();
  const { data: userData } = await (adminClient.from('users') as any)
    .select('role')
    .eq('email', user.email)
    .single();
  const role = (userData as any)?.role;
  if (!role || !['super_admin', 'admin', 'location_admin'].includes(role)) return { ok: false as const, user: null };
  return { ok: true as const, user };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { ok } = await checkAdmin(supabase);
    if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminClient = createAdminClient();
    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get('patientId') || undefined;
    const doctorId = searchParams.get('doctorId') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));

    let query = adminClient
      .from('prescriptions')
      .select(`
        id, appointment_id, doctor_id, patient_id, file_url, file_name, notes, created_at,
        patient:patient_id(id, full_name, email),
        doctor:doctors(id, user_id, users:user_id(full_name))
      `, { count: 'exact' });

    if (patientId) query = query.eq('patient_id', patientId);
    if (doctorId) query = query.eq('doctor_id', doctorId);
    if (dateFrom) query = query.gte('created_at', dateFrom);
    if (dateTo) query = query.lte('created_at', dateTo + 'T23:59:59.999Z');

    query = query.order('created_at', { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Admin prescriptions GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const list = (data || []).map((row: any) => ({
      id: row.id,
      appointmentId: row.appointment_id,
      doctorId: row.doctor_id,
      patientId: row.patient_id,
      fileUrl: row.file_url,
      fileName: row.file_name,
      notes: row.notes,
      createdAt: row.created_at,
      patient: row.patient ? { id: row.patient.id, fullName: row.patient.full_name, email: row.patient.email } : null,
      doctor: row.doctor?.users ? { id: row.doctor.id, fullName: row.doctor.users.full_name } : null,
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
    console.error('Admin prescriptions error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { ok } = await checkAdmin(supabase);
    if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
      .single();

    if (aptErr || !appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const { data: inserted, error: insertErr } = await (adminClient.from('prescriptions') as any).insert({
      appointment_id: appointmentId,
      doctor_id: (appointment as any).doctor_id,
      patient_id: (appointment as any).patient_id,
      file_url: fileUrl || '',
      file_name: fileName || null,
      notes: notes ?? null,
    }).select().single();

    if (insertErr) {
      console.error('Admin prescriptions POST error:', insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: inserted });
  } catch (e) {
    console.error('Admin prescriptions POST error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
