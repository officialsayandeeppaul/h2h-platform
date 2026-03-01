/**
 * H2H Healthcare - Patient Prescriptions API
 * Fetch prescriptions for logged-in patient
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    // Look up patient by email
    const { data: userData } = await (adminClient.from('users') as any)
      .select('id')
      .eq('email', user.email)
      .single();
    const patientId = userData?.id || user.id;

    const { data: prescriptions, error } = await (adminClient.from('prescriptions') as any)
      .select(`
        id,
        notes,
        file_url,
        file_name,
        created_at,
        appointment:appointment_id(
          appointment_date,
          start_time,
          service:service_id(name)
        ),
        doctor:doctor_id(users:user_id(full_name))
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error('Patient prescriptions error:', error);
      return NextResponse.json({ success: false, data: [], error: error.message }, { status: 500 });
    }

    const list = (prescriptions || []).map((p: any) => ({
      id: p.id,
      notes: p.notes,
      fileUrl: p.file_url,
      fileName: p.file_name,
      createdAt: p.created_at,
      date: p.appointment?.appointment_date,
      startTime: p.appointment?.start_time,
      serviceName: p.appointment?.service?.name,
      doctor: p.doctor?.users?.full_name || 'Doctor',
    }));

    return NextResponse.json({
      success: true,
      data: list,
      page,
      limit,
    });
  } catch (error) {
    console.error('Patient prescriptions error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
