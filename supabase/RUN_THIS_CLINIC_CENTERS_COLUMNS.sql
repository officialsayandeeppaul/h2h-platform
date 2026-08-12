-- Add missing clinic_centers columns used by admin Locations UI / booking.
-- Fixes: Could not find the 'landmark' column of 'clinic_centers' in the schema cache.
-- Run in: Supabase PRODUCTION → SQL Editor
-- Safe to re-run.

ALTER TABLE public.clinic_centers
  ADD COLUMN IF NOT EXISTS landmark TEXT,
  ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
  ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Refresh PostgREST schema cache so the new columns are visible immediately
NOTIFY pgrst, 'reload schema';
