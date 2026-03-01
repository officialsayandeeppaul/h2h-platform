/**
 * Admin Seed API - Seeds the database with comprehensive test data
 * Only accessible by super_admin
 * 
 * Seeds: locations, clinic_centers, services, doctors, doctor_availability,
 *        doctor_services, patient users, appointments (all combinations)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function checkSuperAdmin() {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { isSuperAdmin: false, adminClient, userId: '' };

  const { data: userData } = await adminClient
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  return {
    isSuperAdmin: (userData as any)?.role === 'super_admin',
    adminClient,
    userId: user.id,
  };
}

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
  { id: 'c4444444-4444-4444-4444-444444444441', location_id: '44444444-4444-4444-4444-444444444444', name: 'H2H Kothrud', slug: 'h2h-kothrud', address: '45, Paud Road, Kothrud', pincode: '411038', phone: '+91 98765 43213', email: 'kothrud@healtohealth.in', facilities: ['Parking', 'Wheelchair Access'], rating: 4.7, total_reviews: 167, is_featured: true },
  { id: 'c5555555-5555-5555-5555-555555555551', location_id: '55555555-5555-5555-5555-555555555555', name: 'H2H Banjara Hills', slug: 'h2h-banjara-hills', address: 'Road No. 12, Banjara Hills', pincode: '500034', phone: '+91 98765 43214', email: 'banjarahills@healtohealth.in', facilities: ['Parking', 'Wheelchair Access', 'Gym'], rating: 4.8, total_reviews: 234, is_featured: true },
  { id: 'c6666666-6666-6666-6666-666666666661', location_id: '66666666-6666-6666-6666-666666666666', name: 'H2H Malviya Nagar', slug: 'h2h-malviya-nagar-jaipur', address: 'D-45, Malviya Nagar', pincode: '302017', phone: '+91 98765 43215', email: 'malviyanagar@healtohealth.in', facilities: ['Parking'], rating: 4.6, total_reviews: 89, is_featured: false },
  { id: 'c7777777-7777-7777-7777-777777777771', location_id: '77777777-7777-7777-7777-777777777777', name: 'H2H Salt Lake', slug: 'h2h-salt-lake', address: 'Sector V, Salt Lake City', pincode: '700091', phone: '+91 98765 43216', email: 'saltlake@healtohealth.in', facilities: ['Parking', 'Wheelchair Access'], rating: 4.7, total_reviews: 145, is_featured: true },
  { id: 'c8888888-8888-8888-8888-888888888881', location_id: '88888888-8888-8888-8888-888888888888', name: 'H2H T Nagar', slug: 'h2h-t-nagar', address: '23, Usman Road, T Nagar', pincode: '600017', phone: '+91 98765 43217', email: 'tnagar@healtohealth.in', facilities: ['Parking', 'Wheelchair Access', 'Pharmacy'], rating: 4.8, total_reviews: 198, is_featured: true },
];

const SERVICES = [
  // Pain Relief & Physiotherapy (6)
  { name: 'Back Pain Treatment', slug: 'back-pain-treatment', category: 'pain_relief_physiotherapy', description: 'Expert treatment for chronic and acute back pain', duration_minutes: 45, tier1_price: 1200, tier2_price: 800, online_available: true, offline_available: true, home_visit_available: true },
  { name: 'Neck Pain & Cervical Care', slug: 'neck-pain-cervical-care', category: 'pain_relief_physiotherapy', description: 'Specialized care for neck pain and cervical spondylosis', duration_minutes: 45, tier1_price: 1200, tier2_price: 800, online_available: true, offline_available: true, home_visit_available: true },
  { name: 'Joint Pain Management', slug: 'joint-pain-management', category: 'pain_relief_physiotherapy', description: 'Treatment for knee, shoulder, hip and other joint pain', duration_minutes: 45, tier1_price: 1300, tier2_price: 900, online_available: true, offline_available: true, home_visit_available: true },
  { name: 'Sciatica Treatment', slug: 'sciatica-treatment', category: 'pain_relief_physiotherapy', description: 'Targeted therapy for sciatic nerve pain', duration_minutes: 45, tier1_price: 1400, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: true },
  { name: 'Frozen Shoulder Treatment', slug: 'frozen-shoulder-treatment', category: 'pain_relief_physiotherapy', description: 'Treatment for adhesive capsulitis', duration_minutes: 45, tier1_price: 1300, tier2_price: 900, online_available: false, offline_available: true, home_visit_available: true },
  { name: 'Arthritis Care', slug: 'arthritis-care', category: 'pain_relief_physiotherapy', description: 'Physiotherapy for osteoarthritis and rheumatoid arthritis', duration_minutes: 45, tier1_price: 1400, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: true },

  // Advanced Rehabilitation (6)
  { name: 'Post-Surgery Rehabilitation', slug: 'post-surgery-rehabilitation', category: 'advanced_rehabilitation', description: 'Rehabilitation after orthopedic surgeries', duration_minutes: 60, tier1_price: 1800, tier2_price: 1200, online_available: false, offline_available: true, home_visit_available: true },
  { name: 'Stroke Rehabilitation', slug: 'stroke-rehabilitation', category: 'advanced_rehabilitation', description: 'Physiotherapy for stroke recovery', duration_minutes: 60, tier1_price: 2000, tier2_price: 1500, online_available: false, offline_available: true, home_visit_available: true },
  { name: 'Spinal Cord Injury Rehab', slug: 'spinal-cord-injury-rehab', category: 'advanced_rehabilitation', description: 'Rehabilitation for spinal cord injuries', duration_minutes: 60, tier1_price: 2200, tier2_price: 1800, online_available: false, offline_available: true, home_visit_available: true },
  { name: 'ACL Reconstruction Rehab', slug: 'acl-reconstruction-rehab', category: 'advanced_rehabilitation', description: 'Recovery program for ACL reconstruction', duration_minutes: 60, tier1_price: 1800, tier2_price: 1400, online_available: false, offline_available: true, home_visit_available: true },
  { name: 'Total Knee Replacement Rehab', slug: 'total-knee-replacement-rehab', category: 'advanced_rehabilitation', description: 'Post-operative knee replacement rehab', duration_minutes: 60, tier1_price: 1800, tier2_price: 1400, online_available: false, offline_available: true, home_visit_available: true },
  { name: 'Geriatric Rehabilitation', slug: 'geriatric-rehabilitation', category: 'advanced_rehabilitation', description: 'Specialized care for elderly patients', duration_minutes: 45, tier1_price: 1500, tier2_price: 1000, online_available: false, offline_available: true, home_visit_available: true },

  // Nutrition & Lifestyle (5)
  { name: 'Sports Nutrition Consultation', slug: 'sports-nutrition-consultation', category: 'nutrition_lifestyle', description: 'Nutrition plans for athletes', duration_minutes: 45, tier1_price: 1500, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Weight Management Program', slug: 'weight-management-program', category: 'nutrition_lifestyle', description: 'Weight loss/gain program with diet guidance', duration_minutes: 45, tier1_price: 1200, tier2_price: 800, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Diabetes Nutrition Care', slug: 'diabetes-nutrition-care', category: 'nutrition_lifestyle', description: 'Diet planning for diabetes management', duration_minutes: 45, tier1_price: 1300, tier2_price: 900, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Heart Health Nutrition', slug: 'heart-health-nutrition', category: 'nutrition_lifestyle', description: 'Cardiac-friendly diet planning', duration_minutes: 45, tier1_price: 1300, tier2_price: 900, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Lifestyle Modification Coaching', slug: 'lifestyle-modification-coaching', category: 'nutrition_lifestyle', description: 'Holistic lifestyle coaching', duration_minutes: 60, tier1_price: 1500, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: false },

  // Mental Wellness (5)
  { name: 'Sports Psychology Consultation', slug: 'sports-psychology-consultation', category: 'mental_wellness', description: 'Mental performance coaching for athletes', duration_minutes: 60, tier1_price: 2000, tier2_price: 1500, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Stress & Anxiety Management', slug: 'stress-anxiety-management', category: 'mental_wellness', description: 'Sessions for stress and anxiety management', duration_minutes: 45, tier1_price: 1500, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Performance Enhancement Coaching', slug: 'performance-enhancement-coaching', category: 'mental_wellness', description: 'Mental conditioning for peak performance', duration_minutes: 60, tier1_price: 1800, tier2_price: 1200, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Sleep Disorder Consultation', slug: 'sleep-disorder-consultation', category: 'mental_wellness', description: 'Assessment of sleep-related issues', duration_minutes: 45, tier1_price: 1400, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Mindfulness & Meditation Therapy', slug: 'mindfulness-meditation-therapy', category: 'mental_wellness', description: 'Guided mindfulness and meditation', duration_minutes: 45, tier1_price: 1000, tier2_price: 700, online_available: true, offline_available: true, home_visit_available: false },

  // Therapeutic Yoga (6)
  { name: 'Therapeutic Yoga', slug: 'therapeutic-yoga', category: 'therapeutic_yoga', description: 'Yoga for healing and rehabilitation', duration_minutes: 60, tier1_price: 800, tier2_price: 500, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Prenatal Yoga', slug: 'prenatal-yoga', category: 'therapeutic_yoga', description: 'Safe yoga for expecting mothers', duration_minutes: 45, tier1_price: 1000, tier2_price: 700, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Senior Yoga', slug: 'senior-yoga', category: 'therapeutic_yoga', description: 'Gentle yoga for older adults', duration_minutes: 45, tier1_price: 700, tier2_price: 500, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Yoga for Back Pain', slug: 'yoga-for-back-pain', category: 'therapeutic_yoga', description: 'Yoga sequences for back pain relief', duration_minutes: 45, tier1_price: 900, tier2_price: 600, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Breathwork & Pranayama', slug: 'breathwork-pranayama', category: 'therapeutic_yoga', description: 'Advanced breathing techniques', duration_minutes: 45, tier1_price: 700, tier2_price: 500, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Corporate Wellness Yoga', slug: 'corporate-wellness-yoga', category: 'therapeutic_yoga', description: 'Group yoga for corporates', duration_minutes: 60, tier1_price: 5000, tier2_price: 3500, online_available: true, offline_available: true, home_visit_available: false },

  // Sports Performance (6)
  { name: 'Sports Injury Assessment', slug: 'sports-injury-assessment', category: 'sports_performance', description: 'Evaluation of sports injuries', duration_minutes: 60, tier1_price: 1500, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Biomechanical Analysis', slug: 'biomechanical-analysis', category: 'sports_performance', description: 'Movement analysis for performance', duration_minutes: 90, tier1_price: 3000, tier2_price: 2500, online_available: false, offline_available: true, home_visit_available: false },
  { name: 'Athletic Performance Testing', slug: 'athletic-performance-testing', category: 'sports_performance', description: 'Fitness assessment for athletes', duration_minutes: 90, tier1_price: 2500, tier2_price: 2000, online_available: false, offline_available: true, home_visit_available: false },
  { name: 'Sports-Specific Training', slug: 'sports-specific-training', category: 'sports_performance', description: 'Customized training programs', duration_minutes: 60, tier1_price: 2000, tier2_price: 1500, online_available: false, offline_available: true, home_visit_available: false },
  { name: 'Injury Prevention Program', slug: 'injury-prevention-program', category: 'sports_performance', description: 'Proactive injury prevention', duration_minutes: 60, tier1_price: 1800, tier2_price: 1200, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Return to Sport Assessment', slug: 'return-to-sport-assessment', category: 'sports_performance', description: 'Safe return to sports evaluation', duration_minutes: 60, tier1_price: 2000, tier2_price: 1500, online_available: false, offline_available: true, home_visit_available: false },

  // Digital Health (5)
  { name: 'Tele-Rehabilitation', slug: 'tele-rehabilitation', category: 'digital_health', description: 'Remote physiotherapy sessions', duration_minutes: 45, tier1_price: 800, tier2_price: 600, online_available: true, offline_available: false, home_visit_available: false },
  { name: 'Virtual Fitness Assessment', slug: 'virtual-fitness-assessment', category: 'digital_health', description: 'Online fitness assessment', duration_minutes: 45, tier1_price: 700, tier2_price: 500, online_available: true, offline_available: false, home_visit_available: false },
  { name: 'Digital Health Monitoring', slug: 'digital-health-monitoring', category: 'digital_health', description: 'Remote health tracking', duration_minutes: 30, tier1_price: 500, tier2_price: 400, online_available: true, offline_available: false, home_visit_available: false },
  { name: 'Online Second Opinion', slug: 'online-second-opinion', category: 'digital_health', description: 'Expert second opinion online', duration_minutes: 30, tier1_price: 1000, tier2_price: 800, online_available: true, offline_available: false, home_visit_available: false },
  { name: 'Home Exercise Program Design', slug: 'home-exercise-program-design', category: 'digital_health', description: 'Customized home exercise programs', duration_minutes: 45, tier1_price: 600, tier2_price: 400, online_available: true, offline_available: false, home_visit_available: false },
];

// Doctor data split into user record + doctor record
const DOCTOR_SEED = [
  {
    user: { id: 'u-doc-1111-1111-1111-111111111111', email: 'rajesh.kumar@healtohealth.in', full_name: 'Dr. Rajesh Kumar', phone: '+91 98765 11111', avatar_url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=rajesh&backgroundColor=b6e3f4', role: 'doctor' },
    doctor: { id: 'd1111111-1111-1111-1111-111111111111', location_id: '11111111-1111-1111-1111-111111111111', specializations: ['Sports Physiotherapy', 'Pain Relief'], qualifications: ['BPT', 'MPT (Sports)', 'CSCS'], experience_years: 12, bio: 'Renowned sports physiotherapist with 12+ years experience working with professional athletes.', consultation_fee: 1500, rating: 4.9, total_reviews: 245, google_meet_enabled: true, is_active: true },
  },
  {
    user: { id: 'u-doc-2222-2222-2222-222222222222', email: 'priya.sharma@healtohealth.in', full_name: 'Dr. Priya Sharma', phone: '+91 98765 22222', avatar_url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=priya&backgroundColor=c0aede', role: 'doctor' },
    doctor: { id: 'd2222222-2222-2222-2222-222222222222', location_id: '22222222-2222-2222-2222-222222222222', specializations: ['Pain Management', 'Orthopedic Physiotherapy'], qualifications: ['BPT', 'MPT (Ortho)', 'Pain Specialist'], experience_years: 10, bio: 'Specializes in chronic pain management using evidence-based techniques.', consultation_fee: 1200, rating: 4.8, total_reviews: 189, google_meet_enabled: true, is_active: true },
  },
  {
    user: { id: 'u-doc-3333-3333-3333-333333333333', email: 'amit.patel@healtohealth.in', full_name: 'Dr. Amit Patel', phone: '+91 98765 33333', avatar_url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=amit&backgroundColor=d1d4f9', role: 'doctor' },
    doctor: { id: 'd3333333-3333-3333-3333-333333333333', location_id: '33333333-3333-3333-3333-333333333333', specializations: ['Neurological Rehabilitation', 'Stroke Recovery'], qualifications: ['BPT', 'MPT (Neuro)', 'NDT Certified'], experience_years: 15, bio: 'Expert in neurological rehabilitation with extensive stroke recovery experience.', consultation_fee: 1800, rating: 4.9, total_reviews: 312, google_meet_enabled: false, is_active: true },
  },
  {
    user: { id: 'u-doc-4444-4444-4444-444444444444', email: 'sneha.reddy@healtohealth.in', full_name: 'Dr. Sneha Reddy', phone: '+91 98765 44444', avatar_url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=sneha&backgroundColor=ffd5dc', role: 'doctor' },
    doctor: { id: 'd4444444-4444-4444-4444-444444444444', location_id: '55555555-5555-5555-5555-555555555555', specializations: ['Yoga Therapy', 'Mental Wellness'], qualifications: ['BPT', 'MSc Yoga', 'Certified Yoga Therapist'], experience_years: 8, bio: 'Combines traditional yoga with modern physiotherapy for holistic healing.', consultation_fee: 1000, rating: 4.7, total_reviews: 156, google_meet_enabled: true, is_active: true },
  },
  {
    user: { id: 'u-doc-5555-5555-5555-555555555555', email: 'vikram.singh@healtohealth.in', full_name: 'Dr. Vikram Singh', phone: '+91 98765 55555', avatar_url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=vikram&backgroundColor=b6e3f4', role: 'doctor' },
    doctor: { id: 'd5555555-5555-5555-5555-555555555555', location_id: '11111111-1111-1111-1111-111111111111', specializations: ['Sports Performance', 'Athletic Training'], qualifications: ['BPT', 'MPT (Sports)', 'CSCS', 'PES'], experience_years: 14, bio: 'Sports performance specialist who has worked with national athletes and IPL teams.', consultation_fee: 2000, rating: 4.9, total_reviews: 428, google_meet_enabled: true, is_active: true },
  },
  {
    user: { id: 'u-doc-6666-6666-6666-666666666666', email: 'meera.nair@healtohealth.in', full_name: 'Dr. Meera Nair', phone: '+91 98765 66666', avatar_url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=meera&backgroundColor=c0aede', role: 'doctor' },
    doctor: { id: 'd6666666-6666-6666-6666-666666666666', location_id: '88888888-8888-8888-8888-888888888888', specializations: ['Geriatric Physiotherapy', 'Fall Prevention'], qualifications: ['BPT', 'MPT (Geriatrics)'], experience_years: 11, bio: 'Specializes in elderly care focusing on mobility and fall prevention.', consultation_fee: 1200, rating: 4.8, total_reviews: 198, google_meet_enabled: true, is_active: true },
  },
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

// Patient users to seed
const PATIENTS = [
  { id: 'p1111111-1111-1111-1111-111111111111', email: 'rahul.sharma@example.com', full_name: 'Rahul Sharma', phone: '+91 91234 56701', role: 'patient' },
  { id: 'p2222222-2222-2222-2222-222222222222', email: 'anita.desai@example.com', full_name: 'Anita Desai', phone: '+91 91234 56702', role: 'patient' },
  { id: 'p3333333-3333-3333-3333-333333333333', email: 'vikash.kumar@example.com', full_name: 'Vikash Kumar', phone: '+91 91234 56703', role: 'patient' },
  { id: 'p4444444-4444-4444-4444-444444444444', email: 'priyanka.joshi@example.com', full_name: 'Priyanka Joshi', phone: '+91 91234 56704', role: 'patient' },
  { id: 'p5555555-5555-5555-5555-555555555555', email: 'suresh.menon@example.com', full_name: 'Suresh Menon', phone: '+91 91234 56705', role: 'patient' },
  { id: 'p6666666-6666-6666-6666-666666666666', email: 'deepika.singh@example.com', full_name: 'Deepika Singh', phone: '+91 91234 56706', role: 'patient' },
  { id: 'p7777777-7777-7777-7777-777777777777', email: 'arjun.nair@example.com', full_name: 'Arjun Nair', phone: '+91 91234 56707', role: 'patient' },
  { id: 'p8888888-8888-8888-8888-888888888888', email: 'kavita.reddy@example.com', full_name: 'Kavita Reddy', phone: '+91 91234 56708', role: 'patient' },
];

// ============================================
// SEED FUNCTIONS
// ============================================

export async function POST(request: NextRequest) {
  try {
    const { isSuperAdmin, adminClient } = await checkSuperAdmin();
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized - Super Admin only' }, { status: 403 });
    }

    const logs: string[] = [];
    const log = (msg: string) => { logs.push(msg); console.log(`[SEED] ${msg}`); };

    log('Starting comprehensive database seed...');

    // 1. Seed Locations
    log('Seeding locations...');
    const { error: locErr } = await (adminClient.from('locations') as any).upsert(LOCATIONS, { onConflict: 'id' });
    if (locErr) log(`  WARNING locations: ${locErr.message}`);
    else log(`  OK ${LOCATIONS.length} locations`);

    // 2. Seed Clinic Centers
    log('Seeding clinic centers...');
    const { error: centerErr } = await (adminClient.from('clinic_centers') as any).upsert(CLINIC_CENTERS, { onConflict: 'id' });
    if (centerErr) log(`  WARNING centers: ${centerErr.message}`);
    else log(`  OK ${CLINIC_CENTERS.length} clinic centers`);

    // 3. Seed Services
    log('Seeding services...');
    const { error: svcErr } = await (adminClient.from('services') as any).upsert(SERVICES, { onConflict: 'slug' });
    if (svcErr) log(`  WARNING services: ${svcErr.message}`);
    else log(`  OK ${SERVICES.length} services across 7 categories`);

    // 4. Seed Doctor Users (create user records with role='doctor')
    log('Seeding doctor user accounts...');
    const doctorUserRecords = DOCTOR_SEED.map(d => d.user);
    for (const du of doctorUserRecords) {
      // Check if user with this email already exists
      const { data: existing } = await adminClient.from('users').select('id').eq('email', du.email).single();
      if (existing) {
        // Update existing user
        await (adminClient.from('users') as any).update({ full_name: du.full_name, phone: du.phone, avatar_url: du.avatar_url, role: 'doctor' }).eq('id', (existing as any).id);
        // Store the real user ID for doctor record
        (du as any)._realId = (existing as any).id;
        log(`  Updated existing user: ${du.full_name} (${(existing as any).id})`);
      } else {
        const { data: newUser, error: uErr } = await (adminClient.from('users') as any)
          .insert({ id: du.id, email: du.email, full_name: du.full_name, phone: du.phone, avatar_url: du.avatar_url, role: 'doctor', is_active: true })
          .select('id').single();
        if (uErr) {
          log(`  WARNING user ${du.full_name}: ${uErr.message}`);
          // Try upsert by id
          await (adminClient.from('users') as any).upsert({ id: du.id, email: du.email, full_name: du.full_name, phone: du.phone, avatar_url: du.avatar_url, role: 'doctor', is_active: true }, { onConflict: 'id' });
        }
        (du as any)._realId = newUser ? (newUser as any).id : du.id;
        log(`  Created user: ${du.full_name}`);
      }
    }

    // 5. Seed Doctor records (with user_id FK)
    log('Seeding doctor profiles...');
    for (const ds of DOCTOR_SEED) {
      const userId = (ds.user as any)._realId || ds.user.id;
      // Delete existing doctor for this user_id first
      await (adminClient.from('doctor_services') as any).delete().eq('doctor_id', ds.doctor.id);
      await (adminClient.from('doctor_availability') as any).delete().eq('doctor_id', ds.doctor.id);
      await (adminClient.from('doctors') as any).delete().eq('id', ds.doctor.id);
      // Also delete any doctor record for this user_id
      await (adminClient.from('doctors') as any).delete().eq('user_id', userId);

      const { error: docErr } = await (adminClient.from('doctors') as any).insert({
        id: ds.doctor.id,
        user_id: userId,
        location_id: ds.doctor.location_id,
        specializations: ds.doctor.specializations,
        qualifications: ds.doctor.qualifications,
        experience_years: ds.doctor.experience_years,
        bio: ds.doctor.bio,
        consultation_fee: ds.doctor.consultation_fee,
        rating: ds.doctor.rating,
        total_reviews: ds.doctor.total_reviews,
        google_meet_enabled: ds.doctor.google_meet_enabled,
        is_active: ds.doctor.is_active,
      });
      if (docErr) log(`  WARNING doctor ${ds.user.full_name}: ${docErr.message}`);
    }
    log(`  OK ${DOCTOR_SEED.length} doctor profiles created`);

    // 6. Seed Doctor Availability
    log('Seeding doctor availability...');
    const { error: availErr } = await (adminClient.from('doctor_availability') as any).insert(DOCTOR_AVAILABILITY);
    if (availErr) log(`  WARNING availability: ${availErr.message}`);
    else log(`  OK ${DOCTOR_AVAILABILITY.length} availability slots`);

    // 7. Seed Doctor-Service mappings
    log('Seeding doctor-service mappings...');
    const { data: allServices } = await adminClient.from('services').select('id, category');
    if (allServices) {
      const doctorServices: { doctor_id: string; service_id: string; is_primary: boolean }[] = [];

      // Dr. Rajesh: Sports + Pain Relief
      (allServices as any[]).filter((s: any) => s.category === 'sports_performance' || s.category === 'pain_relief_physiotherapy')
        .forEach((s: any) => doctorServices.push({ doctor_id: 'd1111111-1111-1111-1111-111111111111', service_id: s.id, is_primary: s.category === 'sports_performance' }));

      // Dr. Priya: Pain Relief + Nutrition
      (allServices as any[]).filter((s: any) => s.category === 'pain_relief_physiotherapy' || s.category === 'nutrition_lifestyle')
        .forEach((s: any) => doctorServices.push({ doctor_id: 'd2222222-2222-2222-2222-222222222222', service_id: s.id, is_primary: s.category === 'pain_relief_physiotherapy' }));

      // Dr. Amit: Advanced Rehab
      (allServices as any[]).filter((s: any) => s.category === 'advanced_rehabilitation')
        .forEach((s: any) => doctorServices.push({ doctor_id: 'd3333333-3333-3333-3333-333333333333', service_id: s.id, is_primary: true }));

      // Dr. Sneha: Yoga + Mental Wellness
      (allServices as any[]).filter((s: any) => s.category === 'therapeutic_yoga' || s.category === 'mental_wellness')
        .forEach((s: any) => doctorServices.push({ doctor_id: 'd4444444-4444-4444-4444-444444444444', service_id: s.id, is_primary: s.category === 'therapeutic_yoga' }));

      // Dr. Vikram: Sports Performance + Digital Health
      (allServices as any[]).filter((s: any) => s.category === 'sports_performance' || s.category === 'digital_health')
        .forEach((s: any) => doctorServices.push({ doctor_id: 'd5555555-5555-5555-5555-555555555555', service_id: s.id, is_primary: s.category === 'sports_performance' }));

      // Dr. Meera: Advanced Rehab + Pain Relief (geriatric focus)
      (allServices as any[]).filter((s: any) => s.category === 'advanced_rehabilitation' || s.category === 'pain_relief_physiotherapy')
        .forEach((s: any) => doctorServices.push({ doctor_id: 'd6666666-6666-6666-6666-666666666666', service_id: s.id, is_primary: s.category === 'advanced_rehabilitation' }));

      const { error: dsErr } = await (adminClient.from('doctor_services') as any).insert(doctorServices);
      if (dsErr) log(`  WARNING doctor_services: ${dsErr.message}`);
      else log(`  OK ${doctorServices.length} doctor-service mappings`);
    }

    // 8. Seed Patient Users
    log('Seeding patient users...');
    for (const pat of PATIENTS) {
      const { data: existing } = await adminClient.from('users').select('id').eq('email', pat.email).single();
      if (existing) {
        await (adminClient.from('users') as any).update({ full_name: pat.full_name, phone: pat.phone, role: 'patient' }).eq('id', (existing as any).id);
        (pat as any)._realId = (existing as any).id;
      } else {
        const { data: newPat, error: pErr } = await (adminClient.from('users') as any)
          .insert({ id: pat.id, email: pat.email, full_name: pat.full_name, phone: pat.phone, role: 'patient', is_active: true })
          .select('id').single();
        if (pErr) {
          await (adminClient.from('users') as any).upsert({ id: pat.id, email: pat.email, full_name: pat.full_name, phone: pat.phone, role: 'patient', is_active: true }, { onConflict: 'id' });
        }
        (pat as any)._realId = newPat ? (newPat as any).id : pat.id;
      }
    }
    log(`  OK ${PATIENTS.length} patient users`);

    // 9. Seed Appointments (comprehensive combinations)
    log('Seeding appointments...');
    const { data: svcList } = await adminClient.from('services').select('id, name, category, tier1_price');
    if (svcList && (svcList as any[]).length > 0) {
      const services = svcList as any[];

      // Delete old seed appointments for these patients
      const patientIds = PATIENTS.map(p => (p as any)._realId || p.id);
      for (const pid of patientIds) {
        await (adminClient.from('appointments') as any).delete().eq('patient_id', pid);
      }

      const today = new Date();
      const appointments: any[] = [];

      const modes = ['online', 'offline'];

      // Doctor-location mapping for offline appointments
      const doctorLocations: Record<string, string> = {
        'd1111111-1111-1111-1111-111111111111': '11111111-1111-1111-1111-111111111111',
        'd2222222-2222-2222-2222-222222222222': '22222222-2222-2222-2222-222222222222',
        'd3333333-3333-3333-3333-333333333333': '33333333-3333-3333-3333-333333333333',
        'd4444444-4444-4444-4444-444444444444': '55555555-5555-5555-5555-555555555555',
        'd5555555-5555-5555-5555-555555555555': '11111111-1111-1111-1111-111111111111',
        'd6666666-6666-6666-6666-666666666666': '88888888-8888-8888-8888-888888888888',
      };

      const doctorIds = DOCTOR_SEED.map(d => d.doctor.id);
      let aptIndex = 0;

      for (let dayOffset = -14; dayOffset <= 14; dayOffset++) {
        const date = new Date(today);
        date.setDate(date.getDate() + dayOffset);
        const dateStr = date.toISOString().split('T')[0];

        const aptsPerDay = dayOffset === 0 ? 3 : (Math.abs(dayOffset) <= 3 ? 2 : 1);

        for (let j = 0; j < aptsPerDay; j++) {
          const patientIdx = aptIndex % PATIENTS.length;
          const doctorIdx = aptIndex % doctorIds.length;
          const serviceIdx = aptIndex % services.length;
          const mode = modes[aptIndex % modes.length];
          const hour = 9 + (j * 2);

          let status: string;
          let paymentStatus: string;
          if (dayOffset < -3) {
            status = aptIndex % 5 === 0 ? 'cancelled' : 'completed';
            paymentStatus = status === 'cancelled' ? 'failed' : 'completed';
          } else if (dayOffset < 0) {
            const opts = ['pending', 'confirmed', 'completed'];
            status = opts[aptIndex % 3];
            paymentStatus = status === 'completed' ? 'completed' : 'pending';
          } else if (dayOffset === 0) {
            status = j === 0 ? 'confirmed' : (j === 1 ? 'pending' : 'confirmed');
            paymentStatus = 'completed';
          } else {
            status = aptIndex % 3 === 0 ? 'pending' : 'confirmed';
            paymentStatus = aptIndex % 4 === 0 ? 'pending' : 'completed';
          }

          const amount = services[serviceIdx].tier1_price || 1200;
          const doctorId = doctorIds[doctorIdx];
          const locationId = mode === 'offline' ? (doctorLocations[doctorId] || LOCATIONS[0].id) : null;
          const patientId = (PATIENTS[patientIdx] as any)._realId || PATIENTS[patientIdx].id;

          appointments.push({
            patient_id: patientId,
            doctor_id: doctorId,
            service_id: services[serviceIdx].id,
            location_id: locationId,
            appointment_date: dateStr,
            start_time: `${hour.toString().padStart(2, '0')}:00`,
            end_time: `${(hour + 1).toString().padStart(2, '0')}:00`,
            mode,
            status,
            payment_status: paymentStatus,
            amount,
            metadata: {
              patient_name: PATIENTS[patientIdx].full_name,
              patient_phone: PATIENTS[patientIdx].phone,
            },
          });

          aptIndex++;
        }
      }

      const { error: aptErr } = await (adminClient.from('appointments') as any).insert(appointments);
      if (aptErr) log(`  WARNING appointments: ${aptErr.message}`);
      else log(`  OK ${appointments.length} appointments (past, today, future; online/offline; all statuses)`);

      // 10. Seed Payments for completed appointments
      log('Seeding payments...');
      const { data: completedApts } = await (adminClient.from('appointments') as any)
        .select('id, patient_id, amount, payment_status')
        .in('patient_id', patientIds)
        .eq('payment_status', 'completed');

      if (completedApts && completedApts.length > 0) {
        const aptIds = completedApts.map((a: any) => a.id);
        await (adminClient.from('payments') as any).delete().in('appointment_id', aptIds);

        const payments = completedApts.map((apt: any) => ({
          appointment_id: apt.id,
          user_id: apt.patient_id,
          amount: apt.amount,
          status: 'completed',
          razorpay_order_id: `order_seed_${apt.id.slice(0, 8)}`,
          razorpay_payment_id: `pay_seed_${apt.id.slice(0, 8)}`,
        }));

        const { error: payErr } = await (adminClient.from('payments') as any).insert(payments);
        if (payErr) log(`  WARNING payments: ${payErr.message}`);
        else log(`  OK ${payments.length} payment records`);
      }
    }

    log('Seed complete!');

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      summary: {
        locations: LOCATIONS.length,
        clinicCenters: CLINIC_CENTERS.length,
        services: SERVICES.length,
        doctors: DOCTOR_SEED.length,
        patients: PATIENTS.length,
        categories: 7,
      },
      logs,
    });

  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message || 'Seed failed' }, { status: 500 });
  }
}
