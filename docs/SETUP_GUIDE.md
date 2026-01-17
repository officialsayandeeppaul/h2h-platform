# H2H Healthcare Platform - Complete Setup Guide

This guide walks you through setting up **every single service** needed for the H2H Healthcare Platform. Follow each step carefully.

---

## 📋 Table of Contents

1. [Supabase Setup (Database & Auth)](#1-supabase-setup)
2. [Razorpay Setup (Payments)](#2-razorpay-setup)
3. [Twilio Setup (WhatsApp & SMS)](#3-twilio-setup)
4. [Resend Setup (Email)](#4-resend-setup)
5. [Google Cloud Setup (Calendar & Meet)](#5-google-cloud-setup)
6. [Tawk.to Setup (Live Chat)](#6-tawkto-setup)
7. [PostHog Setup (Analytics)](#7-posthog-setup)
8. [Mapbox Setup (Maps)](#8-mapbox-setup)
9. [Cloudinary Setup (Image Optimization)](#9-cloudinary-setup)
10. [Upstash Setup (Rate Limiting)](#10-upstash-setup)
11. [Final .env.local Configuration](#11-final-env-configuration)

---

## 1. Supabase Setup

**Cost: FREE** (50,000 monthly active users)

### Step 1: Create Account
1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub (recommended) or email

### Step 2: Create New Project
1. Click **"New Project"**
2. Fill in:
   - **Name**: `h2h-healthcare`
   - **Database Password**: Generate a strong password (SAVE THIS!)
   - **Region**: Select closest to India → `ap-south-1 (Mumbai)` or `ap-southeast-1 (Singapore)`
3. Click **"Create new project"**
4. Wait 2-3 minutes for setup

### Step 3: Get API Keys
1. Go to **Settings** → **API** (left sidebar)
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (Keep secret!)

### Step 4: Run Database Migration
1. Go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy entire content from `supabase/migrations/001_initial_schema.sql`
4. Paste and click **"Run"**
5. Should see "Success. No rows returned"

### Step 5: Run Seed Data
1. In SQL Editor, click **"New Query"**
2. Copy content from `supabase/seed.sql`
3. Paste and click **"Run"**

### Step 6: Enable Google Auth
1. Go to **Authentication** → **Providers**
2. Find **Google** and click to expand
3. Toggle **Enable Sign in with Google**
4. You'll need Google OAuth credentials (see Section 5)

---

## 2. Razorpay Setup

**Cost: FREE** (2% per transaction - paid by customer)

### Step 1: Create Account
1. Go to [https://dashboard.razorpay.com/signup](https://dashboard.razorpay.com/signup)
2. Sign up with email
3. Verify email

### Step 2: Complete KYC (Required for Live Mode)
1. Go to **Account & Settings** → **Profile**
2. Complete business verification:
   - Business Type: Individual/Proprietorship
   - PAN Card
   - Bank Account Details
   - Address Proof

### Step 3: Get API Keys (Test Mode First)
1. Go to **Account & Settings** → **API Keys**
2. Click **"Generate Test Key"**
3. Copy:
   - **Key ID** → `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - **Key Secret** → `RAZORPAY_KEY_SECRET`

### Step 4: Configure Webhooks
1. Go to **Account & Settings** → **Webhooks**
2. Click **"+ Add New Webhook"**
3. Enter:
   - **Webhook URL**: `https://your-domain.com/api/webhooks/razorpay`
   - **Secret**: Generate and save as `RAZORPAY_WEBHOOK_SECRET`
   - **Events**: Select `payment.captured`, `payment.failed`, `refund.created`
4. Click **"Create Webhook"**

---

## 3. Twilio Setup

**Cost: ~₹1,100/month** (WhatsApp + SMS)

### Step 1: Create Account
1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up with email
3. Verify phone number

### Step 2: Get Account Credentials
1. Go to **Console Dashboard**
2. Copy from the dashboard:
   - **Account SID** → `TWILIO_ACCOUNT_SID`
   - **Auth Token** → `TWILIO_AUTH_TOKEN`

### Step 3: Get Phone Number (SMS)
1. Go to **Phone Numbers** → **Buy a Number**
2. Select India (+91) or US number
3. Buy number (~$1/month)
4. Copy number → `TWILIO_SMS_NUMBER`

### Step 4: Setup WhatsApp Sandbox (Testing)
1. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Follow instructions to join sandbox
3. Sandbox number: `whatsapp:+14155238886` → `TWILIO_WHATSAPP_NUMBER`

### Step 5: Apply for WhatsApp Business API (Production)
1. Go to **Messaging** → **Senders** → **WhatsApp Senders**
2. Click **"Register WhatsApp Sender"**
3. Complete Facebook Business verification
4. Submit message templates for approval

### WhatsApp Message Templates (Submit These)
```
Template 1: booking_confirmation
Hi {{1}}! Your appointment has been booked.
Service: {{2}}
Doctor: {{3}}
Date: {{4}}
Time: {{5}}
Amount: ₹{{6}}
Complete payment to confirm.

Template 2: payment_success
Hi {{1}}! Payment received. Your appointment is confirmed.
Service: {{2}}
Date: {{3}}
Time: {{4}}
Meet Link: {{5}}

Template 3: appointment_reminder
Hi {{1}}! Reminder: Appointment tomorrow.
Service: {{2}}
Doctor: {{3}}
Time: {{4}}
```

---

## 4. Resend Setup

**Cost: FREE** (3,000 emails/month)

### Step 1: Create Account
1. Go to [https://resend.com/signup](https://resend.com/signup)
2. Sign up with GitHub or email

### Step 2: Get API Key
1. Go to **API Keys** (left sidebar)
2. Click **"Create API Key"**
3. Name: `h2h-production`
4. Permission: **Full access**
5. Copy key → `RESEND_API_KEY`

### Step 3: Add Domain (Optional but Recommended)
1. Go to **Domains** → **Add Domain**
2. Enter: `healtohealth.in`
3. Add DNS records to your domain registrar:
   - TXT record for verification
   - MX records for receiving
   - DKIM records for authentication
4. Click **"Verify"**

### Step 4: Set From Email
- If domain verified: `EMAIL_FROM=noreply@healtohealth.in`
- If not: `EMAIL_FROM=onboarding@resend.dev` (for testing)

---

## 5. Google Cloud Setup

**Cost: FREE** (generous quotas)

### Step 1: Create Google Cloud Project
1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Click **"Select a project"** → **"New Project"**
3. Name: `h2h-healthcare`
4. Click **"Create"**

### Step 2: Enable APIs
1. Go to **APIs & Services** → **Library**
2. Search and enable each:
   - **Google Calendar API**
   - **Google Meet API** (or Google Workspace APIs)
   - **Google+ API** (for OAuth)

### Step 3: Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Configure consent screen first:
   - User Type: **External**
   - App name: `H2H Healthcare`
   - User support email: your email
   - Developer contact: your email
   - Save
4. Back to Credentials → **"Create Credentials"** → **"OAuth client ID"**
5. Application type: **Web application**
6. Name: `H2H Web Client`
7. Authorized JavaScript origins:
   ```
   http://localhost:3000
   https://your-domain.com
   ```
8. Authorized redirect URIs:
   ```
   http://localhost:3000/auth/callback
   https://your-domain.com/auth/callback
   ```
9. Click **"Create"**
10. Copy:
    - **Client ID** → `GOOGLE_CLIENT_ID`
    - **Client Secret** → `GOOGLE_CLIENT_SECRET`

### Step 4: Add to Supabase
1. Go to Supabase → **Authentication** → **Providers** → **Google**
2. Paste Client ID and Client Secret
3. Save

---

## 6. Tawk.to Setup

**Cost: FREE** (Unlimited forever!)

### Step 1: Create Account
1. Go to [https://www.tawk.to](https://www.tawk.to)
2. Click **"Sign Up Free"**
3. Enter email and create account

### Step 2: Create Property
1. After signup, create your first property
2. Property name: `H2H Healthcare`
3. Website URL: `https://healtohealth.in`

### Step 3: Get Widget Code
1. Go to **Administration** → **Channels** → **Chat Widget**
2. Find the widget code, it looks like:
   ```html
   <!--Start of Tawk.to Script-->
   <script type="text/javascript">
   var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
   (function(){
   var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
   s1.async=true;
   s1.src='https://embed.tawk.to/PROPERTY_ID/WIDGET_ID';
   s1.charset='UTF-8';
   s1.setAttribute('crossorigin','*');
   s0.parentNode.insertBefore(s1,s0);
   })();
   </script>
   <!--End of Tawk.to Script-->
   ```
3. Extract from the URL `https://embed.tawk.to/PROPERTY_ID/WIDGET_ID`:
   - `PROPERTY_ID` → `NEXT_PUBLIC_TAWK_PROPERTY_ID`
   - `WIDGET_ID` → `NEXT_PUBLIC_TAWK_WIDGET_ID`

### Step 4: Customize Widget
1. Go to **Administration** → **Chat Widget** → **Widget Appearance**
2. Set colors to match your brand (blue: #0066cc)
3. Set position: Bottom Right
4. Enable: Visitor info, Sound notifications

### Step 5: Add Team Members
1. Go to **Administration** → **Team Members**
2. Invite Location Admins as agents
3. Set up departments for routing

---

## 7. PostHog Setup

**Cost: FREE** (1 million events/month)

### Step 1: Create Account
1. Go to [https://app.posthog.com/signup](https://app.posthog.com/signup)
2. Sign up with email or Google

### Step 2: Create Project
1. After signup, create project
2. Name: `H2H Healthcare`
3. Select **Cloud** (recommended)

### Step 3: Get API Key
1. Go to **Project Settings** (gear icon)
2. Copy:
   - **Project API Key** → `NEXT_PUBLIC_POSTHOG_KEY`
   - **Host** → `NEXT_PUBLIC_POSTHOG_HOST` (usually `https://app.posthog.com`)

### Step 4: Configure Events (Optional)
1. Go to **Data Management** → **Events**
2. Define custom events:
   - `booking_started`
   - `booking_completed`
   - `payment_initiated`
   - `payment_completed`

---

## 8. Mapbox Setup

**Cost: FREE** (50,000 map loads/month)

### Step 1: Create Account
1. Go to [https://account.mapbox.com/auth/signup](https://account.mapbox.com/auth/signup)
2. Sign up with email

### Step 2: Get Access Token
1. Go to **Account** → **Access tokens**
2. Copy **Default public token** → `NEXT_PUBLIC_MAPBOX_TOKEN`

### Step 3: Create Custom Token (Recommended)
1. Click **"Create a token"**
2. Name: `h2h-production`
3. Scopes: Select all public scopes
4. URL restrictions: Add your domains
5. Create and copy → `NEXT_PUBLIC_MAPBOX_TOKEN`

---

## 9. Cloudinary Setup (BONUS - Image Optimization)

**Cost: FREE** (25GB storage, 25GB bandwidth)

### Step 1: Create Account
1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up with email

### Step 2: Get Credentials
1. Go to **Dashboard**
2. Copy:
   - **Cloud name** → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`

### Benefits:
- Automatic image optimization
- Responsive images
- Fast CDN delivery
- Doctor/patient photo uploads

---

## 10. Upstash Setup (BONUS - Rate Limiting)

**Cost: FREE** (10,000 requests/day)

### Step 1: Create Account
1. Go to [https://console.upstash.com](https://console.upstash.com)
2. Sign up with GitHub or email

### Step 2: Create Redis Database
1. Click **"Create Database"**
2. Name: `h2h-ratelimit`
3. Region: `ap-south-1` (Mumbai)
4. Type: **Regional**
5. Click **"Create"**

### Step 3: Get Credentials
1. Click on your database
2. Copy:
   - **UPSTASH_REDIS_REST_URL** → `UPSTASH_REDIS_REST_URL`
   - **UPSTASH_REDIS_REST_TOKEN** → `UPSTASH_REDIS_REST_TOKEN`

### Benefits:
- Prevent API abuse
- Rate limit booking attempts
- Protect against spam

---

## 11. Final .env.local Configuration

Create `.env.local` in your project root with ALL values:

```env
# ===========================================
# H2H HEALTHCARE - ENVIRONMENT CONFIGURATION
# ===========================================

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=H2H Healthcare

# ===========================================
# SUPABASE (Database & Auth)
# Get from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-service-role-key

# ===========================================
# RAZORPAY (Payments)
# Get from: https://dashboard.razorpay.com/app/keys
# ===========================================
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# ===========================================
# TWILIO (WhatsApp & SMS)
# Get from: https://console.twilio.com
# ===========================================
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
TWILIO_SMS_NUMBER=+1234567890

# ===========================================
# RESEND (Email)
# Get from: https://resend.com/api-keys
# ===========================================
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=H2H Healthcare <noreply@healtohealth.in>

# ===========================================
# GOOGLE (OAuth, Calendar, Meet)
# Get from: https://console.cloud.google.com/apis/credentials
# ===========================================
GOOGLE_CLIENT_ID=xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx

# ===========================================
# TAWK.TO (Live Chat)
# Get from: https://dashboard.tawk.to - Widget Code
# ===========================================
NEXT_PUBLIC_TAWK_PROPERTY_ID=xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_TAWK_WIDGET_ID=xxxxxxxxxx

# ===========================================
# POSTHOG (Analytics)
# Get from: https://app.posthog.com/project/settings
# ===========================================
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ===========================================
# MAPBOX (Maps)
# Get from: https://account.mapbox.com/access-tokens
# ===========================================
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4In0.xxxxxxxxxxxxxxxxxxxx

# ===========================================
# CLOUDINARY (Image Optimization) - OPTIONAL
# Get from: https://cloudinary.com/console
# ===========================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=xxxxxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# ===========================================
# UPSTASH (Rate Limiting) - OPTIONAL
# Get from: https://console.upstash.com
# ===========================================
UPSTASH_REDIS_REST_URL=https://your-region.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📊 Complete Cost Summary

| Service | Free Tier Limits | Monthly Cost |
|---------|------------------|--------------|
| **Supabase** | 50K users, 500MB DB | ₹0 |
| **Vercel** | 100GB bandwidth | ₹0 |
| **Razorpay** | Unlimited | 2% per txn |
| **Twilio WhatsApp** | - | ~₹600 |
| **Twilio SMS** | - | ~₹500 |
| **Resend** | 3,000 emails | ₹0 |
| **Google APIs** | 1M requests/day | ₹0 |
| **Tawk.to** | Unlimited | ₹0 |
| **PostHog** | 1M events | ₹0 |
| **Mapbox** | 50K loads | ₹0 |
| **Cloudinary** | 25GB | ₹0 |
| **Upstash** | 10K req/day | ₹0 |
| **Domain** | - | ~₹67 |
| **TOTAL** | | **~₹1,200/month** |

---

## 🚀 Quick Start Checklist

- [ ] Create Supabase project and run migrations
- [ ] Create Razorpay account and get test keys
- [ ] Create Twilio account and setup WhatsApp sandbox
- [ ] Create Resend account and get API key
- [ ] Create Google Cloud project and OAuth credentials
- [ ] Create Tawk.to account and get widget IDs
- [ ] Create PostHog account and get project key
- [ ] Create Mapbox account and get access token
- [ ] (Optional) Create Cloudinary account
- [ ] (Optional) Create Upstash account
- [ ] Create `.env.local` with all values
- [ ] Run `npm run dev` and test

---

## 🆘 Troubleshooting

### "Supabase URL/Key required"
- Check `.env.local` exists in project root
- Restart dev server after adding env vars

### "Google OAuth not working"
- Verify redirect URIs match exactly
- Check Supabase Google provider is enabled

### "Razorpay payment failing"
- Use test mode keys for development
- Check webhook URL is accessible

### "WhatsApp messages not sending"
- Join Twilio sandbox first
- Check phone number format (+91...)

---

## 📞 Support

If you get stuck:
1. Check error messages in browser console
2. Check Supabase logs
3. Check Vercel deployment logs
4. Contact respective service support

---

*Last Updated: January 2026*
