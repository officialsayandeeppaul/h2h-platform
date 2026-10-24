/**
 * H2H Healthcare - super-admin expense ledger (list + record).
 * GET  /api/super-admin/expenses - list expenses (capped detail rows + uncapped light rows)
 * POST /api/super-admin/expenses - record an expense (validated server-side)
 *
 * If `public.expenses` has not been created yet, both verbs answer with
 * `migrationRequired: true` plus the one-time setup SQL, so the page can show
 * a copy-paste setup banner instead of a generic failure.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { EXPENSES_MIGRATION_SQL, isMissingExpensesTable } from '@/lib/expenses/migration';
import { validateExpenseFields } from '@/lib/expenses/validation';

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
  return { ok: true as const, profile };
}

function migrationResponse() {
  return NextResponse.json(
    {
      success: false,
      migrationRequired: true,
      error:
        'The expenses table does not exist yet. Run the one-time setup SQL below in the Supabase SQL Editor, then refresh.',
      migrationSql: EXPENSES_MIGRATION_SQL,
    },
    { status: 503 }
  );
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const auth = await requireSuperAdmin(supabase);
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '200', 10);

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from('expenses')
      .select('*')
      .order('expense_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(Number.isFinite(limit) && limit > 0 ? Math.min(limit, 500) : 200);

    if (error) {
      console.error('Error fetching expenses:', error);
      if (isMissingExpensesTable(error)) return migrationResponse();
      return NextResponse.json(
        { success: false, error: 'Failed to fetch expenses' },
        { status: 500 }
      );
    }

    // Uncapped light projection so stats/charts/summary stay accurate even
    // though the detailed card list above is capped (same pattern as audit).
    const { data: allRows, error: allError } = await adminClient
      .from('expenses')
      .select('expense_date, amount, category, paid_via')
      .order('expense_date', { ascending: false })
      .limit(50000);

    if (allError && isMissingExpensesTable(allError)) return migrationResponse();

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
      // On a light-query failure fall back to the (heavier) main rows — they
      // carry the same four fields, so the client always receives an array.
      all: allError ? data || [] : allRows || [],
    });
  } catch (error) {
    console.error('Error in expenses GET:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const auth = await requireSuperAdmin(supabase);
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 });
    }

    const result = validateExpenseFields(body as Record<string, unknown>, 'create');
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    const value = result.value;

    const adminClient = createAdminClient();
    // `as never`: the generated DB types predate this table (same reason the
    // repo's other inserts cast — but without the any, keeping lint at zero).
    const { data: row, error } = await adminClient
      .from('expenses')
      .insert({
        title: value.title,
        category: value.category,
        amount: value.amount,
        expense_date: value.date,
        paid_via: value.paid_via ?? 'cash',
        paid_to: value.paid_to,
        notes: value.notes,
        created_by: auth.profile?.email || null,
      } as never)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating expense:', error);
      if (isMissingExpensesTable(error)) return migrationResponse();
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to record the expense' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: row, message: 'Expense recorded.' });
  } catch (error) {
    console.error('Error in expenses POST:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
