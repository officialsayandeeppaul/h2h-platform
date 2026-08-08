/**
 * OTP gate for creating / promoting super admins.
 * Codes are emailed to SUPER_ADMIN_OTP_EMAIL (owner inbox).
 */

import { deleteOTP, getOTP, incrementAttempts, setOTP } from '@/lib/otp-store';
import { sendEmail } from '@/lib/resend';

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

  const result = await sendEmail({
    to,
    subject: 'H2H Security — Super Admin verification code',
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#0f172a;">
        <h2 style="margin:0 0 12px;color:#0891b2;">Super Admin verification</h2>
        <p style="margin:0 0 16px;color:#475569;line-height:1.5;">
          A request was made to grant <strong>super admin</strong> access to
          <strong>${params.candidateEmail}</strong>${params.candidateName ? ` (${params.candidateName})` : ''}.
        </p>
        <p style="margin:0 0 8px;color:#475569;">Your 6-digit verification code:</p>
        <p style="font-size:32px;letter-spacing:8px;font-weight:700;margin:0 0 16px;color:#0e7490;">${otp}</p>
        <p style="margin:0;font-size:13px;color:#94a3b8;">This code expires in 10 minutes. If you did not request this, ignore this email.</p>
      </div>
    `,
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
