-- Doctor consultation slot durations + prices (used by booking UI)
-- Safe to re-run.

CREATE TABLE IF NOT EXISTS public.consultation_slot_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
  name TEXT,
  label TEXT,
  online_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  offline_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  clinic_price NUMERIC(10, 2),
  home_visit_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  home_visit_additional_charge NUMERIC(10, 2) NOT NULL DEFAULT 0,
  mode TEXT NOT NULL DEFAULT 'both'
    CHECK (mode IN ('online', 'offline', 'home_visit', 'both')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (doctor_id, duration_minutes)
);

CREATE INDEX IF NOT EXISTS idx_consultation_slot_types_doctor
  ON public.consultation_slot_types(doctor_id);

COMMENT ON TABLE public.consultation_slot_types IS
  'Per-doctor session lengths and Online/Clinic/Home prices for booking';

-- Keep clinic_price in sync with offline_price for older readers
CREATE OR REPLACE FUNCTION public.sync_slot_clinic_price()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.clinic_price IS NULL AND NEW.offline_price IS NOT NULL THEN
    NEW.clinic_price := NEW.offline_price;
  ELSIF NEW.offline_price IS NULL AND NEW.clinic_price IS NOT NULL THEN
    NEW.offline_price := NEW.clinic_price;
  ELSIF NEW.clinic_price IS DISTINCT FROM NEW.offline_price AND NEW.offline_price IS NOT NULL THEN
    NEW.clinic_price := NEW.offline_price;
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_slot_clinic_price ON public.consultation_slot_types;
CREATE TRIGGER trg_sync_slot_clinic_price
  BEFORE INSERT OR UPDATE ON public.consultation_slot_types
  FOR EACH ROW EXECUTE FUNCTION public.sync_slot_clinic_price();

ALTER TABLE public.consultation_slot_types ENABLE ROW LEVEL SECURITY;
