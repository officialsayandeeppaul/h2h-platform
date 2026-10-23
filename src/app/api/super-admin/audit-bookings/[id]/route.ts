/**
 * H2H Healthcare - Update an audit booking (super admin only).
 * PATCH /api/super-admin/audit-bookings/[id]
 *
 * Actions:
 *   - markCashPaid : settle the booking with an offline/cash payment
 *   - confirm / complete / cancel / no_show : move the booking through its lifecycle
 */

import { createAdminClient, createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const STATUS_ACTIONS = new Set(['confirm', 'complete', 'cancel', 'no_show']);
const STATUS_MAP: Record<string, string> = {
  confirm: 'confirmed',
  complete: 'completed',
  cancel: 'cancelled',
  no_show: 'no_show',
};

async function requireSuperAdmin(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, status: 401 as const, error: 'Not authenticated' };

  const adminClient = createAdminClient();
  const { data: userData } = await adminClient
    .from('users')
    .select('id, email, role')
    .eq('email', user.email)
    .single();

  if (!userData || (userData as any).role !== 'super_admin') {
    return { ok: false as const, status: 403 as const, error: 'Super admin access required' };
  }
  return { ok: true as const, adminClient, profile: userData as any };
}

function isAuditBooking(metadata: unknown): boolean {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return false;
  return Boolean((metadata as Record<string, unknown>)['is_audit_booking']);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const auth = await requireSuperAdmin(supabase);
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();
    const action: string | undefined = body?.action;

    if (!action) {
      return NextResponse.json({ success: false, error: 'action is required' }, { status: 400 });
    }

    const adminClient = (auth.adminClient as any);

    const { data: appointment, error } = await adminClient
      .from('appointments')
      .select('id, payment_status, status, metadata, patient_id, amount')
      .eq('id', id)
      .single();

    if (error || !appointment) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    if (!isAuditBooking((appointment as any).metadata)) {
      return NextResponse.json(
        { success: false, error: 'This booking was not created via Audit Bookings' },
        { status: 400 }
      );
    }

    const existingMeta =
      (appointment as any).metadata && typeof (appointment as any).metadata === 'object'
        ? { ...((appointment as any).metadata as Record<string, unknown>) }
        : {};

    // --- Mark paid in cash (offline) ---
    if (action === 'markCashPaid') {
      if ((appointment as any).payment_status === 'paid') {
        return NextResponse.json(
          { success: false, error: 'This booking is already paid' },
          { status: 400 }
        );
      }

      const amount = Number((appointment as any).amount) || 0;

      // Record the manual cash payment in the ledger.
      await adminClient.from('payments').insert({
        appointment_id: id,
        user_id: (appointment as any).patient_id,
        amount,
        currency: 'INR',
        status: 'success',
        payment_method: 'cash',
        receipt_url: null,
      });

      const { data: updated, error: updateError } = await adminClient
        .from('appointments')
        .update({
          payment_status: 'paid',
          status: (appointment as any).status === 'pending' ? 'confirmed' : (appointment as any).status,
          metadata: {
            ...existingMeta,
            payment_mode: 'cash',
            paid_at: new Date().toISOString(),
            paid_by: auth.profile?.email || null,
          },
        })
        .eq('id', id)
        .select('id, status, payment_status')
        .single();

      if (updateError) {
        return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        data: updated,
        message: 'Marked as paid (cash).',
      });
    }

    // --- Lifecycle status changes ---
    if (STATUS_ACTIONS.has(action)) {
      const newStatus = STATUS_MAP[action];
      const updates: Record<string, unknown> = { status: newStatus };

      // Confirming a booking that was created as "later" keeps payment pending.
      if (action === 'cancel') {
        updates.payment_status =
          (appointment as any).payment_status === 'paid' ? 'refunded' : (appointment as any).payment_status;
      }

      const { data: updated, error: updateError } = await adminClient
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select('id, status, payment_status')
        .single();

      if (updateError) {
        return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data: updated, message: `Booking ${newStatus}.` });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Error in audit-bookings PATCH:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
