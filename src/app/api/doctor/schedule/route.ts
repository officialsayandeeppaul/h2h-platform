/**
 * H2H Healthcare - Doctor Schedule API
 * GET /api/doctor/schedule - get my availability
 * PATCH /api/doctor/schedule - update my availability
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDoctorFromRequest } from '@/lib/doctor-api';
import { createAdminClient } from '@/lib/supabase/server';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export async function GET() {
  try {
    const doctor = await getDoctorFromRequest();
    if (!doctor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = createAdminClient();
    const { data: slots, error } = await adminClient
      .from('doctor_availability')
      .select('id, day_of_week, start_time, end_time, is_available, mode, center_id')
      .eq('doctor_id', doctor.doctorId)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Doctor schedule GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const byDay: Record<number, { id: string; start_time: string; end_time: string; is_available: boolean; mode?: string; center_id?: string }[]> = {};
    for (let d = 0; d <= 6; d++) byDay[d] = [];
    for (const row of slots ?? []) {
      const r = row as any;
      byDay[r.day_of_week].push({
        id: r.id,
        start_time: r.start_time?.slice(0, 5) ?? r.start_time,
        end_time: r.end_time?.slice(0, 5) ?? r.end_time,
        is_available: r.is_available ?? true,
        mode: r.mode ?? 'both',
        center_id: r.center_id ?? undefined,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        days: DAYS,
        byDay,
        raw: slots ?? [],
      },
    });
  } catch (error) {
    console.error('Doctor schedule API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const doctor = await getDoctorFromRequest();
    if (!doctor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const availability = body.availability as { day_of_week: number; start_time: string; end_time: string; is_available: boolean }[] | undefined;
    if (!Array.isArray(availability)) {
      return NextResponse.json({ error: 'availability array required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    await adminClient.from('doctor_availability').delete().eq('doctor_id', doctor.doctorId);

    const records = availability
      .filter((a) => a.day_of_week >= 0 && a.day_of_week <= 6 && a.start_time && a.end_time)
      .map((a) => ({
        doctor_id: doctor.doctorId,
        day_of_week: a.day_of_week,
        start_time: a.start_time,
        end_time: a.end_time,
        is_available: a.is_available !== false,
      }));

    if (records.length > 0) {
      const { error: insertError } = await adminClient.from('doctor_availability').insert(records);
      if (insertError) {
        console.error('Doctor schedule PATCH insert error:', insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Schedule updated' });
  } catch (error) {
    console.error('Doctor schedule PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
