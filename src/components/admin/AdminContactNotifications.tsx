'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const DEFAULT_TITLE = 'H2H Admin';

function showNewMessageToast(name: string) {
  document.title = `● New message from ${name} - ${DEFAULT_TITLE}`;
  toast.success(`New message from ${name}`, {
    description: 'View in Help & Support',
    duration: 8000,
    action: {
      label: 'View',
      onClick: () => {
        document.title = DEFAULT_TITLE;
        window.location.href = '/super-admin/help-support';
      },
    },
  });
  setTimeout(() => { document.title = DEFAULT_TITLE; }, 3000);
}

/**
 * Super admin push notification for new contact form submissions.
 * 1. Supabase Realtime (instant, when enabled)
 * 2. Polling fallback (every 45s) so admin always gets notified
 */
export function AdminContactNotifications() {
  const seenIds = useRef<Set<string>>(new Set());
  const baselineSet = useRef(false);
  const realtimeSubscribed = useRef(false);

  // Realtime subscription (instant push when Supabase Realtime is enabled)
  useEffect(() => {
    if (realtimeSubscribed.current) return;
    realtimeSubscribed.current = true;

    const supabase = createClient();
    const channel = supabase
      .channel('contact_messages_insert')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_messages',
        },
        (payload) => {
          const row = payload.new as { id?: string; name?: string } | null;
          if (row?.id) seenIds.current.add(row.id);
          const name = row?.name ?? 'Someone';
          showNewMessageToast(name);
        }
      )
      .subscribe();

    return () => {
      realtimeSubscribed.current = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Polling fallback (works without Realtime; ensures admin gets notified)
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('/api/admin/contact-messages');
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success || !Array.isArray(data.data)) return;

        const messages = data.data as { id: string; name?: string }[];
        for (const m of messages) {
          if (m.id && !seenIds.current.has(m.id)) {
            seenIds.current.add(m.id);
            if (!baselineSet.current) continue;
            showNewMessageToast(m?.name ?? 'Someone');
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
