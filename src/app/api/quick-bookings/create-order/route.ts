/**
 * Create Razorpay order for a Quick Booking (guest — no login).
 */

import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createAdminClient } from '@/lib/supabase/server';

let razorpayInstance: Razorpay | null = null;

function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials not configured');
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

function uniqueReceipt(bookingId: string): string {
  const compact = bookingId.replace(/-/g, '').slice(0, 16);
  const stamp = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  return `qb${compact}${stamp}`.slice(0, 40);
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Payment provider is not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const bookingId = body.bookingId as string | undefined;
    if (!bookingId) {
      return NextResponse.json({ success: false, error: 'bookingId is required' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: booking, error } = await supabase
      .from('quick_bookings')
      .select('id, amount, payment_required, payment_status, patient_name, patient_phone, patient_email, service_name, razorpay_order_id')
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    if (!booking.payment_required || booking.payment_status === 'paid') {
      return NextResponse.json(
        { success: false, error: 'Payment is not required for this booking' },
        { status: 400 }
      );
    }

    const amountInr = Number(booking.amount);
    if (!Number.isFinite(amountInr) || amountInr <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid booking amount' }, { status: 400 });
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: Math.round(amountInr * 100),
      currency: 'INR',
      receipt: uniqueReceipt(booking.id),
      notes: {
        type: 'quick_booking',
        quick_booking_id: booking.id,
        service: booking.service_name,
      },
    });

    await supabase
      .from('quick_bookings')
      .update({
        razorpay_order_id: order.id,
        payment_status: 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', booking.id);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      prefill: {
        name: booking.patient_name,
        contact: booking.patient_phone,
        email: booking.patient_email || undefined,
      },
      description: booking.service_name,
    });
  } catch (err) {
    console.error('POST /api/quick-bookings/create-order', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to create order' },
      { status: 500 }
    );
  }
}
