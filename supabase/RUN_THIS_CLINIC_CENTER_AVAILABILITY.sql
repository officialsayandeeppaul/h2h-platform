-- Optional: clinic open-hours table (API works without it)
-- Run in Supabase PRODUCTION SQL Editor if you want Mon–Sat hours on centers.

CREATE TABLE IF NOT EXISTS public.clinic_center_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id UUID NOT NULL REFERENCES public.clinic_centers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  is_open BOOLEAN DEFAULT true,
  open_time TIME NOT NULL DEFAULT '09:00',
  close_time TIME NOT NULL DEFAULT '18:00',
  break_start TIME,
  break_end TIME,
  max_appointments INTEGER DEFAULT 40,
  current_bookings INTEGER DEFAULT 0,
  special_note TEXT,
  UNIQUE (center_id, day_of_week)
);

CREATE INDEX IF NOT EXISTS idx_cca_center ON public.clinic_center_availability(center_id);

ALTER TABLE public.clinic_center_availability ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'clinic_center_availability' AND policyname = 'Public read center hours'
  ) THEN
    CREATE POLICY "Public read center hours"
      ON public.clinic_center_availability FOR SELECT
      USING (true);
  END IF;
END $$;

-- Seed Mon–Sat for Kolkata + Bhubaneswar
INSERT INTO public.clinic_center_availability (
  center_id, day_of_week, is_open, open_time, close_time, max_appointments, current_bookings
)
SELECT c.id, g.dow, TRUE, '09:00'::time, '18:00'::time, 40, 0
FROM public.clinic_centers c
CROSS JOIN generate_series(1, 6) AS g(dow)
WHERE c.id IN (
  'c1111111-1111-1111-1111-111111111111'::uuid,
  'c2222222-2222-2222-2222-222222222221'::uuid
)
ON CONFLICT (center_id, day_of_week) DO NOTHING;
