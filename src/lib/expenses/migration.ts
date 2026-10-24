/**
 * One-time setup SQL for the Expenses feature.
 *
 * The API returns this string when `public.expenses` does not exist yet, and
 * the Expenses page shows it in a copyable setup banner — so the admin never
 * has to hunt for a file. Run it once in the Supabase SQL Editor.
 *
 * KEEPS IN SYNC WITH: supabase/RUN_THIS_EXPENSES.sql
 */
export const EXPENSES_MIGRATION_FILENAME = 'supabase/RUN_THIS_EXPENSES.sql';

export const EXPENSES_MIGRATION_SQL = `-- super-admin Expenses — one-time setup (safe to re-run)

CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL
    CHECK (char_length(btrim(title)) BETWEEN 2 AND 120 AND btrim(title) <> ''),
  category TEXT NOT NULL
    CHECK (char_length(btrim(category)) BETWEEN 1 AND 60 AND btrim(category) <> ''),
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  expense_date DATE NOT NULL,
  paid_via TEXT NOT NULL DEFAULT 'cash'
    CHECK (paid_via IN ('cash', 'upi', 'bank', 'card', 'other')),
  paid_to TEXT
    CHECK (paid_to IS NULL OR char_length(btrim(paid_to)) <= 120),
  notes TEXT
    CHECK (notes IS NULL OR char_length(notes) <= 1000),
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_date_desc
  ON public.expenses (expense_date DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category
  ON public.expenses (category);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at
  ON public.expenses (created_at DESC);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
`;

/**
 * PostgREST reports a missing table two different ways depending on the
 * verb/path shape: SQLSTATE 42P01 from Postgres itself, or a schema-cache
 * miss (PGRST205: "Could not find the table 'public.expenses' in the schema
 * cache"). Both mean the same thing to the admin: run the setup SQL.
 */
export function isMissingExpensesTable(
  error: { code?: string | null; message?: string | null } | null | undefined
): boolean {
  if (!error) return false;
  if (error.code === '42P01') return true;
  const message = error.message || '';
  return (
    /could not find the table .* in the schema cache/i.test(message) ||
    /relation .* does not exist/i.test(message)
  );
}
