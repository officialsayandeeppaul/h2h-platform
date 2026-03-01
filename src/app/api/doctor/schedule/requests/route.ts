/**
 * Doctor Schedule Change Requests API
 * GET - List my requests + date overrides
 * POST - Submit new request (specific date unavailability)
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

    const [requestsRes, overridesRes] = await Promise.all([
      adminClient
        .from('doctor_schedule_change_requests')
        .select('id, request_type, payload, reason, status, reviewed_at, review_notes, created_at')
        .eq('doctor_id', doctor.doctorId)
        .order('created_at', { ascending: false })
        .limit(50),
      adminClient
        .from('doctor_date_overrides')
        .select('id, override_date, start_time, end_time, is_available, reason, created_at')
        .eq('doctor_id', doctor.doctorId)
        .gte('override_date', new Date().toISOString().split('T')[0])
        .order('override_date', { ascending: true })
        .limit(50)
        .then(r => r)
        .catch(() => ({ data: null, error: null })),
    ]);

    if (requestsRes.error) {
      if (requestsRes.error.code === '42P01' || requestsRes.error.message?.includes('does not exist')) {
        return NextResponse.json({ success: true, data: [], overrides: [] });
      }
      return NextResponse.json({ error: requestsRes.error.message }, { status: 500 });
    }

    const list = (requestsRes.data ?? []).map((r: any) => ({
      id: r.id,
      requestType: r.request_type,
      payload: r.payload,
      reason: r.reason,
      status: r.status,
      reviewedAt: r.reviewed_at,
      reviewNotes: r.review_notes,
      createdAt: r.created_at,
      daysLabel: formatRequestLabel(r),
    }));

    const overrides = (overridesRes.data ?? []).map((o: any) => ({
      id: o.id,
      date: o.override_date,
      startTime: o.start_time?.slice(0, 5) ?? null,
      endTime: o.end_time?.slice(0, 5) ?? null,
      isAvailable: o.is_available,
      reason: o.reason,
      createdAt: o.created_at,
    }));

    return NextResponse.json({ success: true, data: list, overrides });
  } catch (err) {
    console.error('Doctor schedule requests API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const doctor = await getDoctorFromRequest();
    if (!doctor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { dates, date_slots, reason } = body;

    let payload: any;
    let requestType: string;

    if (Array.isArray(date_slots) && date_slots.length > 0) {
      // Partial time off on specific dates
      const valid = date_slots.filter((s: any) =>
        s.date && s.unavailable_start && s.unavailable_end &&
        s.unavailable_start < s.unavailable_end
      );
      if (valid.length === 0) {
        return NextResponse.json({ error: 'Valid date_slots required (date, unavailable_start, unavailable_end)' }, { status: 400 });
      }
      payload = { date_slots: valid };
      requestType = 'date_unavailable';
    } else if (Array.isArray(dates) && dates.length > 0) {
      // Whole day off on specific dates
      const today = new Date().toISOString().split('T')[0];
      const validDates = dates.filter((d: string) => typeof d === 'string' && d >= today);
      if (validDates.length === 0) {
        return NextResponse.json({ error: 'At least one future date required' }, { status: 400 });
      }
      payload = { dates: [...new Set(validDates)].sort() };
      requestType = 'date_unavailable';
    } else {
      return NextResponse.json({ error: 'Provide dates (whole day) or date_slots (partial time) for specific date unavailability' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    const { data: existing, error: existingError } = await adminClient
      .from('doctor_schedule_change_requests')
      .select('id')
      .eq('doctor_id', doctor.doctorId)
      .eq('status', 'pending')
      .limit(1);

    if (existingError && (existingError.code === '42P01' || existingError.message?.includes('does not exist'))) {
      return NextResponse.json({
        error: 'Schedule request feature is not set up yet. Please ask your admin to run the migration.',
      }, { status: 503 });
    }
    if (existing && existing.length > 0) {
      return NextResponse.json({
        error: 'You already have a pending request. Wait for admin approval before submitting another.',
      }, { status: 400 });
    }

    const { data: row, error } = await adminClient
      .from('doctor_schedule_change_requests')
      .insert({
        doctor_id: doctor.doctorId,
        request_type: requestType,
        payload,
        reason: typeof reason === 'string' ? reason.trim().slice(0, 500) : null,
        status: 'pending',
      })
      .select('id, request_type, payload, reason, status, created_at')
      .single();

    if (error) {
      console.error('Doctor schedule request POST error:', error);
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json({
          error: 'Schedule request feature is not set up yet. Please ask your admin to run the migration.',
        }, { status: 503 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const r = row as any;
    return NextResponse.json({
      success: true,
      data: {
        id: r.id,
        requestType: r.request_type,
        payload: r.payload,
        reason: r.reason,
        status: r.status,
        createdAt: r.created_at,
        daysLabel: formatRequestLabel(r),
      },
      message: 'Request submitted. Super admin will review shortly.',
    });
  } catch (err) {
    console.error('Doctor schedule request POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function formatRequestLabel(r: any): string {
  const p = r.payload || {};
  if (Array.isArray(p.dates) && p.dates.length > 0) {
    return p.dates.map((d: string) => {
      const dt = new Date(d + 'T00:00:00');
      return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' });
    }).join(', ');
  }
  if (Array.isArray(p.date_slots) && p.date_slots.length > 0) {
    return p.date_slots.map((s: any) => {
      const dt = new Date(s.date + 'T00:00:00');
      const dateStr = dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' });
      return `${dateStr} ${s.unavailable_start}–${s.unavailable_end}`;
    }).join('; ');
  }
  if (Array.isArray(p.days)) {
    return p.days.map((d: number) => DAYS[d] ?? `Day ${d}`).join(', ');
  }
  return '';
}
