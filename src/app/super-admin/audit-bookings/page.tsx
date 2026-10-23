'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Banknote,
  Calendar,
  CalendarPlus,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Copy,
  CreditCard,
  IndianRupee,
  Link2,
  Loader2,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  User,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format, parseISO, isToday } from 'date-fns';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CallRequestsAdminSkeleton } from '@/components/admin/AdminSkeletons';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PaymentMode = 'cash' | 'link' | 'later';

/** Audit-booking-specific fields stored in appointments.metadata JSONB. */
interface AuditMetadata {
  is_audit_booking?: boolean;
  payment_mode?: PaymentMode;
  patient_name?: string;
  patient_phone?: string;
  audit_note?: string;
  paid_at?: string;
  paid_by?: string;
  payment_link_id?: string;
  payment_link_url?: string;
  payment_link_status?: string;
  created_by_email?: string;
  [key: string]: unknown;
}

interface AuditBooking {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  mode: 'online' | 'offline' | 'home_visit';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  amount: number;
  notes: string | null;
  created_at: string;
  metadata?: AuditMetadata | null;
  patient?: { id: string; full_name: string; email: string; phone: string | null } | null;
  doctor?: { id: string; users: { full_name: string; email: string } | null } | null;
  service?: { id: string; name: string } | null;
}

interface DoctorOption {
  id: string;
  name: string;
  consultation_fee?: number;
}

interface ServiceOption {
  id: string;
  name: string;
  duration_minutes?: number;
  price?: number;
}

interface SlotOption {
  time: string;
  endTime: string;
  available: boolean;
  duration: number;
  price?: number;
}

// ---------------------------------------------------------------------------
// Visual tokens
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  no_show: 'bg-gray-100 text-gray-700 border-gray-200',
};

const PAYMENT_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600 border-amber-200',
  paid: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  refunded: 'bg-purple-50 text-purple-600 border-purple-200',
  failed: 'bg-red-50 text-red-600 border-red-200',
};

const CHART_PALETTE = ['#06b6d4', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toE164(phone?: string): string {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  return phone || '';
}

function buildWaLink(phone?: string | null, text?: string): string | null {
  const e164 = toE164(phone || undefined);
  if (!e164) return null;
  return `https://wa.me/${e164.replace(/^\+/, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

// ---------------------------------------------------------------------------
// Page (wrapped in Suspense for useSearchParams inside the booking dialog)
// ---------------------------------------------------------------------------

export default function AuditBookingsPage() {
  return (
    <Suspense fallback={<CallRequestsAdminSkeleton />}>
      <AuditBookingsContent />
    </Suspense>
  );
}

function AuditBookingsContent() {
  const [bookings, setBookings] = useState<AuditBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AuditBooking['status']>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | AuditBooking['payment_status']>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/super-admin/audit-bookings');
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to load audit bookings');
        setBookings([]);
      } else {
        setBookings(Array.isArray(data.data) ? data.data : []);
      }
    } catch {
      setError('Failed to load audit bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // --- Derived: stats, charts, filters ---
  const stats = useMemo(() => {
    const today = bookings.filter((b) => isToday(parseISO(b.appointment_date)));
    return {
      total: bookings.length,
      today: today.length,
      pendingPayment: bookings.filter((b) => b.payment_status === 'pending').length,
      paid: bookings.filter((b) => b.payment_status === 'paid').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      revenue: bookings
        .filter((b) => b.payment_status === 'paid')
        .reduce((sum, b) => sum + (Number(b.amount) || 0), 0),
    };
  }, [bookings]);

  const paymentBreakdown = useMemo(() => {
    const groups: Record<string, number> = {};
    for (const b of bookings) {
      const key = b.payment_status || 'pending';
      groups[key] = (groups[key] || 0) + 1;
    }
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [bookings]);

  const last7Days = useMemo(() => {
    const days: { label: string; bookings: number; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = format(d, 'yyyy-MM-dd');
      const dayRows = bookings.filter((b) => b.appointment_date === iso);
      days.push({
        label: format(d, 'EEE'),
        bookings: dayRows.length,
        revenue: dayRows
          .filter((b) => b.payment_status === 'paid')
          .reduce((s, b) => s + (Number(b.amount) || 0), 0),
      });
    }
    return days;
  }, [bookings]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      const name = b.metadata?.patient_name || b.patient?.full_name || '';
      const phone = b.metadata?.patient_phone || b.patient?.phone || '';
      const doctor = b.doctor?.users?.full_name || '';
      const service = b.service?.name || '';
      const matchesSearch =
        !q ||
        name.toLowerCase().includes(q) ||
        (phone || '').includes(q) ||
        doctor.toLowerCase().includes(q) ||
        service.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || b.payment_status === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [bookings, search, statusFilter, paymentFilter]);

  // --- Actions ---
  const runAction = async (
    id: string,
    path: string,
    method: 'PATCH' | 'POST',
    body?: Record<string, unknown>,
    successMsg?: string
  ) => {
    setActionId(id);
    try {
      const res = await fetch(path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || 'Action failed');
      toast.success(successMsg || data.message || 'Updated');
      await fetchBookings();
      return data;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Action failed');
      return null;
    } finally {
      setActionId(null);
    }
  };

  const markCashPaid = (id: string) =>
    runAction(id, `/api/super-admin/audit-bookings/${id}`, 'PATCH', { action: 'markCashPaid' }, 'Marked as paid (cash)');

  const changeStatus = (id: string, action: 'confirm' | 'complete' | 'cancel' | 'no_show') =>
    runAction(id, `/api/super-admin/audit-bookings/${id}`, 'PATCH', { action }, `Booking ${action}d`);

  const generatePaymentLink = async (id: string) => {
    const data = await runAction(
      id,
      `/api/super-admin/audit-bookings/${id}/payment-link`,
      'POST',
      undefined,
      'Payment link generated'
    );
    if (data?.data?.shortUrl) {
      try {
        await navigator.clipboard.writeText(data.data.shortUrl);
        toast.success('Payment link copied to clipboard');
      } catch {
        /* clipboard unavailable — link still shown on the card */
      }
    }
    return data;
  };

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error('Could not copy');
    }
  };

  if (loading) return <CallRequestsAdminSkeleton />;

  return (
    <div className="space-y-5 sm:space-y-6 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-600" />
            Audit Bookings
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Book a slot on a patient&apos;s behalf and settle payment by cash or payment link.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={fetchBookings} className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Button size="sm" onClick={() => setDialogOpen(true)} className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700">
            <CalendarPlus className="h-4 w-4 mr-2" /> New booking
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Total" value={stats.total} icon={ClipboardList} tone="text-gray-900" />
        <StatCard label="Today" value={stats.today} icon={Calendar} tone="text-cyan-600" />
        <StatCard label="Awaiting payment" value={stats.pendingPayment} icon={CreditCard} tone="text-amber-600" />
        <StatCard label="Paid" value={stats.paid} icon={CheckCircle2} tone="text-emerald-600" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="text-blue-600" />
        <StatCard label="Collected" value={`₹${stats.revenue.toLocaleString('en-IN')}`} icon={IndianRupee} tone="text-teal-600" />
      </div>

      {/* Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Bookings — last 7 days</h2>
            <span className="text-xs text-gray-400">by appointment date</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(6,182,212,0.06)' }}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                  formatter={(value) => [value, 'Bookings']}
                />
                <Bar dataKey="bookings" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Payment status</h2>
          {paymentBreakdown.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-sm text-gray-400">No data yet</div>
          ) : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {paymentBreakdown.map((entry, idx) => (
                      <Cell key={entry.name} fill={CHART_PALETTE[idx % CHART_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {paymentBreakdown.map((entry, idx) => (
              <span key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: CHART_PALETTE[idx % CHART_PALETTE.length] }}
                />
                {entry.name} ({entry.value})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by patient, phone, doctor or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm min-w-[140px]"
        >
          <option value="all">All status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no_show">No show</option>
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value as typeof paymentFilter)}
          className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm min-w-[140px]"
        >
          <option value="all">All payments</option>
          <option value="pending">Awaiting payment</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="flex-1">{error}</span>
          <Button variant="outline" size="sm" onClick={fetchBookings}>
            Retry
          </Button>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-14 bg-white rounded-xl border border-gray-200">
          <ClipboardList className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-600 font-medium">
            {bookings.length === 0 ? 'No audit bookings yet' : 'No bookings match your filters'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {bookings.length === 0
              ? 'Use “New booking” to reserve a slot on a patient’s behalf.'
              : 'Try adjusting the search or filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const isExpanded = expandedId === b.id;
            const patientName = b.metadata?.patient_name || b.patient?.full_name || 'Unknown patient';
            const patientPhone = b.metadata?.patient_phone || b.patient?.phone || '';
            const doctorName = (b.doctor?.users?.full_name || 'Unknown doctor').replace(/^Dr\.?\s*/i, '');
            const serviceName = b.service?.name || 'Unknown service';
            const linkUrl: string | null = b.metadata?.payment_link_url || null;
            const isPaid = b.payment_status === 'paid';

            return (
              <div key={b.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Main row */}
                <div
                  className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedId(isExpanded ? null : b.id)}
                >
                  <div className="w-20 text-center shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {format(parseISO(b.appointment_date), 'dd MMM')}
                    </p>
                    <p className="text-xs text-gray-500">{b.start_time?.substring(0, 5)}</p>
                    {isToday(parseISO(b.appointment_date)) && (
                      <Badge className="bg-cyan-500 text-white text-[10px] mt-1">Today</Badge>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="font-medium text-gray-900 truncate">{patientName}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Phone className="h-3 w-3 shrink-0" />
                      <span className="truncate">{patientPhone || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="hidden md:block flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{serviceName}</p>
                    <p className="text-xs text-gray-500 truncate">Dr. {doctorName}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-semibold text-gray-900 flex items-center justify-end gap-0.5">
                      <IndianRupee className="h-3 w-3" />
                      {Number(b.amount) || 0}
                    </p>
                    <Badge className={`text-[10px] border ${PAYMENT_COLORS[b.payment_status] || ''}`}>
                      {b.payment_status}
                    </Badge>
                  </div>

                  <Badge className={`${STATUS_COLORS[b.status]} capitalize shrink-0`}>{b.status}</Badge>

                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                  )}
                </div>

                {/* Expanded details + actions */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 p-4 space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Patient</h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-gray-500">Name:</span>{' '}
                            <span className="font-medium">{patientName}</span>
                          </p>
                          <p>
                            <span className="text-gray-500">Phone:</span>{' '}
                            <span className="font-medium">{patientPhone || 'N/A'}</span>
                          </p>
                          <p>
                            <span className="text-gray-500">Email:</span>{' '}
                            <span className="font-medium">{b.patient?.email || 'N/A'}</span>
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Appointment</h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-gray-500">Date:</span>{' '}
                            <span className="font-medium">
                              {format(parseISO(b.appointment_date), 'EEE, dd MMM yyyy')}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-500">Time:</span>{' '}
                            <span className="font-medium">
                              {b.start_time?.substring(0, 5)} – {b.end_time?.substring(0, 5)}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-500">Mode:</span>{' '}
                            <span className="font-medium capitalize">{b.mode.replace('_', ' ')}</span>
                          </p>
                          <p>
                            <span className="text-gray-500">Created:</span>{' '}
                            <span className="font-medium">{format(parseISO(b.created_at), 'dd MMM yyyy, HH:mm')}</span>
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Payment</h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-gray-500">Amount:</span>{' '}
                            <span className="font-medium">₹{Number(b.amount) || 0}</span>
                          </p>
                          <p>
                            <span className="text-gray-500">Status:</span>{' '}
                            <Badge className={`ml-1 text-[10px] border ${PAYMENT_COLORS[b.payment_status] || ''}`}>
                              {b.payment_status}
                            </Badge>
                          </p>
                          <p>
                            <span className="text-gray-500">Method:</span>{' '}
                            <span className="font-medium capitalize">{b.metadata?.payment_mode || 'link'}</span>
                          </p>
                          {b.metadata?.paid_at && (
                            <p>
                              <span className="text-gray-500">Paid:</span>{' '}
                              <span className="font-medium">
                                {format(parseISO(b.metadata.paid_at), 'dd MMM yyyy, HH:mm')}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {b.metadata?.audit_note && (
                      <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-lg">
                        <p className="text-xs font-semibold text-cyan-700 mb-1">Audit note</p>
                        <p className="text-sm text-cyan-900">{b.metadata.audit_note}</p>
                      </div>
                    )}

                    {b.notes && b.notes !== b.metadata?.audit_note && (
                      <div className="p-3 bg-white border border-gray-200 rounded-lg">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Notes</p>
                        <p className="text-sm text-gray-700">{b.notes}</p>
                      </div>
                    )}

                    {/* Payment link display */}
                    {linkUrl && !isPaid && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex flex-wrap items-center gap-2">
                        <Link2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <a
                          href={linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-emerald-700 font-medium hover:underline break-all"
                        >
                          {linkUrl}
                        </a>
                        <Button variant="outline" size="sm" onClick={() => copy(linkUrl, 'Payment link')}>
                          <Copy className="h-3 w-3 mr-1" /> Copy
                        </Button>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {!isPaid && (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          disabled={actionId === b.id}
                          onClick={() => markCashPaid(b.id)}
                        >
                          {actionId === b.id ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <Banknote className="h-3 w-3 mr-1" />
                          )}
                          Mark paid (cash)
                        </Button>
                      )}

                      {!isPaid && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionId === b.id}
                          onClick={() => generatePaymentLink(b.id)}
                        >
                          {actionId === b.id ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <Link2 className="h-3 w-3 mr-1" />
                          )}
                          {linkUrl ? 'Regenerate payment link' : 'Generate payment link'}
                        </Button>
                      )}

                      {isPaid && linkUrl && (
                        <Button size="sm" variant="outline" disabled={actionId === b.id} onClick={() => copy(linkUrl, 'Payment link')}>
                          <Copy className="h-3 w-3 mr-1" /> Copy payment link
                        </Button>
                      )}

                      {/* Share over WhatsApp / SMS */}
                      {patientPhone && !isPaid && (
                        <>
                          {buildWaLink(
                            patientPhone,
                            `Hi ${patientName}, here is your H2H Healthcare payment link: ${linkUrl || ''}`
                          ) && (
                            <a
                              href={buildWaLink(
                                patientPhone,
                                `Hi ${patientName}, here is your H2H Healthcare payment link: ${linkUrl || ''}`
                              ) as string}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button size="sm" variant="outline" asChild>
                                <span>
                                  <MessageSquare className="h-3 w-3 mr-1" /> WhatsApp
                                </span>
                              </Button>
                            </a>
                          )}
                          <a href={`tel:${toE164(patientPhone)}`}>
                            <Button size="sm" variant="outline" asChild>
                              <span>
                                <Phone className="h-3 w-3 mr-1" /> Call
                              </span>
                            </Button>
                          </a>
                        </>
                      )}

                      <span className="flex-1" />

                      {b.status === 'pending' && (
                        <Button size="sm" variant="outline" disabled={actionId === b.id} onClick={() => changeStatus(b.id, 'confirm')}>
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Confirm
                        </Button>
                      )}
                      {b.status === 'confirmed' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={actionId === b.id} onClick={() => changeStatus(b.id, 'complete')}>
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Mark complete
                        </Button>
                      )}
                      {(b.status === 'pending' || b.status === 'confirmed') && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          disabled={actionId === b.id}
                          onClick={() => changeStatus(b.id, 'cancel')}
                        >
                          <XCircle className="h-3 w-3 mr-1" /> Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <NewAuditBookingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={() => {
          setDialogOpen(false);
          fetchBookings();
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-gray-500 truncate">{label}</p>
          <p className={`text-xl font-semibold mt-1 ${tone}`}>{value}</p>
        </div>
        <Icon className="h-5 w-5 text-gray-300 shrink-0" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// New booking dialog
// ---------------------------------------------------------------------------

function NewAuditBookingDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}) {
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [slots, setSlots] = useState<SlotOption[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [mode, setMode] = useState<'online' | 'offline' | 'home_visit'>('offline');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('later');
  const [notes, setNotes] = useState('');
  const [auditNote, setAuditNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load catalog data when the dialog opens.
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const [docRes, svcRes] = await Promise.all([fetch('/api/doctors'), fetch('/api/services')]);
        const docJson = await docRes.json().catch(() => ({}));
        const svcJson = await svcRes.json().catch(() => ({}));
        setDoctors(Array.isArray(docJson.data) ? docJson.data : []);
        setServices(Array.isArray(svcJson.data) ? svcJson.data : []);
      } catch {
        toast.error('Could not load doctors/services');
      }
    })();
  }, [open]);

  // Reset on open.
  useEffect(() => {
    if (open) {
      setPatientName('');
      setPatientPhone('');
      setPatientEmail('');
      setDoctorId('');
      setServiceId('');
      setMode('offline');
      setDate('');
      setStartTime('');
      setEndTime('');
      setAmount('');
      setPaymentMode('later');
      setNotes('');
      setAuditNote('');
      setFormError(null);
      setSlots([]);
    }
  }, [open]);

  // Fetch slots when doctor/date/mode change.
  useEffect(() => {
    if (!open || !doctorId || !date) {
      setSlots([]);
      setStartTime('');
      setEndTime('');
      return;
    }
    let cancelled = false;
    (async () => {
      setSlotsLoading(true);
      setStartTime('');
      setEndTime('');
      try {
        const duration =
          services.find((s) => s.id === serviceId)?.duration_minutes || 30;
        const res = await fetch(
          `/api/slots?doctorId=${doctorId}&date=${date}&mode=${mode}&duration=${duration}`
        );
        const data = await res.json().catch(() => ({}));
        if (!cancelled) setSlots(Array.isArray(data.data?.slots) ? data.data.slots : []);
      } catch {
        if (!cancelled) setSlots([]);
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, doctorId, date, mode, serviceId, services]);

  // Default amount to the service price when a service is chosen.
  useEffect(() => {
    if (!serviceId) return;
    const svc = services.find((s) => s.id === serviceId);
    if (svc && svc.price != null && amount === '') {
      setAmount(String(svc.price));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, services]);

  const selectedSlot = slots.find((s) => s.time === startTime);
  const canSubmit =
    patientName.trim().length > 0 &&
    !!doctorId &&
    !!serviceId &&
    !!date &&
    !!startTime &&
    !!endTime &&
    Number(amount) >= 0;

  const submit = async () => {
    if (!canSubmit) {
      setFormError('Fill in patient, doctor, service, date, a time slot and amount.');
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch('/api/super-admin/audit-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: patientName.trim(),
          patientPhone: patientPhone.trim() || undefined,
          patientEmail: patientEmail.trim() || undefined,
          doctorId,
          serviceId,
          date,
          startTime,
          endTime,
          mode,
          amount: Number(amount) || 0,
          paymentMode,
          notes: notes.trim() || undefined,
          auditNote: auditNote.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create booking');
      }
      toast.success(data.message || 'Audit booking created');
      onCreated();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5 text-cyan-600" /> New audit booking
          </DialogTitle>
          <DialogDescription>
            Reserve a slot on a patient&apos;s behalf. Choose how to collect payment: cash now, a shareable payment link, or later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Patient name <span className="text-red-500">*</span>
              </label>
              <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <Input value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} placeholder="10-digit mobile" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <Input type="email" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} placeholder="email@example.com" />
            </div>
          </div>

          {/* Doctor / service / mode */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Doctor <span className="text-red-500">*</span>
              </label>
              <select
                value={doctorId}
                onChange={(e) => {
                  setDoctorId(e.target.value);
                  setStartTime('');
                  setEndTime('');
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
              >
                <option value="">Select doctor</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Service <span className="text-red-500">*</span>
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
              >
                <option value="">Select service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Mode</label>
              <select
                value={mode}
                onChange={(e) => {
                  setMode(e.target.value as typeof mode);
                  setStartTime('');
                  setEndTime('');
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
              >
                <option value="offline">In-clinic</option>
                <option value="online">Online</option>
                <option value="home_visit">Home visit</option>
              </select>
            </div>
          </div>

          {/* Date + slots */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                min={format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => {
                  setDate(e.target.value);
                  setStartTime('');
                  setEndTime('');
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Amount (₹)
              </label>
              <Input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Available slots {doctorId && date ? '' : '(pick a doctor and date first)'}
            </label>
            {slotsLoading ? (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 rounded-lg" />
                ))}
              </div>
            ) : !doctorId || !date ? (
              <div className="p-4 border border-dashed border-gray-200 rounded-lg text-sm text-gray-400 text-center">
                Select a doctor and date to load slots.
              </div>
            ) : slots.length === 0 ? (
              <div className="p-4 border border-dashed border-gray-200 rounded-lg text-sm text-gray-500 text-center">
                No slots available on this date. Try another date or doctor.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 max-h-44 overflow-y-auto p-1">
                {slots.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!s.available}
                    onClick={() => {
                      setStartTime(s.time);
                      setEndTime(s.endTime);
                    }}
                    className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                      !s.available
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed line-through'
                        : startTime === s.time
                          ? 'bg-cyan-500 text-white ring-2 ring-cyan-300'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-cyan-400 hover:bg-cyan-50'
                    }`}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
            )}
            {selectedSlot && (
              <p className="text-xs text-cyan-700 mt-2 flex items-center gap-1">
                <ArrowRight className="h-3 w-3" /> {selectedSlot.time} – {selectedSlot.endTime}
                {selectedSlot.duration ? ` · ${selectedSlot.duration} min` : ''}
              </p>
            )}
          </div>

          {/* Payment mode */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Payment</label>
            <div className="grid grid-cols-3 gap-2">
              <PaymentModeCard
                active={paymentMode === 'cash'}
                onClick={() => setPaymentMode('cash')}
                icon={Banknote}
                title="Cash"
                desc="Mark paid now"
              />
              <PaymentModeCard
                active={paymentMode === 'link'}
                onClick={() => setPaymentMode('link')}
                icon={Link2}
                title="Payment link"
                desc="Share with patient"
              />
              <PaymentModeCard
                active={paymentMode === 'later'}
                onClick={() => setPaymentMode('later')}
                icon={CreditCard}
                title="Later"
                desc="Leave pending"
              />
            </div>
            {paymentMode === 'link' && (!patientPhone.trim() && !patientEmail.trim()) && (
              <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Add a phone or email so the payment link can be raised.
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Clinical / booking notes"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Audit note</label>
              <textarea
                value={auditNote}
                onChange={(e) => setAuditNote(e.target.value)}
                rows={2}
                placeholder="Why this booking is being raised (audit purpose)"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm resize-none"
              />
            </div>
          </div>

          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={submitting || !canSubmit} className="bg-cyan-600 hover:bg-cyan-700">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
            Create booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PaymentModeCard({
  active,
  onClick,
  icon: Icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-3 rounded-lg border text-left transition-all ${
        active
          ? 'border-cyan-500 bg-cyan-50 ring-2 ring-cyan-200'
          : 'border-gray-200 bg-white hover:border-cyan-300'
      }`}
    >
      <Icon className={`h-4 w-4 mb-1 ${active ? 'text-cyan-600' : 'text-gray-400'}`} />
      <p className={`text-xs font-semibold ${active ? 'text-cyan-700' : 'text-gray-700'}`}>{title}</p>
      <p className="text-[11px] text-gray-400">{desc}</p>
    </button>
  );
}
