'use client';

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatPhoneInput, validateIndianMobile } from '@/lib/validation/indian-phone';
import { toast } from 'sonner';

type ServiceOption = {
  id: string;
  name: string;
  slug: string;
  tier1_price?: number;
  category?: string;
};

type Settings = {
  payment_enabled: boolean;
  default_amount: number | null;
  require_payment: boolean;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type QuickBookingFormProps = {
  initialServiceSlug?: string | null;
  compact?: boolean;
  /** modal = no outer card/header (dialog already has chrome) */
  variant?: 'page' | 'modal';
  className?: string;
  onSuccess?: () => void;
};

export function QuickBookingForm({
  initialServiceSlug,
  compact = false,
  variant = 'page',
  className = '',
  onSuccess,
}: QuickBookingFormProps) {
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [settings, setSettings] = useState<Settings>({
    payment_enabled: false,
    default_amount: null,
    require_payment: true,
  });
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [serviceId, setServiceId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ message: string; paid?: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [svcRes, setRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/quick-bookings'),
        ]);
        const svcJson = await svcRes.json().catch(() => ({}));
        const setJson = await setRes.json().catch(() => ({}));
        if (cancelled) return;

        const list: ServiceOption[] = Array.isArray(svcJson.data)
          ? svcJson.data
          : Array.isArray(svcJson.services)
            ? svcJson.services
            : [];
        const active = list.filter((s) => s.id && s.name);
        setServices(active);

        if (setJson.settings) setSettings(setJson.settings);

        if (initialServiceSlug) {
          const match = active.find(
            (s) => s.slug === initialServiceSlug || s.id === initialServiceSlug
          );
          if (match) setServiceId(match.id);
        }
      } finally {
        if (!cancelled) setLoadingMeta(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialServiceSlug]);

  const selected = services.find((s) => s.id === serviceId);
  const displayAmount =
    settings.payment_enabled
      ? settings.default_amount != null && settings.default_amount > 0
        ? settings.default_amount
        : selected?.tier1_price ?? null
      : null;

  const onPhoneChange = (raw: string) => {
    const next = formatPhoneInput(raw);
    setPhone(next);
    if (!next) {
      setPhoneError(null);
      return;
    }
    if (next.length < 10) {
      setPhoneError('Enter exactly 10 digits');
      return;
    }
    const check = validateIndianMobile(next);
    setPhoneError(check.valid ? null : check.error || 'Invalid mobile');
  };

  const openCheckout = async (bookingId: string) => {
    const orderRes = await fetch('/api/quick-bookings/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId }),
    });
    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData.success) {
      throw new Error(orderData.error || 'Could not start payment');
    }

    const ok = await loadRazorpayScript();
    if (!ok || !window.Razorpay) throw new Error('Failed to load payment gateway');

    await new Promise<void>((resolve, reject) => {
      const rzp = new window.Razorpay!({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'H2H Healthcare',
        description: orderData.description || 'Quick Booking',
        order_id: orderData.orderId,
        prefill: orderData.prefill || {},
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch('/api/quick-bookings/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...response, bookingId }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              reject(new Error(verifyData.error || 'Payment verification failed'));
              return;
            }
            setDone({
              message: verifyData.message || 'Payment successful. We will call you shortly.',
              paid: true,
            });
            resolve();
          } catch (e) {
            reject(e);
          }
        },
        modal: {
          ondismiss: () => reject(new Error('Payment cancelled')),
        },
      });
      rzp.open();
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceId) {
      setServiceError('Please select a service');
      return;
    }
    setServiceError(null);

    const phoneCheck = validateIndianMobile(phone);
    if (!phoneCheck.valid || !phoneCheck.normalized) {
      setPhoneError(phoneCheck.error || 'Enter exactly 10-digit mobile');
      return;
    }
    setPhoneError(null);

    if (name.trim().length < 2) {
      toast.error('Name is required');
      return;
    }

    setSubmitting(true);
    setDone(null);
    try {
      const res = await fetch('/api/quick-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          name: name.trim(),
          phone: phoneCheck.normalized,
          email: email.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Submission failed');
      }

      if (data.booking?.payment_required) {
        await openCheckout(data.booking.id);
        toast.success('Payment completed');
        onSuccess?.();
      } else {
        setDone({
          message: data.message || 'Request submitted. Our team will call you shortly.',
        });
        toast.success('Quick booking submitted');
        setName('');
        setPhone('');
        setEmail('');
        setServiceId('');
        onSuccess?.();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingMeta) {
    return (
      <div className={`flex items-center justify-center py-12 text-gray-500 ${className}`}>
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
      </div>
    );
  }

  if (done) {
    return (
      <div className={`rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center ${className}`}>
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600 mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {done.paid ? 'Booking confirmed' : 'Request received'}
        </h3>
        <p className="text-sm text-gray-600 mb-6">{done.message}</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setDone(null);
            setName('');
            setPhone('');
            setEmail('');
            setServiceId('');
          }}
        >
          Book another
        </Button>
      </div>
    );
  }

  const isModal = variant === 'modal';

  return (
    <form
      onSubmit={onSubmit}
      className={
        isModal
          ? `space-y-4 ${className}`
          : `rounded-2xl border border-gray-200 bg-white shadow-sm ${compact ? 'p-5' : 'p-6 sm:p-8'} ${className}`
      }
      noValidate
    >
      {!isModal && (
        <div className="flex items-start gap-3 mb-6">
          <div className="rounded-xl bg-cyan-50 p-2.5 text-cyan-700">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Quick Booking</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Pick a service, share your name &amp; mobile — no doctor selection needed.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Service *</label>
          <Select
            value={serviceId || undefined}
            onValueChange={(v) => {
              setServiceId(v);
              setServiceError(null);
            }}
          >
            <SelectTrigger
              className={`h-11 w-full rounded-lg border-gray-200 bg-white text-sm ${
                serviceError ? 'border-red-400 focus-visible:ring-red-200' : ''
              }`}
            >
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="z-[80] max-h-56 w-[var(--radix-select-trigger-width)] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
            >
              {services.map((s) => (
                <SelectItem key={s.id} value={s.id} className="cursor-pointer text-sm">
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {serviceError && <p className="mt-1 text-xs text-red-600">{serviceError}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name *</label>
          <input
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile *</label>
          <div
            className={`flex h-11 overflow-hidden rounded-lg border bg-white focus-within:ring-2 focus-within:ring-cyan-500/30 focus-within:border-cyan-500 ${
              phoneError ? 'border-red-400' : 'border-gray-200'
            }`}
          >
            <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-sm text-gray-600 shrink-0">
              +91
            </span>
            <input
              required
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              pattern="[6-9][0-9]{9}"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              onBlur={() => {
                if (phone) {
                  const check = validateIndianMobile(phone);
                  setPhoneError(check.valid ? null : check.error || 'Invalid mobile');
                }
              }}
              placeholder="10-digit mobile"
              className="min-w-0 flex-1 border-0 bg-transparent px-3 text-sm outline-none"
              aria-invalid={Boolean(phoneError)}
            />
          </div>
          <p className={`mt-1 text-xs ${phoneError ? 'text-red-600' : 'text-gray-400'}`}>
            {phoneError || `${phone.length}/10 digits · starts with 6–9`}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
          />
        </div>

        {settings.payment_enabled && displayAmount != null && (
          <div className="rounded-lg border border-cyan-100 bg-cyan-50 px-3 py-2.5 text-sm text-cyan-900">
            Payment required: <strong>₹{Number(displayAmount).toLocaleString('en-IN')}</strong>
            {settings.default_amount == null && (
              <span className="text-cyan-700/80"> (service rate)</span>
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={submitting || !services.length || Boolean(phoneError)}
          className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Please wait…
            </>
          ) : settings.payment_enabled && displayAmount != null ? (
            `Pay ₹${Number(displayAmount).toLocaleString('en-IN')} & Book`
          ) : (
            'Submit Quick Booking'
          )}
        </Button>
      </div>
    </form>
  );
}
