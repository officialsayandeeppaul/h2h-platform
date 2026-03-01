/**
 * Admin Users API - Manage admin users and approvals
 * Only accessible by super_admin
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function checkSuperAdmin(): Promise<{ isSuperAdmin: boolean; adminClient: any }> {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { isSuperAdmin: false, adminClient };

  const { data: userData } = await adminClient
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  return { isSuperAdmin: (userData as any)?.role === 'super_admin', adminClient };
}

// GET - List all users (for admin management)
export async function GET(request: NextRequest) {
  try {
    const { isSuperAdmin, adminClient } = await checkSuperAdmin();

    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let query = adminClient
      .from('users')
      .select('id, email, full_name, phone, role, avatar_url, is_active, created_at')
      .order('created_at', { ascending: false });

    if (role) {
      query = query.eq('role', role);
    }

    const { data: users, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update user role (promote/demote)
export async function PUT(request: NextRequest) {
  try {
    const { isSuperAdmin, adminClient } = await checkSuperAdmin();

    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, role, is_active } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updates: any = {};
    if (role) updates.role = role;
    if (typeof is_active === 'boolean') updates.is_active = is_active;

    const { data: user, error } = await (adminClient
      .from('users') as any)
      .update(updates)
      .eq('id', userId)
      .select('id, email, full_name, role, is_active')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
