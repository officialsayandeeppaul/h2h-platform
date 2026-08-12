/**
 * Super-admin Quick Bookings list + status updates
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

export async function GET(request: NextRequest) {
  try {
    const { isSuperAdmin, adminClient } = await checkSuperAdmin();
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');

    let query = adminClient
      .from('quick_bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (status && status !== 'all') query = query.eq('status', status);
    if (paymentStatus && paymentStatus !== 'all') query = query.eq('payment_status', paymentStatus);

    const { data, error } = await query;
    if (error) {
      console.error('admin quick_bookings list:', error);
      const missing = /schema cache|does not exist|Could not find the table/i.test(error.message);
      return NextResponse.json(
        {
          success: false,
          needsSetup: missing,
          error: missing
            ? 'Run supabase/RUN_THIS_QUICK_BOOKINGS.sql in Supabase SQL Editor (Production).'
            : error.message,
        },
        { status: missing ? 503 : 500 }
      );
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err) {
    console.error('GET /api/admin/quick-bookings', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
