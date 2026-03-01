/**
 * H2H Healthcare - Admin Single Appointment API
 * Get/Update a specific appointment
 */

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ appointmentId: string }>;
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
 * GET /api/admin/appointments/[appointmentId]
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { appointmentId } = await params;
    const supabase = await createClient();
    const isAdmin = await checkSuperAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const adminClient = createAdminClient();
    const { data: appointment, error } = await adminClient
      .from('appointments')
      .select(`
        *,
        patient:patient_id(id, full_name, email, phone),
        doctor:doctor_id(id, users:user_id(full_name, email)),
        service:service_id(id, name),
        location:location_id(id, city, name)
      `)
      .eq('id', appointmentId)
      .single();

    if (error || !appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/appointments/[appointmentId]
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { appointmentId } = await params;
    const supabase = await createClient();
    const isAdmin = await checkSuperAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { status, payment_status, notes } = body;

    const adminClient = createAdminClient();
    
    const updateData: any = { updated_at: new Date().toISOString() };
    if (status) updateData.status = status;
    if (payment_status) updateData.payment_status = payment_status;
    if (notes !== undefined) updateData.notes = notes;

    const { data: appointment, error } = await (adminClient
      .from('appointments') as any)
      .update(updateData)
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: appointment, 
      message: 'Appointment updated successfully' 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
