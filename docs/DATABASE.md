# H2H Platform - Database Documentation

## Overview
The H2H platform uses **Supabase** (PostgreSQL) as its database with Row Level Security (RLS) for multi-tenant data isolation.

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   USERS     │       │  LOCATIONS  │       │  SERVICES   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ email       │◄──────│ name        │       │ name        │
│ phone       │       │ city        │       │ slug        │
│ full_name   │       │ address     │       │ category    │
│ role        │       │ tier (1/2)  │       │ tier1_price │
│ location_id │───────│ lat/long    │       │ tier2_price │
│ is_active   │       │ is_active   │       │ duration    │
└─────────────┘       └─────────────┘       └─────────────┘
       │                     │                     │
       │                     │                     │
       ▼                     ▼                     ▼
┌─────────────┐       ┌─────────────────────────────────┐
│   DOCTORS   │       │          APPOINTMENTS           │
├─────────────┤       ├─────────────────────────────────┤
│ id (PK)     │       │ id (PK)                         │
│ user_id(FK) │───────│ patient_id (FK → users)         │
│ location_id │       │ doctor_id (FK → doctors)        │
│ specializ.  │◄──────│ service_id (FK → services)      │
│ experience  │       │ location_id (FK → locations)    │
│ rating      │       │ appointment_date                │
│ google_cal  │       │ start_time / end_time           │
└─────────────┘       │ mode (online/offline/home)      │
       │              │ status (pending/confirmed/...)  │
       │              │ payment_status                  │
       ▼              │ razorpay_order_id               │
┌─────────────┐       │ google_meet_link                │
│ DOCTOR_     │       └─────────────────────────────────┘
│ AVAILABILITY│                      │
├─────────────┤                      │
│ doctor_id   │                      ▼
│ day_of_week │       ┌─────────────────────────────────┐
│ start_time  │       │           PAYMENTS              │
│ end_time    │       ├─────────────────────────────────┤
└─────────────┘       │ id (PK)                         │
                      │ appointment_id (FK)             │
                      │ amount                          │
                      │ razorpay_payment_id             │
                      │ status                          │
                      └─────────────────────────────────┘
```

## Table Definitions

### 1. users
Primary user table for all roles (patients, doctors, admins).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| email | TEXT | UNIQUE, NOT NULL | User email |
| phone | TEXT | | Phone number |
| full_name | TEXT | NOT NULL | Display name |
| avatar_url | TEXT | | Profile picture URL |
| role | TEXT | NOT NULL, CHECK | One of: super_admin, location_admin, doctor, patient |
| location_id | UUID | FK → locations | For location admins and doctors |
| is_active | BOOLEAN | DEFAULT true | Account status |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update |

### 2. locations
Clinic/city locations with tier-based pricing.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| name | TEXT | NOT NULL | Location name |
| city | TEXT | NOT NULL | City name |
| address | TEXT | NOT NULL | Full address |
| tier | INTEGER | CHECK (1 or 2) | Pricing tier |
| latitude | DECIMAL(10,8) | | GPS latitude |
| longitude | DECIMAL(11,8) | | GPS longitude |
| phone | TEXT | | Contact phone |
| email | TEXT | | Contact email |
| is_active | BOOLEAN | DEFAULT true | Location status |

### 3. services
Healthcare services offered.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| name | TEXT | NOT NULL | Service name |
| slug | TEXT | UNIQUE, NOT NULL | URL-friendly name |
| category | TEXT | CHECK | sports_rehab, pain_management, physiotherapy, yoga |
| description | TEXT | | Service description |
| duration_minutes | INTEGER | DEFAULT 60 | Session duration |
| tier1_price | DECIMAL(10,2) | NOT NULL | Metro city price |
| tier2_price | DECIMAL(10,2) | NOT NULL | Tier-2 city price |
| online_available | BOOLEAN | DEFAULT true | Video consultation |
| offline_available | BOOLEAN | DEFAULT true | Clinic visit |
| home_visit_available | BOOLEAN | DEFAULT false | Home service |

### 4. doctors
Doctor profiles linked to users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK → users | Link to user account |
| location_id | UUID | FK → locations | Primary location |
| specializations | TEXT[] | NOT NULL | Array of specializations |
| qualifications | TEXT[] | | Degrees, certifications |
| experience_years | INTEGER | | Years of experience |
| bio | TEXT | | Doctor bio |
| google_calendar_id | TEXT | | For calendar sync |
| google_meet_enabled | BOOLEAN | DEFAULT true | Video consultations |
| consultation_fee | DECIMAL(10,2) | | Base fee |
| rating | DECIMAL(2,1) | DEFAULT 0 | Average rating |
| total_reviews | INTEGER | DEFAULT 0 | Review count |

### 5. doctor_availability
Weekly schedule for doctors.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| doctor_id | UUID | FK → doctors | Doctor reference |
| day_of_week | INTEGER | CHECK (0-6) | 0=Sunday, 6=Saturday |
| start_time | TIME | NOT NULL | Shift start |
| end_time | TIME | NOT NULL | Shift end |
| is_available | BOOLEAN | DEFAULT true | Availability flag |

### 6. appointments
Core booking records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| patient_id | UUID | FK → users | Patient reference |
| doctor_id | UUID | FK → doctors | Doctor reference |
| service_id | UUID | FK → services | Service reference |
| location_id | UUID | FK → locations | Location reference |
| appointment_date | DATE | NOT NULL | Appointment date |
| start_time | TIME | NOT NULL | Start time |
| end_time | TIME | NOT NULL | End time |
| mode | TEXT | CHECK | online, offline, home_visit |
| status | TEXT | CHECK | pending, confirmed, completed, cancelled, no_show |
| payment_status | TEXT | CHECK | pending, paid, refunded, failed |
| amount | DECIMAL(10,2) | NOT NULL | Total amount |
| razorpay_order_id | TEXT | | Razorpay order ID |
| razorpay_payment_id | TEXT | | Payment ID |
| google_meet_link | TEXT | | Video call link |
| google_calendar_event_id | TEXT | | Calendar event ID |
| notes | TEXT | | Additional notes |
| cancellation_reason | TEXT | | If cancelled |

### 7. payments
Payment transaction records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| appointment_id | UUID | FK → appointments | Appointment reference |
| user_id | UUID | FK → users | Payer reference |
| amount | DECIMAL(10,2) | NOT NULL | Payment amount |
| currency | TEXT | DEFAULT 'INR' | Currency code |
| razorpay_order_id | TEXT | | Order ID |
| razorpay_payment_id | TEXT | | Payment ID |
| razorpay_signature | TEXT | | Verification signature |
| status | TEXT | CHECK | pending, success, failed, refunded |
| payment_method | TEXT | | UPI, card, netbanking |
| receipt_url | TEXT | | Receipt download URL |

### 8. prescriptions
Doctor prescriptions for appointments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| appointment_id | UUID | FK → appointments | Appointment reference |
| doctor_id | UUID | FK → doctors | Doctor reference |
| patient_id | UUID | FK → users | Patient reference |
| file_url | TEXT | NOT NULL | File storage URL |
| file_name | TEXT | | Original filename |
| notes | TEXT | | Prescription notes |

### 9. reviews
Patient reviews for doctors.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| appointment_id | UUID | FK → appointments | Appointment reference |
| patient_id | UUID | FK → users | Reviewer |
| doctor_id | UUID | FK → doctors | Reviewed doctor |
| rating | INTEGER | CHECK (1-5) | Star rating |
| comment | TEXT | | Review text |
| is_visible | BOOLEAN | DEFAULT true | Visibility flag |

### 10. notifications
Notification delivery log.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK → users | Recipient |
| appointment_id | UUID | FK → appointments | Related appointment |
| type | TEXT | CHECK | whatsapp, sms, email |
| template | TEXT | NOT NULL | Template name |
| status | TEXT | CHECK | pending, sent, failed |
| external_id | TEXT | | Third-party message ID |
| error_message | TEXT | | If failed |

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_doctors_location ON doctors(location_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_payments_status ON payments(status);
```

## Row Level Security Policies

All tables have RLS enabled. Key policies:

1. **Patients** can only access their own data
2. **Doctors** can access their appointments and patient info
3. **Location Admins** can access their location's data
4. **Super Admins** have full access

See `supabase/migrations/` for complete policy definitions.

## Triggers

### Auto-update timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Update doctor rating
```sql
CREATE OR REPLACE FUNCTION update_doctor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE doctors SET
    rating = (SELECT AVG(rating) FROM reviews WHERE doctor_id = NEW.doctor_id),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE doctor_id = NEW.doctor_id)
  WHERE id = NEW.doctor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER review_rating_update
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_doctor_rating();
```

## Seed Data

Initial data includes:
- Default super admin account
- Sample locations (Mumbai, Bangalore, Delhi)
- Service catalog (Sports Rehab, Physiotherapy, Yoga, Pain Management)
- Sample doctors for testing

See `supabase/seed.sql` for complete seed data.
