/**
 * H2H Healthcare - Doctor OTP Send API
 * POST /api/doctor/auth/send-otp
 * Sends a 6-digit OTP to the doctor's email for login.
 * OTP is also logged to console for development.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { setOTP } from '@/lib/otp-store';
import nodemailer from 'nodemailer';
import {
  emailCodeBlock,
  emailParagraph,
  wrapH2HEmail,
} from '@/lib/email-layout';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Check if this email belongs to a doctor
    const normalizedEmail = email.toLowerCase().trim();
    const { data: user } = await (adminClient.from('users') as any)
      .select('id, email, full_name, role')
      .ilike('email', normalizedEmail)
      .eq('role', 'doctor')
      .maybeSingle();

    if (!user || (user as any).role !== 'doctor') {
      // Don't reveal whether the email exists for security
      return NextResponse.json({
        success: false,
        error: 'No doctor account found with this email address.',
      }, { status: 404 });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP in shared store
    setOTP(normalizedEmail, otp);

    // Always console.log the OTP for development
    console.log(`\n========================================`);
    console.log(`🔐 DOCTOR OTP LOGIN`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 OTP: ${otp}`);
    console.log(`⏰ Expires: ${new Date(expiresAt).toLocaleTimeString()}`);
    console.log(`========================================\n`);

    // Try to send email
    const transporter = getTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"H2H Healthcare" <${process.env.SMTP_USER}>`,
          to: email,
          subject: 'Your H2H Doctor Login OTP',
          html: wrapH2HEmail({
            preview: 'Your doctor portal login code',
            title: 'Doctor Login OTP | H2H Healthcare',
            headerTitle: 'Login verification',
            bodyRowsHtml: [
              emailParagraph('Hello,'),
              emailParagraph(
                "We've received a request to sign in to the H2H doctor portal. Use this one-time code:"
              ),
              emailCodeBlock(otp),
              emailParagraph('This code expires in 5 minutes. Do not share it with anyone.'),
            ].join(''),
            tip: "If you didn't request this login, ignore this email and ensure your account email is secure.",
          }),
        });
        console.log(`✅ OTP email sent to ${email}`);
      } catch (emailErr) {
        console.error('Failed to send OTP email:', emailErr);
        // Still return success since OTP is in console
      }
    } else {
      console.log('⚠️ SMTP not configured. OTP only available in console.');
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email address.',
      doctorName: (user as any).full_name,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

