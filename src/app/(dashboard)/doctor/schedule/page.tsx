'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Loader2, Calendar, RefreshCw, AlertCircle, Send, CheckCircle2, XCircle,
  Clock, CalendarDays, Inbox, Info, Ban,
} from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type SlotMode = 'online' | 'offline' | 'both';

interface Slot {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  mode?: SlotMode;
}

interface ScheduleRequest {
  id: string;
  requestType: string;
  payload: any;
  reason: string | null;
  status: 'pending' | 'approved' | 'rejected';
  daysLabel: string;
  createdAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

interface DateOverride {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  isAvailable: boolean;
  reason: string | null;
}

function modeLabel(mode?: SlotMode): string {
  if (mode === 'offline') return 'Clinic';
  if (mode === 'online') return 'Online';
  return 'Both';
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DoctorSchedulePage() {
  const [byDay, setByDay] = useState<Record<number, Slot[]>>({});
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ScheduleRequest[]>([]);
  const [overrides, setOverrides] = useState<DateOverride[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const [openRequest, setOpenRequest] = useState(false);
  const [requestMode, setRequestMode] = useState<'whole_day' | 'partial'>('whole_day');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [partialDate, setPartialDate] = useState('');
  const [unavailableStart, setUnavailableStart] = useState('');
  const [unavailableEnd, setUnavailableEnd] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/doctor/schedule');
      const data = await res.json();
      if (data.success && data.data?.byDay) {
        setByDay(data.data.byDay);
      } else {
        setError(data.error || 'Failed to load schedule');
      }
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  }, []);

  const fetchRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      const res = await fetch('/api/doctor/schedule/requests');
      const data = await res.json();
      if (data.success) {
        setRequests(Array.isArray(data.data) ? data.data : []);
        setOverrides(Array.isArray(data.overrides) ? data.overrides : []);
      }
    } catch { /* ignore */ }
    finally { setLoadingRequests(false); }
  }, []);

  useEffect(() => { fetchSchedule(); }, [fetchSchedule]);
  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const toggleDate = (d: string) => {
    setSelectedDates(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort());
  };

  const handleSubmitRequest = async () => {
    if (requestMode === 'whole_day' && selectedDates.length === 0) {
      setError('Pick at least one date'); return;
    }
    if (requestMode === 'partial') {
      if (!partialDate) { setError('Pick a date'); return; }
      if (!unavailableStart || !unavailableEnd) { setError('Specify unavailable times'); return; }
      if (unavailableStart >= unavailableEnd) { setError('End must be after start'); return; }
    }
    setSubmitting(true);
    setError(null);
    try {
      let body: object;
      if (requestMode === 'whole_day') {
        body = { dates: selectedDates, reason: reason.trim() || undefined };
      } else {
        body = {
          date_slots: [{ date: partialDate, unavailable_start: unavailableStart, unavailable_end: unavailableEnd }],
          reason: reason.trim() || undefined,
        };
      }
      const res = await fetch('/api/doctor/schedule/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setOpenRequest(false);
        resetForm();
        await Promise.all([fetchSchedule(), fetchRequests()]);
      } else {
        setError(data.error || 'Failed to submit');
      }
    } catch { setError('Network error'); }
    finally { setSubmitting(false); }
  };

  function resetForm() {
    setRequestMode('whole_day');
    setSelectedDates([]);
    setPartialDate('');
    setUnavailableStart('');
    setUnavailableEnd('');
    setReason('');
    setError(null);
  }

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const availableSlots = Object.values(byDay).flat().filter(s => s.is_available).length;

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">My Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">Recurring weekly slots and date-specific time off</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { fetchSchedule(); fetchRequests(); }} disabled={loading} className="shrink-0">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Card className="border-gray-200 bg-white">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-100"><CalendarDays className="h-5 w-5 text-cyan-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(byDay).filter(d => (byDay[Number(d)] || []).length > 0).length}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Working days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-white">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100"><Clock className="h-5 w-5 text-emerald-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{availableSlots}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Slots / week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-white">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-100"><Ban className="h-5 w-5 text-rose-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overrides.length}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date blocks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-white">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100"><Inbox className="h-5 w-5 text-amber-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <XCircle className="h-5 w-5 shrink-0" /> {error}
        </div>
      )}

      {pendingCount > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-start gap-2">
          <Info className="h-5 w-5 shrink-0 mt-0.5" />
          <span>You have {pendingCount} pending request(s). New requests are blocked until reviewed.</span>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Weekly slots */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" /> Weekly availability
            </CardTitle>
            <p className="text-sm text-gray-500">Recurring schedule (every week)</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DAYS.map((name, dow) => {
                const slots = byDay[dow] || [];
                return (
                  <div key={dow} className="flex flex-wrap items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                    <span className="w-24 text-sm font-semibold text-gray-700">{name}</span>
                    {slots.length === 0 ? (
                      <span className="text-sm text-gray-400 italic">No slots</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {slots.map(slot => (
                          <span key={slot.id} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${slot.is_available ? 'bg-cyan-50 text-cyan-800 border border-cyan-200' : 'bg-gray-100 text-gray-500 border border-gray-200 line-through'}`}>
                            {slot.start_time} – {slot.end_time}
                            <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${slot.mode === 'offline' ? 'bg-blue-100 text-blue-800' : slot.mode === 'online' ? 'bg-violet-100 text-violet-800' : 'bg-amber-100 text-amber-800'}`}>
                              {modeLabel(slot.mode)}
                            </span>
                            {!slot.is_available && ' (off)'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-6 flex items-start gap-1.5">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              To change recurring slots, contact your location admin.
            </p>
          </CardContent>
        </Card>

        {/* Right */}
        <div className="space-y-6">
          {/* Request time off */}
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                <AlertCircle className="h-5 w-5 text-amber-600" /> Request time off
              </CardTitle>
              <p className="text-sm text-gray-600">
                Pick specific dates to block. Super admin approves, then those dates are unavailable for patients.
              </p>
            </CardHeader>
            <CardContent>
              <Button size="lg" onClick={() => setOpenRequest(true)} disabled={pendingCount > 0} className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-medium">
                <AlertCircle className="h-5 w-5 mr-2" /> Request time off
              </Button>
              {pendingCount > 0 && <p className="text-xs text-amber-700 mt-2">Blocked while you have pending requests.</p>}
            </CardContent>
          </Card>

          {/* Upcoming date blocks */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Ban className="h-5 w-5 text-rose-500" /> Upcoming blocked dates
              </CardTitle>
              <p className="text-sm text-gray-500">Approved date-specific unavailability</p>
            </CardHeader>
            <CardContent>
              {overrides.length === 0 ? (
                <div className="py-8 text-center">
                  <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No blocked dates</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                  {overrides.map(o => (
                    <div key={o.id} className="flex items-center justify-between p-3 rounded-lg border border-rose-100 bg-rose-50/50">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{formatDate(o.date)}</p>
                        <p className="text-xs text-gray-600">
                          {o.startTime && o.endTime ? `${o.startTime}–${o.endTime} blocked` : 'Whole day blocked'}
                        </p>
                        {o.reason && <p className="text-xs text-gray-500 mt-0.5">{o.reason}</p>}
                      </div>
                      <Ban className="h-4 w-4 text-rose-400 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Request history */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Inbox className="h-5 w-5 text-gray-600" /> Request history
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingRequests ? (
                <div className="py-8 text-center text-gray-500 text-sm">Loading...</div>
              ) : requests.length === 0 ? (
                <div className="py-8 text-center">
                  <Inbox className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No requests yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {requests.map(r => (
                    <div key={r.id} className="p-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">{r.daysLabel}</p>
                          {r.reason && <p className="text-xs text-gray-600 mt-0.5">{r.reason}</p>}
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 ${r.status === 'pending' ? 'bg-amber-100 text-amber-800' : r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {r.status === 'pending' && <Clock className="h-3 w-3" />}
                          {r.status === 'approved' && <CheckCircle2 className="h-3 w-3" />}
                          {r.status === 'rejected' && <XCircle className="h-3 w-3" />}
                          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                        </span>
                      </div>
                      {r.reviewNotes && r.status !== 'pending' && (
                        <p className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-100">Admin: {r.reviewNotes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Request Dialog */}
      <Dialog open={openRequest} onOpenChange={open => { setOpenRequest(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg sm:max-w-xl max-h-[90vh] min-h-0 flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-xl font-semibold">Request time off</DialogTitle>
            <DialogDescription>
              Choose specific dates you need off. Once approved, those dates will be blocked for patients.
            </DialogDescription>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200 mb-2 shrink-0">
            <button type="button" onClick={() => setRequestMode('whole_day')} className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${requestMode === 'whole_day' ? 'bg-amber-100 text-amber-800 border-b-2 border-amber-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              Whole day(s)
            </button>
            <button type="button" onClick={() => setRequestMode('partial')} className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${requestMode === 'partial' ? 'bg-amber-100 text-amber-800 border-b-2 border-amber-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              Partial time
            </button>
          </div>

          <div className="overflow-y-auto flex-1 min-h-0 space-y-5 py-3 -mx-1 px-1">
            {requestMode === 'whole_day' && (
              <div>
                <label className="text-sm font-semibold text-gray-800 block mb-2">Pick date(s)</label>
                <p className="text-xs text-gray-500 mb-3">Select one or more future dates to mark as completely unavailable.</p>
                <input
                  type="date"
                  min={today}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v && !selectedDates.includes(v)) {
                      setSelectedDates(prev => [...prev, v].sort());
                    }
                    e.target.value = '';
                  }}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm mb-3"
                />
                {selectedDates.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedDates.map(d => (
                      <span key={d} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 text-sm font-medium">
                        {formatDate(d)}
                        <button type="button" onClick={() => setSelectedDates(prev => prev.filter(x => x !== d))} className="hover:text-red-600 ml-1">
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {selectedDates.length === 0 && <p className="text-xs text-gray-400 italic">No dates selected yet. Use the date picker above.</p>}
              </div>
            )}

            {requestMode === 'partial' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-800 block mb-2">Date</label>
                  <input type="date" min={today} value={partialDate} onChange={(e) => setPartialDate(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm" />
                </div>
                {partialDate && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-800 block mb-1">Unavailable from</label>
                      <input type="time" value={unavailableStart} onChange={(e) => setUnavailableStart(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-800 block mb-1">Unavailable to</label>
                      <input type="time" value={unavailableEnd} onChange={(e) => setUnavailableEnd(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                    </div>
                    <p className="col-span-2 text-xs text-gray-500">
                      On {formatDate(partialDate)}, slots from {unavailableStart || '…'} to {unavailableEnd || '…'} will be blocked after approval.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-2">Reason (optional)</label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Vacation, personal leave, conference..." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" rows={2} />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 flex items-center gap-2 shrink-0">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}
          <DialogFooter className="gap-2 sm:gap-0 shrink-0 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={() => setOpenRequest(false)} disabled={submitting} className="w-full sm:w-auto">Cancel</Button>
            <Button
              onClick={handleSubmitRequest}
              disabled={submitting || (requestMode === 'whole_day' && selectedDates.length === 0) || (requestMode === 'partial' && (!partialDate || !unavailableStart || !unavailableEnd))}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Submit request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
