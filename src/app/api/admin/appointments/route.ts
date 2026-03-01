/**
 * H2H Healthcare - Admin Appointments API
 * Get all appointments with full details for admin dashboard
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
 * GET /api/admin/appointments - Get all appointments
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const isAdmin = await checkSuperAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const patientId = searchParams.get('patientId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '100');

    const adminClient = createAdminClient();
    
    let query = adminClient
      .from('appointments')
      .select(`
        *,
        patient:patient_id(id, full_name, email, phone),
        doctor:doctor_id(id, users:user_id(full_name, email)),
        service:service_id(id, name),
        location:location_id(id, city, name)
      `)
      .order('appointment_date', { ascending: false })
      .order('start_time', { ascending: false })
      .limit(limit);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (date) {
      query = query.eq('appointment_date', date);
    }

    if (patientId) {
      query = query.eq('patient_id', patientId);
    }

    const { data: appointments, error } = await query;

    if (error) {
      console.error('Error fetching appointments:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: appointments || [],
      count: appointments?.length || 0,
    });
  } catch (error) {
    console.error('Error in admin appointments GET:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
