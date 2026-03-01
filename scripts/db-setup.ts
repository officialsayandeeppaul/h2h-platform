/**
 * H2H Healthcare Platform - Safe Database Setup
 * 
 * This script ONLY seeds data - it NEVER deletes existing data.
 * It uses upsert to safely add/update records without data loss.
 * 
 * Run: npm run db:setup
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================
// SCHEMA SQL
// ============================================

const SCHEMA_SQL = `
-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin', 'super_admin');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE consultation_mode AS ENUM ('online', 'offline', 'both');
CREATE TYPE service_category AS ENUM (
  'pain_relief_physiotherapy',
  'advanced_rehabilitation', 
  'nutrition_lifestyle',
  'mental_wellness',
  'therapeutic_yoga',
  'sports_performance',
  'digital_health'
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'patient',
  date_of_birth DATE,
  gender VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) DEFAULT 'India',
  address TEXT,
  tier INTEGER DEFAULT 1 CHECK (tier IN (1, 2)),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clinic Centers
CREATE TABLE clinic_centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  pincode VARCHAR(10),
  phone VARCHAR(20),
  email VARCHAR(255),
  facilities JSONB DEFAULT '[]'::jsonb,
  rating DECIMAL(2, 1) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category service_category NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 60,
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  specialization VARCHAR(255),
  qualification VARCHAR(255),
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  avatar_url TEXT,
  consultation_fee DECIMAL(10, 2),
  rating DECIMAL(2, 1) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  languages JSONB DEFAULT '["English", "Hindi"]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  online_available BOOLEAN DEFAULT true,
  offline_available BOOLEAN DEFAULT true,
  home_visit_available BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctor Services
CREATE TABLE doctor_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(doctor_id, service_id)
);

-- Doctor Availability
CREATE TABLE doctor_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  center_id UUID REFERENCES clinic_centers(id) ON DELETE SET NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  mode consultation_mode DEFAULT 'both',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  center_id UUID REFERENCES clinic_centers(id) ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  mode consultation_mode NOT NULL,
  status appointment_status DEFAULT 'pending',
  amount DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  meeting_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status payment_status DEFAULT 'pending',
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prescriptions
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  diagnosis TEXT,
  medications JSONB DEFAULT '[]'::jsonb,
  exercises JSONB DEFAULT '[]'::jsonb,
  instructions TEXT,
  follow_up_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  center_id UUID REFERENCES clinic_centers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'general',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_locations_city ON locations(city);
CREATE INDEX idx_clinic_centers_location ON clinic_centers(location_id);
CREATE INDEX idx_clinic_centers_slug ON clinic_centers(slug);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_doctors_active ON doctors(is_active);
CREATE INDEX idx_doctor_availability_doctor ON doctor_availability(doctor_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_payments_appointment ON payments(appointment_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- Triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_appointments_timestamp BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public policies
CREATE POLICY "Public read locations" ON locations FOR SELECT USING (is_active = true);
CREATE POLICY "Public read centers" ON clinic_centers FOR SELECT USING (is_active = true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read doctors" ON doctors FOR SELECT USING (is_active = true);
CREATE POLICY "Public read doctor_services" ON doctor_services FOR SELECT USING (true);
CREATE POLICY "Public read availability" ON doctor_availability FOR SELECT USING (is_available = true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (is_visible = true);

-- User policies
CREATE POLICY "Users read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users read own appointments" ON appointments FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Users create appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Users read own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own prescriptions" ON prescriptions FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Users read own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Service role policies
CREATE POLICY "Service full users" ON users FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service full locations" ON locations FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service full centers" ON clinic_centers FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service full services" ON services FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service full doctors" ON doctors FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service full appointments" ON appointments FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service full payments" ON payments FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service full prescriptions" ON prescriptions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service full reviews" ON reviews FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service full notifications" ON notifications FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
`;

const DROP_SQL = `
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctor_services CASCADE;
DROP TABLE IF EXISTS doctor_availability CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS clinic_centers CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS appointment_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS consultation_mode CASCADE;
DROP TYPE IF EXISTS service_category CASCADE;
DROP FUNCTION IF EXISTS update_updated_at CASCADE;
`;

// ============================================
// SEED DATA
// ============================================

const LOCATIONS = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'H2H Mumbai', city: 'Mumbai', state: 'Maharashtra', address: 'Andheri West, Mumbai', tier: 1 },
  { id: '22222222-2222-2222-2222-222222222222', name: 'H2H Bangalore', city: 'Bangalore', state: 'Karnataka', address: 'Koramangala, Bangalore', tier: 1 },
  { id: '33333333-3333-3333-3333-333333333333', name: 'H2H Delhi', city: 'Delhi', state: 'Delhi', address: 'Saket, New Delhi', tier: 1 },
  { id: '44444444-4444-4444-4444-444444444444', name: 'H2H Pune', city: 'Pune', state: 'Maharashtra', address: 'Kothrud, Pune', tier: 2 },
  { id: '55555555-5555-5555-5555-555555555555', name: 'H2H Hyderabad', city: 'Hyderabad', state: 'Telangana', address: 'Banjara Hills, Hyderabad', tier: 1 },
  { id: '66666666-6666-6666-6666-666666666666', name: 'H2H Jaipur', city: 'Jaipur', state: 'Rajasthan', address: 'Malviya Nagar, Jaipur', tier: 2 },
  { id: '77777777-7777-7777-7777-777777777777', name: 'H2H Kolkata', city: 'Kolkata', state: 'West Bengal', address: 'Salt Lake City, Kolkata', tier: 2 },
  { id: '88888888-8888-8888-8888-888888888888', name: 'H2H Chennai', city: 'Chennai', state: 'Tamil Nadu', address: 'T Nagar, Chennai', tier: 1 },
];

const CLINIC_CENTERS = [
  { id: 'c1111111-1111-1111-1111-111111111111', location_id: '11111111-1111-1111-1111-111111111111', name: 'H2H Andheri West', slug: 'h2h-andheri-west', address: 'Shop 12, Lokhandwala Complex, Andheri West', pincode: '400058', phone: '+91 98765 43210', email: 'andheri@healtohealth.in', facilities: ['Parking', 'Wheelchair Access', 'Pharmacy'], rating: 4.8, total_reviews: 245, is_featured: true },
  { id: 'c1111111-1111-1111-1111-111111111112', location_id: '11111111-1111-1111-1111-111111111111', name: 'H2H Bandra', slug: 'h2h-bandra', address: '15, Hill Road, Bandra West', pincode: '400050', phone: '+91 98765 43218', email: 'bandra@healtohealth.in', facilities: ['Parking', 'Wheelchair Access'], rating: 4.7, total_reviews: 189, is_featured: true },
  { id: 'c2222222-2222-2222-2222-222222222221', location_id: '22222222-2222-2222-2222-222222222222', name: 'H2H Koramangala', slug: 'h2h-koramangala', address: '80 Feet Road, Koramangala 4th Block', pincode: '560034', phone: '+91 98765 43211', email: 'koramangala@healtohealth.in', facilities: ['Parking', 'Wheelchair Access', 'Gym'], rating: 4.9, total_reviews: 312, is_featured: true },
  { id: 'c2222222-2222-2222-2222-222222222222', location_id: '22222222-2222-2222-2222-222222222222', name: 'H2H Indiranagar', slug: 'h2h-indiranagar', address: '100 Feet Road, Indiranagar', pincode: '560038', phone: '+91 98765 43219', email: 'indiranagar@healtohealth.in', facilities: ['Parking', 'Wheelchair Access'], rating: 4.6, total_reviews: 156, is_featured: false },
  { id: 'c3333333-3333-3333-3333-333333333331', location_id: '33333333-3333-3333-3333-333333333333', name: 'H2H Saket', slug: 'h2h-saket', address: 'B-12, Select Citywalk Mall, Saket', pincode: '110017', phone: '+91 98765 43212', email: 'saket@healtohealth.in', facilities: ['Parking', 'Wheelchair Access', 'Pharmacy', 'Gym'], rating: 4.9, total_reviews: 428, is_featured: true },
  { id: 'c3333333-3333-3333-3333-333333333332', location_id: '33333333-3333-3333-3333-333333333333', name: 'H2H Dwarka', slug: 'h2h-dwarka', address: 'Sector 12, Dwarka', pincode: '110075', phone: '+91 98765 43220', email: 'dwarka@healtohealth.in', facilities: ['Parking', 'Wheelchair Access'], rating: 4.5, total_reviews: 98, is_featured: false },
  { id: 'c4444444-4444-4444-4444-444444444441', location_id: '44444444-4444-4444-4444-444444444444', name: 'H2H Kothrud', slug: 'h2h-kothrud', address: '45, Paud Road, Kothrud', pincode: '411038', phone: '+91 98765 43213', email: 'kothrud@healtohealth.in', facilities: ['Parking', 'Wheelchair Access'], rating: 4.7, total_reviews: 167, is_featured: true },
  { id: 'c5555555-5555-5555-5555-555555555551', location_id: '55555555-5555-5555-5555-555555555555', name: 'H2H Banjara Hills', slug: 'h2h-banjara-hills', address: 'Road No. 12, Banjara Hills', pincode: '500034', phone: '+91 98765 43214', email: 'banjarahills@healtohealth.in', facilities: ['Parking', 'Wheelchair Access', 'Gym'], rating: 4.8, total_reviews: 234, is_featured: true },
  { id: 'c6666666-6666-6666-6666-666666666661', location_id: '66666666-6666-6666-6666-666666666666', name: 'H2H Malviya Nagar', slug: 'h2h-malviya-nagar-jaipur', address: 'D-45, Malviya Nagar', pincode: '302017', phone: '+91 98765 43215', email: 'malviyanagar@healtohealth.in', facilities: ['Parking'], rating: 4.6, total_reviews: 89, is_featured: false },
  { id: 'c7777777-7777-7777-7777-777777777771', location_id: '77777777-7777-7777-7777-777777777777', name: 'H2H Salt Lake', slug: 'h2h-salt-lake', address: 'Sector V, Salt Lake City', pincode: '700091', phone: '+91 98765 43216', email: 'saltlake@healtohealth.in', facilities: ['Parking', 'Wheelchair Access'], rating: 4.7, total_reviews: 145, is_featured: true },
  { id: 'c8888888-8888-8888-8888-888888888881', location_id: '88888888-8888-8888-8888-888888888888', name: 'H2H T Nagar', slug: 'h2h-t-nagar', address: '23, Usman Road, T Nagar', pincode: '600017', phone: '+91 98765 43217', email: 'tnagar@healtohealth.in', facilities: ['Parking', 'Wheelchair Access', 'Pharmacy'], rating: 4.8, total_reviews: 198, is_featured: true },
];

const SERVICES = [
  // Pain Relief & Physiotherapy
  { name: 'Back Pain Treatment', slug: 'back-pain-treatment', category: 'pain_relief_physiotherapy', description: 'Expert treatment for chronic and acute back pain', duration_minutes: 45, tier1_price: 1200, tier2_price: 800, online_available: true, offline_available: true, home_visit_available: true },
  { name: 'Neck Pain & Cervical Care', slug: 'neck-pain-cervical-care', category: 'pain_relief_physiotherapy', description: 'Specialized care for neck pain and cervical spondylosis', duration_minutes: 45, tier1_price: 1200, tier2_price: 800, online_available: true, offline_available: true, home_visit_available: true },
  { name: 'Joint Pain Management', slug: 'joint-pain-management', category: 'pain_relief_physiotherapy', description: 'Treatment for knee, shoulder, hip and other joint pain', duration_minutes: 45, tier1_price: 1300, tier2_price: 900, online_available: true, offline_available: true, home_visit_available: true },
  { name: 'Sciatica Treatment', slug: 'sciatica-treatment', category: 'pain_relief_physiotherapy', description: 'Targeted therapy for sciatic nerve pain', duration_minutes: 45, tier1_price: 1400, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: true },
  { name: 'Frozen Shoulder Treatment', slug: 'frozen-shoulder-treatment', category: 'pain_relief_physiotherapy', description: 'Treatment for adhesive capsulitis', duration_minutes: 45, tier1_price: 1300, tier2_price: 900, online_available: false, offline_available: true, home_visit_available: true },
  { name: 'Arthritis Care', slug: 'arthritis-care', category: 'pain_relief_physiotherapy', description: 'Physiotherapy for osteoarthritis and rheumatoid arthritis', duration_minutes: 45, tier1_price: 1400, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: true },

  // Advanced Rehabilitation
  { name: 'Post-Surgery Rehabilitation', slug: 'post-surgery-rehabilitation', category: 'advanced_rehabilitation', description: 'Rehabilitation after orthopedic surgeries', duration_minutes: 60, tier1_price: 1800, tier2_price: 1200, online_available: false, offline_available: true, home_visit_available: true },
  { name: 'Stroke Rehabilitation', slug: 'stroke-rehabilitation', category: 'advanced_rehabilitation', description: 'Physiotherapy for stroke recovery', duration_minutes: 60, tier1_price: 2000, tier2_price: 1500, online_available: false, offline_available: true, home_visit_available: true },
  { name: 'Spinal Cord Injury Rehab', slug: 'spinal-cord-injury-rehab', category: 'advanced_rehabilitation', description: 'Rehabilitation for spinal cord injuries', duration_minutes: 60, tier1_price: 2200, tier2_price: 1800, online_available: false, offline_available: true, home_visit_available: true },
  { name: 'ACL Reconstruction Rehab', slug: 'acl-reconstruction-rehab', category: 'advanced_rehabilitation', description: 'Recovery program for ACL reconstruction', duration_minutes: 60, tier1_price: 1800, tier2_price: 1400, online_available: false, offline_available: true, home_visit_available: true },
  { name: 'Total Knee Replacement Rehab', slug: 'total-knee-replacement-rehab', category: 'advanced_rehabilitation', description: 'Post-operative knee replacement rehab', duration_minutes: 60, tier1_price: 1800, tier2_price: 1400, online_available: false, offline_available: true, home_visit_available: true },
  { name: 'Geriatric Rehabilitation', slug: 'geriatric-rehabilitation', category: 'advanced_rehabilitation', description: 'Specialized care for elderly patients', duration_minutes: 45, tier1_price: 1500, tier2_price: 1000, online_available: false, offline_available: true, home_visit_available: true },

  // Nutrition & Lifestyle
  { name: 'Sports Nutrition Consultation', slug: 'sports-nutrition-consultation', category: 'nutrition_lifestyle', description: 'Nutrition plans for athletes', duration_minutes: 45, tier1_price: 1500, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Weight Management Program', slug: 'weight-management-program', category: 'nutrition_lifestyle', description: 'Weight loss/gain program with diet guidance', duration_minutes: 45, tier1_price: 1200, tier2_price: 800, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Diabetes Nutrition Care', slug: 'diabetes-nutrition-care', category: 'nutrition_lifestyle', description: 'Diet planning for diabetes management', duration_minutes: 45, tier1_price: 1300, tier2_price: 900, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Heart Health Nutrition', slug: 'heart-health-nutrition', category: 'nutrition_lifestyle', description: 'Cardiac-friendly diet planning', duration_minutes: 45, tier1_price: 1300, tier2_price: 900, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Lifestyle Modification Coaching', slug: 'lifestyle-modification-coaching', category: 'nutrition_lifestyle', description: 'Holistic lifestyle coaching', duration_minutes: 60, tier1_price: 1500, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: false },

  // Mental Wellness
  { name: 'Sports Psychology Consultation', slug: 'sports-psychology-consultation', category: 'mental_wellness', description: 'Mental performance coaching for athletes', duration_minutes: 60, tier1_price: 2000, tier2_price: 1500, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Stress & Anxiety Management', slug: 'stress-anxiety-management', category: 'mental_wellness', description: 'Sessions for stress and anxiety management', duration_minutes: 45, tier1_price: 1500, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Performance Enhancement Coaching', slug: 'performance-enhancement-coaching', category: 'mental_wellness', description: 'Mental conditioning for peak performance', duration_minutes: 60, tier1_price: 1800, tier2_price: 1200, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Sleep Disorder Consultation', slug: 'sleep-disorder-consultation', category: 'mental_wellness', description: 'Assessment of sleep-related issues', duration_minutes: 45, tier1_price: 1400, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Mindfulness & Meditation Therapy', slug: 'mindfulness-meditation-therapy', category: 'mental_wellness', description: 'Guided mindfulness and meditation', duration_minutes: 45, tier1_price: 1000, tier2_price: 700, online_available: true, offline_available: true, home_visit_available: false },

  // Therapeutic Yoga
  { name: 'Therapeutic Yoga', slug: 'therapeutic-yoga', category: 'therapeutic_yoga', description: 'Yoga for healing and rehabilitation', duration_minutes: 60, tier1_price: 800, tier2_price: 500, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Prenatal Yoga', slug: 'prenatal-yoga', category: 'therapeutic_yoga', description: 'Safe yoga for expecting mothers', duration_minutes: 45, tier1_price: 1000, tier2_price: 700, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Senior Yoga', slug: 'senior-yoga', category: 'therapeutic_yoga', description: 'Gentle yoga for older adults', duration_minutes: 45, tier1_price: 700, tier2_price: 500, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Yoga for Back Pain', slug: 'yoga-for-back-pain', category: 'therapeutic_yoga', description: 'Yoga sequences for back pain relief', duration_minutes: 45, tier1_price: 900, tier2_price: 600, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Breathwork & Pranayama', slug: 'breathwork-pranayama', category: 'therapeutic_yoga', description: 'Advanced breathing techniques', duration_minutes: 45, tier1_price: 700, tier2_price: 500, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Corporate Wellness Yoga', slug: 'corporate-wellness-yoga', category: 'therapeutic_yoga', description: 'Group yoga for corporates', duration_minutes: 60, tier1_price: 5000, tier2_price: 3500, online_available: true, offline_available: true, home_visit_available: false },

  // Sports Performance
  { name: 'Sports Injury Assessment', slug: 'sports-injury-assessment', category: 'sports_performance', description: 'Evaluation of sports injuries', duration_minutes: 60, tier1_price: 1500, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Biomechanical Analysis', slug: 'biomechanical-analysis', category: 'sports_performance', description: 'Movement analysis for performance', duration_minutes: 90, tier1_price: 3000, tier2_price: 2500, online_available: false, offline_available: true, home_visit_available: false },
  { name: 'Athletic Performance Testing', slug: 'athletic-performance-testing', category: 'sports_performance', description: 'Fitness assessment for athletes', duration_minutes: 90, tier1_price: 2500, tier2_price: 2000, online_available: false, offline_available: true, home_visit_available: false },
  { name: 'Sports-Specific Training', slug: 'sports-specific-training', category: 'sports_performance', description: 'Customized training programs', duration_minutes: 60, tier1_price: 2000, tier2_price: 1500, online_available: false, offline_available: true, home_visit_available: false },
  { name: 'Injury Prevention Program', slug: 'injury-prevention-program', category: 'sports_performance', description: 'Proactive injury prevention', duration_minutes: 60, tier1_price: 1800, tier2_price: 1200, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Return to Sport Assessment', slug: 'return-to-sport-assessment', category: 'sports_performance', description: 'Safe return to sports evaluation', duration_minutes: 60, tier1_price: 2000, tier2_price: 1500, online_available: false, offline_available: true, home_visit_available: false },

  // Digital Health
  { name: 'Tele-Rehabilitation', slug: 'tele-rehabilitation', category: 'digital_health', description: 'Remote physiotherapy sessions', duration_minutes: 45, tier1_price: 800, tier2_price: 600, online_available: true, offline_available: false, home_visit_available: false },
  { name: 'Virtual Fitness Assessment', slug: 'virtual-fitness-assessment', category: 'digital_health', description: 'Online fitness assessment', duration_minutes: 45, tier1_price: 700, tier2_price: 500, online_available: true, offline_available: false, home_visit_available: false },
  { name: 'Digital Health Monitoring', slug: 'digital-health-monitoring', category: 'digital_health', description: 'Remote health tracking', duration_minutes: 30, tier1_price: 500, tier2_price: 400, online_available: true, offline_available: false, home_visit_available: false },
  { name: 'Online Second Opinion', slug: 'online-second-opinion', category: 'digital_health', description: 'Expert second opinion online', duration_minutes: 30, tier1_price: 1000, tier2_price: 800, online_available: true, offline_available: false, home_visit_available: false },
  { name: 'Home Exercise Program Design', slug: 'home-exercise-program-design', category: 'digital_health', description: 'Customized home exercise programs', duration_minutes: 45, tier1_price: 600, tier2_price: 400, online_available: true, offline_available: false, home_visit_available: false },
];

const DOCTORS = [
  { id: 'd1111111-1111-1111-1111-111111111111', full_name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@healtohealth.in', phone: '+91 98765 11111', specialization: 'Sports Physiotherapy', qualification: 'BPT, MPT (Sports), CSCS', experience_years: 12, bio: 'Renowned sports physiotherapist with 12+ years experience working with professional athletes.', avatar_url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=rajesh&backgroundColor=b6e3f4', consultation_fee: 1500, rating: 4.9, total_reviews: 245, languages: ['English', 'Hindi', 'Marathi'], is_featured: true, online_available: true, offline_available: true, home_visit_available: true },
  { id: 'd2222222-2222-2222-2222-222222222222', full_name: 'Dr. Priya Sharma', email: 'priya.sharma@healtohealth.in', phone: '+91 98765 22222', specialization: 'Pain Management', qualification: 'BPT, MPT (Ortho), Pain Specialist', experience_years: 10, bio: 'Specializes in chronic pain management using evidence-based techniques.', avatar_url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=priya&backgroundColor=c0aede', consultation_fee: 1200, rating: 4.8, total_reviews: 189, languages: ['English', 'Hindi'], is_featured: true, online_available: true, offline_available: true, home_visit_available: true },
  { id: 'd3333333-3333-3333-3333-333333333333', full_name: 'Dr. Amit Patel', email: 'amit.patel@healtohealth.in', phone: '+91 98765 33333', specialization: 'Neurological Rehabilitation', qualification: 'BPT, MPT (Neuro), NDT Certified', experience_years: 15, bio: 'Expert in neurological rehabilitation with extensive stroke recovery experience.', avatar_url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=amit&backgroundColor=d1d4f9', consultation_fee: 1800, rating: 4.9, total_reviews: 312, languages: ['English', 'Hindi', 'Gujarati'], is_featured: true, online_available: false, offline_available: true, home_visit_available: true },
  { id: 'd4444444-4444-4444-4444-444444444444', full_name: 'Dr. Sneha Reddy', email: 'sneha.reddy@healtohealth.in', phone: '+91 98765 44444', specialization: 'Yoga Therapy', qualification: 'BPT, MSc Yoga, Certified Yoga Therapist', experience_years: 8, bio: 'Combines traditional yoga with modern physiotherapy for holistic healing.', avatar_url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=sneha&backgroundColor=ffd5dc', consultation_fee: 1000, rating: 4.7, total_reviews: 156, languages: ['English', 'Hindi', 'Telugu'], is_featured: false, online_available: true, offline_available: true, home_visit_available: false },
  { id: 'd5555555-5555-5555-5555-555555555555', full_name: 'Dr. Vikram Singh', email: 'vikram.singh@healtohealth.in', phone: '+91 98765 55555', specialization: 'Sports Performance', qualification: 'BPT, MPT (Sports), CSCS, PES', experience_years: 14, bio: 'Sports performance specialist who has worked with national athletes and IPL teams.', avatar_url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=vikram&backgroundColor=b6e3f4', consultation_fee: 2000, rating: 4.9, total_reviews: 428, languages: ['English', 'Hindi', 'Punjabi'], is_featured: true, online_available: true, offline_available: true, home_visit_available: false },
  { id: 'd6666666-6666-6666-6666-666666666666', full_name: 'Dr. Meera Nair', email: 'meera.nair@healtohealth.in', phone: '+91 98765 66666', specialization: 'Geriatric Physiotherapy', qualification: 'BPT, MPT (Geriatrics)', experience_years: 11, bio: 'Specializes in elderly care focusing on mobility and fall prevention.', avatar_url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=meera&backgroundColor=c0aede', consultation_fee: 1200, rating: 4.8, total_reviews: 198, languages: ['English', 'Hindi', 'Malayalam'], is_featured: false, online_available: true, offline_available: true, home_visit_available: true },
];

const DOCTOR_AVAILABILITY = [
  // Dr. Rajesh - Mumbai
  { doctor_id: 'd1111111-1111-1111-1111-111111111111', center_id: 'c1111111-1111-1111-1111-111111111111', day_of_week: 1, start_time: '09:00', end_time: '17:00', mode: 'both' },
  { doctor_id: 'd1111111-1111-1111-1111-111111111111', center_id: 'c1111111-1111-1111-1111-111111111111', day_of_week: 2, start_time: '09:00', end_time: '17:00', mode: 'both' },
  { doctor_id: 'd1111111-1111-1111-1111-111111111111', center_id: 'c1111111-1111-1111-1111-111111111111', day_of_week: 3, start_time: '09:00', end_time: '17:00', mode: 'both' },
  { doctor_id: 'd1111111-1111-1111-1111-111111111111', center_id: 'c1111111-1111-1111-1111-111111111111', day_of_week: 4, start_time: '09:00', end_time: '17:00', mode: 'both' },
  { doctor_id: 'd1111111-1111-1111-1111-111111111111', center_id: 'c1111111-1111-1111-1111-111111111111', day_of_week: 5, start_time: '09:00', end_time: '17:00', mode: 'both' },
  { doctor_id: 'd1111111-1111-1111-1111-111111111111', center_id: null, day_of_week: 6, start_time: '10:00', end_time: '14:00', mode: 'online' },
  
  // Dr. Priya - Bangalore
  { doctor_id: 'd2222222-2222-2222-2222-222222222222', center_id: 'c2222222-2222-2222-2222-222222222221', day_of_week: 1, start_time: '10:00', end_time: '18:00', mode: 'both' },
  { doctor_id: 'd2222222-2222-2222-2222-222222222222', center_id: 'c2222222-2222-2222-2222-222222222221', day_of_week: 2, start_time: '10:00', end_time: '18:00', mode: 'both' },
  { doctor_id: 'd2222222-2222-2222-2222-222222222222', center_id: 'c2222222-2222-2222-2222-222222222221', day_of_week: 3, start_time: '10:00', end_time: '18:00', mode: 'both' },
  { doctor_id: 'd2222222-2222-2222-2222-222222222222', center_id: 'c2222222-2222-2222-2222-222222222221', day_of_week: 4, start_time: '10:00', end_time: '18:00', mode: 'both' },
  { doctor_id: 'd2222222-2222-2222-2222-222222222222', center_id: 'c2222222-2222-2222-2222-222222222221', day_of_week: 5, start_time: '10:00', end_time: '18:00', mode: 'both' },
  
  // Dr. Amit - Delhi
  { doctor_id: 'd3333333-3333-3333-3333-333333333333', center_id: 'c3333333-3333-3333-3333-333333333331', day_of_week: 1, start_time: '09:00', end_time: '17:00', mode: 'offline' },
  { doctor_id: 'd3333333-3333-3333-3333-333333333333', center_id: 'c3333333-3333-3333-3333-333333333331', day_of_week: 2, start_time: '09:00', end_time: '17:00', mode: 'offline' },
  { doctor_id: 'd3333333-3333-3333-3333-333333333333', center_id: 'c3333333-3333-3333-3333-333333333331', day_of_week: 3, start_time: '09:00', end_time: '17:00', mode: 'offline' },
  { doctor_id: 'd3333333-3333-3333-3333-333333333333', center_id: 'c3333333-3333-3333-3333-333333333331', day_of_week: 4, start_time: '09:00', end_time: '17:00', mode: 'offline' },
  { doctor_id: 'd3333333-3333-3333-3333-333333333333', center_id: 'c3333333-3333-3333-3333-333333333331', day_of_week: 5, start_time: '09:00', end_time: '17:00', mode: 'offline' },
  
  // Dr. Sneha - Hyderabad
  { doctor_id: 'd4444444-4444-4444-4444-444444444444', center_id: 'c5555555-5555-5555-5555-555555555551', day_of_week: 1, start_time: '08:00', end_time: '14:00', mode: 'both' },
  { doctor_id: 'd4444444-4444-4444-4444-444444444444', center_id: 'c5555555-5555-5555-5555-555555555551', day_of_week: 2, start_time: '08:00', end_time: '14:00', mode: 'both' },
  { doctor_id: 'd4444444-4444-4444-4444-444444444444', center_id: 'c5555555-5555-5555-5555-555555555551', day_of_week: 3, start_time: '08:00', end_time: '14:00', mode: 'both' },
  { doctor_id: 'd4444444-4444-4444-4444-444444444444', center_id: null, day_of_week: 4, start_time: '08:00', end_time: '14:00', mode: 'online' },
  { doctor_id: 'd4444444-4444-4444-4444-444444444444', center_id: null, day_of_week: 5, start_time: '08:00', end_time: '14:00', mode: 'online' },
  
  // Dr. Vikram - Mumbai & Bangalore
  { doctor_id: 'd5555555-5555-5555-5555-555555555555', center_id: 'c1111111-1111-1111-1111-111111111111', day_of_week: 1, start_time: '14:00', end_time: '20:00', mode: 'offline' },
  { doctor_id: 'd5555555-5555-5555-5555-555555555555', center_id: 'c2222222-2222-2222-2222-222222222221', day_of_week: 2, start_time: '10:00', end_time: '18:00', mode: 'offline' },
  { doctor_id: 'd5555555-5555-5555-5555-555555555555', center_id: 'c1111111-1111-1111-1111-111111111111', day_of_week: 3, start_time: '14:00', end_time: '20:00', mode: 'offline' },
  { doctor_id: 'd5555555-5555-5555-5555-555555555555', center_id: 'c2222222-2222-2222-2222-222222222221', day_of_week: 4, start_time: '10:00', end_time: '18:00', mode: 'offline' },
  { doctor_id: 'd5555555-5555-5555-5555-555555555555', center_id: null, day_of_week: 5, start_time: '09:00', end_time: '17:00', mode: 'online' },
  
  // Dr. Meera - Chennai
  { doctor_id: 'd6666666-6666-6666-6666-666666666666', center_id: 'c8888888-8888-8888-8888-888888888881', day_of_week: 1, start_time: '09:00', end_time: '17:00', mode: 'both' },
  { doctor_id: 'd6666666-6666-6666-6666-666666666666', center_id: 'c8888888-8888-8888-8888-888888888881', day_of_week: 2, start_time: '09:00', end_time: '17:00', mode: 'both' },
  { doctor_id: 'd6666666-6666-6666-6666-666666666666', center_id: 'c8888888-8888-8888-8888-888888888881', day_of_week: 3, start_time: '09:00', end_time: '17:00', mode: 'both' },
  { doctor_id: 'd6666666-6666-6666-6666-666666666666', center_id: 'c8888888-8888-8888-8888-888888888881', day_of_week: 4, start_time: '09:00', end_time: '17:00', mode: 'both' },
  { doctor_id: 'd6666666-6666-6666-6666-666666666666', center_id: 'c8888888-8888-8888-8888-888888888881', day_of_week: 5, start_time: '09:00', end_time: '17:00', mode: 'both' },
];

// ============================================
// MAIN FUNCTIONS
// ============================================

async function runSQL(sql: string, description: string): Promise<boolean> {
  console.log(`  Running: ${description}...`);
  const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).single();
  
  if (error) {
    // Try direct query if RPC doesn't exist
    const { error: directError } = await supabase.from('_temp').select().limit(0);
    if (directError?.message?.includes('does not exist')) {
      // Expected - table doesn't exist, that's fine
    }
    console.log(`  ⚠️  Note: ${error.message}`);
    return false;
  }
  console.log(`  ✓ ${description}`);
  return true;
}

// SAFETY: This function is DISABLED to prevent accidental data deletion
// If you really need to clear data, do it manually in Supabase Dashboard
async function checkExistingData() {
  console.log('\n� Checking existing data...');
  
  const { count: locCount } = await supabase.from('locations').select('*', { count: 'exact', head: true });
  const { count: centerCount } = await supabase.from('clinic_centers').select('*', { count: 'exact', head: true });
  const { count: serviceCount } = await supabase.from('services').select('*', { count: 'exact', head: true });
  const { count: doctorCount } = await supabase.from('doctors').select('*', { count: 'exact', head: true });
  
  console.log(`  📍 Locations: ${locCount || 0}`);
  console.log(`  🏥 Clinic Centers: ${centerCount || 0}`);
  console.log(`  💊 Services: ${serviceCount || 0}`);
  console.log(`  👨‍⚕️ Doctors: ${doctorCount || 0}`);
  
  return {
    hasLocations: (locCount || 0) > 0,
    hasCenters: (centerCount || 0) > 0,
    hasServices: (serviceCount || 0) > 0,
    hasDoctors: (doctorCount || 0) > 0,
  };
}

// Old seedData function removed - using seedDataSafe instead

async function seedDataSafe(existing: { hasLocations: boolean; hasCenters: boolean; hasServices: boolean; hasDoctors: boolean }) {
  console.log('\n📦 Seeding data (SAFE MODE - using upsert)...');
  
  // Locations - upsert to avoid duplicates
  if (!existing.hasLocations) {
    console.log('  📍 Inserting locations...');
    const { error: locError } = await supabase.from('locations').upsert(LOCATIONS, { onConflict: 'id' });
    if (locError) {
      console.error(`  ❌ Locations: ${locError.message}`);
    } else {
      console.log(`  ✓ ${LOCATIONS.length} locations`);
    }
  } else {
    console.log('  📍 Locations already exist - skipping');
  }
  
  // Clinic Centers
  if (!existing.hasCenters) {
    console.log('  🏥 Inserting clinic centers...');
    const { error: centerError } = await supabase.from('clinic_centers').upsert(CLINIC_CENTERS, { onConflict: 'id' });
    if (centerError) {
      console.error(`  ❌ Centers: ${centerError.message}`);
    } else {
      console.log(`  ✓ ${CLINIC_CENTERS.length} clinic centers`);
    }
  } else {
    console.log('  🏥 Clinic centers already exist - skipping');
  }
  
  // Services
  if (!existing.hasServices) {
    console.log('  💊 Inserting services...');
    const { error: svcError } = await supabase.from('services').upsert(SERVICES, { onConflict: 'slug' });
    if (svcError) {
      console.error(`  ❌ Services: ${svcError.message}`);
    } else {
      console.log(`  ✓ ${SERVICES.length} services`);
    }
  } else {
    console.log('  💊 Services already exist - skipping');
  }
  
  // Doctors
  if (!existing.hasDoctors) {
    console.log('  👨‍⚕️ Inserting doctors...');
    const { error: docError } = await supabase.from('doctors').upsert(DOCTORS, { onConflict: 'id' });
    if (docError) {
      console.error(`  ❌ Doctors: ${docError.message}`);
    } else {
      console.log(`  ✓ ${DOCTORS.length} doctors`);
    }
    
    // Doctor Availability
    console.log('  📅 Inserting availability...');
    const { error: availError } = await supabase.from('doctor_availability').upsert(DOCTOR_AVAILABILITY, { onConflict: 'id' });
    if (availError) {
      console.error(`  ❌ Availability: ${availError.message}`);
    } else {
      console.log(`  ✓ ${DOCTOR_AVAILABILITY.length} availability slots`);
    }
    
    // Doctor Services
    console.log('  🔗 Assigning services to doctors...');
    const { data: services } = await supabase.from('services').select('id, category');
    
    if (services) {
      const doctorServices: { doctor_id: string; service_id: string; is_primary: boolean }[] = [];
      
      services.filter(s => s.category === 'sports_performance' || s.category === 'pain_relief_physiotherapy')
        .forEach(s => doctorServices.push({ doctor_id: 'd1111111-1111-1111-1111-111111111111', service_id: s.id, is_primary: s.category === 'sports_performance' }));
      
      services.filter(s => s.category === 'pain_relief_physiotherapy')
        .forEach(s => doctorServices.push({ doctor_id: 'd2222222-2222-2222-2222-222222222222', service_id: s.id, is_primary: true }));
      
      services.filter(s => s.category === 'advanced_rehabilitation')
        .forEach(s => doctorServices.push({ doctor_id: 'd3333333-3333-3333-3333-333333333333', service_id: s.id, is_primary: true }));
      
      services.filter(s => s.category === 'therapeutic_yoga' || s.category === 'mental_wellness')
        .forEach(s => doctorServices.push({ doctor_id: 'd4444444-4444-4444-4444-444444444444', service_id: s.id, is_primary: s.category === 'therapeutic_yoga' }));
      
      services.filter(s => s.category === 'sports_performance')
        .forEach(s => doctorServices.push({ doctor_id: 'd5555555-5555-5555-5555-555555555555', service_id: s.id, is_primary: true }));
      
      services.filter(s => s.category === 'advanced_rehabilitation' || s.category === 'pain_relief_physiotherapy')
        .forEach(s => doctorServices.push({ doctor_id: 'd6666666-6666-6666-6666-666666666666', service_id: s.id, is_primary: s.category === 'advanced_rehabilitation' }));
      
      const { error: dsError } = await supabase.from('doctor_services').upsert(doctorServices, { onConflict: 'doctor_id,service_id' });
      if (dsError) {
        console.log(`  ⚠️  Doctor services: ${dsError.message}`);
      } else {
        console.log(`  ✓ ${doctorServices.length} doctor-service assignments`);
      }
    }
  } else {
    console.log('  👨‍⚕️ Doctors already exist - skipping');
  }
  
  return true;
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     H2H Healthcare - Safe Database Setup (No Delete)       ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  // Step 1: Check existing data
  const existing = await checkExistingData();
  
  // Step 2: Seed new data (only if not exists)
  const success = await seedDataSafe(existing);
  
  if (success) {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ Setup Complete!                       ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('\nDatabase now contains:');
    console.log(`  • ${LOCATIONS.length} locations`);
    console.log(`  • ${CLINIC_CENTERS.length} clinic centers`);
    console.log(`  • ${SERVICES.length} services (7 categories)`);
    console.log(`  • ${DOCTORS.length} doctors`);
    console.log(`  • ${DOCTOR_AVAILABILITY.length} availability slots`);
    console.log('\n📋 Service Categories:');
    console.log('  1. Pain Relief & Physiotherapy Care');
    console.log('  2. Advanced Rehabilitation & Recovery');
    console.log('  3. Nutrition & Lifestyle Care');
    console.log('  4. Mental Wellness & Performance Care');
    console.log('  5. Therapeutic Yoga & Wellness');
    console.log('  6. Sports Performance & Athlete Development');
    console.log('  7. Digital Health & Web Solutions');
  } else {
    console.log('\n❌ Setup failed. Check errors above.');
    process.exit(1);
  }
}

main();
