/**
 * List patients for admin (e.g. assign prescription)
 * Allowed: super_admin, admin, location_admin
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function checkAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const adminClient = createAdminClient();
  const { data } = await (adminClient.from('users') as any).select('role').eq('email', user.email).single();
  const role = (data as any)?.role;
  return !!role && ['super_admin', 'admin', 'location_admin'].includes(role);
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!(await checkAdmin(supabase))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const search = (request.nextUrl.searchParams.get('search') || '').trim().toLowerCase();
    const adminClient = createAdminClient();

    let query = adminClient
      .from('users')
      .select('id, full_name, email, phone')
      .eq('role', 'patient')
      .order('full_name');

    const { data: users, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    let list = (users || []).map((u: any) => ({
      id: u.id,
      fullName: u.full_name || '',
      email: u.email || '',
      phone: u.phone || '',
    }));

    if (search) {
      list = list.filter(
        (p) =>
          p.fullName.toLowerCase().includes(search) ||
          (p.email && p.email.toLowerCase().includes(search)) ||
          (p.phone && p.phone.includes(search))
      );
    }

    return NextResponse.json({ success: true, data: list });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
