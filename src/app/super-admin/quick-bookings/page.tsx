'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CallRequestsAdminSkeleton } from '@/components/admin/AdminSkeletons';
import { Loader2, Phone, Zap, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

type BookingStatus = 'new' | 'contacted' | 'converted' | 'cancelled';
type PaymentStatus = 'not_required' | 'pending' | 'paid' | 'failed' | 'waived';

interface QuickBooking {
  id: string;
  service_name: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  status: BookingStatus;
  payment_required: boolean;
  amount: number | null;
  payment_status: PaymentStatus;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Settings {
  payment_enabled: boolean;
  default_amount: number | null;
  require_payment: boolean;
}

function CopyId({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 font-mono text-[11px] text-gray-600 hover:text-cyan-700"
      title={`Copy ${label}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          toast.success(`${label} copied`);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          toast.error('Could not copy');
        }
      }}
    >
      <span className="text-gray-400">{label}:</span> {value}
      {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

export default function SuperAdminQuickBookingsPage() {
  const [bookings, setBookings] = useState<QuickBooking[]>([]);
  const [settings, setSettings] = useState<Settings>({
    payment_enabled: false,
    default_amount: null,
    require_payment: true,
  });
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  /** Default All so Converted / Contacted never "disappear" from the inbox */
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const [needsSetup, setNeedsSetup] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setListError(null);
    try {
      const [listRes, setRes] = await Promise.all([
        fetch('/api/admin/quick-bookings'),
        fetch('/api/admin/quick-bookings/settings'),
      ]);
      const listJson = await listRes.json().catch(() => ({}));
      const setJson = await setRes.json().catch(() => ({}));

      if (!listRes.ok || !listJson.success) {
        setBookings([]);
        setListError(listJson.error || 'Failed to load quick bookings');
      } else if (Array.isArray(listJson.data)) {
        setBookings(listJson.data);
      } else {
        setBookings([]);
      }

      setNeedsSetup(Boolean(setJson.needsSetup));
      if (setJson.settings) {
        setSettings(setJson.settings);
        setAmountInput(
          setJson.settings.default_amount != null ? String(setJson.settings.default_amount) : ''
        );
      }
      if (setJson.needsSetup) {
        toast.message('Database setup needed', {
          description: 'Run RUN_THIS_QUICK_BOOKINGS.sql in Supabase SQL Editor for this project.',
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const counts = useMemo(() => {
    const c = { all: bookings.length, new: 0, contacted: 0, converted: 0, cancelled: 0 };
    for (const b of bookings) {
      if (b.status in c) c[b.status as BookingStatus] += 1;
    }
    return c;
  }, [bookings]);

  const visibleBookings = useMemo(() => {
    if (statusFilter === 'all') return bookings;
    return bookings.filter((b) => b.status === statusFilter);
  }, [bookings, statusFilter]);

  const patchBooking = async (id: string, body: Record<string, unknown>) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/quick-bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Update failed');

      // Keep row visible: update local state (never delete). Payment IDs stay intact.
      if (data.data) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...data.data } : b)));
      } else {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === id
              ? {
                  ...b,
                  ...(body.status != null ? { status: body.status as BookingStatus } : {}),
                  ...(body.payment_status != null
                    ? { payment_status: body.payment_status as PaymentStatus }
                    : {}),
                }
              : b
          )
        );
      }

      if (body.status && statusFilter !== 'all' && body.status !== statusFilter) {
        setStatusFilter(body.status as BookingStatus);
        toast.success(
          body.status === 'converted'
            ? 'Marked converted — still listed under Converted'
            : `Status → ${String(body.status)}`
        );
      } else {
        toast.success(
          body.status === 'converted' ? 'Marked converted (payment details kept)' : 'Updated'
        );
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/quick-bookings/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_enabled: settings.payment_enabled,
          require_payment: settings.require_payment,
          default_amount: amountInput === '' ? null : Number(amountInput),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save settings');
      setSettings(data.settings);
      toast.success('Payment settings saved');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) return <CallRequestsAdminSkeleton />;

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="h-6 w-6 text-cyan-600" /> Quick Bookings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Leads from Quick Booking. Converted stays in the list with full payment details.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAll}>
          Refresh
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Payment settings</h2>
        {needsSetup && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Tables missing on this database. In Supabase SQL Editor run{' '}
            <code className="font-mono text-xs">RUN_THIS_QUICK_BOOKINGS.sql</code>, then refresh.
          </div>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={settings.payment_enabled}
              onChange={(e) =>
                setSettings((s) => ({ ...s, payment_enabled: e.target.checked }))
              }
              className="rounded border-gray-300"
            />
            Require Razorpay payment on Quick Booking
          </label>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs text-gray-500 mb-1">
              Fixed amount (₹) — leave blank to use service tier-1 price
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="e.g. 499"
              className="h-9 w-full rounded-md border border-gray-200 px-3 text-sm"
              disabled={!settings.payment_enabled}
            />
          </div>
          <Button onClick={saveSettings} disabled={savingSettings} size="sm">
            {savingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save settings'}
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          When payment is off, submissions appear here as leads only. When on, users pay before
          confirmation. Paid Razorpay IDs are kept even after Converted.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['all', 'All'],
            ['new', 'New'],
            ['contacted', 'Contacted'],
            ['converted', 'Converted'],
            ['cancelled', 'Cancelled'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatusFilter(value)}
            className={`rounded-full px-3 py-1.5 text-sm border transition-colors ${
              statusFilter === value
                ? 'bg-cyan-600 text-white border-cyan-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-cyan-300'
            }`}
          >
            {label}{' '}
            <span className={statusFilter === value ? 'opacity-90' : 'text-gray-400'}>
              ({counts[value]})
            </span>
          </button>
        ))}
      </div>

      {listError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {listError}
        </div>
      )}

      {statusFilter === 'new' && counts.new > 0 && (
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
          {counts.new} new quick booking{counts.new !== 1 ? 's' : ''} waiting.
        </div>
      )}

      {visibleBookings.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          {bookings.length === 0
            ? 'No quick bookings found.'
            : `No ${statusFilter === 'all' ? '' : statusFilter + ' '}quick bookings. Try All.`}
        </div>
      ) : (
        <div className="space-y-3">
          {visibleBookings.map((b) => (
            <div key={b.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-900">{b.patient_name}</p>
                    <Badge
                      className={
                        b.status === 'new'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : b.status === 'converted'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : b.status === 'cancelled'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                      }
                    >
                      {b.status}
                    </Badge>
                    <Badge
                      className={
                        b.payment_status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : b.payment_status === 'pending'
                            ? 'bg-orange-100 text-orange-800 border-orange-200'
                            : b.payment_status === 'failed'
                              ? 'bg-red-100 text-red-800 border-red-200'
                              : b.payment_status === 'waived'
                                ? 'bg-purple-100 text-purple-800 border-purple-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                      }
                    >
                      {b.payment_status}
                      {b.amount != null ? ` · ₹${Number(b.amount).toLocaleString('en-IN')}` : ''}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{b.service_name}</p>
                  <p className="text-sm text-gray-500 flex flex-wrap items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    <a href={`tel:+91${b.patient_phone}`} className="hover:text-cyan-700">
                      +91 {b.patient_phone}
                    </a>
                    {b.patient_email && (
                      <span className="ml-2 truncate">{b.patient_email}</span>
                    )}
                  </p>
                  {(b.razorpay_payment_id || b.razorpay_order_id) && (
                    <div className="flex flex-col gap-0.5 pt-1">
                      {b.razorpay_payment_id && (
                        <CopyId label="Payment ID" value={b.razorpay_payment_id} />
                      )}
                      {b.razorpay_order_id && (
                        <CopyId label="Order ID" value={b.razorpay_order_id} />
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-400">
                    {new Date(b.created_at).toLocaleString('en-IN')}
                    {b.updated_at && b.updated_at !== b.created_at
                      ? ` · updated ${new Date(b.updated_at).toLocaleString('en-IN')}`
                      : ''}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {b.status === 'new' && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updatingId === b.id}
                      onClick={() => patchBooking(b.id, { status: 'contacted' })}
                    >
                      Mark contacted
                    </Button>
                  )}
                  {(b.status === 'new' || b.status === 'contacted') && (
                    <Button
                      size="sm"
                      disabled={updatingId === b.id}
                      onClick={() => patchBooking(b.id, { status: 'converted' })}
                    >
                      Converted
                    </Button>
                  )}
                  {b.status === 'converted' && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updatingId === b.id}
                      onClick={() => patchBooking(b.id, { status: 'contacted' })}
                    >
                      Reopen
                    </Button>
                  )}
                  {b.payment_status === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updatingId === b.id}
                      onClick={() => patchBooking(b.id, { payment_status: 'waived' })}
                    >
                      Waive payment
                    </Button>
                  )}
                  {b.payment_status === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updatingId === b.id}
                      onClick={() => patchBooking(b.id, { payment_status: 'paid' })}
                    >
                      Mark paid
                    </Button>
                  )}
                  {b.status !== 'cancelled' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={updatingId === b.id}
                      onClick={() => patchBooking(b.id, { status: 'cancelled' })}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
