/**
 * H2H Healthcare - Doctor OTP Verify API
 * POST /api/doctor/auth/verify-otp
 * Verifies the OTP and sets a secure doctor session cookie.
 * No Supabase Auth needed — uses a simple signed cookie.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getOTP, incrementAttempts, deleteOTP } from '@/lib/otp-store';
import crypto from 'crypto';

// Simple HMAC signing for the session cookie
const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'doctor-session-secret';

function signPayload(payload: string): string {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: 'Email and OTP are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const entry = getOTP(normalizedEmail);

    if (!entry) {
      return NextResponse.json({ success: false, error: 'No OTP found. Please request a new one.' }, { status: 400 });
    }

    // Check expiry
    if (Date.now() > entry.expiresAt) {
      deleteOTP(normalizedEmail);
      return NextResponse.json({ success: false, error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    // Check attempts (max 5)
    if (entry.attempts >= 5) {
      deleteOTP(normalizedEmail);
      return NextResponse.json({ success: false, error: 'Too many failed attempts. Please request a new OTP.' }, { status: 429 });
    }

    // Verify OTP
    if (entry.otp !== otp.trim()) {
      incrementAttempts(normalizedEmail);
      const remaining = 5 - (entry.attempts + 1);
      return NextResponse.json({
        success: false,
        error: `Invalid OTP. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
      }, { status: 400 });
    }

    // OTP is valid - clean up
    deleteOTP(normalizedEmail);

    const adminClient = createAdminClient();

    // Get the doctor's record from our users table
    const { data: userData } = await (adminClient.from('users') as any)
      .select('id, email, full_name, role')
      .eq('email', normalizedEmail)
      .eq('role', 'doctor')
      .single();

    if (!userData) {
      return NextResponse.json({ success: false, error: 'Doctor account not found.' }, { status: 404 });
    }

    // Create a signed session payload
    const sessionData = {
      id: (userData as any).id,
      email: (userData as any).email,
      fullName: (userData as any).full_name,
      role: 'doctor',
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    const payload = Buffer.from(JSON.stringify(sessionData)).toString('base64');
    const signature = signPayload(payload);
    const token = `${payload}.${signature}`;

    console.log(`✅ Doctor ${normalizedEmail} OTP verified. Session cookie set.`);

    // Set the session cookie and return success
    const response = NextResponse.json({
      success: true,
      verified: true,
      message: 'OTP verified successfully.',
      user: {
        id: sessionData.id,
        email: sessionData.email,
        fullName: sessionData.fullName,
        role: 'doctor',
      },
    });

    // Set HTTP-only secure cookie
    response.cookies.set('doctor_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours in seconds
    });

    return response;
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// Export helper to verify the doctor session cookie
export function verifyDoctorSession(cookieValue: string): {
  id: string; email: string; fullName: string; role: string;
} | null {
  try {
    const [payload, signature] = cookieValue.split('.');
    if (!payload || !signature) return null;

    // Verify signature
    const expectedSig = signPayload(payload);
    if (signature !== expectedSig) return null;

    // Decode and check expiry
    const data = JSON.parse(Buffer.from(payload, 'base64').toString());
    if (Date.now() > data.exp) return null;

    return { id: data.id, email: data.email, fullName: data.fullName, role: data.role };
  } catch {
    return null;
  }
}
