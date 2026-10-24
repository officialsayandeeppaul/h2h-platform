/**
 * H2H Healthcare - edit or delete an expense (super admin only).
 * PATCH  /api/super-admin/expenses/[id] - partial update (only specified fields)
 * DELETE /api/super-admin/expenses/[id] - remove an entry
 *
 * Same validation ladder as creation — an edit can never write an invalid
 * row even if the client is bypassed.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { isMissingExpensesTable } from '@/lib/expenses/migration';
import { validateExpenseFields } from '@/lib/expenses/validation';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** The cookie-bound client createClient() hands the route. */
type ServerClient = Awaited<ReturnType<typeof createClient>>;

/** Minimal shape of a public.users row (generated types don't cover it). */
interface AdminProfile {
  id?: string;
  email?: string | null;
  role?: string | null;
}

async function requireSuperAdmin(supabase: ServerClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return { ok: false as const, status: 401 as const, error: 'Not authenticated' };

  const adminClient = createAdminClient();
  const { data: userData } = await adminClient
    .from('users')
    .select('id, email, role')
    .eq('email', user.email)
    .single();

  const profile = userData as AdminProfile | null;
  if (!profile || profile.role !== 'super_admin') {
    return { ok: false as const, status: 403 as const, error: 'Super admin access required' };
  }
  return { ok: true as const };
}

function migrationResponse() {
  return NextResponse.json(
    {
      success: false,
      migrationRequired: true,
      error: 'The expenses table does not exist yet — run the one-time setup SQL.',
    },
    { status: 503 }
  );
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const auth = await requireSuperAdmin(supabase);
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    if (!/^[0-9a-f-]{36}$/i.test(id)) {
      return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 });
    }

    const result = validateExpenseFields(body as Record<string, unknown>, 'update');
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    const value = result.value;
    if (Object.keys(value).length === 0) {
      return NextResponse.json({ success: false, error: 'Nothing to update.' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Exists first so a stale id answers 404 rather than a silent no-op update.
    const { data: existing, error: findError } = await adminClient
      .from('expenses')
      .select('id')
      .eq('id', id)
      .maybeSingle();
    if (findError) {
      if (isMissingExpensesTable(findError)) return migrationResponse();
      console.error('Error finding expense:', findError);
      return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};
    if (value.title !== undefined) updates.title = value.title;
    if (value.category !== undefined) updates.category = value.category;
    if (value.amount !== undefined) updates.amount = value.amount;
    if (value.date !== undefined) updates.expense_date = value.date;
    if (value.paid_via !== undefined) updates.paid_via = value.paid_via;
    if (value.paid_to !== undefined) updates.paid_to = value.paid_to;
    if (value.notes !== undefined) updates.notes = value.notes;
    updates.updated_at = new Date().toISOString();

    const { data: row, error: updateError } = await adminClient
      .from('expenses')
      // `as never`: generated DB types predate this table — avoids the any.
      .update(updates as never)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (updateError) {
      console.error('Error updating expense:', updateError);
      if (isMissingExpensesTable(updateError)) return migrationResponse();
      return NextResponse.json(
        { success: false, error: updateError.message || 'Failed to update the expense' },
        { status: 500 }
      );
    }
    if (!row) {
      return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: row, message: 'Expense updated.' });
  } catch (error) {
    console.error('Error in expenses PATCH:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const auth = await requireSuperAdmin(supabase);
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    if (!/^[0-9a-f-]{36}$/i.test(id)) {
      return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
    }

    const adminClient = createAdminClient();
    const { data: row, error } = await adminClient
      .from('expenses')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) {
      console.error('Error deleting expense:', error);
      if (isMissingExpensesTable(error)) return migrationResponse();
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to delete the expense' },
        { status: 500 }
      );
    }
    if (!row) {
      return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Expense deleted.' });
  } catch (error) {
    console.error('Error in expenses DELETE:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
