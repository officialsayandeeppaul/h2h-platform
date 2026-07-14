'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ListItemsSkeleton } from '@/components/admin/AdminSkeletons';
import { Calendar, CalendarCheck, Loader2, Phone, Video } from 'lucide-react';

type RequestStatus = 'new' | 'read' | 'replied';

interface CallRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  services: string[];
  status: RequestStatus;
  created_at: string;
}

function parseLine(message: string, prefix: string): string | null {
  const line = message
    .split('\n')
    .find((item) => item.toLowerCase().startsWith(prefix.toLowerCase()));
  if (!line) return null;
  return line.slice(prefix.length).trim();
}

function requestMode(
  services: string[]
): 'calendar' | 'video' | 'phone' | 'unknown' {
  if (services.includes('video_call_request')) return 'video';
  if (services.includes('phone_callback_request')) return 'phone';
  if (services.includes('calendar_slot_request')) return 'calendar';
  return 'unknown';
}

export default function SuperAdminCallRequestsPage() {
  const [requests, setRequests] = useState<CallRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | RequestStatus>('new');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.set('source', 'call_requests');
      if (statusFilter !== 'all') qs.set('status', statusFilter);
      const res = await fetch(`/api/admin/contact-messages?${qs.toString()}`);
      const data = await res.json().catch(() => ({}));
      if (data.success && Array.isArray(data.data)) {
        setRequests(data.data);
      } else {
        setRequests([]);
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateStatus = async (id: string, status: RequestStatus) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/admin/contact-messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await fetchRequests();
    } finally {
      setUpdatingId(null);
    }
  };

  const newCount = requests.filter((r) => r.status === 'new').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Call &amp; calendar requests</h1>
          <p className="mt-1 text-sm text-gray-500">
            Cal.com live bookings and manual slot requests from the homepage icons.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | RequestStatus)}
          >
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="all">All</option>
          </select>
          <Button variant="outline" size="sm" onClick={fetchRequests} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      {!loading && statusFilter === 'new' && newCount > 0 && (
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
          {newCount} new request{newCount !== 1 ? 's' : ''} waiting for review.
        </div>
      )}

      {loading ? (
        <ListItemsSkeleton count={6} />
      ) : requests.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          No call or Cal.com requests found.
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => {
            const mode = requestMode(request.services);
            const fromCal = request.services.includes('cal_booking');
            const scheduledSlot =
              parseLine(request.message, 'Scheduled slot:') ||
              parseLine(request.message, 'Preferred slot:');
            const calUid = parseLine(request.message, 'Cal UID:');
            const meetingLink = parseLine(request.message, 'Meeting link:');

            return (
              <div key={request.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-900">{request.name}</p>
                      {fromCal && (
                        <Badge className="bg-violet-100 text-violet-800 border-violet-200">
                          <CalendarCheck className="mr-1 h-3 w-3" /> Cal.com
                        </Badge>
                      )}
                      {mode === 'calendar' && (
                        <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200">
                          <Calendar className="mr-1 h-3 w-3" /> Calendar
                        </Badge>
                      )}
                      {mode === 'video' && (
                        <Badge className="bg-teal-100 text-teal-800 border-teal-200">
                          <Video className="mr-1 h-3 w-3" /> Video
                        </Badge>
                      )}
                      {mode === 'phone' && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          <Phone className="mr-1 h-3 w-3" /> Phone
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{request.email}</p>
                    {request.phone && (
                      <a
                        href={`tel:${request.phone}`}
                        className="text-sm text-cyan-700 hover:underline"
                      >
                        {request.phone}
                      </a>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(request.created_at).toLocaleString('en-IN')}
                    </p>
                    {scheduledSlot && (
                      <p className="text-sm font-medium text-gray-800">
                        {fromCal ? 'Scheduled' : 'Preferred'}: {scheduledSlot}
                      </p>
                    )}
                    {calUid && calUid !== '—' && (
                      <p className="text-xs text-gray-500 font-mono">UID {calUid}</p>
                    )}
                    {meetingLink && (
                      <a
                        href={meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-cyan-600 hover:underline break-all"
                      >
                        Join meeting
                      </a>
                    )}
                    {!fromCal && request.message && (
                      <p className="text-xs text-gray-500 whitespace-pre-wrap line-clamp-3">
                        {request.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {request.status !== 'read' && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updatingId === request.id}
                        onClick={() => updateStatus(request.id, 'read')}
                      >
                        {updatingId === request.id ? (
                          <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                        ) : null}
                        Mark read
                      </Button>
                    )}
                    {request.status !== 'replied' && (
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        disabled={updatingId === request.id}
                        onClick={() => updateStatus(request.id, 'replied')}
                      >
                        {updatingId === request.id ? (
                          <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                        ) : null}
                        Mark replied
                      </Button>
                    )}
                    {request.status !== 'new' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={updatingId === request.id}
                        onClick={() => updateStatus(request.id, 'new')}
                      >
                        Mark new
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
