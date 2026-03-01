'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

/**
 * Super admin: toast when a new appointment/booking is created
 * Polling-based (works without Realtime)
 */
export function AdminBookingNotifications() {
  const seenIds = useRef<Set<string>>(new Set());
  const baselineSet = useRef(false);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('/api/admin/appointments?limit=20');
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success || !Array.isArray(data.data)) return;

        const appointments = data.data as { id: string; patient?: { full_name?: string }; payment_status?: string }[];
        for (const apt of appointments) {
          if (apt.id && !seenIds.current.has(apt.id) && apt.payment_status === 'paid') {
            seenIds.current.add(apt.id);
            if (!baselineSet.current) continue;
            const name = (apt.patient as { full_name?: string })?.full_name ?? 'Patient';
            toast.success('New booking', {
              description: `${name} booked an appointment`,
              duration: 6000,
              action: {
                label: 'View',
                onClick: () => { window.location.href = '/super-admin/appointments'; },
              },
            });
          }
        }
        baselineSet.current = true;
      } catch { /* ignore */ }
    };

    poll();
    const interval = setInterval(poll, 15000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
