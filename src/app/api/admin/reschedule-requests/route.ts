/**
 * H2H Healthcare - Admin Reschedule Requests API
 * GET /api/admin/reschedule-requests - List all pending reschedule requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function checkAdmin(supabase: any): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const adminClient = createAdminClient();
  const { data: userData } = await (adminClient.from('users') as any)
    .select('role')
    .eq('email', user.email)
    .single();
  return ['super_admin', 'admin'].includes((userData as any)?.role);
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!(await checkAdmin(supabase))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const adminClient = createAdminClient();
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') || 'pending';

    // Fetch all appointments that have a reschedule_request in metadata
    const { data: appointments, error } = await (adminClient.from('appointments') as any)
      .select(`
        id,
        appointment_date,
        start_time,
        end_time,
        mode,
        status,
        amount,
        metadata,
        created_at,
        patient:patient_id(id, full_name, email, phone),
        doctor:doctor_id(id, users:user_id(full_name, email)),
        service:service_id(id, name)
      `)
      .not('metadata', 'is', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reschedule requests:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch requests' }, { status: 500 });
    }

    // Filter appointments that have reschedule_request in metadata
    const requests = (appointments || [])
      .filter((apt: any) => {
        const req = apt.metadata?.reschedule_request;
        if (!req) return false;
        if (statusFilter === 'all') return true;
        return req.status === statusFilter;
      })
      .map((apt: any) => {
        const req = apt.metadata.reschedule_request;
        const rawDocName = apt.doctor?.users?.full_name || 'Unknown Doctor';
        const doctorName = rawDocName.replace(/^Dr\.?\s*/i, '');
        return {
          appointmentId: apt.id,
          currentDate: apt.appointment_date,
          currentStartTime: apt.start_time,
          currentEndTime: apt.end_time,
          requestedDate: req.requested_date,
          requestedStartTime: req.requested_start_time,
          requestedEndTime: req.requested_end_time,
          reason: req.reason,
          requestStatus: req.status,
          requestedAt: req.requested_at,
          requestedBy: req.requested_by,
          reviewedAt: req.reviewed_at || null,
          reviewedBy: req.reviewed_by || null,
          adminNote: req.admin_note || null,
          mode: apt.mode,
          appointmentStatus: apt.status,
          amount: apt.amount,
          patient: {
            name: apt.patient?.full_name || apt.metadata?.patient_name || 'Unknown',
            email: apt.patient?.email || '',
            phone: apt.patient?.phone || apt.metadata?.patient_phone || '',
          },
          doctor: {
            id: apt.doctor?.id || null,
            name: `Dr. ${doctorName}`,
          },
          service: {
            id: apt.service?.id || null,
            name: apt.service?.name || 'Unknown Service',
          },
        };
      });

    return NextResponse.json({
      success: true,
      data: requests,
      count: requests.length,
    });
  } catch (error) {
    console.error('Error in reschedule requests API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
