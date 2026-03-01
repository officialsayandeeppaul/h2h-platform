/**
 * H2H Healthcare - Doctor Patients API
 * GET /api/doctor/patients
 * List patients who have had appointments with the logged-in doctor.
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
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));
    const search = (searchParams.get('search') || '').trim().toLowerCase();

    const adminClient = createAdminClient();

    const { data: appointments, error: aptError } = await adminClient
      .from('appointments')
      .select('patient_id, appointment_date, start_time, metadata')
      .eq('doctor_id', doctor.doctorId)
      .order('appointment_date', { ascending: false });

    if (aptError) {
      console.error('Doctor patients API error:', aptError);
      return NextResponse.json({ error: aptError.message }, { status: 500 });
    }

    const byPatientId = new Map<
      string,
      { patientId: string; lastVisit: string; lastTime: string; appointmentCount: number }
    >();
    for (const apt of appointments ?? []) {
      const pid = (apt as any).patient_id;
      const meta = (apt as any).metadata as Record<string, string> | null;
      const name = meta?.patient_name ?? null;
      if (!pid && !name) continue;
      const key = pid || `guest-${name}`;
      if (!byPatientId.has(key)) {
        byPatientId.set(key, {
          patientId: pid || '',
          lastVisit: (apt as any).appointment_date,
          lastTime: (apt as any).start_time ?? '',
          appointmentCount: 0,
        });
      }
      const rec = byPatientId.get(key)!;
      rec.appointmentCount += 1;
    }

    const patientIds = [...byPatientId.keys()].filter((k) => !k.startsWith('guest-'));
    let usersMap: Record<string, { full_name: string; email: string | null; phone: string | null }> = {};
    if (patientIds.length > 0) {
      const { data: users } = await adminClient
        .from('users')
        .select('id, full_name, email, phone')
        .in('id', patientIds);
      for (const u of users ?? []) {
        const row = u as any;
        usersMap[row.id] = {
          full_name: row.full_name ?? 'Unknown',
          email: row.email ?? null,
          phone: row.phone ?? null,
        };
      }
    }

    let list = [...byPatientId.entries()].map(([key, rec]) => {
      const isGuest = key.startsWith('guest-');
      const guestName = isGuest ? key.replace(/^guest-/, '') : null;
      const user = usersMap[rec.patientId];
      const fullName = user?.full_name ?? guestName ?? 'Unknown';
      return {
        patientId: rec.patientId,
        fullName,
        email: user?.email ?? null,
        phone: user?.phone ?? null,
        lastVisit: rec.lastVisit,
        lastTime: rec.lastTime,
        appointmentCount: rec.appointmentCount,
      };
    });

    if (search) {
      list = list.filter(
        (p) =>
          p.fullName.toLowerCase().includes(search) ||
          (p.email && p.email.toLowerCase().includes(search)) ||
          (p.phone && p.phone.includes(search))
      );
    }

    const total = list.length;
    const start = (page - 1) * pageSize;
    const paginated = list.slice(start, start + pageSize);

    return NextResponse.json({
      success: true,
      data: paginated,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Doctor patients API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
