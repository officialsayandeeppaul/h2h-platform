/**
 * H2H Healthcare - Admin Contact Messages API
 * Super admin only - for Help & Support sidebar
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function checkSuperAdmin(): Promise<{ isSuperAdmin: boolean; adminClient: ReturnType<typeof createAdminClient> }> {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { isSuperAdmin: false, adminClient };

  const { data: userData } = await adminClient
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  return { isSuperAdmin: (userData as { role?: string })?.role === 'super_admin', adminClient };
}

export async function GET(request: NextRequest) {
  try {
    const { isSuperAdmin, adminClient } = await checkSuperAdmin();

    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = adminClient
      .from('contact_messages')
      .select('id, name, email, phone, message, services, status, created_at')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: messages, error } = await query;

    if (error) {
      console.error('Contact messages fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: messages ?? [] });
  } catch (err) {
    console.error('Contact messages API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
