/**
 * Auth Me API - Get current user info
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
