/**
 * Super Admin - Approve/Reject Schedule Change Request
 * PATCH - Update status (approved | rejected)
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isSuperAdmin, adminClient, userId } = await checkSuperAdmin();

    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized - super admin only' }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Request ID required' }, { status: 400 });
    }

    const body = await request.json();
    const { status, reviewNotes } = body;

    if (status !== 'approved' && status !== 'rejected') {
      return NextResponse.json({ error: 'status must be approved or rejected' }, { status: 400 });
    }

    // Fetch the request
    const { data: reqRow, error: fetchError } = await adminClient
      .from('doctor_schedule_change_requests')
      .select('id, doctor_id, request_type, payload, status')
      .eq('id', id)
      .single();

    if (fetchError || !reqRow) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if ((reqRow as any).status !== 'pending') {
      return NextResponse.json({ error: 'Request already reviewed' }, { status: 400 });
    }

    const payload = (reqRow as any).payload || {};
    const requestType = (reqRow as any).request_type;
    const doctorId = (reqRow as any).doctor_id;

    if (status === 'approved') {
      const days = Array.isArray(payload.days) ? payload.days : [];
      const slotRequests = Array.isArray(payload.slot_requests) ? payload.slot_requests : [];

      if (requestType === 'mark_unavailable' && days.length > 0) {
        const { data: slots } = await adminClient
          .from('doctor_availability')
          .select('id, day_of_week')
          .eq('doctor_id', doctorId);
        const slotIds = (slots ?? [])
          .filter((s: any) => days.includes(s.day_of_week))
          .map((s: any) => s.id);
        if (slotIds.length > 0) {
          const { error: updateError } = await adminClient
            .from('doctor_availability')
            .update({ is_available: false })
            .in('id', slotIds);
          if (updateError) {
            console.error('doctor_availability update error:', updateError);
            return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
          }
        }
      }

      if (requestType === 'partial_unavailable' && slotRequests.length > 0) {
        for (const sr of slotRequests) {
          const { data: slot } = await adminClient
            .from('doctor_availability')
            .select('id, doctor_id, day_of_week, start_time, end_time, mode, center_id')
            .eq('id', sr.slot_id)
            .eq('doctor_id', doctorId)
            .single();

          if (!slot) continue;

          const s = slot as any;
          const slotStart = (s.start_time?.slice(0, 5) ?? s.start_time) as string;
          const slotEnd = (s.end_time?.slice(0, 5) ?? s.end_time) as string;
          const unavStart = (sr.unavailable_start?.slice(0, 5) ?? sr.unavailable_start) as string;
          const unavEnd = (sr.unavailable_end?.slice(0, 5) ?? sr.unavailable_end) as string;

          const base = { doctor_id: doctorId, day_of_week: sr.day_of_week, mode: s.mode ?? 'both', center_id: s.center_id ?? null, is_available: true };

          if (unavStart === slotStart && unavEnd === slotEnd) {
            await adminClient.from('doctor_availability').delete().eq('id', sr.slot_id);
          } else if (unavStart === slotStart) {
            await adminClient.from('doctor_availability').update({ start_time: unavEnd }).eq('id', sr.slot_id);
          } else if (unavEnd === slotEnd) {
            await adminClient.from('doctor_availability').update({ end_time: unavStart }).eq('id', sr.slot_id);
          } else {
            await adminClient.from('doctor_availability').delete().eq('id', sr.slot_id);
            await adminClient.from('doctor_availability').insert([
              { ...base, start_time: slotStart, end_time: unavStart },
              { ...base, start_time: unavEnd, end_time: slotEnd },
            ]);
          }
        }
      }

      // Date-specific unavailability → insert into doctor_date_overrides
      if (requestType === 'date_unavailable') {
        const dates = Array.isArray(payload.dates) ? payload.dates : [];
        const dateSlots = Array.isArray(payload.date_slots) ? payload.date_slots : [];

        const overrideRows: any[] = [];

        for (const d of dates) {
          overrideRows.push({
            doctor_id: doctorId,
            override_date: d,
            start_time: null,
            end_time: null,
            is_available: false,
            reason: (reqRow as any).reason || null,
            request_id: id,
          });
        }

        for (const ds of dateSlots) {
          overrideRows.push({
            doctor_id: doctorId,
            override_date: ds.date,
            start_time: ds.unavailable_start,
            end_time: ds.unavailable_end,
            is_available: false,
            reason: (reqRow as any).reason || null,
            request_id: id,
          });
        }

        if (overrideRows.length > 0) {
          const { error: insertErr } = await adminClient
            .from('doctor_date_overrides')
            .insert(overrideRows);
          if (insertErr) {
            console.error('doctor_date_overrides insert error:', insertErr);
            return NextResponse.json({ error: 'Failed to create date overrides' }, { status: 500 });
          }
        }
      }
    }

    // Update the request record
    const { data: updated, error } = await adminClient
      .from('doctor_schedule_change_requests')
      .update({
        status,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
        review_notes: typeof reviewNotes === 'string' ? reviewNotes.slice(0, 500) : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, status, reviewed_at, review_notes')
      .single();

    if (error) {
      console.error('Schedule request PATCH error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: status === 'approved' ? 'Request approved. Doctor schedule updated.' : 'Request rejected.',
    });
  } catch (err) {
    console.error('Super admin schedule request PATCH error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
