/**
 * H2H Healthcare - Generate a Razorpay Payment Link for an existing audit booking.
 * POST /api/super-admin/audit-bookings/[id]/payment-link
 *
 * Lets the super admin (re)generate a shareable hosted payment link for a
 * booking that was created on behalf of a patient and is still unpaid.
 */

import { createAppointmentPaymentLink } from '@/lib/razorpay';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function requireSuperAdmin(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, status: 401 as const, error: 'Not authenticated' };

  const adminClient = createAdminClient();
  const { data: userData } = await adminClient
    .from('users')
    .select('id, email, role')
    .eq('email', user.email)
    .single();

  if (!userData || (userData as any).role !== 'super_admin') {
    return { ok: false as const, status: 403 as const, error: 'Super admin access required' };
  }
  return { ok: true as const };
}

function isAuditBooking(metadata: unknown): boolean {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return false;
  return Boolean((metadata as Record<string, unknown>)['is_audit_booking']);
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const auth = await requireSuperAdmin(supabase);
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const adminClient = createAdminClient() as any;

    const { data: appointment, error } = await adminClient
      .from('appointments')
      .select('id, amount, payment_status, metadata, patient:patient_id(full_name, email, phone), service:service_id(name)')
      .eq('id', id)
      .single();

    if (error || !appointment) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    if (!isAuditBooking((appointment as any).metadata)) {
      return NextResponse.json(
        { success: false, error: 'This booking was not created via Audit Bookings' },
        { status: 400 }
      );
    }

    if ((appointment as any).payment_status === 'paid') {
      return NextResponse.json(
        { success: false, error: 'This booking is already paid' },
        { status: 400 }
      );
    }

    const amount = Number((appointment as any).amount) || 0;
    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot generate a payment link for a zero-amount booking' },
        { status: 400 }
      );
    }

    const patient = (appointment as any).patient || {};
    const origin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

    // Metadata is needed for the description too (custom service names).
    const existingMeta =
      (appointment as any).metadata && typeof (appointment as any).metadata === 'object'
        ? { ...((appointment as any).metadata as Record<string, unknown>) }
        : {};

    const serviceLabel =
      (appointment as any)?.service?.name ||
      (typeof existingMeta.custom_service_name === 'string'
        ? existingMeta.custom_service_name
        : null) ||
      'Appointment';

    const link = await createAppointmentPaymentLink({
      amountInr: amount,
      appointmentId: id,
      description: `H2H Healthcare consultation — ${serviceLabel}`,
      customer: {
        name: patient.full_name,
        email: patient.email,
        contact: patient.phone,
      },
      callbackUrl: `${origin}/booking/confirmation?appointmentId=${id}`,
      notes: { source: 'super_admin_audit' },
    });

    // Persist the link on the appointment so it's visible in the list + reused.

    await adminClient
      .from('appointments')
      .update({
        payment_status: (appointment as any).payment_status === 'failed' ? 'pending' : (appointment as any).payment_status,
        metadata: {
          ...existingMeta,
          payment_link_id: link.id,
          payment_link_url: link.shortUrl,
          payment_link_created_at: new Date().toISOString(),
        },
      })
      .eq('id', id);

    return NextResponse.json({
      success: true,
      data: { paymentLinkId: link.id, shortUrl: link.shortUrl, amount: link.amount },
      message: 'Payment link generated. Share it with the patient.',
    });
  } catch (error) {
    console.error('Error generating payment link:', error);
    const message =
      error instanceof Error ? error.message : 'Could not generate payment link';
    // Validation problems (missing contact, zero amount) are client errors.
    const isValidation = /required|greater than 0/i.test(message);
    return NextResponse.json(
      { success: false, error: message },
      { status: isValidation ? 400 : 500 }
    );
  }
}
