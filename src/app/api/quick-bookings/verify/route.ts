/**
 * Verify Razorpay payment for Quick Booking (guest — no login).
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = body as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
      bookingId?: string;
    };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Missing payment details' }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ success: false, error: 'Payment configuration error' }, { status: 500 });
    }

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
    }

    const supabase = createAdminClient();
    let query = supabase.from('quick_bookings').select('id, payment_status').eq('razorpay_order_id', razorpay_order_id);
    if (bookingId) query = query.eq('id', bookingId);

    const { data: booking, error } = await query.maybeSingle();
    if (error || !booking) {
      return NextResponse.json({ success: false, error: 'Booking not found for this payment' }, { status: 404 });
    }

    if (booking.payment_status === 'paid') {
      return NextResponse.json({ success: true, message: 'Already paid', bookingId: booking.id });
    }

    const { error: updateError } = await supabase
      .from('quick_bookings')
      .update({
        razorpay_payment_id,
        payment_status: 'paid',
        updated_at: new Date().toISOString(),
      })
      .eq('id', booking.id);

    if (updateError) {
      console.error('quick_bookings payment update:', updateError);
      return NextResponse.json({ success: false, error: 'Failed to update booking' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified. Our team will contact you shortly.',
      bookingId: booking.id,
    });
  } catch (err) {
    console.error('POST /api/quick-bookings/verify', err);
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }
}
