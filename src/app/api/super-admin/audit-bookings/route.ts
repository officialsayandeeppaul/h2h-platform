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

import { findSlotConflict } from '@/lib/appointment-slot';
import { findAuthUserByEmail, generateTemporaryPassword } from '@/lib/doctor-credentials';
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
  doctorId?: string;
  /** Free-text doctor name for doctors not configured in the system. */
  customDoctorName?: string;
  serviceId?: string;
  /** Free-text service name for services not configured in the system. */
  customServiceName?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  mode: 'online' | 'offline' | 'home_visit';
  amount: number;
  paymentMode: PaymentMode;
  notes?: string;
  auditNote?: string;
}

/** Indian mobile number: 10 digits after stripping +91 / 91 / 0 prefixes. */
function isValidIndianMobile(phone?: string): boolean {
  if (!phone?.trim()) return false;
  const normalized = phone.replace(/[\s\-()]/g, '').replace(/^(\+91|91|0)/, '');
  return /^\d{10}$/.test(normalized);
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

/**
 * Placeholder email for walk-in patients who only gave a phone number.
 * `users.email` is NOT NULL + UNIQUE, so a row always needs one. The `.invalid`
 * TLD is reserved (RFC 2606) so it can never receive mail, and it is derived
 * from the phone digits so re-booking the same patient stays deterministic.
 */
function placeholderEmailForPhone(phoneDigits: string): string {
  // Canonicalize to the local 10 digits so every input format of the same
  // mobile (0…, +91…, spaced) maps to ONE deterministic placeholder.
  const local = phoneDigits.replace(/\D/g, '').slice(-10);
  return `walkin+${local}@h2h.invalid`;
}

/** Escape LIKE wildcards so ilike() matches the value exactly (still case-insensitive). */
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/** Practical email check — the field is optional but must be real when given. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Canonical Indian mobile — strips formatting and the +91 / 91 / 0 prefixes so
 * every plausible input form (spaced, dashed, prefixed) lands on the same
 * 10-digit value for storage, lookup, and the walk-in placeholder email.
 */
function canonicalIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 13 && digits.startsWith('910')) return digits.slice(3);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits || phone.trim();
}

function isUniqueViolation(error: { code?: string } | null): boolean {
  return error?.code === '23505';
}

/** Find an existing patient row by email or phone, or create one on the fly. */
async function resolveOrCreatePatient(
  adminClient: any,
  { name, email, phone }: { name: string; email?: string; phone?: string }
): Promise<{ id: string } | { error: string }> {
  const normalizedEmail = email?.trim().toLowerCase() || null;
  const canonicalPhone = phone ? canonicalIndianPhone(phone) : '';
  const phoneDigits = canonicalPhone;

  if (!normalizedEmail && !phoneDigits) {
    return { error: 'Provide at least a phone number or an email for the patient.' };
  }

  // 1. Existing patient by email — case-insensitive (auth stores the typed case).
  if (normalizedEmail) {
    const { data: byEmail } = await adminClient
      .from('users')
      .select('id')
      .ilike('email', escapeLike(normalizedEmail))
      .maybeSingle();
    if (byEmail) return { id: (byEmail as any).id };
  }

  // 2. Existing patient by phone — canonical variants first, then a suffix scan
  //    that catches every legacy storage format (spaced, dashed, +91-, 0…).
  if (phoneDigits) {
    const local = phoneDigits.slice(-10);
    const { data: byPhone } = await adminClient
      .from('users')
      .select('id, phone')
      .in('phone', [local, `+91${local}`, `91${local}`, `0${local}`])
      .limit(1);
    if (byPhone && byPhone.length > 0) return { id: (byPhone as any)[0].id };

    // Suffix scan for every other storage format (internally spaced, dashed,
    // +91-…): compare digit-normalized values so formatting never hides a match.
    const { data: phoneRows } = await adminClient
      .from('users')
      .select('id, phone')
      .not('phone', 'is', null)
      .limit(5000);
    const digitsOf = (v: unknown) => String(v || '').replace(/\D/g, '');
    const suffixMatch = (phoneRows || []).find((r: any) => {
      const digits = digitsOf((r as any).phone);
      return digits.length >= 10 && digits.endsWith(local);
    });
    if (suffixMatch) return { id: (suffixMatch as any).id };
  }

  // 3. public.users.id references auth.users(id) and has NO default — a patient
  //    row can only be born from a Supabase Auth account (the on_auth_user_created
  //    trigger mirrors auth → public.users). Create the auth user first.
  const insertEmail = normalizedEmail || placeholderEmailForPhone(phoneDigits);

  let authUserId: string | null = null;
  const { data: createdAuth, error: authError } = await adminClient.auth.admin.createUser({
    email: insertEmail,
    password: generateTemporaryPassword(),
    email_confirm: true,
    user_metadata: {
      full_name: name || 'Walk-in Patient',
      ...(phoneDigits ? { phone: phoneDigits } : {}),
      role: 'patient',
      source: 'audit_booking',
    },
  });

  if (!authError && createdAuth?.user?.id) {
    authUserId = createdAuth.user.id as string;
  } else {
    const msg = authError?.message || '';
    const alreadyExists = authError?.status === 422 || /already|registered|duplicate/i.test(msg);
    if (!alreadyExists) {
      console.error('Audit booking auth user creation failed:', authError);
      return { error: `Failed to create patient record: ${msg || 'could not create login account'}` };
    }
    // Auth account exists but the public row is missing — link to that account.
    const orphan = await findAuthUserByEmail(adminClient, insertEmail);
    if (!orphan) {
      console.error('Audit booking: could not resolve existing auth user:', msg);
      return { error: `Failed to create patient record: ${msg}` };
    }
    authUserId = orphan.id;
  }

  // 4. Ensure the public profile row exists (the trigger usually created it).
  const ensured = await ensurePublicPatientRow(adminClient, authUserId, {
    email: insertEmail,
    fullName: name || 'Walk-in Patient',
    phone: phoneDigits || null,
  });
  if (!ensured) {
    return { error: 'Failed to create patient record: profile row could not be created' };
  }
  return { id: ensured };
}

/**
 * public.users row for an auth user — created by the on_auth_user_created
 * trigger in normal operation; inserted explicitly here as a fallback (passing
 * the auth id so the auth.users FK is satisfied). Also backfills the phone,
 * which the trigger does not copy.
 */
async function ensurePublicPatientRow(
  adminClient: any,
  authUserId: string,
  { email, fullName, phone }: { email: string; fullName: string; phone: string | null }
): Promise<string | null> {
  const { data: existing } = await adminClient
    .from('users')
    .select('id, phone')
    .eq('id', authUserId)
    .maybeSingle();

  if (existing) {
    if (!(existing as any).phone && phone) {
      await adminClient.from('users').update({ phone }).eq('id', authUserId);
    }
    return (existing as any).id as string;
  }

  const { data: inserted, error: insertError } = await adminClient
    .from('users')
    .insert({
      id: authUserId,
      email,
      full_name: fullName,
      phone,
      role: 'patient',
      is_active: true,
    } as any)
    .select('id')
    .maybeSingle();

  if (!insertError && inserted) return (inserted as any).id as string;

  if (insertError && !isUniqueViolation(insertError)) {
    console.error('Error creating audit-booking patient profile:', insertError);
    return null;
  }

  // Unique violation → the row appeared concurrently (or the email is owned by
  // another id). Resolve to the winning row instead of failing the booking.
  const { data: again } = await adminClient
    .from('users')
    .select('id, phone')
    .eq('id', authUserId)
    .maybeSingle();
  if (again) {
    if (!(again as any).phone && phone) {
      await adminClient.from('users').update({ phone }).eq('id', authUserId);
    }
    return (again as any).id as string;
  }

  const { data: emailOwner } = await adminClient
    .from('users')
    .select('id')
    .ilike('email', escapeLike(email))
    .maybeSingle();
  return emailOwner ? ((emailOwner as any).id as string) : null;
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

    // Light projection of EVERY audit booking (no joins) so the dashboard's
    // stats and charts stay accurate even though the detailed card list above
    // is capped — a page-limited array would silently skew Today/Collected
    // once bookings outgrow the cap.
    const { data: allRows, error: allError } = await adminClient
      .from('appointments')
      .select('appointment_date, payment_status, status, amount')
      .eq(`metadata->>${AUDIT_METADATA_KEY}`, 'true')
      .order('appointment_date', { ascending: false })
      .limit(50000);

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
      // On a light-query failure fall back to the (heavier) main rows — they
      // carry the same four fields, so the client always receives an array.
      all: allError ? data || [] : allRows || [],
    });
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
      customDoctorName,
      serviceId,
      customServiceName,
      date,
      startTime,
      endTime,
      mode,
      amount,
      paymentMode,
      notes,
      auditNote,
    } = body;

    const doctorIdTrimmed = doctorId?.trim() || null;
    const serviceIdTrimmed = serviceId?.trim() || null;
    const doctorNameTrimmed = customDoctorName?.trim() || null;
    const serviceNameTrimmed = customServiceName?.trim() || null;

    if (!patientName || !date || !startTime || !endTime || !mode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: patientName, date, startTime, endTime, mode',
        },
        { status: 400 }
      );
    }

    // Patient name needs at least 2 non-whitespace characters.
    if (patientName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Patient name must be at least 2 characters.' },
        { status: 400 }
      );
    }

    // Date must be a real calendar day (YYYY-MM-DD) and not in the past.
    // "Today" is computed at the clinic's timezone (IST, UTC+5:30) so a
    // booking for the current Indian day is never wrongly rejected.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, error: 'Invalid appointment date — expected YYYY-MM-DD.' },
        { status: 400 }
      );
    }
    const istToday = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
    if (date < istToday) {
      return NextResponse.json(
        {
          success: false,
          error: 'The booking date cannot be in the past. Choose today or a future date.',
        },
        { status: 400 }
      );
    }

    // Doctor: pick from the catalog OR type a free-text name (walk-ins with a
    // doctor who isn't configured in the system).
    if (!doctorIdTrimmed && !doctorNameTrimmed) {
      return NextResponse.json(
        { success: false, error: 'Choose a doctor or type a custom doctor name.' },
        { status: 400 }
      );
    }

    if (!serviceIdTrimmed && !serviceNameTrimmed) {
      return NextResponse.json(
        { success: false, error: 'Choose a service or type a custom service name.' },
        { status: 400 }
      );
    }

    // Phone numbers must be valid 10-digit Indian mobiles (Razorpay + WhatsApp
    // both need a correctly formatted contact).
    if (patientPhone?.trim() && !isValidIndianMobile(patientPhone)) {
      return NextResponse.json(
        { success: false, error: 'Enter a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    // Email is optional, but when provided it must be a valid address —
    // a malformed one would silently break Razorpay payment-link delivery.
    if (patientEmail?.trim() && !EMAIL_REGEX.test(patientEmail.trim())) {
      return NextResponse.json(
        { success: false, error: 'Enter a valid email address, or leave the email field empty.' },
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

    // users.email is NOT NULL and payment links need a contact route, so the
    // patient must always be reachable by at least phone or email.
    if (!patientPhone?.trim() && !patientEmail?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Enter the patient phone number or email (at least one is required).' },
        { status: 400 }
      );
    }

    if (paymentMode === 'link' && !(Number(amount) > 0)) {
      return NextResponse.json(
        { success: false, error: 'Enter an amount greater than 0 to generate a payment link.' },
        { status: 400 }
      );
    }

    // Amount, when provided, must be a finite non-negative number — a direct
    // API call could otherwise store a negative or NaN charge.
    if (
      amount !== undefined &&
      amount !== null &&
      (!Number.isFinite(Number(amount)) || Number(amount) < 0)
    ) {
      return NextResponse.json(
        { success: false, error: 'Amount must be a number of 0 or more.' },
        { status: 400 }
      );
    }

    if (endTime <= startTime) {
      return NextResponse.json(
        { success: false, error: 'The end time must be after the start time.' },
        { status: 400 }
      );
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
    // can never double-book a real doctor slot). Custom doctors have no
    // availability schedule — we still guard against overlapping bookings for
    // the same custom doctor name on the same date.
    let overlappingQuery = adminClient
      .from('appointments')
      .select('id, status, payment_status, created_at, start_time, end_time')
      .eq('appointment_date', date)
      .not('status', 'eq', 'cancelled');

    if (doctorIdTrimmed) {
      overlappingQuery = overlappingQuery.eq('doctor_id', doctorIdTrimmed);
    } else {
      overlappingQuery = overlappingQuery
        .is('doctor_id', null)
        .eq('metadata->>custom_doctor_name', doctorNameTrimmed);
    }

    const { data: overlapping } = await overlappingQuery;

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
    //
    // Audit bookings are always `confirmed`: the super admin deliberately
    // reserved the slot, so the 15-minute payment-hold cron must never treat
    // them as abandoned checkouts and auto-cancel them. Money state is carried
    // purely by payment_status (paid for cash, pending for link/later).
    const isPaidNow = paymentMode === 'cash';
    const paymentStatus = isPaidNow ? 'paid' : 'pending';
    const status = 'confirmed';

    const metadata: Record<string, unknown> = {
      [AUDIT_METADATA_KEY]: true,
      booked_at: new Date().toISOString(),
      created_by: 'super_admin',
      created_by_email: auth.profile?.email || null,
      payment_mode: paymentMode,
      audit_note: auditNote || null,
      patient_name: patientName,
      patient_phone: patientPhone || null,
      // Free-text fallbacks used when doctor_id / service_id are null.
      ...(doctorIdTrimmed ? {} : { custom_doctor_name: doctorNameTrimmed }),
      ...(serviceIdTrimmed ? {} : { custom_service_name: serviceNameTrimmed }),
    };

    const { data: appointment, error: insertError } = await adminClient
      .from('appointments')
      .insert({
        patient_id: patient.id,
        doctor_id: doctorIdTrimmed,
        service_id: serviceIdTrimmed,
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
    // Non-fatal — the booking itself must never fail because of the ledger row.
    if (isPaidNow) {
      const { error: ledgerError } = await (adminClient as any)
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
        .maybeSingle();
      if (ledgerError) console.error('Audit booking cash ledger insert failed:', ledgerError);
    }

    // Link: generate a hosted Razorpay payment link to share with the patient.
    let paymentLink: { id: string; shortUrl: string } | null = null;
    if (paymentMode === 'link') {
      try {
        const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
        const link = await createAppointmentPaymentLink({
          amountInr: Number(amount) || 0,
          appointmentId,
          description: `H2H Healthcare consultation — ${(appointment as any)?.service?.name || serviceNameTrimmed || 'Appointment'}`,
          customer: {
            name: (appointment as any).patient?.full_name || patientName,
            // Prefer what the admin typed; fall back to the stored patient
            // record (a real email gets the link delivered automatically).
            email: patientEmail || (appointment as any).patient?.email || undefined,
            contact: patientPhone || (appointment as any).patient?.phone || undefined,
          },
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
