/**
 * Cal.com scheduling — public embed links and event-type mapping.
 * @see docs/CALCOM_SETUP.md
 */

export type CalBookingChannel = 'calendar' | 'video' | 'phone';

const DEFAULT_ORIGIN = 'https://cal.com';

export function getCalOrigin(): string {
  return (process.env.NEXT_PUBLIC_CALCOM_ORIGIN || DEFAULT_ORIGIN).replace(/\/$/, '');
}

export function getCalUsername(): string | null {
  const u = process.env.NEXT_PUBLIC_CALCOM_USERNAME?.trim();
  return u || null;
}

/** True when at least username + one event slug are configured. */
export function isCalConfigured(): boolean {
  const user = getCalUsername();
  if (!user) return false;
  return (
    Boolean(process.env.NEXT_PUBLIC_CALCOM_EVENT_CLINIC?.trim()) ||
    Boolean(process.env.NEXT_PUBLIC_CALCOM_EVENT_VIDEO?.trim()) ||
    Boolean(process.env.NEXT_PUBLIC_CALCOM_EVENT_PHONE?.trim())
  );
}

export function isCalChannelConfigured(channel: CalBookingChannel): boolean {
  const user = getCalUsername();
  const slug = getCalEventSlug(channel);
  return Boolean(user && slug);
}

function getCalEventSlug(channel: CalBookingChannel): string | null {
  const map: Record<CalBookingChannel, string | undefined> = {
    calendar: process.env.NEXT_PUBLIC_CALCOM_EVENT_CLINIC,
    video: process.env.NEXT_PUBLIC_CALCOM_EVENT_VIDEO,
    phone: process.env.NEXT_PUBLIC_CALCOM_EVENT_PHONE,
  };
  const slug = map[channel]?.trim();
  return slug || null;
}

/** Cal link path: `username/event-slug` (no leading slash). */
export function getCalLink(channel: CalBookingChannel): string | null {
  const user = getCalUsername();
  const slug = getCalEventSlug(channel);
  if (!user || !slug) return null;
  return `${user}/${slug}`;
}

export function channelFromEventSlug(slug: string): CalBookingChannel | 'unknown' {
  const normalized = slug.trim().toLowerCase();
  const clinic = process.env.NEXT_PUBLIC_CALCOM_EVENT_CLINIC?.trim().toLowerCase();
  const video = process.env.NEXT_PUBLIC_CALCOM_EVENT_VIDEO?.trim().toLowerCase();
  const phone = process.env.NEXT_PUBLIC_CALCOM_EVENT_PHONE?.trim().toLowerCase();
  if (clinic && normalized === clinic) return 'calendar';
  if (video && normalized === video) return 'video';
  if (phone && normalized === phone) return 'phone';
  if (normalized.includes('video')) return 'video';
  if (normalized.includes('phone') || normalized.includes('call')) return 'phone';
  return 'unknown';
}

export const CAL_CHANNEL_LABELS: Record<CalBookingChannel, string> = {
  calendar: 'Clinic / calendar visit',
  video: 'Video consultation',
  phone: 'Phone callback',
};

export const CAL_SERVICE_TAGS: Record<CalBookingChannel, string> = {
  calendar: 'calendar_slot_request',
  video: 'video_call_request',
  phone: 'phone_callback_request',
};
