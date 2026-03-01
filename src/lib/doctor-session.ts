/**
 * H2H Healthcare - Doctor Session Helper
 * Verifies the signed doctor_session cookie.
 * Used by middleware and dashboard layout.
 */

import crypto from 'crypto';

const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'doctor-session-secret';

function signPayload(payload: string): string {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
}

export interface DoctorSessionData {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export function verifyDoctorSession(cookieValue: string): DoctorSessionData | null {
  try {
    const [payload, signature] = cookieValue.split('.');
    if (!payload || !signature) return null;

    const expectedSig = signPayload(payload);
    if (signature !== expectedSig) return null;

    const data = JSON.parse(Buffer.from(payload, 'base64').toString());
    if (Date.now() > data.exp) return null;

    return { id: data.id, email: data.email, fullName: data.fullName, role: data.role };
  } catch {
    return null;
  }
}
