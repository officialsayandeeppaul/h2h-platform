import type { CalBookingChannel } from '@/lib/cal/config';
import { CAL_CHANNEL_LABELS } from '@/lib/cal/config';

export interface CalBookingPayload {
  uid?: string;
  bookingId?: number;
  title?: string;
  eventTitle?: string;
  type?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  additionalNotes?: string;
  videoCallUrl?: string;
  attendees?: { name?: string; email?: string; phoneNumber?: string }[];
  responses?: Record<string, { value?: unknown }>;
}

function responseValue(
  responses: CalBookingPayload['responses'],
  key: string
): string | null {
  const entry = responses?.[key];
  if (!entry || entry.value == null) return null;
  if (typeof entry.value === 'string') return entry.value.trim() || null;
  if (typeof entry.value === 'object' && entry.value !== null && 'value' in entry.value) {
    const v = (entry.value as { value?: string }).value;
    return typeof v === 'string' ? v.trim() || null : null;
  }
  return null;
}

export function extractAttendee(payload: CalBookingPayload): {
  name: string;
  email: string;
  phone: string | null;
} {
  const primary = payload.attendees?.[0];
  const name =
    primary?.name?.trim() ||
    responseValue(payload.responses, 'name') ||
    'Guest';
  const email =
    primary?.email?.trim() ||
    responseValue(payload.responses, 'email') ||
    'no-email@cal.local';
  const phone =
    primary?.phoneNumber?.trim() ||
    responseValue(payload.responses, 'attendeePhoneNumber') ||
    null;

  return { name, email, phone };
}

export function formatCalBookingMessage(
  payload: CalBookingPayload,
  channel: CalBookingChannel
): string {
  const start = payload.startTime
    ? new Date(payload.startTime).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '—';
  const end = payload.endTime
    ? new Date(payload.endTime).toLocaleString('en-IN', { timeStyle: 'short' })
    : '';
  const slot = end ? `${start} – ${end}` : start;

  const lines = [
    'Cal.com booking confirmed',
    `Channel: ${CAL_CHANNEL_LABELS[channel]}`,
    `Event: ${payload.eventTitle || payload.title || payload.type || 'Appointment'}`,
    `Cal UID: ${payload.uid || '—'}`,
    payload.bookingId != null ? `Booking ID: ${payload.bookingId}` : null,
    `Scheduled slot: ${slot}`,
    payload.location ? `Location: ${payload.location}` : null,
    payload.videoCallUrl ? `Meeting link: ${payload.videoCallUrl}` : null,
    payload.additionalNotes?.trim()
      ? `Notes: ${payload.additionalNotes.trim()}`
      : null,
  ].filter(Boolean);

  return lines.join('\n');
}
