import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const { error: paymentError } = await (supabase as any)
      .from('payments')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'success',
      })
      .eq('razorpay_order_id', razorpay_order_id);

    if (paymentError) {
      console.error('Payment update error:', paymentError);
    }

    const { data: appointment, error: appointmentError } = await (supabase as any)
      .from('appointments')
      .update({
        razorpay_payment_id,
        payment_status: 'paid',
        status: 'confirmed',
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select()
      .single();

    if (appointmentError) {
      console.error('Appointment update error:', appointmentError);
      return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      appointmentId: appointment?.id,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
