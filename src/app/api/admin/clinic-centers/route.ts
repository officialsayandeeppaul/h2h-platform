/**
 * H2H Healthcare - Admin Clinic Centers API
 * CRUD operations for clinic centers (Super Admin only)
 */

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// Check if user is super admin
async function checkSuperAdmin(supabase: any): Promise<{ isAdmin: boolean; userId?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { isAdmin: false };
  }

  const adminClient = createAdminClient();
  const { data: userData } = await adminClient
    .from('users')
    .select('id, role')
    .eq('email', user.email)
    .single() as { data: { id: string; role: string } | null };

  return { 
    isAdmin: userData?.role === 'super_admin' || userData?.role === 'admin',
    userId: userData?.id 
  };
}

/**
 * GET /api/admin/clinic-centers
 * Get all clinic centers with full details (admin view)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { isAdmin } = await checkSuperAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Super Admin access required',
      }, { status: 403 });
    }

    const adminClient = createAdminClient();
    const searchParams = request.nextUrl.searchParams;
    const locationId = searchParams.get('locationId');

    let query = adminClient
      .from('clinic_centers')
      .select(`
        *,
        location:locations(id, name, city, tier),
        availability:clinic_center_availability(*)
      `)
      .order('created_at', { ascending: false });

    if (locationId) {
      query = query.eq('location_id', locationId);
    }

    const { data: centers, error } = await query;

    if (error) {
      console.error('Error fetching clinic centers:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch clinic centers',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: centers || [],
    });
  } catch (error) {
    console.error('Error in admin clinic centers GET:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

/**
 * POST /api/admin/clinic-centers
 * Create a new clinic center
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { isAdmin } = await checkSuperAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Super Admin access required',
      }, { status: 403 });
    }

    const body = await request.json();
    const {
      location_id,
      name,
      slug,
      address,
      landmark,
      pincode,
      phone,
      email,
      facilities,
      rating,
      is_featured,
      is_active,
      availability,
    } = body;

    // Validate required fields
    if (!location_id || !name || !slug || !address) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: location_id, name, slug, address',
      }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Create the clinic center
    const { data: center, error: centerError } = await adminClient
      .from('clinic_centers')
      .insert({
        location_id,
        name,
        slug,
        address,
        landmark: landmark || null,
        pincode: pincode || null,
        phone: phone || null,
        email: email || null,
        facilities: facilities || [],
        rating: rating || 4.5,
        total_reviews: 0,
        is_featured: is_featured || false,
        is_active: is_active !== false,
      } as any)
      .select()
      .single();

    if (centerError) {
      console.error('Error creating clinic center:', centerError);
      if (centerError.message?.includes('duplicate')) {
        return NextResponse.json({
          success: false,
          error: 'A center with this slug already exists',
        }, { status: 409 });
      }
      return NextResponse.json({
        success: false,
        error: 'Failed to create clinic center: ' + centerError.message,
      }, { status: 500 });
    }

    // Create default availability if not provided
    const defaultAvailability = availability || [
      { day_of_week: 0, is_open: false, open_time: '09:00', close_time: '18:00', max_appointments: 0 },
      { day_of_week: 1, is_open: true, open_time: '08:00', close_time: '20:00', break_start: '13:00', break_end: '14:00', max_appointments: 50 },
      { day_of_week: 2, is_open: true, open_time: '08:00', close_time: '20:00', break_start: '13:00', break_end: '14:00', max_appointments: 50 },
      { day_of_week: 3, is_open: true, open_time: '08:00', close_time: '20:00', break_start: '13:00', break_end: '14:00', max_appointments: 50 },
      { day_of_week: 4, is_open: true, open_time: '08:00', close_time: '20:00', break_start: '13:00', break_end: '14:00', max_appointments: 50 },
      { day_of_week: 5, is_open: true, open_time: '08:00', close_time: '20:00', break_start: '13:00', break_end: '14:00', max_appointments: 50 },
      { day_of_week: 6, is_open: true, open_time: '09:00', close_time: '17:00', max_appointments: 30 },
    ];

    for (const avail of defaultAvailability) {
      await adminClient.from('clinic_center_availability').insert({
        center_id: (center as any).id,
        day_of_week: avail.day_of_week,
        is_open: avail.is_open,
        open_time: avail.open_time,
        close_time: avail.close_time,
        break_start: avail.break_start || null,
        break_end: avail.break_end || null,
        max_appointments: avail.max_appointments,
        current_bookings: 0,
      } as any);
    }

    return NextResponse.json({
      success: true,
      data: center,
      message: 'Clinic center created successfully',
    });
  } catch (error) {
    console.error('Error in admin clinic centers POST:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

/**
 * PUT /api/admin/clinic-centers
 * Update a clinic center
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { isAdmin } = await checkSuperAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Super Admin access required',
      }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Center ID is required',
      }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Update the clinic center
    const { data: center, error } = await (adminClient
      .from('clinic_centers') as any)
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating clinic center:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to update clinic center: ' + error.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: center,
      message: 'Clinic center updated successfully',
    });
  } catch (error) {
    console.error('Error in admin clinic centers PUT:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/clinic-centers
 * Delete a clinic center
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { isAdmin } = await checkSuperAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Super Admin access required',
      }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Center ID is required',
      }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Delete availability first (cascade should handle this, but being explicit)
    await adminClient
      .from('clinic_center_availability')
      .delete()
      .eq('center_id', id);

    // Delete the clinic center
    const { error } = await adminClient
      .from('clinic_centers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting clinic center:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to delete clinic center: ' + error.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Clinic center deleted successfully',
    });
  } catch (error) {
    console.error('Error in admin clinic centers DELETE:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
