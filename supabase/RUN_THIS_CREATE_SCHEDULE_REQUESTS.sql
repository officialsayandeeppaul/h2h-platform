-- Run this in Supabase SQL Editor to create doctor_schedule_change_requests table

CREATE TABLE IF NOT EXISTS public.doctor_schedule_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL DEFAULT 'mark_unavailable' CHECK (request_type IN ('mark_unavailable', 'restore_availability')),
  payload JSONB NOT NULL DEFAULT '{}',
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schedule_requests_doctor ON public.doctor_schedule_change_requests(doctor_id);
CREATE INDEX IF NOT EXISTS idx_schedule_requests_status ON public.doctor_schedule_change_requests(status);
CREATE INDEX IF NOT EXISTS idx_schedule_requests_created ON public.doctor_schedule_change_requests(created_at DESC);
