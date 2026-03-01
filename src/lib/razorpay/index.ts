/**
 * H2H Healthcare - Razorpay Payment Integration
 * Complete payment gateway integration for appointment bookings
 */

import Razorpay from 'razorpay';
import crypto from 'crypto';

// Lazy initialization to prevent errors when env vars are not set during build
let razorpayInstance: Razorpay | null = null;

function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

export interface CreateOrderParams {
  amount: number; // Amount in INR (will be converted to paise)
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface OrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

export interface VerifyPaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentDetails {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  method: string;
  description: string;
  email: string;
  contact: string;
  created_at: number;
}

/**
 * Create a new Razorpay order for appointment payment
 */
export async function createOrder(params: CreateOrderParams): Promise<OrderResponse> {
  try {
    const options = {
      amount: Math.round(params.amount * 100), // Convert to paise
      currency: params.currency || 'INR',
      receipt: params.receipt,
      notes: params.notes || {},
    };

    const order = await getRazorpay().orders.create(options);
    return order as OrderResponse;
  } catch (error) {
    console.error('Razorpay create order error:', error);
    throw new Error('Failed to create payment order');
  }
}

/**
 * Verify Razorpay payment signature
 * This ensures the payment response is authentic and not tampered with
 */
export function verifyPaymentSignature(params: VerifyPaymentParams): boolean {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;
    
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    return expectedSignature === razorpay_signature;
  } catch (error) {
    console.error('Razorpay signature verification error:', error);
    return false;
  }
}

/**
 * Verify webhook signature for Razorpay webhooks
 */
export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Razorpay webhook signature verification error:', error);
    return false;
  }
}

/**
 * Fetch payment details by payment ID
 */
export async function fetchPayment(paymentId: string): Promise<PaymentDetails> {
  try {
    const payment = await getRazorpay().payments.fetch(paymentId);
    return payment as PaymentDetails;
  } catch (error) {
    console.error('Razorpay fetch payment error:', error);
    throw new Error('Failed to fetch payment details');
  }
}

/**
 * Fetch order details by order ID
 */
export async function fetchOrder(orderId: string): Promise<OrderResponse> {
  try {
    const order = await getRazorpay().orders.fetch(orderId);
    return order as OrderResponse;
  } catch (error) {
    console.error('Razorpay fetch order error:', error);
    throw new Error('Failed to fetch order details');
  }
}

/**
 * Initiate refund for a payment
 */
export async function initiateRefund(
  paymentId: string,
  amount?: number, // Optional: partial refund amount in INR
  notes?: Record<string, string>
): Promise<{
  id: string;
  entity: string;
  amount: number;
  currency: string;
  payment_id: string;
  status: string;
  created_at: number;
}> {
  try {
    const refundOptions: Record<string, unknown> = {};
    
    if (amount) {
      refundOptions.amount = Math.round(amount * 100); // Convert to paise
    }
    
    if (notes) {
      refundOptions.notes = notes;
    }

    const refund = await getRazorpay().payments.refund(paymentId, refundOptions);
    return refund as {
      id: string;
      entity: string;
      amount: number;
      currency: string;
      payment_id: string;
      status: string;
      created_at: number;
    };
  } catch (error) {
    console.error('Razorpay refund error:', error);
    throw new Error('Failed to initiate refund');
  }
}

/**
 * Get Razorpay public key for frontend
 */
export function getPublicKey(): string {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
}

export { getRazorpay as razorpay };
