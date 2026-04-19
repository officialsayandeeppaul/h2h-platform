/**
 * H2H Healthcare - Contact Form API
 * Public endpoint - stores messages for super admin (Help & Support)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

const INDIAN_MOBILE_10 = /^[6-9]\d{9}$/;

function normalizePhoneTenDigits(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;
  let d = raw.replace(/\D/g, '');
  if (d.length >= 12 && d.startsWith('91')) d = d.slice(-10);
  else if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length !== 10 || !INDIAN_MOBILE_10.test(d)) return null;
  return d;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, services } = body as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
      services?: string[];
    };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name, email and message are required' },
        { status: 400 }
      );
    }

    const phoneNormalized = normalizePhoneTenDigits(phone);
    if (phone != null && String(phone).trim() !== '' && phoneNormalized === null) {
      return NextResponse.json(
        {
          success: false,
          error: 'Phone must be exactly 10 digits (Indian mobile), or omit the field',
        },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: name.trim(),
        email: email.trim(),
        phone: phoneNormalized,
        message: message.trim(),
        services: Array.isArray(services) ? services : [],
        status: 'new',
      })
      .select('id, created_at')
      .single();

    if (error) {
      console.error('Contact form insert error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data?.id,
      message: 'Message sent successfully. We will get back to you soon.',
    });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
