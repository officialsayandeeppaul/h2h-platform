-- Run this in Supabase SQL Editor to create doctor_date_overrides table

CREATE TABLE IF NOT EXISTS public.doctor_date_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  override_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN NOT NULL DEFAULT false,
  reason TEXT,
  request_id UUID REFERENCES public.doctor_schedule_change_requests(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_date_overrides_doctor_date ON public.doctor_date_overrides(doctor_id, override_date);
CREATE INDEX IF NOT EXISTS idx_date_overrides_date ON public.doctor_date_overrides(override_date);

ALTER TABLE public.doctor_schedule_change_requests
  DROP CONSTRAINT IF EXISTS doctor_schedule_change_requests_request_type_check;
ALTER TABLE public.doctor_schedule_change_requests
  ADD CONSTRAINT doctor_schedule_change_requests_request_type_check
  CHECK (request_type IN ('mark_unavailable', 'restore_availability', 'partial_unavailable', 'date_unavailable'));
