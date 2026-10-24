-- Run in Supabase SQL Editor (PROD) for the super-admin Expenses feature.
-- Safe to re-run (idempotent).
--
-- KEEPS IN SYNC WITH: src/lib/expenses/migration.ts
-- (that constant is returned by the API and copied from the Expenses page's
--  setup banner — after editing this file, paste the same content there.)

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

-- Locked down: RLS on with zero policies means anon/authenticated get nothing
-- and only the service role (used by the super-admin API routes) can read or
-- write — same posture as the other admin tables.
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
