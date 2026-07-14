import { createAdminClient } from '@/lib/supabase/server';
import {
  CAL_SERVICE_TAGS,
  channelFromEventSlug,
  type CalBookingChannel,
} from '@/lib/cal/config';
import {
  extractAttendee,
  formatCalBookingMessage,
  type CalBookingPayload,
} from '@/lib/cal/format-booking-message';

function channelFromPayload(payload: CalBookingPayload): CalBookingChannel {
  const slug = (payload.type || '').trim();
  const mapped = channelFromEventSlug(slug);
  if (mapped !== 'unknown') return mapped;

  const loc = String(payload.location || '').toLowerCase();
  if (loc.includes('phone') || loc.includes('attendee')) return 'phone';
  if (loc.includes('video') || payload.videoCallUrl) return 'video';
  return 'calendar';
}

export async function persistCalBookingToAdmin(
  payload: CalBookingPayload
): Promise<{ ok: boolean; skipped?: boolean; id?: string; error?: string }> {
  const uid = payload.uid?.trim();
  if (!uid) {
    return { ok: false, error: 'Missing booking uid' };
  }

  const channel = channelFromPayload(payload);
  const channelTag =
    channel !== 'unknown' ? CAL_SERVICE_TAGS[channel] : 'calendar_slot_request';

  const admin = createAdminClient();
  const calUidTag = `cal_uid_${uid}`;

  const { data: existingRows } = await admin
    .from('contact_messages')
    .select('id')
    .contains('services', [calUidTag])
    .limit(1);

  const existing = (existingRows ?? []) as { id: string }[];
  if (existing.length > 0) {
    return { ok: true, skipped: true, id: existing[0].id };
  }

  const attendee = extractAttendee(payload);
  const message = formatCalBookingMessage(
    payload,
    channel === 'unknown' ? 'calendar' : channel
  );

  const videoUrl =
    payload.videoCallUrl ||
    (payload.metadata as { videoCallUrl?: string } | undefined)?.videoCallUrl;

  const fullMessage = videoUrl && !message.includes(videoUrl)
    ? `${message}\nMeeting link: ${videoUrl}`
    : message;

  const { data, error } = await admin
    .from('contact_messages')
    .insert({
      name: attendee.name,
      email: attendee.email,
      phone: attendee.phone,
      message: fullMessage,
      services: ['cal_booking', calUidTag, channelTag],
      status: 'new',
    })
    .select('id')
    .single();

  if (error) {
    console.error('[H2H] Cal booking persist error:', error);
    return { ok: false, error: error.message };
  }

  return { ok: true, id: data?.id };
}
