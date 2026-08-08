/**
 * OTP gate for creating / promoting super admins.
 * Codes are emailed to SUPER_ADMIN_OTP_EMAIL (owner inbox).
 */

import { deleteOTP, getOTP, incrementAttempts, setOTP } from '@/lib/otp-store';
import { sendEmail } from '@/lib/resend';
import {
  emailCodeBlock,
  emailParagraph,
  escapeEmailHtml,
  wrapH2HEmail,
} from '@/lib/email-layout';

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function getSuperAdminOtpEmail(): string {
  return (
    process.env.SUPER_ADMIN_OTP_EMAIL?.trim() ||
    'official.sayandeeppaul@gmail.com'
  );
}

function otpStoreKey(candidateEmail: string): string {
  return `super-admin-create:${candidateEmail.toLowerCase().trim()}`;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
}

export async function sendSuperAdminCreationOtp(params: {
  candidateEmail: string;
  candidateName?: string | null;
}): Promise<{ success: boolean; to: string; error?: string }> {
  const to = getSuperAdminOtpEmail();
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  setOTP(otpStoreKey(params.candidateEmail), otp, OTP_TTL_MS);

  const nameBit = params.candidateName
    ? ` (${escapeEmailHtml(params.candidateName)})`
    : '';

  const result = await sendEmail({
    to,
    subject: 'H2H Security — Super Admin verification code',
    html: wrapH2HEmail({
      preview: 'Your 6-digit super admin verification code',
      title: 'Super Admin verification | H2H Healthcare',
      headerTitle: 'Security verification',
      bodyRowsHtml: [
        emailParagraph('Hello,'),
        emailParagraph(
          `We've received a request to grant <strong>super admin</strong> access to <strong>${escapeEmailHtml(params.candidateEmail)}</strong>${nameBit}.`
        ),
        emailParagraph('You can approve this by entering the code below:'),
        emailCodeBlock(otp),
        emailParagraph('This code expires in 10 minutes.'),
      ].join(''),
      tip: 'If you did not request this, ignore this email and secure your admin secret key immediately.',
    }),
  });

  if (!result.success) {
    return { success: false, to, error: 'Failed to send verification email' };
  }

  return { success: true, to };
}

export function verifySuperAdminCreationOtp(
  candidateEmail: string,
  otp: string
): { ok: true } | { ok: false; error: string } {
  const key = otpStoreKey(candidateEmail);
  const entry = getOTP(key);

  if (!entry) {
    return { ok: false, error: 'Verification code expired or not requested. Request a new code.' };
  }

  if (Date.now() > entry.expiresAt) {
    deleteOTP(key);
    return { ok: false, error: 'Verification code expired. Request a new code.' };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    deleteOTP(key);
    return { ok: false, error: 'Too many invalid attempts. Request a new code.' };
  }

  if (entry.otp !== otp.trim()) {
    incrementAttempts(key);
    return { ok: false, error: 'Invalid verification code' };
  }

  deleteOTP(key);
  return { ok: true };
}
