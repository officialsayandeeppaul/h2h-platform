/**
 * Public Quick Booking API
 * POST — create booking (service + name + mobile)
 * GET  — public settings (payment on/off + amount hint)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import {
  resolveQuickBookingAmount,
  validateQuickBookingInput,
  type QuickBookingSettings,
} from '@/lib/quick-booking';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data: settings } = await supabase
      .from('quick_booking_settings')
      .select('payment_enabled, default_amount, require_payment')
      .eq('id', 1)
      .maybeSingle();

    const cfg: QuickBookingSettings = {
      payment_enabled: Boolean(settings?.payment_enabled),
      default_amount:
        settings?.default_amount != null ? Number(settings.default_amount) : null,
      require_payment: settings?.require_payment !== false,
    };

    return NextResponse.json({ success: true, settings: cfg });
  } catch (err) {
    console.error('GET /api/quick-bookings', err);
    return NextResponse.json(
      {
        success: true,
        settings: { payment_enabled: false, default_amount: null, require_payment: true },
      },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = validateQuickBookingInput(body);
    if (!parsed.ok) {
      return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: service, error: serviceErr } = await supabase
      .from('services')
      .select('id, name, tier1_price, is_active')
      .eq('id', parsed.data.serviceId)
      .single();

    if (serviceErr || !service || service.is_active === false) {
      return NextResponse.json({ success: false, error: 'Selected service is not available' }, { status: 400 });
    }

    const { data: settingsRow } = await supabase
      .from('quick_booking_settings')
      .select('payment_enabled, default_amount, require_payment')
      .eq('id', 1)
      .maybeSingle();

    const settings: QuickBookingSettings = {
      payment_enabled: Boolean(settingsRow?.payment_enabled),
      default_amount:
        settingsRow?.default_amount != null ? Number(settingsRow.default_amount) : null,
      require_payment: settingsRow?.require_payment !== false,
    };

    const amount = resolveQuickBookingAmount(settings, service.tier1_price);
    const paymentRequired = settings.payment_enabled && amount != null && amount > 0;

    if (settings.payment_enabled && settings.require_payment && !paymentRequired) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment is enabled but no amount is configured. Contact support or try again later.',
        },
        { status: 503 }
      );
    }

    const { data, error } = await supabase
      .from('quick_bookings')
      .insert({
        service_id: service.id,
        service_name: service.name,
        patient_name: parsed.data.name,
        patient_phone: parsed.data.phone,
        patient_email: parsed.data.email,
        status: 'new',
        payment_required: paymentRequired,
        amount: paymentRequired ? amount : null,
        payment_status: paymentRequired ? 'pending' : 'not_required',
      })
      .select('id, amount, payment_required, payment_status, service_name')
      .single();

    if (error) {
      console.error('quick_bookings insert:', error);
      const missing = /relation .* does not exist|Could not find the table/i.test(error.message);
      return NextResponse.json(
        {
          success: false,
          error: missing
            ? 'Quick Booking is not set up yet. Run RUN_THIS_QUICK_BOOKINGS.sql in Supabase.'
            : 'Failed to submit booking. Please try again.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      booking: data,
      message: paymentRequired
        ? 'Booking created. Complete payment to confirm.'
        : 'Request submitted. Our team will call you shortly.',
    });
  } catch (err) {
    console.error('POST /api/quick-bookings', err);
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 });
  }
}
