/**
 * H2H Healthcare - Admin Single Location API
 * Get/Update/Delete a specific location
 */

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ locationId: string }>;
}

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
 * GET /api/admin/locations/[locationId]
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { locationId } = await params;
    const supabase = await createClient();
    const isAdmin = await checkSuperAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const adminClient = createAdminClient();
    const { data: location, error } = await adminClient
      .from('locations')
      .select('*')
      .eq('id', locationId)
      .single();

    if (error || !location) {
      return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: location });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/locations/[locationId]
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { locationId } = await params;
    const supabase = await createClient();
    const isAdmin = await checkSuperAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const adminClient = createAdminClient();

    const { data: location, error } = await (adminClient
      .from('locations') as any)
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', locationId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: location, message: 'Location updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/locations/[locationId]
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { locationId } = await params;
    const supabase = await createClient();
    const isAdmin = await checkSuperAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const adminClient = createAdminClient();

    // Check if there are clinic centers using this location
    const { data: centers } = await adminClient
      .from('clinic_centers')
      .select('id')
      .eq('location_id', locationId);

    if (centers && centers.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Cannot delete location with ${centers.length} clinic centers. Delete centers first.` 
      }, { status: 400 });
    }

    const { error } = await adminClient
      .from('locations')
      .delete()
      .eq('id', locationId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Location deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
