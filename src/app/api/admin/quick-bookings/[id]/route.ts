/**
 * Super-admin: patch a quick booking (status, notes, waive/mark paid)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function checkSuperAdmin() {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { isSuperAdmin: false, adminClient };

  const { data: userData } = await adminClient.from('users').select('role').eq('id', user.id).single();
  return {
    isSuperAdmin: (userData as { role?: string } | null)?.role === 'super_admin',
    adminClient,
  };
}

const STATUSES = new Set(['new', 'contacted', 'converted', 'cancelled']);
const PAYMENT_STATUSES = new Set(['not_required', 'pending', 'paid', 'failed', 'waived']);

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { isSuperAdmin, adminClient } = await checkSuperAdmin();
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.status != null) {
      if (!STATUSES.has(body.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      updates.status = body.status;
    }

    if (body.payment_status != null) {
      if (!PAYMENT_STATUSES.has(body.payment_status)) {
        return NextResponse.json({ error: 'Invalid payment_status' }, { status: 400 });
      }
      updates.payment_status = body.payment_status;
    }

    if (body.admin_notes !== undefined) {
      updates.admin_notes = body.admin_notes == null ? null : String(body.admin_notes);
    }

    if (body.amount !== undefined) {
      const amount = body.amount == null ? null : Number(body.amount);
      if (amount != null && (!Number.isFinite(amount) || amount < 0)) {
        return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
      }
      updates.amount = amount;
    }

    const { data, error } = await adminClient
      .from('quick_bookings')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('PATCH /api/admin/quick-bookings/[id]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
