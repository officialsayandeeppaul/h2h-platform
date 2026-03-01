/**
 * H2H Healthcare - Patient Appointments API
 * Fetch all appointments for logged-in patient
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();
    const searchParams = request.nextUrl.searchParams;
    
    const status = searchParams.get('status'); // upcoming, completed, cancelled, all
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Look up user by email since auth ID may differ from users table ID
    const { data: userData } = await (adminClient.from('users') as any)
      .select('id')
      .eq('email', user.email)
      .single();
    const patientId = userData?.id || user.id;

    const today = new Date().toISOString().split('T')[0];
    let query = (adminClient.from('appointments') as any)
      .select(`
        id,
        appointment_date,
        start_time,
        end_time,
        mode,
        status,
        amount,
        payment_status,
        notes,
        razorpay_payment_id,
        google_meet_link,
        metadata,
        created_at,
        doctor:doctor_id(
          id,
          users:user_id(full_name, avatar_url, email, phone),
          specializations
        ),
        service:service_id(id, name, duration_minutes),
        location:location_id(id, name, city, address)
      `)
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: false })
      .order('start_time', { ascending: false });

    // Apply status filter
    if (status === 'upcoming') {
      query = query.gte('appointment_date', today).not('status', 'eq', 'cancelled');
    } else if (status === 'completed') {
      query = query.eq('status', 'completed');
    } else if (status === 'cancelled') {
      query = query.eq('status', 'cancelled');
    }

    // Pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: appointments, error, count } = await query;

    if (error) {
      console.error('Error fetching appointments:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch appointments' }, { status: 500 });
    }

    // Transform data
    const transformedAppointments = (appointments || []).map((apt: any) => ({
      id: apt.id,
      date: apt.appointment_date,
      startTime: apt.start_time,
      endTime: apt.end_time,
      mode: apt.mode,
      status: apt.status,
      amount: apt.amount,
      paymentStatus: apt.payment_status,
      notes: apt.notes,
      transactionId: apt.razorpay_payment_id,
      googleMeetLink: apt.google_meet_link || null,
      rescheduleRequest: apt.metadata?.reschedule_request || null,
      createdAt: apt.created_at,
      doctor: {
        id: apt.doctor?.id,
        name: apt.doctor?.users?.full_name || 'Doctor',
        avatar: apt.doctor?.users?.avatar_url,
        email: apt.doctor?.users?.email,
        phone: apt.doctor?.users?.phone,
        specializations: apt.doctor?.specializations || [],
      },
      service: {
        id: apt.service?.id,
        name: apt.service?.name || 'Consultation',
        duration: apt.service?.duration_minutes,
      },
      location: apt.mode === 'online' ? {
        name: 'Online Consultation',
        address: 'Video call via Google Meet',
      } : {
        id: apt.location?.id,
        name: apt.location?.name || 'Clinic',
        city: apt.location?.city,
        address: apt.location?.address,
      },
    }));

    return NextResponse.json({
      success: true,
      data: transformedAppointments,
      pagination: {
        page,
        limit,
        total: count || transformedAppointments.length,
      },
    });
  } catch (error) {
    console.error('Error in patient appointments API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
