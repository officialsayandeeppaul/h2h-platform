/**
 * H2H Healthcare - Super Admin Audit Bookings API
 * Super admin can book a slot on behalf of a patient (for audit / walk-in / phone
 * bookings) and choose how to collect payment:
 *   - cash:   mark the booking paid immediately (offline / cash collected)
 *   - link:   generate a hosted Razorpay payment link to share with the patient
 *   - later:  leave the booking pending payment
 *
 * GET  /api/super-admin/audit-bookings        - list all audit bookings
 * POST /api/super-admin/audit-bookings        - create a booking on behalf of a patient
 */

import { findSlotConflict, paymentHoldExpiresAt } from '@/lib/appointment-slot';
import { createAppointmentPaymentLink } from '@/lib/razorpay';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/** Marker stored in appointments.metadata so audit bookings are distinguishable. */
const AUDIT_METADATA_KEY = 'is_audit_booking';

type PaymentMode = 'cash' | 'link' | 'later';

interface CreateAuditBookingBody {
  patientName: string;
  patientPhone?: string;
  patientEmail?: string;
  doctorId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  mode: 'online' | 'offline' | 'home_visit';
  amount: number;
  paymentMode: PaymentMode;
  notes?: string;
  auditNote?: string;
}

async function requireSuperAdmin(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, status: 401 as const, error: 'Not authenticated' };

  const adminClient = createAdminClient();
  const { data: userData } = await adminClient
    .from('users')
    .select('id, email, full_name, role')
    .eq('email', user.email)
    .single();

  if (!userData || (userData as any).role !== 'super_admin') {
    return { ok: false as const, status: 403 as const, error: 'Super admin access required' };
  }

  return { ok: true as const, adminClient, profile: userData as any };
}

/** Find an existing patient row by email or phone, or create one on the fly. */
async function resolveOrCreatePatient(
  adminClient: any,
  { name, email, phone }: { name: string; email?: string; phone?: string }
): Promise<{ id: string } | { error: string }> {
  const normalizedEmail = email?.trim().toLowerCase() || null;
  const normalizedPhone = phone?.replace(/\s/g, '').replace(/^\+91/, '').replace(/^91/, '') || null;

  if (normalizedEmail) {
    const { data: byEmail } = await adminClient
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .single();
    if (byEmail) return { id: (byEmail as any).id };
  }

  if (normalizedPhone) {
    const { data: byPhone } = await adminClient
      .from('users')
      .select('id')
      .eq('phone', normalizedPhone)
      .single();
    if (byPhone) return { id: (byPhone as any).id };
  }

  // Create a new patient record (no auth account yet — patient can register later).
  const { data: created, error } = await adminClient
    .from('users')
    .insert({
      email: normalizedEmail,
      full_name: name || 'Walk-in Patient',
      phone: normalizedPhone,
      role: 'patient',
      is_active: true,
    } as any)
    .select('id')
    .single();

  if (error || !created) {
    console.error('Error creating audit-booking patient:', error);
    return { error: 'Failed to create patient record' };
  }
  return { id: (created as any).id };
}

/**
 * GET /api/super-admin/audit-bookings
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const auth = await requireSuperAdmin(supabase);
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '200', 10);

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from('appointments')
      .select(`
        *,
        patient:patient_id(id, full_name, email, phone),
        doctor:doctor_id(id, users:user_id(full_name, email)),
        service:service_id(id, name),
        location:location_id(id, city, name)
      `)
      .eq(`metadata->>${AUDIT_METADATA_KEY}`, 'true')
      .order('created_at', { ascending: false })
      .limit(Number.isFinite(limit) && limit > 0 ? Math.min(limit, 500) : 200);

    if (error) {
      console.error('Error fetching audit bookings:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch audit bookings' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data || [], count: data?.length || 0 });
  } catch (error) {
    console.error('Error in audit-bookings GET:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/super-admin/audit-bookings
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const auth = await requireSuperAdmin(supabase);
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body: CreateAuditBookingBody = await request.json();
    const {
      patientName,
      patientPhone,
      patientEmail,
      doctorId,
      serviceId,
      date,
      startTime,
      endTime,
      mode,
      amount,
      paymentMode,
      notes,
      auditNote,
    } = body;

    if (!patientName || !doctorId || !serviceId || !date || !startTime || !endTime || !mode) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields: patientName, doctorId, serviceId, date, startTime, endTime, mode',
        },
        { status: 400 }
      );
    }

    if (!['cash', 'link', 'later'].includes(paymentMode)) {
      return NextResponse.json(
        { success: false, error: 'paymentMode must be cash, link, or later' },
        { status: 400 }
      );
    }

    if (!['online', 'offline', 'home_visit'].includes(mode)) {
      return NextResponse.json({ success: false, error: 'Invalid consultation mode' }, { status: 400 });
    }

    const adminClient = auth.adminClient as any;

    // Resolve or create the patient on whose behalf we are booking.
    const patient = await resolveOrCreatePatient(adminClient, {
      name: patientName,
      email: patientEmail,
      phone: patientPhone,
    });
    if ('error' in patient) {
      return NextResponse.json({ success: false, error: patient.error }, { status: 500 });
    }

    // Slot conflict check (mirrors the public booking flow so audit bookings
    // can never double-book a real doctor slot).
    const { data: overlapping } = await adminClient
      .from('appointments')
      .select('id, status, payment_status, created_at, start_time, end_time')
      .eq('doctor_id', doctorId)
      .eq('appointment_date', date)
      .not('status', 'eq', 'cancelled');

    const conflict = findSlotConflict(overlapping || [], startTime, endTime);
    if (conflict) {
      return NextResponse.json(
        {
          success: false,
          error: 'That slot is already taken. Pick another time or doctor.',
          conflict: true,
        },
        { status: 409 }
      );
    }

    // Determine the initial payment state from the chosen payment mode.
    const isPaidNow = paymentMode === 'cash';
    const paymentStatus = isPaidNow ? 'paid' : 'pending';
    const status = paymentMode === 'later' ? 'pending' : 'confirmed';

    const metadata: Record<string, unknown> = {
      [AUDIT_METADATA_KEY]: true,
      booked_at: new Date().toISOString(),
      payment_hold_expires_at: paymentHoldExpiresAt(new Date().toISOString()).toISOString(),
      created_by: 'super_admin',
      created_by_email: auth.profile?.email || null,
      payment_mode: paymentMode,
      audit_note: auditNote || null,
      patient_name: patientName,
      patient_phone: patientPhone || null,
    };

    const { data: appointment, error: insertError } = await adminClient
      .from('appointments')
      .insert({
        patient_id: patient.id,
        doctor_id: doctorId,
        service_id: serviceId,
        appointment_date: date,
        start_time: startTime,
        end_time: endTime,
        mode,
        status,
        payment_status: paymentStatus,
        amount: Number(amount) || 0,
        notes: notes || auditNote || null,
        metadata,
      } as any)
      .select(`
        *,
        patient:patient_id(id, full_name, email, phone),
        doctor:doctor_id(id, users:user_id(full_name, email)),
        service:service_id(id, name)
      `)
      .single();

    if (insertError || !appointment) {
      console.error('Error creating audit booking:', insertError);
      return NextResponse.json(
        { success: false, error: insertError?.message || 'Failed to create booking' },
        { status: 500 }
      );
    }

    const appointmentId = (appointment as any).id as string;

    // Cash: record a manual payment row so the ledger shows how it was settled.
    if (isPaidNow) {
      await (adminClient as any)
        .from('payments')
        .insert({
          appointment_id: appointmentId,
          user_id: patient.id,
          amount: Number(amount) || 0,
          currency: 'INR',
          status: 'success',
          payment_method: 'cash',
          receipt_url: null,
        })
        .select('id')
        .single();
    }

    // Link: generate a hosted Razorpay payment link to share with the patient.
    let paymentLink: { id: string; shortUrl: string } | null = null;
    if (paymentMode === 'link') {
      try {
        const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
        const link = await createAppointmentPaymentLink({
          amountInr: Number(amount) || 0,
          appointmentId,
          description: `H2H Healthcare consultation — ${(appointment as any)?.service?.name || 'Appointment'}`,
          customer: { name: patientName, email: patientEmail, contact: patientPhone },
          callbackUrl: `${origin}/booking/confirmation?appointmentId=${appointmentId}`,
          notes: { source: 'super_admin_audit' },
        });
        paymentLink = { id: link.id, shortUrl: link.shortUrl };

        await (adminClient as any)
          .from('appointments')
          .update({
            metadata: {
              ...(appointment as any).metadata,
              payment_link_id: link.id,
              payment_link_url: link.shortUrl,
              payment_link_created_at: new Date().toISOString(),
            },
          })
          .eq('id', appointmentId);
      } catch (linkError) {
        console.error('Failed to create payment link for audit booking:', linkError);
        // Booking still exists; report the link failure so the UI can fall back to cash.
        return NextResponse.json({
          success: true,
          data: { ...appointment, payment_link: null },
          paymentLinkError:
            linkError instanceof Error ? linkError.message : 'Could not generate payment link',
          message: 'Booking created, but the payment link could not be generated.',
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: { ...appointment, payment_link: paymentLink },
      message:
        paymentMode === 'cash'
          ? 'Booking created and marked paid (cash).'
          : paymentMode === 'link'
            ? 'Booking created. Share the payment link with the patient.'
            : 'Booking created. Payment can be collected later.',
    });
  } catch (error) {
    console.error('Error in audit-bookings POST:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
