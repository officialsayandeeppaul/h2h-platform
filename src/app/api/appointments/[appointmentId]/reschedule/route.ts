/**
 * H2H Healthcare - Appointment Reschedule Request API
 * PATCH /api/appointments/[appointmentId]/reschedule
 * 
 * Flow:
 * 1. Patient submits reschedule request → stored as pending in appointment metadata
 * 2. Super admin reviews and approves/rejects via /api/admin/reschedule-requests
 * 3. Only on approval does the appointment date/time actually change
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ appointmentId: string }>;
}

/**
 * PATCH - Patient submits a reschedule request (pending admin approval)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { appointmentId } = await params;
    const supabase = await createClient();
    const adminClient = createAdminClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Look up user by email to get correct users table ID
    const { data: userData } = await (adminClient.from('users') as any)
      .select('id, full_name')
      .eq('email', user.email as string)
      .single();
    const patientId = (userData as any)?.id || user.id;
    const patientName = (userData as any)?.full_name || user.email;

    // Get the appointment with current metadata
    const { data: appointment, error: fetchError } = await (adminClient.from('appointments') as any)
      .select('id, patient_id, status, doctor_id, service_id, mode, appointment_date, start_time, end_time, metadata')
      .eq('id', appointmentId)
      .single();

    if (fetchError || !appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }

    // Verify ownership
    if ((appointment as any).patient_id !== patientId) {
      return NextResponse.json({ success: false, error: 'Not authorized to reschedule this appointment' }, { status: 403 });
    }

    // Only confirmed or pending appointments can be rescheduled
    if (!['confirmed', 'pending'].includes((appointment as any).status)) {
      return NextResponse.json({ success: false, error: 'Only confirmed or pending appointments can be rescheduled' }, { status: 400 });
    }

    // Check if there's already a pending reschedule request
    const existingMeta = (appointment as any).metadata || {};
    if (existingMeta.reschedule_request?.status === 'pending') {
      return NextResponse.json({ success: false, error: 'A reschedule request is already pending approval' }, { status: 400 });
    }

    const body = await request.json();
    const { newDate, newTime, reason } = body;

    if (!newDate || !newTime) {
      return NextResponse.json({ success: false, error: 'New date and time are required' }, { status: 400 });
    }

    // Validate date is in the future
    const requestedDate = new Date(newDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (requestedDate < today) {
      return NextResponse.json({ success: false, error: 'Requested date must be in the future' }, { status: 400 });
    }

    // Calculate end time based on service duration
    const { data: service } = await (adminClient.from('services') as any)
      .select('duration_minutes')
      .eq('id', (appointment as any).service_id)
      .single();

    const durationMinutes = (service as any)?.duration_minutes || 30;
    const [hours, minutes] = newTime.split(':').map(Number);
    const endDate = new Date(2000, 0, 1, hours, minutes + durationMinutes);
    const newEndTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}:00`;
    const newStartTime = `${newTime}:00`;

    // Store reschedule request in metadata (NOT updating the actual appointment date/time)
    const updatedMetadata = {
      ...existingMeta,
      reschedule_request: {
        status: 'pending',
        requested_date: newDate,
        requested_start_time: newStartTime,
        requested_end_time: newEndTime,
        reason: reason || null,
        original_date: (appointment as any).appointment_date,
        original_start_time: (appointment as any).start_time,
        original_end_time: (appointment as any).end_time,
        requested_by: patientName,
        requested_by_id: patientId,
        requested_at: new Date().toISOString(),
      },
    };

    const { error: updateError } = await (adminClient.from('appointments') as any)
      .update({ metadata: updatedMetadata })
      .eq('id', appointmentId);

    if (updateError) {
      console.error('Reschedule request error:', updateError);
      return NextResponse.json({ success: false, error: 'Failed to submit reschedule request' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Reschedule request submitted. Awaiting admin approval.',
      data: { status: 'pending' },
    });
  } catch (error) {
    console.error('Reschedule request error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET - Check reschedule request status for an appointment
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { appointmentId } = await params;
    const supabase = await createClient();
    const adminClient = createAdminClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: appointment } = await (adminClient.from('appointments') as any)
      .select('metadata')
      .eq('id', appointmentId)
      .single();

    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }

    const rescheduleRequest = (appointment as any).metadata?.reschedule_request || null;

    return NextResponse.json({
      success: true,
      data: rescheduleRequest,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
