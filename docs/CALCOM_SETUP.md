# Cal.com setup for H2H (complete guide)

This connects **live Cal.com booking** on your website to **Super Admin → Call Requests**.

You do **not** need a paid Cal.com API key for the embed + webhook flow. You need:

1. A free [Cal.com](https://cal.com) account  
2. Three **event types** (clinic, video, phone)  
3. Your **username** and each event **slug** in `.env.local`  
4. One **webhook** with a **secret** (for admin inbox)

---

## Part A — Create Cal.com account

1. Go to [https://cal.com/signup](https://cal.com/signup)  
2. Sign up (Google or email).  
3. Complete onboarding (timezone: **Asia/Kolkata** recommended).  
4. Your public profile URL looks like:  
   `https://cal.com/YOUR_USERNAME`  
   → `YOUR_USERNAME` is what you put in `NEXT_PUBLIC_CALCOM_USERNAME`.

**You do not copy a password into H2H.** Cal.com runs on their site; H2H only embeds your public booking pages and receives webhooks.

---

## Part B — Create 3 event types

1. In Cal.com, open **Event Types** (left menu).  
2. Create three events, for example:

| Purpose | Example title | Example slug (in URL) |
|--------|----------------|------------------------|
| Clinic / calendar | Clinic visit | `clinic-visit` |
| Video | Video consultation | `video-consult` |
| Phone | Phone callback | `phone-callback` |

3. For each event, open it → **Settings** or share link.  
4. The slug is the last part of the URL:  
   `https://cal.com/YOUR_USERNAME/clinic-visit` → slug is **`clinic-visit`** (not the full URL).

5. Suggested settings:
   - **Duration**: 15–30 min (your choice)  
   - **Location**: Video event → Google Meet / Cal video; Phone → Phone; Clinic → In person  
   - **Availability**: Set your working hours  

---

## Part C — Put credentials in H2H (`.env.local`)

Open `c:\Anotech-Solutions\h2h-platform\.env.local` and add:

```env
# Cal.com — public embed (safe to expose in browser)
NEXT_PUBLIC_CALCOM_USERNAME=your-username-here
NEXT_PUBLIC_CALCOM_EVENT_CLINIC=clinic-visit
NEXT_PUBLIC_CALCOM_EVENT_VIDEO=video-consult
NEXT_PUBLIC_CALCOM_EVENT_PHONE=phone-callback

# Cal.com webhook secret (PRIVATE — never commit to git)
CALCOM_WEBHOOK_SECRET=paste-secret-from-cal-webhook-page
```

| Variable | Where to get it |
|----------|-----------------|
| `NEXT_PUBLIC_CALCOM_USERNAME` | Your Cal.com profile: `cal.com/THIS_PART` |
| `NEXT_PUBLIC_CALCOM_EVENT_CLINIC` | Slug from clinic event URL |
| `NEXT_PUBLIC_CALCOM_EVENT_VIDEO` | Slug from video event URL |
| `NEXT_PUBLIC_CALCOM_EVENT_PHONE` | Slug from phone event URL |
| `CALCOM_WEBHOOK_SECRET` | Cal.com → Settings → Developer → Webhooks → Secret you choose when creating webhook |

**Restart dev server** after saving:

```bash
npm run dev
```

Also add the same variables in **Vercel → Project → Settings → Environment Variables** for production.

---

## Part D — Webhook (bookings → Super Admin)

Without the webhook, patients can book on Cal.com but **nothing appears in admin**.

### Production (Vercel / live domain)

1. Cal.com → **Settings** → **Developer** → **Webhooks** → **New Webhook**  
2. **Subscriber URL**:  
   `https://healtohealth.in/api/webhooks/cal`  
   (replace with your real domain)  
3. **Event triggers**: enable **`BOOKING_CREATED`**  
4. **Secret**: type a long random string (e.g. 32+ chars). Copy it → `CALCOM_WEBHOOK_SECRET` in Vercel and `.env.local`  
5. Save  

### Local testing (localhost)

Cal.com cannot call `localhost` directly. Use **ngrok**:

```bash
ngrok http 3000
```

Use the HTTPS URL ngrok gives you:

`https://xxxx.ngrok-free.app/api/webhooks/cal`

Put that in Cal.com webhook URL. Use the **same secret** in `.env.local` as `CALCOM_WEBHOOK_SECRET`.

---

## Part E — Verify everything works

### 1. Embed on website

1. Homepage → tap **calendar / video / phone** icon in the dock.  
2. If env is correct, you see **Live calendar** tab with Cal.com UI inside the modal.  
3. If env is missing, you only see **Request manually** (form with AM/PM time grid).

### 2. Admin inbox

1. Complete a **test booking** on Cal.com embed.  
2. Log in as **super admin** → **Call Requests**.  
3. You should see a row with **Cal.com** badge, name, email, scheduled time.

### 3. Manual requests (no Cal)

Homepage form / “Confirm Booking” still works without Cal — entries appear in Call Requests **without** Cal.com badge.

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| No “Live calendar” tab | Check `NEXT_PUBLIC_CALCOM_USERNAME` and event slug env vars; restart `npm run dev` |
| Embed shows wrong event | Slug must match Cal.com URL exactly (lowercase, hyphens) |
| Booking works but admin empty | Webhook URL wrong, secret mismatch, or ngrok not running locally |
| Webhook 401 Invalid signature | `CALCOM_WEBHOOK_SECRET` must match Cal.com webhook secret exactly |
| `.env` not applied | `.env.local` overrides `.env` — update **both** or only `.env.local` |

---

## What H2H uses internally

| Piece | Path |
|-------|------|
| Embed component | `src/components/scheduling/CalBookingEmbed.tsx` |
| Config | `src/lib/cal/config.ts` |
| Webhook | `POST /api/webhooks/cal` |
| Admin list | Super Admin → `/super-admin/call-requests` |

---

## Quick checklist

- [ ] Cal.com account created  
- [ ] 3 event types created, slugs noted  
- [ ] `.env.local` filled (username + 3 slugs + webhook secret)  
- [ ] `npm run dev` restarted  
- [ ] Webhook added in Cal.com (BOOKING_CREATED)  
- [ ] Test booking → appears in Call Requests  

For manual-only scheduling (no Cal), the form with **10-digit mobile** and **in-modal AM/PM time buttons** works without any Cal.com setup.
