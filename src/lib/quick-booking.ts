import { validateIndianMobile } from '@/lib/validation/indian-phone';

export type QuickBookingStatus = 'new' | 'contacted' | 'converted' | 'cancelled';
export type QuickBookingPaymentStatus =
  | 'not_required'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'waived';

export interface QuickBookingSettings {
  payment_enabled: boolean;
  default_amount: number | null;
  require_payment: boolean;
}

export interface QuickBookingRow {
  id: string;
  service_id: string | null;
  service_name: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  status: QuickBookingStatus;
  payment_required: boolean;
  amount: number | null;
  payment_status: QuickBookingPaymentStatus;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export function validateQuickBookingInput(body: {
  serviceId?: string;
  name?: string;
  phone?: string;
  email?: string;
}) {
  const name = body.name?.trim() || '';
  if (name.length < 2) {
    return { ok: false as const, error: 'Name is required (at least 2 characters)' };
  }
  if (!body.serviceId?.trim()) {
    return { ok: false as const, error: 'Please select a service' };
  }
  const phoneCheck = validateIndianMobile(body.phone || '');
  if (!phoneCheck.valid || !phoneCheck.normalized) {
    return { ok: false as const, error: phoneCheck.error || 'Valid 10-digit mobile is required' };
  }
  const email = body.email?.trim() || null;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false as const, error: 'Enter a valid email or leave it blank' };
  }
  return {
    ok: true as const,
    data: {
      serviceId: body.serviceId.trim(),
      name,
      phone: phoneCheck.normalized,
      email,
    },
  };
}

export function resolveQuickBookingAmount(
  settings: QuickBookingSettings,
  serviceTier1Price: number | null | undefined
): number | null {
  if (!settings.payment_enabled) return null;
  if (settings.default_amount != null && Number(settings.default_amount) > 0) {
    return Number(settings.default_amount);
  }
  if (serviceTier1Price != null && Number(serviceTier1Price) > 0) {
    return Number(serviceTier1Price);
  }
  return null;
}
