# H2H Healthcare - Quick Start Checklist

Use this checklist to set up your H2H Healthcare platform step by step.

---

## ✅ Phase 1: Create Accounts (30 minutes)

### Required Services (FREE)
- [ ] **Supabase** - https://supabase.com/dashboard
  - [ ] Create account
  - [ ] Create new project (Region: Mumbai/Singapore)
  - [ ] Note down: Project URL, Anon Key, Service Role Key

- [ ] **Razorpay** - https://dashboard.razorpay.com/signup
  - [ ] Create account
  - [ ] Get Test API Keys (Key ID + Secret)
  - [ ] KYC can be done later for live payments

- [ ] **Twilio** - https://www.twilio.com/try-twilio
  - [ ] Create account
  - [ ] Note down: Account SID, Auth Token
  - [ ] Join WhatsApp Sandbox (for testing)

- [ ] **Resend** - https://resend.com/signup
  - [ ] Create account
  - [ ] Generate API Key

- [ ] **Google Cloud** - https://console.cloud.google.com
  - [ ] Create project
  - [ ] Enable: Google Calendar API, Google+ API
  - [ ] Create OAuth credentials (Client ID + Secret)

### Free Add-ons
- [ ] **Tawk.to** - https://www.tawk.to
  - [ ] Create account
  - [ ] Get Property ID and Widget ID from widget code

- [ ] **PostHog** - https://app.posthog.com/signup
  - [ ] Create account
  - [ ] Get Project API Key

- [ ] **Mapbox** - https://account.mapbox.com/auth/signup
  - [ ] Create account
  - [ ] Get Access Token

### Optional (Recommended)
- [ ] **Cloudinary** - https://cloudinary.com/users/register/free
  - [ ] Create account
  - [ ] Get Cloud Name, API Key, API Secret

- [ ] **Upstash** - https://console.upstash.com
  - [ ] Create account
  - [ ] Create Redis database (Region: Mumbai)
  - [ ] Get REST URL and Token

---

## ✅ Phase 2: Configure Environment (10 minutes)

1. Copy environment template:
   ```bash
   cp env.example .env.local
   ```

2. Fill in ALL values in `.env.local`:
   - [ ] NEXT_PUBLIC_SUPABASE_URL
   - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
   - [ ] SUPABASE_SERVICE_ROLE_KEY
   - [ ] RAZORPAY_KEY_ID
   - [ ] RAZORPAY_KEY_SECRET
   - [ ] NEXT_PUBLIC_RAZORPAY_KEY_ID
   - [ ] TWILIO_ACCOUNT_SID
   - [ ] TWILIO_AUTH_TOKEN
   - [ ] TWILIO_WHATSAPP_NUMBER
   - [ ] TWILIO_SMS_NUMBER
   - [ ] RESEND_API_KEY
   - [ ] EMAIL_FROM
   - [ ] GOOGLE_CLIENT_ID
   - [ ] GOOGLE_CLIENT_SECRET
   - [ ] NEXT_PUBLIC_TAWK_PROPERTY_ID
   - [ ] NEXT_PUBLIC_TAWK_WIDGET_ID
   - [ ] NEXT_PUBLIC_POSTHOG_KEY
   - [ ] NEXT_PUBLIC_MAPBOX_TOKEN

---

## ✅ Phase 3: Setup Database (15 minutes)

1. Go to Supabase SQL Editor

2. Run migration:
   - [ ] Copy content from `supabase/migrations/001_initial_schema.sql`
   - [ ] Paste in SQL Editor
   - [ ] Click "Run"
   - [ ] Verify: "Success. No rows returned"

3. Run seed data:
   - [ ] Copy content from `supabase/seed.sql`
   - [ ] Paste in SQL Editor
   - [ ] Click "Run"
   - [ ] Verify: Locations and Services created

4. Enable Google Auth in Supabase:
   - [ ] Go to Authentication → Providers → Google
   - [ ] Enable and add Client ID + Secret
   - [ ] Save

---

## ✅ Phase 4: Test Locally (10 minutes)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Test these pages:
   - [ ] Homepage: http://localhost:3000
   - [ ] Services: http://localhost:3000/services
   - [ ] Locations: http://localhost:3000/locations
   - [ ] Booking: http://localhost:3000/booking
   - [ ] Login: http://localhost:3000/login

4. Test features:
   - [ ] Google login works
   - [ ] Booking flow works
   - [ ] Live chat widget appears (bottom right)

---

## ✅ Phase 5: Deploy to Vercel (15 minutes)

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Initial H2H Healthcare setup"
   git push origin main
   ```

2. Deploy on Vercel:
   - [ ] Go to https://vercel.com/new
   - [ ] Import your GitHub repository
   - [ ] Add ALL environment variables from `.env.local`
   - [ ] Deploy

3. Update URLs:
   - [ ] Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
   - [ ] Add Vercel URL to Google OAuth redirect URIs
   - [ ] Add Vercel URL to Razorpay webhook

---

## ✅ Phase 6: Go Live Checklist

### Before Launch
- [ ] Complete Razorpay KYC for live payments
- [ ] Switch Razorpay to Live keys
- [ ] Apply for WhatsApp Business API (Twilio)
- [ ] Add custom domain to Vercel
- [ ] Verify domain in Resend
- [ ] Create Super Admin account in Supabase

### After Launch
- [ ] Monitor Supabase logs for errors
- [ ] Check PostHog for user analytics
- [ ] Respond to Tawk.to chats
- [ ] Review Razorpay payments dashboard

---

## 📞 Quick Links

| Service | Dashboard |
|---------|-----------|
| Supabase | https://supabase.com/dashboard |
| Razorpay | https://dashboard.razorpay.com |
| Twilio | https://console.twilio.com |
| Resend | https://resend.com/emails |
| Google Cloud | https://console.cloud.google.com |
| Tawk.to | https://dashboard.tawk.to |
| PostHog | https://app.posthog.com |
| Vercel | https://vercel.com/dashboard |

---

## 💰 Monthly Cost Summary

| Service | Cost |
|---------|------|
| Supabase | ₹0 |
| Vercel | ₹0 |
| Razorpay | 2% per txn |
| Twilio | ~₹1,100 |
| Resend | ₹0 |
| Google | ₹0 |
| Tawk.to | ₹0 |
| PostHog | ₹0 |
| Mapbox | ₹0 |
| Cloudinary | ₹0 |
| Upstash | ₹0 |
| **TOTAL** | **~₹1,200/month** |

---

*Estimated total setup time: ~1.5 hours*
