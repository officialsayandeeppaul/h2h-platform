# H2H Healthcare Platform - Complete Technical Architecture

## 🏥 Platform Overview

**H2H (Heal to Health)** is a comprehensive healthcare platform specializing in:
- **Sports Rehabilitation**
- **Pain Management & Mobilization**
- **Physiotherapy**
- **Yoga & Wellness**

### Business Model
- Multi-location healthcare services (Tier-1 & Tier-2 cities)
- Online consultations (Video calls via Google Meet)
- Offline appointments (Clinic visits)
- Home visits (Premium service)

---

## 🛠 Technology Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js 14 | React Framework (App Router) | 14.x |
| TypeScript | Type Safety | 5.x |
| Tailwind CSS | Styling | 3.x |
| Shadcn UI | Component Library | Latest |
| Lucide React | Icons | Latest |
| React Hook Form | Form Handling | 7.x |
| Zod | Validation | 3.x |
| FullCalendar | Appointment Calendar | 6.x |
| Zustand | Global State Management | 4.x |
| TanStack Query | Server State Management | 5.x |

### Backend
| Technology | Purpose | Cost |
|------------|---------|------|
| Supabase | Database, Auth, Storage, Edge Functions | Free (50k MAU) |
| PostgreSQL | Database Engine (via Supabase) | Included |
| Supabase Realtime | Live Updates | Included |
| Supabase Edge Functions | Serverless Functions | Included |

### Third-Party Integrations
| Service | Purpose | Cost |
|---------|---------|------|
| Razorpay | Payment Gateway | 2% per transaction |
| Twilio WhatsApp | Notifications | ₹0.40/message |
| Twilio SMS | OTP & Reminders | ₹0.40/message |
| Resend | Email Automation | Free (3k/month) |
| Google Calendar API | Doctor Scheduling | Free |
| Google Meet API | Video Consultations | Free |
| Tawk.to | Live Chat Support | Free (Unlimited) |
| Mapbox | Location Maps | Free (50k loads) |
| PostHog | Analytics | Free (1M events) |

### Deployment
| Service | Purpose | Cost |
|---------|---------|------|
| Vercel | Frontend Hosting | Free (Hobby) |
| Supabase Cloud | Backend Hosting | Free Tier |

---

## 📁 Project Structure

```
h2h-platform/
├── docs/                          # Documentation
│   ├── ARCHITECTURE.md            # This file
│   ├── DATABASE.md                # Database schema docs
│   ├── API.md                     # API documentation
│   └── DEPLOYMENT.md              # Deployment guide
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (public)/              # Public pages (no auth)
│   │   │   ├── page.tsx           # Homepage
│   │   │   ├── services/          # Services listing
│   │   │   ├── locations/         # Location pages
│   │   │   ├── about/             # About us
│   │   │   └── contact/           # Contact page
│   │   ├── (auth)/                # Auth pages
│   │   │   ├── login/             # Login page
│   │   │   ├── register/          # Registration
│   │   │   └── forgot-password/   # Password reset
│   │   ├── (dashboard)/           # Protected dashboard routes
│   │   │   ├── patient/           # Patient dashboard
│   │   │   ├── doctor/            # Doctor dashboard
│   │   │   ├── location-admin/    # Location admin dashboard
│   │   │   └── admin/             # Super admin dashboard
│   │   ├── booking/               # Booking flow
│   │   │   ├── [locationId]/      # Location-specific booking
│   │   │   └── confirmation/      # Booking confirmation
│   │   ├── api/                   # API routes
│   │   │   ├── auth/              # Auth endpoints
│   │   │   ├── appointments/      # Appointment CRUD
│   │   │   ├── payments/          # Payment webhooks
│   │   │   ├── notifications/     # Notification triggers
│   │   │   └── webhooks/          # External webhooks
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Global styles
│   ├── components/                # React components
│   │   ├── ui/                    # Shadcn UI components
│   │   ├── layout/                # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── forms/                 # Form components
│   │   │   ├── BookingForm.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── ProfileForm.tsx
│   │   ├── booking/               # Booking components
│   │   │   ├── LocationSelector.tsx
│   │   │   ├── ServiceSelector.tsx
│   │   │   ├── DoctorSelector.tsx
│   │   │   ├── TimeSlotPicker.tsx
│   │   │   └── BookingSummary.tsx
│   │   ├── dashboard/             # Dashboard components
│   │   │   ├── StatsCard.tsx
│   │   │   ├── AppointmentList.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   └── UserTable.tsx
│   │   └── shared/                # Shared components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── EmptyState.tsx
│   ├── lib/                       # Utility libraries
│   │   ├── supabase/              # Supabase client
│   │   │   ├── client.ts          # Browser client
│   │   │   ├── server.ts          # Server client
│   │   │   └── middleware.ts      # Auth middleware
│   │   ├── razorpay/              # Razorpay integration
│   │   ├── twilio/                # Twilio (WhatsApp/SMS)
│   │   ├── resend/                # Email service
│   │   ├── google/                # Google APIs
│   │   └── utils/                 # Helper functions
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useAppointments.ts
│   │   ├── useLocations.ts
│   │   └── useNotifications.ts
│   ├── stores/                    # Zustand stores
│   │   ├── authStore.ts
│   │   ├── bookingStore.ts
│   │   └── uiStore.ts
│   ├── types/                     # TypeScript types
│   │   ├── database.ts            # Database types
│   │   ├── api.ts                 # API types
│   │   └── index.ts               # Exported types
│   └── constants/                 # App constants
│       ├── services.ts
│       ├── locations.ts
│       └── config.ts
├── supabase/                      # Supabase configuration
│   ├── migrations/                # Database migrations
│   ├── functions/                 # Edge functions
│   │   ├── send-whatsapp/
│   │   ├── send-email/
│   │   ├── create-meet-link/
│   │   └── payment-webhook/
│   └── seed.sql                   # Seed data
├── public/                        # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
├── .env.example                   # Environment template
├── .env.local                     # Local environment (gitignored)
├── next.config.js                 # Next.js config
├── tailwind.config.ts             # Tailwind config
├── tsconfig.json                  # TypeScript config
├── package.json                   # Dependencies
└── README.md                      # Project readme
```

---

## 👥 User Roles & Permissions

### Role Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPER ADMIN (Owner)                       │
│  Full system access, all locations, financial reports        │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ LOCATION ADMIN  │ │ LOCATION ADMIN  │ │ LOCATION ADMIN  │
│   (Mumbai)      │ │  (Bangalore)    │ │   (Delhi)       │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
    ┌────┴────┐         ┌────┴────┐         ┌────┴────┐
    ▼         ▼         ▼         ▼         ▼         ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│Doctor │ │Doctor │ │Doctor │ │Doctor │ │Doctor │ │Doctor │
└───────┘ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘
                          │
                          ▼
                    ┌───────────┐
                    │  PATIENTS │
                    │ (All can  │
                    │   book)   │
                    └───────────┘
```

### Permission Matrix

| Feature | Super Admin | Location Admin | Doctor | Patient |
|---------|:-----------:|:--------------:|:------:|:-------:|
| View all locations | ✅ | ❌ | ❌ | ❌ |
| Manage all users | ✅ | ❌ | ❌ | ❌ |
| View all revenue | ✅ | ❌ | ❌ | ❌ |
| Add location admins | ✅ | ❌ | ❌ | ❌ |
| System settings | ✅ | ❌ | ❌ | ❌ |
| Manage own location | ✅ | ✅ | ❌ | ❌ |
| Add/edit doctors | ✅ | ✅ | ❌ | ❌ |
| View location revenue | ✅ | ✅ | ❌ | ❌ |
| View own appointments | ✅ | ✅ | ✅ | ✅ |
| Start video call | ❌ | ❌ | ✅ | ✅ |
| Upload prescription | ❌ | ❌ | ✅ | ❌ |
| Book appointments | ❌ | ❌ | ❌ | ✅ |
| Download invoices | ❌ | ❌ | ❌ | ✅ |

---

## 🗄 Database Schema

### Core Tables

```sql
-- Users (All user types)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('super_admin', 'location_admin', 'doctor', 'patient')),
  location_id UUID REFERENCES locations(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations (Cities/Clinics)
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  tier INTEGER NOT NULL CHECK (tier IN (1, 2)),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sports_rehab', 'pain_management', 'physiotherapy', 'yoga')),
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  tier1_price DECIMAL(10, 2) NOT NULL,
  tier2_price DECIMAL(10, 2) NOT NULL,
  online_available BOOLEAN DEFAULT true,
  offline_available BOOLEAN DEFAULT true,
  home_visit_available BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctors
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id),
  specializations TEXT[] NOT NULL,
  qualifications TEXT[],
  experience_years INTEGER,
  bio TEXT,
  google_calendar_id TEXT,
  google_meet_enabled BOOLEAN DEFAULT true,
  consultation_fee DECIMAL(10, 2),
  rating DECIMAL(2, 1) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctor Availability
CREATE TABLE doctor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true
);

-- Doctor Services (Many-to-Many)
CREATE TABLE doctor_services (
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (doctor_id, service_id)
);

-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES users(id),
  doctor_id UUID REFERENCES doctors(id),
  service_id UUID REFERENCES services(id),
  location_id UUID REFERENCES locations(id),
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('online', 'offline', 'home_visit')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  amount DECIMAL(10, 2) NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  google_meet_link TEXT,
  google_calendar_event_id TEXT,
  notes TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id),
  user_id UUID REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  payment_method TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prescriptions
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id),
  doctor_id UUID REFERENCES doctors(id),
  patient_id UUID REFERENCES users(id),
  file_url TEXT NOT NULL,
  file_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id),
  patient_id UUID REFERENCES users(id),
  doctor_id UUID REFERENCES doctors(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications Log
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  appointment_id UUID REFERENCES appointments(id),
  type TEXT NOT NULL CHECK (type IN ('whatsapp', 'sms', 'email')),
  template TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  external_id TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔐 Row Level Security (RLS) Policies

```sql
-- Users can only see their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Super admins can see all users
CREATE POLICY "Super admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Location admins can see users in their location
CREATE POLICY "Location admins can view location users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'location_admin' 
      AND location_id = users.location_id
    )
  );

-- Patients can only see their own appointments
CREATE POLICY "Patients view own appointments"
  ON appointments FOR SELECT
  USING (patient_id = auth.uid());

-- Doctors can see appointments assigned to them
CREATE POLICY "Doctors view assigned appointments"
  ON appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM doctors WHERE user_id = auth.uid() AND id = appointments.doctor_id
    )
  );
```

---

## 🔄 Automated Workflows

### 1. Appointment Booking Flow
```
User Books Appointment
        │
        ▼
┌───────────────────┐
│ Create Appointment│
│   (Supabase)      │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Trigger Edge      │
│ Function          │
└─────────┬─────────┘
          │
    ┌─────┴─────┬─────────────┬─────────────┐
    ▼           ▼             ▼             ▼
┌───────┐ ┌─────────┐ ┌───────────┐ ┌───────────┐
│WhatsApp│ │  Email  │ │  Google   │ │ Razorpay  │
│ Twilio │ │ Resend  │ │ Calendar  │ │  Order    │
└───────┘ └─────────┘ └───────────┘ └───────────┘
```

### 2. Payment Success Flow
```
Razorpay Webhook (payment.captured)
        │
        ▼
┌───────────────────┐
│ Verify Signature  │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Update Appointment│
│ status = confirmed│
│ payment = paid    │
└─────────┬─────────┘
          │
    ┌─────┴─────┬─────────────┐
    ▼           ▼             ▼
┌───────┐ ┌─────────┐ ┌───────────┐
│WhatsApp│ │  Email  │ │  Google   │
│Confirm │ │ Receipt │ │ Meet Link │
└───────┘ └─────────┘ └───────────┘
```

### 3. Reminder Flow (Cron Job)
```
Every Hour (Supabase Cron)
        │
        ▼
┌───────────────────────────┐
│ Find appointments in      │
│ next 24-25 hours          │
└─────────────┬─────────────┘
              │
              ▼
        For Each:
    ┌─────┴─────┐
    ▼           ▼
┌───────┐ ┌─────────┐
│WhatsApp│ │  SMS    │
│Reminder│ │ Backup  │
└───────┘ └─────────┘
```

---

## 💰 Cost Breakdown

### Monthly Costs (Launch Phase)
| Service | Usage | Cost (INR) |
|---------|-------|------------|
| Supabase | Free tier | ₹0 |
| Vercel | Free tier | ₹0 |
| Twilio WhatsApp | 300 messages | ₹120 |
| Twilio SMS | 100 messages | ₹40 |
| Resend | Free tier | ₹0 |
| Domain | healtohealth.in | ₹67 |
| **Total** | | **₹227/month** |

### Monthly Costs (Growth Phase - 500 appointments)
| Service | Usage | Cost (INR) |
|---------|-------|------------|
| Supabase | Free tier | ₹0 |
| Vercel | Free tier | ₹0 |
| Twilio WhatsApp | 1,500 messages | ₹600 |
| Twilio SMS | 500 messages | ₹200 |
| Resend | Free tier | ₹0 |
| Domain | healtohealth.in | ₹67 |
| **Total** | | **₹867/month** |

### Monthly Costs (Scale Phase - 2000 appointments)
| Service | Usage | Cost (INR) |
|---------|-------|------------|
| Supabase Pro | Upgraded | ₹2,000 |
| Vercel | Free tier | ₹0 |
| Twilio WhatsApp | 6,000 messages | ₹2,400 |
| Twilio SMS | 1,000 messages | ₹400 |
| Resend | Free tier | ₹0 |
| Domain | healtohealth.in | ₹67 |
| **Total** | | **₹4,867/month** |

---

## 🚀 Deployment Checklist

### Pre-Launch
- [ ] Supabase project created
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] Edge functions deployed
- [ ] Environment variables set
- [ ] Razorpay account verified
- [ ] Twilio WhatsApp templates approved
- [ ] Google OAuth configured
- [ ] Domain DNS configured
- [ ] SSL certificate active

### Post-Launch
- [ ] Monitor error logs
- [ ] Track user signups
- [ ] Monitor payment success rate
- [ ] Check notification delivery
- [ ] Review analytics data

---

## 📞 Support & Maintenance

### Live Chat
- **Platform**: Tawk.to (Free)
- **Agents**: Super Admin + Location Admins
- **Routing**: By location/query type

### Error Monitoring
- **Platform**: Supabase Logs (Free)
- **Alerts**: Email on critical errors

### Analytics
- **Platform**: PostHog (Free)
- **Tracking**: User behavior, conversion funnels

---

*Last Updated: January 2026*
*Version: 1.0.0*
