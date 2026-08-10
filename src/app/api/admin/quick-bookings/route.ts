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
      .limit(200);

    if (status && status !== 'all') query = query.eq('status', status);
    if (paymentStatus && paymentStatus !== 'all') query = query.eq('payment_status', paymentStatus);

    const { data, error } = await query;
    if (error) {
      console.error('admin quick_bookings list:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err) {
    console.error('GET /api/admin/quick-bookings', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
