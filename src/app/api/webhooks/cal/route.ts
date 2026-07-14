/**
 * Cal.com webhook — BOOKING_CREATED → super-admin Call Requests queue.
 * Configure in Cal.com: Settings → Developer → Webhooks
 * URL: https://YOUR_DOMAIN/api/webhooks/cal
 * Events: BOOKING_CREATED (optional: BOOKING_CANCELLED)
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyCalWebhookSignature } from '@/lib/cal/verify-webhook';
import { persistCalBookingToAdmin } from '@/lib/cal/persist-booking';
import type { CalBookingPayload } from '@/lib/cal/format-booking-message';

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-cal-signature-256');

  if (
    !verifyCalWebhookSignature(
      rawBody,
      signature,
      process.env.CALCOM_WEBHOOK_SECRET
    )
  ) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let body: {
    triggerEvent?: string;
    payload?: CalBookingPayload & {
      metadata?: { videoCallUrl?: string };
    };
  };

  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const trigger = body.triggerEvent;
  if (trigger !== 'BOOKING_CREATED') {
    return NextResponse.json({ success: true, ignored: trigger });
  }

  const p = body.payload;
  if (!p) {
    return NextResponse.json({ error: 'Missing payload' }, { status: 400 });
  }

  const payload: CalBookingPayload = {
    uid: p.uid,
    bookingId: p.bookingId,
    title: p.title,
    eventTitle: p.eventTitle,
    type: p.type,
    startTime: p.startTime,
    endTime: p.endTime,
    location: typeof p.location === 'string' ? p.location : undefined,
    additionalNotes: p.additionalNotes,
    videoCallUrl: p.metadata?.videoCallUrl,
    attendees: p.attendees,
    responses: p.responses,
  };

  const result = await persistCalBookingToAdmin(payload);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    id: result.id,
    skipped: result.skipped ?? false,
  });
}
