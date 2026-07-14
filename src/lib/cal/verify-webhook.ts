import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Verify Cal.com webhook signature (header: x-cal-signature-256).
 */
export function verifyCalWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string | undefined
): boolean {
  if (!secret?.trim()) {
    // Allow unsigned webhooks in dev only when secret is unset
    return process.env.NODE_ENV !== 'production';
  }
  if (!signatureHeader?.trim()) return false;

  const expected = createHmac('sha256', secret.trim())
    .update(rawBody)
    .digest('hex');

  const received = signatureHeader.trim().toLowerCase();
  try {
    const a = Buffer.from(expected, 'hex');
    const b = Buffer.from(received, 'hex');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
