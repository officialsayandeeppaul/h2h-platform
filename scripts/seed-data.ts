/**
 * H2H Healthcare - Comprehensive Database Seed Script
 * 
 * Seeds: locations, clinic_centers, services, doctors (users + profiles),
 *        doctor_availability, doctor_services, patients, appointments, payments
 * 
 * Run: npm run db:seed
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
// SEED DATA
// ============================================

const LOCATIONS = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'H2H Mumbai', city: 'Mumbai', address: 'Andheri West, Mumbai', tier: 1, is_active: true },
  { id: '22222222-2222-2222-2222-222222222222', name: 'H2H Bangalore', city: 'Bangalore', address: 'Koramangala, Bangalore', tier: 1, is_active: true },
  { id: '33333333-3333-3333-3333-333333333333', name: 'H2H Delhi', city: 'Delhi', address: 'Saket, New Delhi', tier: 1, is_active: true },
  { id: '44444444-4444-4444-4444-444444444444', name: 'H2H Pune', city: 'Pune', address: 'Kothrud, Pune', tier: 2, is_active: true },
  { id: '55555555-5555-5555-5555-555555555555', name: 'H2H Hyderabad', city: 'Hyderabad', address: 'Banjara Hills, Hyderabad', tier: 1, is_active: true },
  { id: '66666666-6666-6666-6666-666666666666', name: 'H2H Jaipur', city: 'Jaipur', address: 'Malviya Nagar, Jaipur', tier: 2, is_active: true },
  { id: '77777777-7777-7777-7777-777777777777', name: 'H2H Kolkata', city: 'Kolkata', address: 'Salt Lake City, Kolkata', tier: 2, is_active: true },
  { id: '88888888-8888-8888-8888-888888888888', name: 'H2H Chennai', city: 'Chennai', address: 'T Nagar, Chennai', tier: 1, is_active: true },
];

const CLINIC_CENTERS = [
  { id: 'c1111111-1111-1111-1111-111111111111', location_id: '11111111-1111-1111-1111-111111111111', name: 'H2H Andheri West', slug: 'h2h-andheri-west', address: 'Shop 12, Lokhandwala Complex, Andheri West', pincode: '400058', phone: '+91 98765 43210', email: 'andheri@healtohealth.in', facilities: ['Parking', 'Wheelchair Access', 'Pharmacy'], rating: 4.8, total_reviews: 245, is_featured: true, is_active: true },
  { id: 'c1111111-1111-1111-1111-111111111112', location_id: '11111111-1111-1111-1111-111111111111', name: 'H2H Bandra', slug: 'h2h-bandra', address: '15, Hill Road, Bandra West', pincode: '400050', phone: '+91 98765 43218', email: 'bandra@healtohealth.in', facilities: ['Parking', 'Wheelchair Access'], rating: 4.7, total_reviews: 189, is_featured: true, is_active: true },
  { id: 'c2222222-2222-2222-2222-222222222221', location_id: '22222222-2222-2222-2222-222222222222', name: 'H2H Koramangala', slug: 'h2h-koramangala', address: '80 Feet Road, Koramangala 4th Block', pincode: '560034', phone: '+91 98765 43211', email: 'koramangala@healtohealth.in', facilities: ['Parking', 'Wheelchair Access', 'Gym'], rating: 4.9, total_reviews: 312, is_featured: true, is_active: true },
  { id: 'c2222222-2222-2222-2222-222222222222', location_id: '22222222-2222-2222-2222-222222222222', name: 'H2H Indiranagar', slug: 'h2h-indiranagar', address: '100 Feet Road, Indiranagar', pincode: '560038', phone: '+91 98765 43219', email: 'indiranagar@healtohealth.in', facilities: ['Parking', 'Wheelchair Access'], rating: 4.6, total_reviews: 156, is_featured: false, is_active: true },
  { id: 'c3333333-3333-3333-3333-333333333331', location_id: '33333333-3333-3333-3333-333333333333', name: 'H2H Saket', slug: 'h2h-saket', address: 'B-12, Select Citywalk Mall, Saket', pincode: '110017', phone: '+91 98765 43212', email: 'saket@healtohealth.in', facilities: ['Parking', 'Wheelchair Access', 'Pharmacy', 'Gym'], rating: 4.9, total_reviews: 428, is_featured: true, is_active: true },
  { id: 'c4444444-4444-4444-4444-444444444441', location_id: '44444444-4444-4444-4444-444444444444', name: 'H2H Kothrud', slug: 'h2h-kothrud', address: '45, Paud Road, Kothrud', pincode: '411038', phone: '+91 98765 43213', email: 'kothrud@healtohealth.in', facilities: ['Parking', 'Wheelchair Access'], rating: 4.7, total_reviews: 167, is_featured: true, is_active: true },
  { id: 'c5555555-5555-5555-5555-555555555551', location_id: '55555555-5555-5555-5555-555555555555', name: 'H2H Banjara Hills', slug: 'h2h-banjara-hills', address: 'Road No. 12, Banjara Hills', pincode: '500034', phone: '+91 98765 43214', email: 'banjarahills@healtohealth.in', facilities: ['Parking', 'Wheelchair Access', 'Gym'], rating: 4.8, total_reviews: 234, is_featured: true, is_active: true },
  { id: 'c6666666-6666-6666-6666-666666666661', location_id: '66666666-6666-6666-6666-666666666666', name: 'H2H Malviya Nagar', slug: 'h2h-malviya-nagar-jaipur', address: 'D-45, Malviya Nagar', pincode: '302017', phone: '+91 98765 43215', email: 'malviyanagar@healtohealth.in', facilities: ['Parking'], rating: 4.6, total_reviews: 89, is_featured: false, is_active: true },
  { id: 'c7777777-7777-7777-7777-777777777771', location_id: '77777777-7777-7777-7777-777777777777', name: 'H2H Salt Lake', slug: 'h2h-salt-lake', address: 'Sector V, Salt Lake City', pincode: '700091', phone: '+91 98765 43216', email: 'saltlake@healtohealth.in', facilities: ['Parking', 'Wheelchair Access'], rating: 4.7, total_reviews: 145, is_featured: true, is_active: true },
  { id: 'c8888888-8888-8888-8888-888888888881', location_id: '88888888-8888-8888-8888-888888888888', name: 'H2H T Nagar', slug: 'h2h-t-nagar', address: '23, Usman Road, T Nagar', pincode: '600017', phone: '+91 98765 43217', email: 'tnagar@healtohealth.in', facilities: ['Parking', 'Wheelchair Access', 'Pharmacy'], rating: 4.8, total_reviews: 198, is_featured: true, is_active: true },
];

const SERVICES = [
  // Pain Relief & Physiotherapy (6)
  { name: 'Back Pain Treatment', slug: 'back-pain-treatment', category: 'pain_relief_physiotherapy', description: 'Expert treatment for chronic and acute back pain', duration_minutes: 45, tier1_price: 1200, tier2_price: 800, online_available: true, offline_available: true, home_visit_available: true, is_active: true },
  { name: 'Neck Pain & Cervical Care', slug: 'neck-pain-cervical-care', category: 'pain_relief_physiotherapy', description: 'Specialized care for neck pain and cervical spondylosis', duration_minutes: 45, tier1_price: 1200, tier2_price: 800, online_available: true, offline_available: true, home_visit_available: true, is_active: true },
  { name: 'Joint Pain Management', slug: 'joint-pain-management', category: 'pain_relief_physiotherapy', description: 'Treatment for knee, shoulder, hip and other joint pain', duration_minutes: 45, tier1_price: 1300, tier2_price: 900, online_available: true, offline_available: true, home_visit_available: true, is_active: true },
  { name: 'Sciatica Treatment', slug: 'sciatica-treatment', category: 'pain_relief_physiotherapy', description: 'Targeted therapy for sciatic nerve pain', duration_minutes: 45, tier1_price: 1400, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: true, is_active: true },
  { name: 'Frozen Shoulder Treatment', slug: 'frozen-shoulder-treatment', category: 'pain_relief_physiotherapy', description: 'Treatment for adhesive capsulitis', duration_minutes: 45, tier1_price: 1300, tier2_price: 900, online_available: false, offline_available: true, home_visit_available: true, is_active: true },
  { name: 'Arthritis Care', slug: 'arthritis-care', category: 'pain_relief_physiotherapy', description: 'Physiotherapy for osteoarthritis and rheumatoid arthritis', duration_minutes: 45, tier1_price: 1400, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: true, is_active: true },

  // Advanced Rehabilitation (6)
  { name: 'Post-Surgery Rehabilitation', slug: 'post-surgery-rehabilitation', category: 'advanced_rehabilitation', description: 'Rehabilitation after orthopedic surgeries', duration_minutes: 60, tier1_price: 1800, tier2_price: 1200, online_available: false, offline_available: true, home_visit_available: true, is_active: true },
  { name: 'Stroke Rehabilitation', slug: 'stroke-rehabilitation', category: 'advanced_rehabilitation', description: 'Physiotherapy for stroke recovery', duration_minutes: 60, tier1_price: 2000, tier2_price: 1500, online_available: false, offline_available: true, home_visit_available: true, is_active: true },
  { name: 'Spinal Cord Injury Rehab', slug: 'spinal-cord-injury-rehab', category: 'advanced_rehabilitation', description: 'Rehabilitation for spinal cord injuries', duration_minutes: 60, tier1_price: 2200, tier2_price: 1800, online_available: false, offline_available: true, home_visit_available: true, is_active: true },
  { name: 'ACL Reconstruction Rehab', slug: 'acl-reconstruction-rehab', category: 'advanced_rehabilitation', description: 'Recovery program for ACL reconstruction', duration_minutes: 60, tier1_price: 1800, tier2_price: 1400, online_available: false, offline_available: true, home_visit_available: true, is_active: true },
  { name: 'Total Knee Replacement Rehab', slug: 'total-knee-replacement-rehab', category: 'advanced_rehabilitation', description: 'Post-operative knee replacement rehab', duration_minutes: 60, tier1_price: 1800, tier2_price: 1400, online_available: false, offline_available: true, home_visit_available: true, is_active: true },
  { name: 'Geriatric Rehabilitation', slug: 'geriatric-rehabilitation', category: 'advanced_rehabilitation', description: 'Specialized care for elderly patients', duration_minutes: 45, tier1_price: 1500, tier2_price: 1000, online_available: false, offline_available: true, home_visit_available: true, is_active: true },

  // Nutrition & Lifestyle (5)
  { name: 'Sports Nutrition Consultation', slug: 'sports-nutrition-consultation', category: 'nutrition_lifestyle', description: 'Nutrition plans for athletes', duration_minutes: 45, tier1_price: 1500, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Weight Management Program', slug: 'weight-management-program', category: 'nutrition_lifestyle', description: 'Weight loss/gain program with diet guidance', duration_minutes: 45, tier1_price: 1200, tier2_price: 800, online_available: true, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Diabetes Nutrition Care', slug: 'diabetes-nutrition-care', category: 'nutrition_lifestyle', description: 'Diet planning for diabetes management', duration_minutes: 45, tier1_price: 1300, tier2_price: 900, online_available: true, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Heart Health Nutrition', slug: 'heart-health-nutrition', category: 'nutrition_lifestyle', description: 'Cardiac-friendly diet planning', duration_minutes: 45, tier1_price: 1300, tier2_price: 900, online_available: true, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Lifestyle Modification Coaching', slug: 'lifestyle-modification-coaching', category: 'nutrition_lifestyle', description: 'Holistic lifestyle coaching', duration_minutes: 60, tier1_price: 1500, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: false, is_active: true },

  // Mental Wellness (5)
  { name: 'Sports Psychology Consultation', slug: 'sports-psychology-consultation', category: 'mental_wellness', description: 'Mental performance coaching for athletes', duration_minutes: 60, tier1_price: 2000, tier2_price: 1500, online_available: true, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Stress & Anxiety Management', slug: 'stress-anxiety-management', category: 'mental_wellness', description: 'Sessions for stress and anxiety management', duration_minutes: 45, tier1_price: 1500, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Performance Enhancement Coaching', slug: 'performance-enhancement-coaching', category: 'mental_wellness', description: 'Mental conditioning for peak performance', duration_minutes: 60, tier1_price: 1800, tier2_price: 1200, online_available: true, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Sleep Disorder Consultation', slug: 'sleep-disorder-consultation', category: 'mental_wellness', description: 'Assessment of sleep-related issues', duration_minutes: 45, tier1_price: 1400, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Mindfulness & Meditation Therapy', slug: 'mindfulness-meditation-therapy', category: 'mental_wellness', description: 'Guided mindfulness and meditation', duration_minutes: 45, tier1_price: 1000, tier2_price: 700, online_available: true, offline_available: true, home_visit_available: false, is_active: true },

  // Therapeutic Yoga (6)
  { name: 'Therapeutic Yoga', slug: 'therapeutic-yoga', category: 'therapeutic_yoga', description: 'Yoga for healing and rehabilitation', duration_minutes: 60, tier1_price: 800, tier2_price: 500, online_available: true, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Prenatal Yoga', slug: 'prenatal-yoga', category: 'therapeutic_yoga', description: 'Safe yoga for expecting mothers', duration_minutes: 45, tier1_price: 1000, tier2_price: 700, online_available: true, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Senior Yoga', slug: 'senior-yoga', category: 'therapeutic_yoga', description: 'Gentle yoga for older adults', duration_minutes: 45, tier1_price: 700, tier2_price: 500, online_available: true, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Yoga for Back Pain', slug: 'yoga-for-back-pain', category: 'therapeutic_yoga', description: 'Yoga sequences for back pain relief', duration_minutes: 45, tier1_price: 900, tier2_price: 600, online_available: true, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Breathwork & Pranayama', slug: 'breathwork-pranayama', category: 'therapeutic_yoga', description: 'Advanced breathing techniques', duration_minutes: 45, tier1_price: 700, tier2_price: 500, online_available: true, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Corporate Wellness Yoga', slug: 'corporate-wellness-yoga', category: 'therapeutic_yoga', description: 'Group yoga for corporates', duration_minutes: 60, tier1_price: 5000, tier2_price: 3500, online_available: true, offline_available: true, home_visit_available: false, is_active: true },

  // Sports Performance (6)
  { name: 'Sports Injury Assessment', slug: 'sports-injury-assessment', category: 'sports_performance', description: 'Evaluation of sports injuries', duration_minutes: 60, tier1_price: 1500, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Biomechanical Analysis', slug: 'biomechanical-analysis', category: 'sports_performance', description: 'Movement analysis for performance', duration_minutes: 90, tier1_price: 3000, tier2_price: 2500, online_available: false, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Athletic Performance Testing', slug: 'athletic-performance-testing', category: 'sports_performance', description: 'Fitness assessment for athletes', duration_minutes: 90, tier1_price: 2500, tier2_price: 2000, online_available: false, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Sports-Specific Training', slug: 'sports-specific-training', category: 'sports_performance', description: 'Customized training programs', duration_minutes: 60, tier1_price: 2000, tier2_price: 1500, online_available: false, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Injury Prevention Program', slug: 'injury-prevention-program', category: 'sports_performance', description: 'Proactive injury prevention', duration_minutes: 60, tier1_price: 1800, tier2_price: 1200, online_available: true, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Return to Sport Assessment', slug: 'return-to-sport-assessment', category: 'sports_performance', description: 'Safe return to sports evaluation', duration_minutes: 60, tier1_price: 2000, tier2_price: 1500, online_available: false, offline_available: true, home_visit_available: false, is_active: true },

  // Digital Health (5)
  { name: 'Tele-Rehabilitation', slug: 'tele-rehabilitation', category: 'digital_health', description: 'Remote physiotherapy sessions', duration_minutes: 45, tier1_price: 800, tier2_price: 600, online_available: true, offline_available: false, home_visit_available: false, is_active: true },
  { name: 'Virtual Fitness Assessment', slug: 'virtual-fitness-assessment', category: 'digital_health', description: 'Online fitness assessment', duration_minutes: 45, tier1_price: 700, tier2_price: 500, online_available: true, offline_available: false, home_visit_available: false, is_active: true },
  { name: 'Digital Health Monitoring', slug: 'digital-health-monitoring', category: 'digital_health', description: 'Remote health tracking', duration_minutes: 30, tier1_price: 500, tier2_price: 400, online_available: true, offline_available: false, home_visit_available: false, is_active: true },
  { name: 'Online Second Opinion', slug: 'online-second-opinion', category: 'digital_health', description: 'Expert second opinion online', duration_minutes: 30, tier1_price: 1000, tier2_price: 800, online_available: true, offline_available: false, home_visit_available: false, is_active: true },
  { name: 'Home Exercise Program Design', slug: 'home-exercise-program-design', category: 'digital_health', description: 'Customized home exercise programs', duration_minutes: 45, tier1_price: 600, tier2_price: 400, online_available: true, offline_available: false, home_visit_available: false, is_active: true },
];

// Doctor user IDs and doctor profile IDs
const DOCTOR_USERS = [
  { id: 'a0d01111-1111-1111-1111-111111111111', email: 'rajesh.kumar@healtohealth.in', full_name: 'Dr. Rajesh Kumar', phone: '+91 98765 11111', avatar_url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=rajesh&backgroundColor=b6e3f4', role: 'doctor', is_active: true },
  { id: 'a0d02222-2222-2222-2222-222222222222', email: 'priya.sharma@healtohealth.in', full_name: 'Dr. Priya Sharma', phone: '+91 98765 22222', avatar_url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=priya&backgroundColor=c0aede', role: 'doctor', is_active: true },
  { id: 'a0d03333-3333-3333-3333-333333333333', email: 'amit.patel@healtohealth.in', full_name: 'Dr. Amit Patel', phone: '+91 98765 33333', avatar_url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=amit&backgroundColor=d1d4f9', role: 'doctor', is_active: true },
  { id: 'a0d04444-4444-4444-4444-444444444444', email: 'sneha.reddy@healtohealth.in', full_name: 'Dr. Sneha Reddy', phone: '+91 98765 44444', avatar_url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=sneha&backgroundColor=ffd5dc', role: 'doctor', is_active: true },
  { id: 'a0d05555-5555-5555-5555-555555555555', email: 'vikram.singh@healtohealth.in', full_name: 'Dr. Vikram Singh', phone: '+91 98765 55555', avatar_url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=vikram&backgroundColor=b6e3f4', role: 'doctor', is_active: true },
  { id: 'a0d06666-6666-6666-6666-666666666666', email: 'meera.nair@healtohealth.in', full_name: 'Dr. Meera Nair', phone: '+91 98765 66666', avatar_url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=meera&backgroundColor=c0aede', role: 'doctor', is_active: true },
];

const DOCTORS = [
  { id: 'd1111111-1111-1111-1111-111111111111', user_id: 'a0d01111-1111-1111-1111-111111111111', location_id: '11111111-1111-1111-1111-111111111111', specializations: ['Sports Physiotherapy', 'Pain Relief'], qualifications: ['BPT', 'MPT (Sports)', 'CSCS'], experience_years: 12, bio: 'Renowned sports physiotherapist with 12+ years experience working with professional athletes.', consultation_fee: 1500, rating: 4.9, total_reviews: 245, google_meet_enabled: true, is_active: true },
  { id: 'd2222222-2222-2222-2222-222222222222', user_id: 'a0d02222-2222-2222-2222-222222222222', location_id: '22222222-2222-2222-2222-222222222222', specializations: ['Pain Management', 'Orthopedic Physiotherapy'], qualifications: ['BPT', 'MPT (Ortho)', 'Pain Specialist'], experience_years: 10, bio: 'Specializes in chronic pain management using evidence-based techniques.', consultation_fee: 1200, rating: 4.8, total_reviews: 189, google_meet_enabled: true, is_active: true },
  { id: 'd3333333-3333-3333-3333-333333333333', user_id: 'a0d03333-3333-3333-3333-333333333333', location_id: '33333333-3333-3333-3333-333333333333', specializations: ['Neurological Rehabilitation', 'Stroke Recovery'], qualifications: ['BPT', 'MPT (Neuro)', 'NDT Certified'], experience_years: 15, bio: 'Expert in neurological rehabilitation with extensive stroke recovery experience.', consultation_fee: 1800, rating: 4.9, total_reviews: 312, google_meet_enabled: false, is_active: true },
  { id: 'd4444444-4444-4444-4444-444444444444', user_id: 'a0d04444-4444-4444-4444-444444444444', location_id: '55555555-5555-5555-5555-555555555555', specializations: ['Yoga Therapy', 'Mental Wellness'], qualifications: ['BPT', 'MSc Yoga', 'Certified Yoga Therapist'], experience_years: 8, bio: 'Combines traditional yoga with modern physiotherapy for holistic healing.', consultation_fee: 1000, rating: 4.7, total_reviews: 156, google_meet_enabled: true, is_active: true },
  { id: 'd5555555-5555-5555-5555-555555555555', user_id: 'a0d05555-5555-5555-5555-555555555555', location_id: '11111111-1111-1111-1111-111111111111', specializations: ['Sports Performance', 'Athletic Training'], qualifications: ['BPT', 'MPT (Sports)', 'CSCS', 'PES'], experience_years: 14, bio: 'Sports performance specialist who has worked with national athletes and IPL teams.', consultation_fee: 2000, rating: 4.9, total_reviews: 428, google_meet_enabled: true, is_active: true },
  { id: 'd6666666-6666-6666-6666-666666666666', user_id: 'a0d06666-6666-6666-6666-666666666666', location_id: '88888888-8888-8888-8888-888888888888', specializations: ['Geriatric Physiotherapy', 'Fall Prevention'], qualifications: ['BPT', 'MPT (Geriatrics)'], experience_years: 11, bio: 'Specializes in elderly care focusing on mobility and fall prevention.', consultation_fee: 1200, rating: 4.8, total_reviews: 198, google_meet_enabled: true, is_active: true },
];

const DOCTOR_AVAILABILITY = [
  // Dr. Rajesh - Mumbai (Mon-Fri clinic, Sat online)
  { doctor_id: 'd1111111-1111-1111-1111-111111111111', center_id: 'c1111111-1111-1111-1111-111111111111', day_of_week: 1, start_time: '09:00', end_time: '17:00', mode: 'both' },
  { doctor_id: 'd1111111-1111-1111-1111-111111111111', center_id: 'c1111111-1111-1111-1111-111111111111', day_of_week: 2, start_time: '09:00', end_time: '17:00', mode: 'both' },
  { doctor_id: 'd1111111-1111-1111-1111-111111111111', center_id: 'c1111111-1111-1111-1111-111111111111', day_of_week: 3, start_time: '09:00', end_time: '17:00', mode: 'both' },
  { doctor_id: 'd1111111-1111-1111-1111-111111111111', center_id: 'c1111111-1111-1111-1111-111111111111', day_of_week: 4, start_time: '09:00', end_time: '17:00', mode: 'both' },
  { doctor_id: 'd1111111-1111-1111-1111-111111111111', center_id: 'c1111111-1111-1111-1111-111111111111', day_of_week: 5, start_time: '09:00', end_time: '17:00', mode: 'both' },
  { doctor_id: 'd1111111-1111-1111-1111-111111111111', center_id: null, day_of_week: 6, start_time: '10:00', end_time: '14:00', mode: 'online' },

  // Dr. Priya - Bangalore (Mon-Fri)
  { doctor_id: 'd2222222-2222-2222-2222-222222222222', center_id: 'c2222222-2222-2222-2222-222222222221', day_of_week: 1, start_time: '10:00', end_time: '18:00', mode: 'both' },
  { doctor_id: 'd2222222-2222-2222-2222-222222222222', center_id: 'c2222222-2222-2222-2222-222222222221', day_of_week: 2, start_time: '10:00', end_time: '18:00', mode: 'both' },
  { doctor_id: 'd2222222-2222-2222-2222-222222222222', center_id: 'c2222222-2222-2222-2222-222222222221', day_of_week: 3, start_time: '10:00', end_time: '18:00', mode: 'both' },
  { doctor_id: 'd2222222-2222-2222-2222-222222222222', center_id: 'c2222222-2222-2222-2222-222222222221', day_of_week: 4, start_time: '10:00', end_time: '18:00', mode: 'both' },
  { doctor_id: 'd2222222-2222-2222-2222-222222222222', center_id: 'c2222222-2222-2222-2222-222222222221', day_of_week: 5, start_time: '10:00', end_time: '18:00', mode: 'both' },

  // Dr. Amit - Delhi (Mon-Fri offline only)
  { doctor_id: 'd3333333-3333-3333-3333-333333333333', center_id: 'c3333333-3333-3333-3333-333333333331', day_of_week: 1, start_time: '09:00', end_time: '17:00', mode: 'offline' },
  { doctor_id: 'd3333333-3333-3333-3333-333333333333', center_id: 'c3333333-3333-3333-3333-333333333331', day_of_week: 2, start_time: '09:00', end_time: '17:00', mode: 'offline' },
  { doctor_id: 'd3333333-3333-3333-3333-333333333333', center_id: 'c3333333-3333-3333-3333-333333333331', day_of_week: 3, start_time: '09:00', end_time: '17:00', mode: 'offline' },
  { doctor_id: 'd3333333-3333-3333-3333-333333333333', center_id: 'c3333333-3333-3333-3333-333333333331', day_of_week: 4, start_time: '09:00', end_time: '17:00', mode: 'offline' },
  { doctor_id: 'd3333333-3333-3333-3333-333333333333', center_id: 'c3333333-3333-3333-3333-333333333331', day_of_week: 5, start_time: '09:00', end_time: '17:00', mode: 'offline' },

  // Dr. Sneha - Hyderabad (Mon-Wed clinic, Thu-Fri online)
  { doctor_id: 'd4444444-4444-4444-4444-444444444444', center_id: 'c5555555-5555-5555-5555-555555555551', day_of_week: 1, start_time: '08:00', end_time: '14:00', mode: 'both' },
  { doctor_id: 'd4444444-4444-4444-4444-444444444444', center_id: 'c5555555-5555-5555-5555-555555555551', day_of_week: 2, start_time: '08:00', end_time: '14:00', mode: 'both' },
  { doctor_id: 'd4444444-4444-4444-4444-444444444444', center_id: 'c5555555-5555-5555-5555-555555555551', day_of_week: 3, start_time: '08:00', end_time: '14:00', mode: 'both' },
  { doctor_id: 'd4444444-4444-4444-4444-444444444444', center_id: null, day_of_week: 4, start_time: '08:00', end_time: '14:00', mode: 'online' },
  { doctor_id: 'd4444444-4444-4444-4444-444444444444', center_id: null, day_of_week: 5, start_time: '08:00', end_time: '14:00', mode: 'online' },

  // Dr. Vikram - Mumbai & Bangalore (alternating)
  { doctor_id: 'd5555555-5555-5555-5555-555555555555', center_id: 'c1111111-1111-1111-1111-111111111111', day_of_week: 1, start_time: '14:00', end_time: '20:00', mode: 'offline' },
  { doctor_id: 'd5555555-5555-5555-5555-555555555555', center_id: 'c2222222-2222-2222-2222-222222222221', day_of_week: 2, start_time: '10:00', end_time: '18:00', mode: 'offline' },
  { doctor_id: 'd5555555-5555-5555-5555-555555555555', center_id: 'c1111111-1111-1111-1111-111111111111', day_of_week: 3, start_time: '14:00', end_time: '20:00', mode: 'offline' },
  { doctor_id: 'd5555555-5555-5555-5555-555555555555', center_id: 'c2222222-2222-2222-2222-222222222221', day_of_week: 4, start_time: '10:00', end_time: '18:00', mode: 'offline' },
  { doctor_id: 'd5555555-5555-5555-5555-555555555555', center_id: null, day_of_week: 5, start_time: '09:00', end_time: '17:00', mode: 'online' },

  // Dr. Meera - Chennai (Mon-Fri)
  { doctor_id: 'd6666666-6666-6666-6666-666666666666', center_id: 'c8888888-8888-8888-8888-888888888881', day_of_week: 1, start_time: '09:00', end_time: '17:00', mode: 'both' },
  { doctor_id: 'd6666666-6666-6666-6666-666666666666', center_id: 'c8888888-8888-8888-8888-888888888881', day_of_week: 2, start_time: '09:00', end_time: '17:00', mode: 'both' },
  { doctor_id: 'd6666666-6666-6666-6666-666666666666', center_id: 'c8888888-8888-8888-8888-888888888881', day_of_week: 3, start_time: '09:00', end_time: '17:00', mode: 'both' },
  { doctor_id: 'd6666666-6666-6666-6666-666666666666', center_id: 'c8888888-8888-8888-8888-888888888881', day_of_week: 4, start_time: '09:00', end_time: '17:00', mode: 'both' },
  { doctor_id: 'd6666666-6666-6666-6666-666666666666', center_id: 'c8888888-8888-8888-8888-888888888881', day_of_week: 5, start_time: '09:00', end_time: '17:00', mode: 'both' },
];

const PATIENTS = [
  { id: 'b0a01111-1111-1111-1111-111111111111', email: 'rahul.sharma@example.com', full_name: 'Rahul Sharma', phone: '+91 91234 56701', role: 'patient', is_active: true },
  { id: 'b0a02222-2222-2222-2222-222222222222', email: 'anita.desai@example.com', full_name: 'Anita Desai', phone: '+91 91234 56702', role: 'patient', is_active: true },
  { id: 'b0a03333-3333-3333-3333-333333333333', email: 'vikash.kumar@example.com', full_name: 'Vikash Kumar', phone: '+91 91234 56703', role: 'patient', is_active: true },
  { id: 'b0a04444-4444-4444-4444-444444444444', email: 'priyanka.joshi@example.com', full_name: 'Priyanka Joshi', phone: '+91 91234 56704', role: 'patient', is_active: true },
  { id: 'b0a05555-5555-5555-5555-555555555555', email: 'suresh.menon@example.com', full_name: 'Suresh Menon', phone: '+91 91234 56705', role: 'patient', is_active: true },
  { id: 'b0a06666-6666-6666-6666-666666666666', email: 'deepika.singh@example.com', full_name: 'Deepika Singh', phone: '+91 91234 56706', role: 'patient', is_active: true },
  { id: 'b0a07777-7777-7777-7777-777777777777', email: 'arjun.nair@example.com', full_name: 'Arjun Nair', phone: '+91 91234 56707', role: 'patient', is_active: true },
  { id: 'b0a08888-8888-8888-8888-888888888888', email: 'kavita.reddy@example.com', full_name: 'Kavita Reddy', phone: '+91 91234 56708', role: 'patient', is_active: true },
];

// ============================================
// MAIN SEED FUNCTION
// ============================================

async function deleteAllData() {
  console.log('\n🗑️  Deleting ALL existing data (clean slate)...');
  
  // Tables with created_at column
  const tablesWithCreatedAt = ['payments', 'appointments', 'doctors', 'services', 'clinic_centers', 'locations'];
  // Tables without created_at - use different delete strategy
  const tablesWithoutCreatedAt = ['doctor_services', 'doctor_availability'];
  
  for (const t of tablesWithoutCreatedAt) {
    const { error } = await supabase.from(t).delete().gte('doctor_id', '00000000-0000-0000-0000-000000000000');
    if (error) console.log(`  ⚠️  ${t}: ${error.message}`);
    else console.log(`  ✅ ${t} cleared`);
  }
  
  for (const t of tablesWithCreatedAt) {
    const { error } = await supabase.from(t).delete().gte('created_at', '1970-01-01');
    if (error) console.log(`  ⚠️  ${t}: ${error.message}`);
    else console.log(`  ✅ ${t} cleared`);
  }
  
  // Delete non-super_admin users (keep your own account)
  const { error: uErr } = await supabase.from('users').delete().neq('role', 'super_admin');
  if (uErr) console.log(`  ⚠️  users: ${uErr.message}`);
  else console.log('  ✅ users cleared (kept super_admin)');
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   H2H Healthcare - DELETE ALL + FRESH SEED              ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  // STEP 0: Delete everything
  await deleteAllData();

  // 1. Locations
  console.log('\n📍 Step 1: Seeding locations...');
  const { error: locErr } = await supabase.from('locations').insert(LOCATIONS);
  if (locErr) console.error('  ❌ Locations:', locErr.message);
  else console.log(`  ✅ ${LOCATIONS.length} locations`);

  // 2. Clinic Centers
  console.log('🏥 Step 2: Seeding clinic centers...');
  const { error: centerErr } = await supabase.from('clinic_centers').insert(CLINIC_CENTERS);
  if (centerErr) console.error('  ❌ Centers:', centerErr.message);
  else console.log(`  ✅ ${CLINIC_CENTERS.length} clinic centers`);

  // 3. Services
  console.log('💊 Step 3: Seeding services...');
  const { error: svcErr } = await supabase.from('services').insert(SERVICES);
  if (svcErr) {
    console.error('  ❌ Services:', svcErr.message);
    if (svcErr.message.includes('category')) {
      console.log('  Run this SQL in Supabase SQL Editor, then re-run seed:');
      console.log(`ALTER TABLE services DROP CONSTRAINT IF EXISTS services_category_check;`);
      console.log(`DO $$ BEGIN ALTER TABLE services ALTER COLUMN category TYPE TEXT; EXCEPTION WHEN others THEN NULL; END $$;`);
    }
  } else {
    console.log(`  ✅ ${SERVICES.length} services across 7 categories`);
  }

  // 4. Doctor Users
  console.log('👤 Step 4: Seeding doctor user accounts...');
  const { error: duErr } = await supabase.from('users').insert(DOCTOR_USERS);
  if (duErr) console.error('  ❌ Doctor users:', duErr.message);
  else console.log(`  ✅ ${DOCTOR_USERS.length} doctor user accounts`);

  // 5. Doctor Profiles
  console.log('👨‍⚕️ Step 5: Seeding doctor profiles...');
  const { error: docErr } = await supabase.from('doctors').insert(DOCTORS);
  if (docErr) console.error('  ❌ Doctors:', docErr.message);
  else console.log(`  ✅ ${DOCTORS.length} doctor profiles`);

  // 6. Doctor Availability
  console.log('📅 Step 6: Seeding doctor availability...');
  const { error: availErr } = await supabase.from('doctor_availability').insert(DOCTOR_AVAILABILITY);
  if (availErr) console.error('  ❌ Availability:', availErr.message);
  else console.log(`  ✅ ${DOCTOR_AVAILABILITY.length} availability slots`);

  // 7. Doctor-Service Mappings
  console.log('🔗 Step 7: Seeding doctor-service mappings...');
  const { data: allServices } = await supabase.from('services').select('id, category');
  if (allServices && allServices.length > 0) {
    const ds: any[] = [];

    // Dr. Rajesh: Sports + Pain Relief
    allServices.filter(s => s.category === 'sports_performance' || s.category === 'pain_relief_physiotherapy')
      .forEach(s => ds.push({ doctor_id: 'd1111111-1111-1111-1111-111111111111', service_id: s.id }));

    // Dr. Priya: Pain Relief + Nutrition
    allServices.filter(s => s.category === 'pain_relief_physiotherapy' || s.category === 'nutrition_lifestyle')
      .forEach(s => ds.push({ doctor_id: 'd2222222-2222-2222-2222-222222222222', service_id: s.id }));

    // Dr. Amit: Advanced Rehab
    allServices.filter(s => s.category === 'advanced_rehabilitation')
      .forEach(s => ds.push({ doctor_id: 'd3333333-3333-3333-3333-333333333333', service_id: s.id }));

    // Dr. Sneha: Yoga + Mental Wellness
    allServices.filter(s => s.category === 'therapeutic_yoga' || s.category === 'mental_wellness')
      .forEach(s => ds.push({ doctor_id: 'd4444444-4444-4444-4444-444444444444', service_id: s.id }));

    // Dr. Vikram: Sports Performance + Digital Health
    allServices.filter(s => s.category === 'sports_performance' || s.category === 'digital_health')
      .forEach(s => ds.push({ doctor_id: 'd5555555-5555-5555-5555-555555555555', service_id: s.id }));

    // Dr. Meera: Advanced Rehab + Pain Relief
    allServices.filter(s => s.category === 'advanced_rehabilitation' || s.category === 'pain_relief_physiotherapy')
      .forEach(s => ds.push({ doctor_id: 'd6666666-6666-6666-6666-666666666666', service_id: s.id }));

    const { error: dsErr } = await supabase.from('doctor_services').insert(ds);
    if (dsErr) console.error('  ❌ Doctor services:', dsErr.message);
    else console.log(`  ✅ ${ds.length} doctor-service mappings`);
  }

  // 8. Patient Users
  console.log('🧑 Step 8: Seeding patient users...');
  const { error: patErr } = await supabase.from('users').insert(PATIENTS);
  if (patErr) console.error('  ❌ Patients:', patErr.message);
  else console.log(`  ✅ ${PATIENTS.length} patient users`);

  // 9. Appointments (matches db-setup.ts schema: center_id, no payment_status, no metadata)
  console.log('📋 Step 9: Seeding appointments...');
  const { data: svcList } = await supabase.from('services').select('id, name, category, tier1_price');
  if (svcList && svcList.length > 0) {
    const today = new Date();
    const appointments: any[] = [];
    const modes = ['online', 'offline'];
    // Map doctors to their location IDs for offline appointments
    const doctorLocations: Record<string, string> = {
      'd1111111-1111-1111-1111-111111111111': '11111111-1111-1111-1111-111111111111',
      'd2222222-2222-2222-2222-222222222222': '22222222-2222-2222-2222-222222222222',
      'd3333333-3333-3333-3333-333333333333': '33333333-3333-3333-3333-333333333333',
      'd4444444-4444-4444-4444-444444444444': '55555555-5555-5555-5555-555555555555',
      'd5555555-5555-5555-5555-555555555555': '11111111-1111-1111-1111-111111111111',
      'd6666666-6666-6666-6666-666666666666': '88888888-8888-8888-8888-888888888888',
    };
    const doctorIds = DOCTORS.map(d => d.id);
    let aptIdx = 0;

    for (let dayOff = -14; dayOff <= 14; dayOff++) {
      const date = new Date(today);
      date.setDate(date.getDate() + dayOff);
      const dateStr = date.toISOString().split('T')[0];
      const aptsPerDay = dayOff === 0 ? 3 : (Math.abs(dayOff) <= 3 ? 2 : 1);

      for (let j = 0; j < aptsPerDay; j++) {
        const patIdx = aptIdx % PATIENTS.length;
        const docIdx = aptIdx % doctorIds.length;
        const svcIdx = aptIdx % svcList.length;
        const mode = modes[aptIdx % modes.length];
        const hour = 9 + (j * 2);

        let status: string;
        let paymentStatus: string;
        if (dayOff < -3) {
          status = aptIdx % 5 === 0 ? 'cancelled' : 'completed';
          paymentStatus = status === 'cancelled' ? 'failed' : 'paid';
        } else if (dayOff < 0) {
          const opts = ['pending', 'confirmed', 'completed'];
          status = opts[aptIdx % 3];
          paymentStatus = status === 'completed' ? 'paid' : 'pending';
        } else if (dayOff === 0) {
          status = j === 0 ? 'confirmed' : (j === 1 ? 'pending' : 'confirmed');
          paymentStatus = 'paid';
        } else {
          status = aptIdx % 3 === 0 ? 'pending' : 'confirmed';
          paymentStatus = aptIdx % 4 === 0 ? 'pending' : 'paid';
        }

        const amount = (svcList[svcIdx] as any).tier1_price || 1200;
        const doctorId = doctorIds[docIdx];
        const locationId = mode === 'offline' ? (doctorLocations[doctorId] || null) : null;

        appointments.push({
          patient_id: PATIENTS[patIdx].id,
          doctor_id: doctorId,
          service_id: svcList[svcIdx].id,
          location_id: locationId,
          appointment_date: dateStr,
          start_time: `${hour.toString().padStart(2, '0')}:00`,
          end_time: `${(hour + 1).toString().padStart(2, '0')}:00`,
          mode,
          status,
          payment_status: paymentStatus,
          amount,
        });
        aptIdx++;
      }
    }

    const { error: aptErr } = await supabase.from('appointments').insert(appointments);
    if (aptErr) console.error('  ❌ Appointments:', aptErr.message);
    else console.log(`  ✅ ${appointments.length} appointments`);

    // 10. Payments for completed appointments
    console.log('💰 Step 10: Seeding payments...');
    const { data: completedApts } = await supabase
      .from('appointments')
      .select('id, patient_id, amount')
      .in('patient_id', PATIENTS.map(p => p.id))
      .eq('status', 'completed');

    if (completedApts && completedApts.length > 0) {
      const payments = completedApts.map((apt: any) => ({
        appointment_id: apt.id,
        user_id: apt.patient_id,
        amount: apt.amount,
        status: 'pending',
        razorpay_order_id: `order_seed_${apt.id.slice(0, 8)}`,
        razorpay_payment_id: `pay_seed_${apt.id.slice(0, 8)}`,
      }));

      const { error: payErr } = await supabase.from('payments').insert(payments);
      if (payErr) console.error('  ❌ Payments:', payErr.message);
      else console.log(`  ✅ ${payments.length} payment records`);
    } else {
      console.log('  ⚠️  No completed appointments found for payments');
    }
  }

  // Final summary
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                  ✅ SEED COMPLETE!                       ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('\nDatabase now contains:');
  console.log(`  📍 ${LOCATIONS.length} locations`);
  console.log(`  🏥 ${CLINIC_CENTERS.length} clinic centers`);
  console.log(`  💊 ${SERVICES.length} services (7 categories)`);
  console.log(`  👨‍⚕️ ${DOCTORS.length} doctors (with user accounts)`);
  console.log(`  📅 ${DOCTOR_AVAILABILITY.length} availability slots`);
  console.log(`  🧑 ${PATIENTS.length} patients`);
  console.log(`  📋 ~40 appointments (past/today/future)`);
  console.log(`  💰 Payment records for completed appointments`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
