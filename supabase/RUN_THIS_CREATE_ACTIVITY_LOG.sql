-- H2H Healthcare: Doctor Activity Log table
-- Run this in Supabase SQL Editor if the Activity console shows only prescriptions
-- (status changes and prescription edits require this table).

CREATE TABLE IF NOT EXISTS public.doctor_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  patient_name TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctor_activity_log_doctor ON public.doctor_activity_log(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_activity_log_created ON public.doctor_activity_log(created_at DESC);

COMMENT ON TABLE public.doctor_activity_log IS 'Log of doctor actions: appointment status changes, prescription edits.';
