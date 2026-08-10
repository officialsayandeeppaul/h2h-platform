'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CallRequestsAdminSkeleton } from '@/components/admin/AdminSkeletons';
import { Loader2, Phone, Zap } from 'lucide-react';
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
  admin_notes: string | null;
  created_at: string;
}

interface Settings {
  payment_enabled: boolean;
  default_amount: number | null;
  require_payment: boolean;
}

export default function SuperAdminQuickBookingsPage() {
  const [bookings, setBookings] = useState<QuickBooking[]>([]);
  const [settings, setSettings] = useState<Settings>({
    payment_enabled: false,
    default_amount: null,
    require_payment: true,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('new');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [amountInput, setAmountInput] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (statusFilter !== 'all') qs.set('status', statusFilter);
      const [listRes, setRes] = await Promise.all([
        fetch(`/api/admin/quick-bookings?${qs.toString()}`),
        fetch('/api/admin/quick-bookings/settings'),
      ]);
      const listJson = await listRes.json().catch(() => ({}));
      const setJson = await setRes.json().catch(() => ({}));
      if (listJson.success && Array.isArray(listJson.data)) setBookings(listJson.data);
      else setBookings([]);
      if (setJson.settings) {
        setSettings(setJson.settings);
        setAmountInput(
          setJson.settings.default_amount != null ? String(setJson.settings.default_amount) : ''
        );
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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
      toast.success('Updated');
      await fetchAll();
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

  const newCount = bookings.filter((b) => b.status === 'new').length;

  if (loading) return <CallRequestsAdminSkeleton />;

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="h-6 w-6 text-cyan-600" /> Quick Bookings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Leads from Quick Booking (service + name + mobile). Super admin only.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | BookingStatus)}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="cancelled">Cancelled</option>
            <option value="all">All</option>
          </select>
          <Button variant="outline" size="sm" onClick={fetchAll}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Payment controls */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Payment settings</h2>
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
          confirmation.
        </p>
      </div>

      {statusFilter === 'new' && newCount > 0 && (
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
          {newCount} new quick booking{newCount !== 1 ? 's' : ''} waiting.
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          No quick bookings found.
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-900">{b.patient_name}</p>
                    <Badge
                      className={
                        b.status === 'new'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : b.status === 'converted'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
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
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                      }
                    >
                      {b.payment_status}
                      {b.amount != null ? ` · ₹${Number(b.amount).toLocaleString('en-IN')}` : ''}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{b.service_name}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    <a href={`tel:+91${b.patient_phone}`} className="hover:text-cyan-700">
                      +91 {b.patient_phone}
                    </a>
                    {b.patient_email && (
                      <span className="ml-2 truncate">{b.patient_email}</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(b.created_at).toLocaleString('en-IN')}
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
