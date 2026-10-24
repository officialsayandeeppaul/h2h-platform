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

export interface CreatePaymentLinkParams {
  amountInr: number; // Amount in INR (converted to paise)
  appointmentId: string;
  description: string;
  customer: { name?: string; email?: string; contact?: string };
  callbackUrl?: string;
  notes?: Record<string, string>;
}

/**
 * Hosted payment links stay collectable for 30 days. Razorpay's own default is
 * six months — far too long for a clinic appointment — and an explicit value
 * (Unix seconds, ≥15 min out per Razorpay's rules) lets the dashboard show the
 * exact deadline instead of guessing.
 */
export const PAYMENT_LINK_VALIDITY_DAYS = 30;
const PAYMENT_LINK_VALIDITY_SECONDS = PAYMENT_LINK_VALIDITY_DAYS * 24 * 60 * 60;

export interface PaymentLinkResult {
  id: string;
  shortUrl: string;
  amount: number; // paise
  status: string;
  createdAt: string;
  /** When the hosted link stops accepting payments (ISO-8601). */
  expiresAt: string;
}

/** Normalize an Indian mobile number to E.164 (+91XXXXXXXXXX) for Razorpay. */
function toE164Indian(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, '');
  // Accept 91-prefixed and 0-prefixed local forms as well as bare 10-digit numbers.
  const withoutCountry = digits.replace(/^(?:91|0)(?=\d{10}$)/, '');
  if (withoutCountry.length !== 10) return undefined;
  return `+91${withoutCountry}`;
}

/**
 * Walk-in placeholder emails (built from a phone number) use the reserved
 * `.invalid` TLD — they must never be passed to Razorpay as a delivery route.
 */
function isDeliverableEmail(email?: string): boolean {
  if (!email) return false;
  return !email.trim().toLowerCase().endsWith('.invalid');
}

/**
 * Create a hosted Razorpay Payment Link for an admin/audit-created booking.
 * The patient can pay from the shared short_url; webhook `payment_link.paid`
 * reconciles the appointment back to paid + confirmed.
 */
export async function createAppointmentPaymentLink(
  params: CreatePaymentLinkParams
): Promise<PaymentLinkResult> {
  const contact = toE164Indian(params.customer.contact);
  const email = isDeliverableEmail(params.customer.email) ? params.customer.email : undefined;

  // Razorpay needs at least one real contact route (a placeholder email is not one).
  if (!contact && !email) {
    throw new Error('Patient email or phone is required to generate a payment link');
  }

  if (!(Number(params.amountInr) > 0)) {
    throw new Error('Payment link amount must be greater than 0');
  }

  const razorpay = getRazorpay();
  // Bound the link's lifetime explicitly (see PAYMENT_LINK_VALIDITY_DAYS).
  const expireByEpoch = Math.floor(Date.now() / 1000) + PAYMENT_LINK_VALIDITY_SECONDS;
  const link = await razorpay.paymentLink.create({
    amount: Math.round(params.amountInr * 100),
    currency: 'INR',
    accept_partial: false,
    expire_by: expireByEpoch,
    description: params.description,
    customer: {
      name: params.customer.name || 'Patient',
      ...(email ? { email } : {}),
      ...(contact ? { contact } : {}),
    },
    notify: {
      // Only notify channels that actually exist — Razorpay rejects SMS
      // notifications when no contact is attached to the link.
      sms: Boolean(contact),
      email: Boolean(email),
      whatsapp: Boolean(contact),
    },
    reminder_enable: true,
    notes: {
      appointmentId: params.appointmentId,
      type: 'audit_booking',
      ...params.notes,
    },
    ...(params.callbackUrl
      ? { callback_url: params.callbackUrl, callback_method: 'get' as const }
      : {}),
  });

  // Prefer the echo from Razorpay; fall back to what we asked for.
  const expiresAtEpoch =
    typeof link.expire_by === 'number' && link.expire_by > 0 ? link.expire_by : expireByEpoch;

  return {
    id: link.id,
    shortUrl: link.short_url,
    amount: Number(link.amount),
    status: link.status,
    createdAt: typeof link.created_at === 'string' ? link.created_at : new Date().toISOString(),
    expiresAt: new Date(expiresAtEpoch * 1000).toISOString(),
  };
}

/**
 * Get Razorpay public key for frontend
 */
export function getPublicKey(): string {
  // Prefer server KEY_ID so checkout always matches the key that created the order
  return process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
}

export { getRazorpay as razorpay };
