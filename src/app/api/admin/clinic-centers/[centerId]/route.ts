/**
 * H2H Healthcare - Admin Single Clinic Center API
 * Get/Update/Delete a specific clinic center
 */

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ centerId: string }>;
}

// Check if user is super admin
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
 * GET /api/admin/clinic-centers/[centerId]
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { centerId } = await params;
    const supabase = await createClient();
    const isAdmin = await checkSuperAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 403 });
    }

    const adminClient = createAdminClient();
    const { data: center, error } = await adminClient
      .from('clinic_centers')
      .select(`
        *,
        location:locations(id, name, city, tier),
        availability:clinic_center_availability(*)
      `)
      .eq('id', centerId)
      .single();

    if (error || !center) {
      return NextResponse.json({
        success: false,
        error: 'Clinic center not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: center,
    });
  } catch (error) {
    console.error('Error fetching clinic center:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

/**
 * PUT /api/admin/clinic-centers/[centerId]
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { centerId } = await params;
    const supabase = await createClient();
    const isAdmin = await checkSuperAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 403 });
    }

    const body = await request.json();
    const { availability, ...centerUpdates } = body;

    const adminClient = createAdminClient();

    // Update center
    if (Object.keys(centerUpdates).length > 0) {
      const { error: updateError } = await (adminClient
        .from('clinic_centers') as any)
        .update({
          ...centerUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', centerId);

      if (updateError) {
        return NextResponse.json({
          success: false,
          error: 'Failed to update center: ' + updateError.message,
        }, { status: 500 });
      }
    }

    // Update availability if provided
    if (availability && Array.isArray(availability)) {
      for (const avail of availability) {
        await adminClient
          .from('clinic_center_availability')
          .upsert({
            center_id: centerId,
            day_of_week: avail.day_of_week,
            is_open: avail.is_open,
            open_time: avail.open_time,
            close_time: avail.close_time,
            break_start: avail.break_start || null,
            break_end: avail.break_end || null,
            max_appointments: avail.max_appointments,
          } as any, { onConflict: 'center_id,day_of_week' });
      }
    }

    // Fetch updated center
    const { data: center } = await adminClient
      .from('clinic_centers')
      .select(`*, location:locations(id, name, city), availability:clinic_center_availability(*)`)
      .eq('id', centerId)
      .single();

    return NextResponse.json({
      success: true,
      data: center,
      message: 'Clinic center updated successfully',
    });
  } catch (error) {
    console.error('Error updating clinic center:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/clinic-centers/[centerId]
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { centerId } = await params;
    const supabase = await createClient();
    const isAdmin = await checkSuperAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 403 });
    }

    const adminClient = createAdminClient();

    // Delete (cascade will handle availability)
    const { error } = await adminClient
      .from('clinic_centers')
      .delete()
      .eq('id', centerId);

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete: ' + error.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Clinic center deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting clinic center:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
