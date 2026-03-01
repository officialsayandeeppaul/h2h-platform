# Local Payment Testing Guide

## Testing Razorpay Payments Locally

### Step 1: Your Test Credentials (Already Configured)

Your `.env` already has test credentials:
```env
RAZORPAY_KEY_ID=rzp_test_S4I0TvC6o9osYw
RAZORPAY_KEY_SECRET=2wXUHc8hVR6tmafaOxDkTeO7
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_S4I0TvC6o9osYw
```

### Step 2: Set Up Webhook for Local Testing

#### Option A: Using ngrok (Recommended)

1. **Install ngrok**:
   ```bash
   # Windows (using chocolatey)
   choco install ngrok
   
   # Or download from https://ngrok.com/download
   ```

2. **Start your Next.js app**:
   ```bash
   npm run dev
   ```

3. **In another terminal, start ngrok**:
   ```bash
   ngrok http 3000
   ```

4. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

5. **Configure Razorpay Webhook**:
   - Go to: https://dashboard.razorpay.com/app/website-app-settings/webhooks
   - Click "Add New Webhook"
   - Webhook URL: `https://abc123.ngrok.io/api/payments/webhook`
   - Secret: Generate one and copy it
   - Events: Select `payment.captured`, `payment.failed`
   - Click "Create Webhook"

6. **Update your `.env`**:
   ```env
   RAZORPAY_WEBHOOK_SECRET=your-generated-secret
   ```

7. **Restart your dev server**

#### Option B: Skip Webhook (Manual Verification)

For quick testing without webhooks, you can manually verify payments:

1. After payment, check Razorpay Dashboard → Transactions
2. Manually update appointment status in Supabase

### Step 3: Test Payment Flow

1. **Go to booking page**: http://localhost:3000/booking
2. **Complete booking steps** (location → service → doctor → date/time)
3. **On confirm step**, click "Confirm & Pay"
4. **Use Razorpay test card**:
   ```
   Card Number: 4111 1111 1111 1111
   Expiry: Any future date (e.g., 12/25)
   CVV: Any 3 digits (e.g., 123)
   OTP: 1234 (for test mode)
   ```

5. **Payment should succeed** and:
   - Appointment status → "confirmed"
   - Payment status → "paid"
   - Email sent to user (if webhook configured)

### Test Card Numbers

| Card Type | Number | CVV | Expiry |
|-----------|--------|-----|--------|
| Visa | 4111 1111 1111 1111 | Any 3 digits | Any future |
| Mastercard | 5267 3181 8797 5449 | Any 3 digits | Any future |
| Failed Payment | 4000 0000 0000 0002 | Any 3 digits | Any future |

### Troubleshooting

#### Payment not completing?
- Check browser console for errors
- Check terminal for API errors
- Ensure Razorpay keys are correct

#### Webhook not receiving?
- Verify ngrok is running
- Check Razorpay webhook logs in dashboard
- Verify webhook secret matches

#### Email not sending?
- Check Resend API key is valid
- Verify domain is configured in Resend
- Check server logs for email errors

### Production Checklist

Before going live:
1. [ ] Switch to live Razorpay keys
2. [ ] Update webhook URL to production domain
3. [ ] Verify domain in Resend for emails
4. [ ] Test with real payment (small amount)
5. [ ] Enable webhook alerts in Razorpay
