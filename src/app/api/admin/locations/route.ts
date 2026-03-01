/**
 * H2H Healthcare - Admin Locations API
 * CRUD operations for locations (Super Admin only)
 */

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function checkSuperAdmin(supabase: any): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const adminClient = createAdminClient();
  const { data: userData } = await adminClient
    .from('users')
    .select('role')
    .eq('email', user.email)
    .single() as { data: { role: string } | null };

  return userData?.role === 'super_admin' || userData?.role === 'admin';
}

/**
 * GET /api/admin/locations - Get all locations
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const isAdmin = await checkSuperAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const adminClient = createAdminClient();
    const { data: locations, error } = await adminClient
      .from('locations')
      .select('*')
      .order('city', { ascending: true });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: locations || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/locations - Create a new location
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const isAdmin = await checkSuperAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { name, city, address, tier, phone, email, is_active } = body;

    if (!name || !city || !address) {
      return NextResponse.json({ success: false, error: 'Missing required fields: name, city, address' }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { data: location, error } = await adminClient
      .from('locations')
      .insert({
        name,
        city,
        address,
        tier: tier || 1,
        phone: phone || null,
        email: email || null,
        is_active: is_active !== false,
      } as any)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: location, message: 'Location created successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
