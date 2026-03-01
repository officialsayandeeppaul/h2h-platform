/**
 * H2H Healthcare Platform - Database Reset
 * 
 * ⚠️ WARNING: This script DELETES ALL DATA and seeds fresh!
 * Use with caution - all existing data will be lost.
 * 
 * Run: npm run db:reset
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
  { id: '11111111-1111-1111-1111-111111111111', name: 'H2H Mumbai', city: 'Mumbai', address: 'Andheri West, Mumbai', tier: 1 },
  { id: '22222222-2222-2222-2222-222222222222', name: 'H2H Bangalore', city: 'Bangalore', address: 'Koramangala, Bangalore', tier: 1 },
  { id: '33333333-3333-3333-3333-333333333333', name: 'H2H Delhi', city: 'Delhi', address: 'Saket, New Delhi', tier: 1 },
  { id: '44444444-4444-4444-4444-444444444444', name: 'H2H Pune', city: 'Pune', address: 'Kothrud, Pune', tier: 2 },
  { id: '55555555-5555-5555-5555-555555555555', name: 'H2H Hyderabad', city: 'Hyderabad', address: 'Banjara Hills, Hyderabad', tier: 1 },
  { id: '66666666-6666-6666-6666-666666666666', name: 'H2H Jaipur', city: 'Jaipur', address: 'Malviya Nagar, Jaipur', tier: 2 },
  { id: '77777777-7777-7777-7777-777777777777', name: 'H2H Kolkata', city: 'Kolkata', address: 'Salt Lake City, Kolkata', tier: 2 },
  { id: '88888888-8888-8888-8888-888888888888', name: 'H2H Chennai', city: 'Chennai', address: 'T Nagar, Chennai', tier: 1 },
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
// FUNCTIONS
// ============================================

async function deleteAllData() {
  console.log('\n🗑️  DELETING ALL DATA...');
  console.log('   ⚠️  This cannot be undone!\n');
  
  const tables = [
    'notifications',
    'prescriptions', 
    'reviews',
    'payments',
    'appointments',
    'doctor_services',
    'doctor_availability',
    'doctors',
    'services',
    'clinic_centers',
    'locations',
  ];
  
  for (const table of tables) {
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) {
      console.log(`  ⚠️  ${table}: ${error.message}`);
    } else {
      console.log(`  ✓ Deleted all from ${table}`);
    }
  }
  
  console.log('\n  ✅ All data deleted!');
}

async function updateServiceCategoryConstraint() {
  console.log('\n🔧 Updating service category constraint...');
  
  // Use raw SQL via Supabase's REST API
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey as string,
      'Authorization': `Bearer ${supabaseServiceKey}`,
    },
    body: JSON.stringify({
      sql: `
        ALTER TABLE services DROP CONSTRAINT IF EXISTS services_category_check;
        ALTER TABLE services ADD CONSTRAINT services_category_check CHECK (category IN (
          'pain_relief_physiotherapy', 
          'advanced_rehabilitation', 
          'nutrition_lifestyle', 
          'mental_wellness', 
          'therapeutic_yoga', 
          'sports_performance', 
          'digital_health'
        ));
      `
    }),
  });
  
  if (!response.ok) {
    console.log('  ⚠️  Could not update constraint via RPC (may need manual update in Supabase SQL Editor)');
    console.log('  📋 Run this SQL in Supabase Dashboard → SQL Editor:');
    console.log(`
    ALTER TABLE services DROP CONSTRAINT IF EXISTS services_category_check;
    ALTER TABLE services ADD CONSTRAINT services_category_check CHECK (category IN (
      'pain_relief_physiotherapy', 
      'advanced_rehabilitation', 
      'nutrition_lifestyle', 
      'mental_wellness', 
      'therapeutic_yoga', 
      'sports_performance', 
      'digital_health'
    ));
    `);
  } else {
    console.log('  ✓ Constraint updated');
  }
}

async function seedFreshData() {
  console.log('\n📦 Seeding fresh data...');
  
  // Locations
  console.log('  📍 Inserting locations...');
  const { error: locError } = await supabase.from('locations').insert(LOCATIONS);
  if (locError) {
    console.error(`  ❌ Locations: ${locError.message}`);
    return false;
  }
  console.log(`  ✓ ${LOCATIONS.length} locations`);
  
  // Clinic Centers
  console.log('  🏥 Inserting clinic centers...');
  const { error: centerError } = await supabase.from('clinic_centers').insert(CLINIC_CENTERS);
  if (centerError) {
    console.error(`  ❌ Centers: ${centerError.message}`);
    return false;
  }
  console.log(`  ✓ ${CLINIC_CENTERS.length} clinic centers`);
  
  // Services
  console.log('  💊 Inserting services...');
  const { error: svcError } = await supabase.from('services').insert(SERVICES);
  if (svcError) {
    console.error(`  ❌ Services: ${svcError.message}`);
    console.log('  ⚠️  If category constraint error, run the SQL shown above in Supabase Dashboard');
    return false;
  }
  console.log(`  ✓ ${SERVICES.length} services`);
  
  // Doctors
  console.log('  👨‍⚕️ Inserting doctors...');
  const { error: docError } = await supabase.from('doctors').insert(DOCTORS);
  if (docError) {
    console.error(`  ❌ Doctors: ${docError.message}`);
    return false;
  }
  console.log(`  ✓ ${DOCTORS.length} doctors`);
  
  // Doctor Availability
  console.log('  📅 Inserting availability...');
  const { error: availError } = await supabase.from('doctor_availability').insert(DOCTOR_AVAILABILITY);
  if (availError) {
    console.error(`  ❌ Availability: ${availError.message}`);
    return false;
  }
  console.log(`  ✓ ${DOCTOR_AVAILABILITY.length} availability slots`);
  
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
    
    const { error: dsError } = await supabase.from('doctor_services').insert(doctorServices);
    if (dsError) {
      console.log(`  ⚠️  Doctor services: ${dsError.message}`);
    } else {
      console.log(`  ✓ ${doctorServices.length} doctor-service assignments`);
    }
  }
  
  return true;
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║    ⚠️  H2H Healthcare - DATABASE RESET (DESTRUCTIVE)  ⚠️    ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('\nThis will DELETE ALL DATA and seed fresh!\n');
  
  // Step 1: Delete all data
  await deleteAllData();
  
  // Step 2: Update service category constraint
  await updateServiceCategoryConstraint();
  
  // Step 3: Seed fresh data
  const success = await seedFreshData();
  
  if (success) {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ Reset Complete!                       ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('\nFresh database now contains:');
    console.log(`  • ${LOCATIONS.length} locations`);
    console.log(`  • ${CLINIC_CENTERS.length} clinic centers`);
    console.log(`  • ${SERVICES.length} services (7 categories)`);
    console.log(`  • ${DOCTORS.length} doctors`);
    console.log(`  • ${DOCTOR_AVAILABILITY.length} availability slots`);
  } else {
    console.log('\n❌ Reset failed. Check errors above.');
    process.exit(1);
  }
}

main();
