/**
 * Auth Me API - Get / update current user info
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ user: null });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('id, email, full_name, phone, role, avatar_url, is_active')
      .eq('id', user.id)
      .single();

    const merged = userData
      ? { ...userData, email: userData.email || user.email }
      : { id: user.id, email: user.email, full_name: user.user_metadata?.full_name, phone: user.phone, role: null, avatar_url: user.user_metadata?.avatar_url, is_active: true };
    return NextResponse.json({ user: merged });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updates: Record<string, string | null> = {};

    if (typeof body.avatar_url === 'string' || typeof body.avatarUrl === 'string') {
      const avatarUrl =
        typeof body.avatar_url === 'string'
          ? body.avatar_url.trim()
          : String(body.avatarUrl).trim();
      updates.avatar_url = avatarUrl || null;
    }

    if (typeof body.full_name === 'string' || typeof body.fullName === 'string') {
      const fullName =
        typeof body.full_name === 'string'
          ? body.full_name.trim()
          : String(body.fullName).trim();
      if (!fullName) {
        return NextResponse.json({ success: false, error: 'Full name is required' }, { status: 400 });
      }
      updates.full_name = fullName;
    }

    if (typeof body.phone === 'string') {
      updates.phone = body.phone.trim() || null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    const { data: updated, error } = await adminClient
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select('id, email, full_name, phone, role, avatar_url, is_active')
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (updates.full_name || updates.avatar_url !== undefined) {
      await adminClient.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...(user.user_metadata || {}),
          ...(updates.full_name ? { full_name: updates.full_name, name: updates.full_name } : {}),
          ...(updates.avatar_url !== undefined
            ? { avatar_url: updates.avatar_url, picture: updates.avatar_url }
            : {}),
        },
      });
    }

    return NextResponse.json({
      success: true,
      avatar_url: updated?.avatar_url ?? null,
      user: updated,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}
