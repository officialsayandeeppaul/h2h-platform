-- Run in Supabase SQL Editor (DEV + PROD) for Quick Booking feature.
-- Safe to re-run.

CREATE TABLE IF NOT EXISTS public.quick_booking_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  payment_enabled BOOLEAN NOT NULL DEFAULT false,
  default_amount NUMERIC(10, 2),
  require_payment BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.quick_booking_settings (id, payment_enabled, default_amount, require_payment)
VALUES (1, false, NULL, true)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.quick_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_email TEXT,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'converted', 'cancelled')),
  payment_required BOOLEAN NOT NULL DEFAULT false,
  amount NUMERIC(10, 2),
  payment_status TEXT NOT NULL DEFAULT 'not_required'
    CHECK (payment_status IN ('not_required', 'pending', 'paid', 'failed', 'waived')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quick_bookings_created_at ON public.quick_bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quick_bookings_status ON public.quick_bookings(status);
CREATE INDEX IF NOT EXISTS idx_quick_bookings_payment_status ON public.quick_bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_quick_bookings_phone ON public.quick_bookings(patient_phone);

ALTER TABLE public.quick_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_booking_settings ENABLE ROW LEVEL SECURITY;
