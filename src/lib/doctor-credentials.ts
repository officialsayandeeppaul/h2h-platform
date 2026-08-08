/**
 * Doctor onboarding — Supabase Auth account + welcome email with temporary password.
 */

import crypto from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import {
  emailCodeBlock,
  emailDetailsTable,
  emailParagraph,
  escapeEmailHtml,
  wrapH2HEmail,
} from '@/lib/email-layout';

export function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
  const bytes = crypto.randomBytes(14);
  let password = '';
  for (let i = 0; i < 14; i++) {
    password += chars[bytes[i]! % chars.length];
  }
  return password;
}

function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
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

async function findAuthUserByEmail(
  adminClient: SupabaseClient,
  email: string
): Promise<{ id: string; email?: string } | null> {
  let page = 1;
  const perPage = 200;
  const target = email.toLowerCase();

  while (page <= 10) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage });
    if (error) {
      console.error('listUsers error:', error);
      return null;
    }
    const match = data.users.find((u) => u.email?.toLowerCase() === target);
    if (match) return { id: match.id, email: match.email };
    if (data.users.length < perPage) break;
    page += 1;
  }
  return null;
}

export interface EnsureDoctorAuthResult {
  authUserId: string;
  temporaryPassword: string;
  authCreated: boolean;
}

/**
 * Ensures a Supabase Auth user exists for this doctor email and sets a fresh temporary password.
 */
export async function ensureDoctorAuthUser(
  adminClient: SupabaseClient,
  email: string,
  fullName: string,
  existingPublicUserId?: string
): Promise<EnsureDoctorAuthResult> {
  const normalizedEmail = email.toLowerCase().trim();
  const temporaryPassword = generateTemporaryPassword();

  if (existingPublicUserId) {
    const { data: byId } = await adminClient.auth.admin.getUserById(existingPublicUserId);
    if (byId?.user) {
      const { error: updateErr } = await adminClient.auth.admin.updateUserById(existingPublicUserId, {
        password: temporaryPassword,
        email_confirm: true,
        user_metadata: { full_name: fullName, role: 'doctor' },
      });
      if (updateErr) throw new Error(updateErr.message);
      return { authUserId: existingPublicUserId, temporaryPassword, authCreated: false };
    }
  }

  const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
    email: normalizedEmail,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: 'doctor' },
  });

  if (!createErr && created.user) {
    return { authUserId: created.user.id, temporaryPassword, authCreated: true };
  }

  const alreadyExists =
    createErr?.message?.toLowerCase().includes('already') ||
    createErr?.message?.toLowerCase().includes('registered') ||
    createErr?.status === 422;

  if (alreadyExists) {
    const existingAuth = await findAuthUserByEmail(adminClient, normalizedEmail);
    if (!existingAuth) {
      throw new Error('This email is already registered but could not be linked. Contact support.');
    }
    const { error: updateErr } = await adminClient.auth.admin.updateUserById(existingAuth.id, {
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: 'doctor' },
    });
    if (updateErr) throw new Error(updateErr.message);
    return { authUserId: existingAuth.id, temporaryPassword, authCreated: false };
  }

  throw new Error(createErr?.message || 'Failed to create doctor login account');
}

export async function sendDoctorWelcomeEmail(params: {
  email: string;
  fullName: string;
  temporaryPassword: string;
  loginUrl: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const { email, fullName, temporaryPassword, loginUrl } = params;
  const transporter = getTransporter();

  console.log('\n========================================');
  console.log('DOCTOR ACCOUNT CREATED');
  console.log(`Email: ${email}`);
  console.log(`Temporary password: ${temporaryPassword}`);
  console.log(`Login: ${loginUrl}`);
  console.log('========================================\n');

  if (!transporter) {
    return { sent: false, reason: 'SMTP not configured' };
  }

  try {
    await transporter.sendMail({
      from: `"H2H Healthcare" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your H2H Doctor Portal Account',
      html: wrapH2HEmail({
        preview: 'Your doctor portal account is ready',
        title: 'Doctor Portal Account | H2H Healthcare',
        headerTitle: 'Welcome to the doctor portal',
        bodyRowsHtml: [
          emailParagraph(`Hello ${escapeEmailHtml(fullName)},`),
          emailParagraph(
            'Your H2H doctor account is ready. Use the credentials below to sign in. You can also request a one-time code from the same login page.'
          ),
          emailDetailsTable([
            { label: 'Email', value: escapeEmailHtml(email) },
          ]),
          emailParagraph('Temporary password:'),
          emailCodeBlock(temporaryPassword),
          emailParagraph(
            'Please change this password after your first login when that option is available. Do not share these details with anyone.'
          ),
        ].join(''),
        cta: { label: 'Open doctor portal', href: loginUrl },
        tip: 'If you did not expect this email, contact your clinic administrator or support@healtohealth.in.',
      }),
    });
    console.log(`Doctor welcome email sent to ${email}`);
    return { sent: true };
  } catch (err) {
    console.error('Failed to send doctor welcome email:', err);
    return { sent: false, reason: err instanceof Error ? err.message : 'Send failed' };
  }
}
