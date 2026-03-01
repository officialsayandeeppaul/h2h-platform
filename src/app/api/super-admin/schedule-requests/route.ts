/**
 * Super Admin - Schedule Change Requests
 * GET - List all pending and recent requests
 * Only super_admin can access
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

async function checkSuperAdmin() {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { isSuperAdmin: false, adminClient, userId: null };

  const { data: userData } = await adminClient
    .from('users')
    .select('id, role')
    .eq('id', user.id)
    .single();

  const isSuperAdmin = (userData as any)?.role === 'super_admin';
  return { isSuperAdmin, adminClient, userId: (userData as any)?.id };
}

export async function GET(request: NextRequest) {
  try {
    const { isSuperAdmin, adminClient } = await checkSuperAdmin();

    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized - super admin only' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // pending | approved | rejected | all

    let query = adminClient
      .from('doctor_schedule_change_requests')
      .select(`
        id,
        doctor_id,
        request_type,
        payload,
        reason,
        status,
        reviewed_by,
        reviewed_at,
        review_notes,
        created_at,
        updated_at,
        doctors:doctor_id (
          id,
          user_id,
          users:user_id (full_name, email)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: rows, error } = await query;

    if (error) {
      console.error('Super admin schedule requests GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const list = (rows ?? []).map((r: any) => {
      const doc = r.doctors;
      const user = doc?.users;
      return {
      id: r.id,
      doctorId: r.doctor_id,
      doctorName: user?.full_name ?? 'Unknown',
      doctorEmail: user?.email ?? '',
      requestType: r.request_type,
      payload: r.payload,
      reason: r.reason,
      status: r.status,
      reviewedBy: r.reviewed_by,
      reviewedAt: r.reviewed_at,
      reviewNotes: r.review_notes,
      createdAt: r.created_at,
      daysLabel: formatLabel(r),
    };
    });

    return NextResponse.json({ success: true, data: list });
  } catch (err) {
    console.error('Super admin schedule requests API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function formatLabel(r: any): string {
  const p = r.payload || {};
  if (Array.isArray(p.dates) && p.dates.length > 0) {
    return p.dates.map((d: string) => {
      const dt = new Date(d + 'T00:00:00');
      return dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    }).join(', ');
  }
  if (Array.isArray(p.date_slots) && p.date_slots.length > 0) {
    return p.date_slots.map((s: any) => {
      const dt = new Date(s.date + 'T00:00:00');
      const dateStr = dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      return `${dateStr} ${s.unavailable_start}–${s.unavailable_end}`;
    }).join('; ');
  }
  if (Array.isArray(p.days)) {
    return p.days.map((d: number) => DAYS[d] ?? `Day ${d}`).join(', ');
  }
  if (Array.isArray(p.slot_requests)) {
    return p.slot_requests.map((s: any) =>
      `${DAYS[s.day_of_week] ?? s.day_of_week} ${s.slot_start}–${s.slot_end}: off ${s.unavailable_start}–${s.unavailable_end}`
    ).join('; ');
  }
  return '';
}
