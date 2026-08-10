/**
 * Super-admin Quick Booking payment settings (singleton)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function checkSuperAdmin() {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { isSuperAdmin: false, adminClient };

  const { data: userData } = await adminClient.from('users').select('role').eq('id', user.id).single();
  return {
    isSuperAdmin: (userData as { role?: string } | null)?.role === 'super_admin',
    adminClient,
  };
}

export async function GET() {
  try {
    const { isSuperAdmin, adminClient } = await checkSuperAdmin();
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data, error } = await adminClient
      .from('quick_booking_settings')
      .select('payment_enabled, default_amount, require_payment, updated_at')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      const missing = /schema cache|does not exist|Could not find the table/i.test(error.message);
      if (missing) {
        return NextResponse.json({
          success: true,
          needsSetup: true,
          setupSql: 'RUN_THIS_QUICK_BOOKINGS.sql',
          settings: {
            payment_enabled: false,
            default_amount: null,
            require_payment: true,
            updated_at: null,
          },
          error: error.message,
        });
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      needsSetup: false,
      settings: data || {
        payment_enabled: false,
        default_amount: null,
        require_payment: true,
        updated_at: null,
      },
    });
  } catch (err) {
    console.error('GET /api/admin/quick-bookings/settings', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isSuperAdmin, adminClient } = await checkSuperAdmin();
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const payment_enabled = Boolean(body.payment_enabled);
    const require_payment = body.require_payment !== false;
    let default_amount: number | null = null;
    if (body.default_amount != null && body.default_amount !== '') {
      const n = Number(body.default_amount);
      if (!Number.isFinite(n) || n < 0) {
        return NextResponse.json({ error: 'default_amount must be a non-negative number' }, { status: 400 });
      }
      default_amount = n;
    }

    const { data, error } = await adminClient
      .from('quick_booking_settings')
      .upsert({
        id: 1,
        payment_enabled,
        require_payment,
        default_amount,
        updated_at: new Date().toISOString(),
      })
      .select('payment_enabled, default_amount, require_payment, updated_at')
      .single();

    if (error) {
      const missing = /schema cache|does not exist|Could not find the table/i.test(error.message);
      return NextResponse.json(
        {
          success: false,
          needsSetup: missing,
          error: missing
            ? 'Run supabase/RUN_THIS_QUICK_BOOKINGS.sql in Supabase SQL Editor (Production), then Save again.'
            : error.message,
        },
        { status: missing ? 503 : 500 }
      );
    }

    return NextResponse.json({ success: true, settings: data });
  } catch (err) {
    console.error('PUT /api/admin/quick-bookings/settings', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
