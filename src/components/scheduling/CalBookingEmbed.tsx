'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCalApi } from '@calcom/embed-react';
import {
  getCalLink,
  getCalOrigin,
  isCalChannelConfigured,
  type CalBookingChannel,
} from '@/lib/cal/config';

const Cal = dynamic(() => import('@calcom/embed-react'), { ssr: false });

interface CalBookingEmbedProps {
  channel: CalBookingChannel;
  guestName?: string;
  guestEmail?: string;
  onBookingSuccess?: () => void;
}

export function CalBookingEmbed({
  channel,
  guestName,
  guestEmail,
  onBookingSuccess,
}: CalBookingEmbedProps) {
  const [ready, setReady] = useState(false);
  const calLink = getCalLink(channel);
  const configured = isCalChannelConfigured(channel);

  useEffect(() => {
    if (!configured || !calLink) return;

    let cancelled = false;

    (async () => {
      try {
        const cal = await getCalApi();
        if (cancelled) return;

        cal('ui', {
          theme: 'light',
          styles: {
            branding: { brandColor: '#0891b2' },
          },
          hideEventTypeDetails: false,
          layout: 'month_view',
        });

        if (onBookingSuccess) {
          cal('on', {
            action: 'bookingSuccessful',
            callback: () => {
              if (!cancelled) onBookingSuccess();
            },
          });
        }

        setReady(true);
      } catch (e) {
        console.error('[H2H] Cal embed init failed:', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [configured, calLink, onBookingSuccess]);

  if (!configured || !calLink) {
    return (
      <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
        Cal.com is not configured for this channel. Use the form below or set env vars in{' '}
        <code className="text-xs">.env.local</code> (see docs/CALCOM_SETUP.md).
      </p>
    );
  }

  return (
    <div
      className={`w-full min-h-[420px] rounded-xl border border-gray-200 overflow-hidden bg-white transition-opacity ${
        ready ? 'opacity-100' : 'opacity-70'
      }`}
    >
      <Cal
        calLink={calLink}
        calOrigin={getCalOrigin()}
        style={{ width: '100%', minHeight: 420, height: '100%' }}
        config={{
          layout: 'month_view',
          ...(guestName?.trim() ? { name: guestName.trim() } : {}),
          ...(guestEmail?.trim() ? { email: guestEmail.trim() } : {}),
        }}
      />
    </div>
  );
}
