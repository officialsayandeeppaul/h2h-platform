'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

/**
 * Doctor: toast when a new appointment is booked for this doctor
 * Polling-based (uses doctor_session cookie)
 */
export function DoctorBookingNotifications() {
  const seenIds = useRef<Set<string>>(new Set());
  const baselineSet = useRef(false);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('/api/doctor/appointments?pageSize=20');
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success || !Array.isArray(data.data)) return;

        const list = data.data as { id?: string; patient?: { fullName?: string }; paymentStatus?: string }[];
        for (const apt of list) {
          if (apt.id && !seenIds.current.has(apt.id) && apt.paymentStatus === 'paid') {
            seenIds.current.add(apt.id);
            if (!baselineSet.current) continue;
            const name = apt.patient?.fullName ?? 'Patient';
            toast.success('New appointment booked', {
              description: `${name} booked a session with you`,
              duration: 6000,
              action: {
                label: 'View',
                onClick: () => { window.location.href = '/doctor/appointments'; },
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
