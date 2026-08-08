/**
 * Super Admin Setup API
 * First-time setup: secret key + registered email + OTP emailed to SUPER_ADMIN_OTP_EMAIL
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import {
  getSuperAdminOtpEmail,
  maskEmail,
  sendSuperAdminCreationOtp,
  verifySuperAdminCreationOtp,
} from '@/lib/super-admin-otp';

const SUPER_ADMIN_SECRET = process.env.SUPER_ADMIN_SECRET_KEY || 'h2h-super-admin-2024';

async function findCandidate(supabase: ReturnType<typeof createAdminClient>, email: string) {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, email, full_name')
    .eq('email', email.toLowerCase().trim())
    .single();

  return {
    user: userData as { id: string; email: string; full_name: string } | null,
    error: userError,
  };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { secretKey, email, otp, action } = body as {
      secretKey?: string;
      email?: string;
      otp?: string;
      action?: 'request-otp' | 'confirm';
    };

    if (secretKey !== SUPER_ADMIN_SECRET) {
      return NextResponse.json({ error: 'Invalid secret key' }, { status: 403 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { data: existingAdmins } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'super_admin')
      .limit(1);

    if (existingAdmins && existingAdmins.length > 0) {
      return NextResponse.json({
        error: 'Super admin already exists. New admins must be approved by an existing super admin.',
      }, { status: 400 });
    }

    const { user, error: userError } = await findCandidate(supabase, email);
    if (userError || !user) {
      return NextResponse.json({
        error: `User not found. Please sign up first with Google. (${userError?.message || 'No user with this email'})`,
      }, { status: 404 });
    }

    const step = action || (otp ? 'confirm' : 'request-otp');

    if (step === 'request-otp') {
      const sent = await sendSuperAdminCreationOtp({
        candidateEmail: user.email,
        candidateName: user.full_name,
      });

      if (!sent.success) {
        return NextResponse.json({ error: sent.error || 'Failed to send OTP' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        requiresOtp: true,
        message: `Verification code sent to ${maskEmail(getSuperAdminOtpEmail())}`,
        maskedOtpEmail: maskEmail(getSuperAdminOtpEmail()),
      });
    }

    if (!otp || String(otp).trim().length !== 6) {
      return NextResponse.json({ error: 'Enter the 6-digit verification code' }, { status: 400 });
    }

    const verified = verifySuperAdminCreationOtp(user.email, String(otp));
    if (!verified.ok) {
      return NextResponse.json({ error: verified.error }, { status: 403 });
    }

    const { error: updateError } = await (supabase.from('users') as any)
      .update({ role: 'super_admin' })
      .eq('id', user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Super admin created successfully',
      user: { id: user.id, email: user.email, full_name: user.full_name },
    });
  } catch (error) {
    console.error('Super admin setup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: admins, error } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('role', 'super_admin');

    const hasSuperAdmin = !error && admins && admins.length > 0;

    return NextResponse.json({
      hasSuperAdmin,
      needsSetup: !hasSuperAdmin,
    });
  } catch (error) {
    console.error('GET /api/admin/setup error:', error);
    return NextResponse.json({ error: 'Internal server error', needsSetup: true }, { status: 500 });
  }
}
