/**
 * H2H Healthcare - Doctor Logout API
 * POST /api/doctor/auth/logout
 * Clears the doctor_session cookie.
 */

import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out.' });
  response.cookies.set('doctor_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // Expire immediately
  });
  return response;
}
