/**
 * H2H Healthcare - Single Appointment API
 * Fetch, update, or cancel a specific appointment
 */

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface AppointmentData {
  id: string;
  patient_id: string;
  doctor_id: string;
  service_id: string;
  location_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  mode: string;
  status: string;
  payment_status: string;
  amount: number;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  google_meet_link: string | null;
  notes: string | null;
  service: {
    id: string;
    name: string;
    slug: string;
    duration_minutes: number;
  };
  doctor: {
    id: string;
    specializations: string[];
    user: {
      full_name: string;
      email: string;
    };
  };
  location: {
    id: string;
    name: string;
    city: string;
    address: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  try {
    const { appointmentId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = createAdminClient();

    const { data: appointment, error } = await adminClient
      .from('appointments')
      .select(`
        *,
        service:services(id, name, slug, duration_minutes),
        doctor:doctors(id, specializations, user:users!doctors_user_id_fkey(full_name, email)),
        location:locations(id, name, city, address)
      `)
      .eq('id', appointmentId)
      .single() as { data: AppointmentData | null; error: any };

    if (error || !appointment) {
      console.error('Error fetching appointment:', error);
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Verify user has access to this appointment
    // Check by auth ID or by email match
    const { data: patientUser } = await adminClient
      .from('users')
      .select('email')
      .eq('id', appointment.patient_id)
      .single() as { data: { email: string } | null; error: any };

    const isPatient = appointment.patient_id === user.id || patientUser?.email === user.email;

    if (!isPatient) {
      // Check if user is the doctor
      const { data: doctor } = await adminClient
        .from('doctors')
        .select('id')
        .eq('user_id', user.id)
        .single() as { data: { id: string } | null; error: any };

      if (!doctor || doctor.id !== appointment.doctor_id) {
        // Check if user is admin
        const { data: userData } = await adminClient
          .from('users')
          .select('role')
          .eq('email', user.email as string)
          .single() as { data: { role: string } | null; error: any };

        if (!userData || !['super_admin', 'admin', 'location_admin'].includes(userData.role)) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
      }
    }

    return NextResponse.json({ data: appointment });
  } catch (error) {
    console.error('Error in appointment API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  try {
    const { appointmentId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = createAdminClient();
    const body = await request.json();
    const { status, cancellation_reason, notes } = body;

    // Get current appointment
    const { data: appointment, error: fetchError } = await adminClient
      .from('appointments')
      .select('patient_id, status')
      .eq('id', appointmentId)
      .single() as { data: { patient_id: string; status: string } | null; error: any };

    if (fetchError || !appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Verify user has access
    if (appointment.patient_id !== user.id) {
      const { data: userData } = await adminClient
        .from('users')
        .select('role')
        .eq('email', user.email as string)
        .single() as { data: { role: string } | null; error: any };

      if (!userData || !['super_admin', 'admin', 'location_admin', 'doctor'].includes(userData.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // Build update object
    const updateData: Record<string, any> = {};
    if (status) updateData.status = status;
    if (cancellation_reason) updateData.cancellation_reason = cancellation_reason;
    if (notes !== undefined) updateData.notes = notes;

    const { data: updated, error: updateError } = await (adminClient
      .from('appointments') as any)
      .update(updateData)
      .eq('id', appointmentId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating appointment:', updateError);
      return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Error in appointment update:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  try {
    const { appointmentId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = createAdminClient();

    // Get current appointment
    const { data: appointment, error: fetchError } = await adminClient
      .from('appointments')
      .select('patient_id, status, payment_status')
      .eq('id', appointmentId)
      .single() as { data: { patient_id: string; status: string; payment_status: string } | null; error: any };

    if (fetchError || !appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Verify user has access
    if (appointment.patient_id !== user.id) {
      const { data: userData } = await adminClient
        .from('users')
        .select('role')
        .eq('email', user.email as string)
        .single() as { data: { role: string } | null; error: any };

      if (!userData || userData.role !== 'super_admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // Can only cancel pending appointments
    if (appointment.status !== 'pending') {
      return NextResponse.json({ 
        error: 'Cannot cancel appointment that is not pending' 
      }, { status: 400 });
    }

    // Update to cancelled instead of deleting
    const { error: updateError } = await (adminClient
      .from('appointments') as any)
      .update({ 
        status: 'cancelled',
        cancellation_reason: 'Cancelled by user'
      })
      .eq('id', appointmentId);

    if (updateError) {
      console.error('Error cancelling appointment:', updateError);
      return NextResponse.json({ error: 'Failed to cancel appointment' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error in appointment delete:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
