-- H2H Healthcare Platform - Seed Data
-- Run this after the initial schema migration

-- ============================================
-- LOCATIONS
-- ============================================

INSERT INTO locations (name, city, address, tier, latitude, longitude, phone, email, is_active) VALUES
('H2H Mumbai - Andheri', 'Mumbai', 'Shop 12, Ground Floor, Andheri West, Mumbai - 400058', 1, 19.1197, 72.8464, '+91 98765 43210', 'mumbai@healtohealth.in', true),
('H2H Bangalore - Koramangala', 'Bangalore', '3rd Floor, 80 Feet Road, Koramangala, Bangalore - 560034', 1, 12.9352, 77.6245, '+91 98765 43211', 'bangalore@healtohealth.in', true),
('H2H Delhi - Saket', 'Delhi', 'B-12, Select Citywalk Mall, Saket, New Delhi - 110017', 1, 28.5274, 77.2190, '+91 98765 43212', 'delhi@healtohealth.in', true),
('H2H Pune - Kothrud', 'Pune', '45, Paud Road, Kothrud, Pune - 411038', 2, 18.5074, 73.8077, '+91 98765 43213', 'pune@healtohealth.in', true),
('H2H Hyderabad - Banjara Hills', 'Hyderabad', 'Road No. 12, Banjara Hills, Hyderabad - 500034', 1, 17.4156, 78.4347, '+91 98765 43214', 'hyderabad@healtohealth.in', true),
('H2H Jaipur - Malviya Nagar', 'Jaipur', 'D-45, Malviya Nagar, Jaipur - 302017', 2, 26.8505, 75.8010, '+91 98765 43215', 'jaipur@healtohealth.in', true),
('H2H Kolkata - Salt Lake', 'Kolkata', 'Sector V, Salt Lake City, Kolkata - 700091', 2, 22.5726, 88.4312, '+91 98765 43216', 'kolkata@healtohealth.in', true),
('H2H Chennai - T Nagar', 'Chennai', '23, Usman Road, T Nagar, Chennai - 600017', 1, 13.0418, 80.2341, '+91 98765 43217', 'chennai@healtohealth.in', true);

-- ============================================
-- SERVICES
-- ============================================

INSERT INTO services (name, slug, category, description, duration_minutes, tier1_price, tier2_price, online_available, offline_available, home_visit_available, is_active) VALUES
-- Sports Rehabilitation
('Sports Injury Assessment', 'sports-injury-assessment', 'sports_rehab', 'Comprehensive evaluation of sports-related injuries with personalized recovery plan', 60, 1500.00, 1000.00, true, true, false, true),
('ACL Rehabilitation', 'acl-rehabilitation', 'sports_rehab', 'Specialized rehabilitation program for ACL injuries and post-surgery recovery', 45, 2000.00, 1500.00, false, true, true, true),
('Sports Performance Enhancement', 'sports-performance-enhancement', 'sports_rehab', 'Training and therapy to enhance athletic performance and prevent injuries', 60, 1800.00, 1200.00, true, true, false, true),
('Post-Match Recovery', 'post-match-recovery', 'sports_rehab', 'Quick recovery sessions for athletes after intense matches or training', 30, 1000.00, 700.00, false, true, true, true),

-- Pain Management
('Back Pain Treatment', 'back-pain-treatment', 'pain_management', 'Expert treatment for chronic and acute back pain conditions', 45, 1200.00, 800.00, true, true, true, true),
('Neck Pain & Cervical Care', 'neck-pain-cervical-care', 'pain_management', 'Specialized care for neck pain, cervical spondylosis, and related conditions', 45, 1200.00, 800.00, true, true, true, true),
('Joint Mobilization', 'joint-mobilization', 'pain_management', 'Manual therapy techniques to improve joint mobility and reduce stiffness', 30, 1000.00, 700.00, false, true, true, true),
('Sciatica Treatment', 'sciatica-treatment', 'pain_management', 'Targeted therapy for sciatic nerve pain and related symptoms', 45, 1400.00, 1000.00, true, true, true, true),
('Frozen Shoulder Treatment', 'frozen-shoulder-treatment', 'pain_management', 'Comprehensive treatment for adhesive capsulitis (frozen shoulder)', 45, 1300.00, 900.00, false, true, true, true),

-- Physiotherapy
('Post-Surgery Rehabilitation', 'post-surgery-rehabilitation', 'physiotherapy', 'Comprehensive rehabilitation program after orthopedic surgeries', 60, 1800.00, 1200.00, false, true, true, true),
('Stroke Rehabilitation', 'stroke-rehabilitation', 'physiotherapy', 'Specialized physiotherapy for stroke recovery and neurological conditions', 60, 2000.00, 1500.00, false, true, true, true),
('Geriatric Physiotherapy', 'geriatric-physiotherapy', 'physiotherapy', 'Specialized care for elderly patients focusing on mobility and independence', 45, 1500.00, 1000.00, false, true, true, true),
('Pediatric Physiotherapy', 'pediatric-physiotherapy', 'physiotherapy', 'Gentle physiotherapy for children with developmental or physical challenges', 45, 1600.00, 1100.00, false, true, true, true),
('Posture Correction', 'posture-correction', 'physiotherapy', 'Assessment and correction of postural problems and related pain', 45, 1200.00, 800.00, true, true, false, true),

-- Yoga & Wellness
('Therapeutic Yoga', 'therapeutic-yoga', 'yoga', 'Yoga sessions designed for healing and rehabilitation', 60, 800.00, 500.00, true, true, false, true),
('Prenatal Yoga', 'prenatal-yoga', 'yoga', 'Safe yoga practices for expecting mothers', 45, 1000.00, 700.00, true, true, false, true),
('Stress Relief & Meditation', 'stress-relief-meditation', 'yoga', 'Guided meditation and breathing exercises for stress management', 45, 600.00, 400.00, true, true, false, true),
('Senior Yoga', 'senior-yoga', 'yoga', 'Gentle yoga sessions designed for older adults', 45, 700.00, 500.00, true, true, false, true),
('Corporate Wellness Yoga', 'corporate-wellness-yoga', 'yoga', 'Group yoga sessions for corporate wellness programs', 60, 5000.00, 3500.00, true, true, false, true);

-- ============================================
-- NOTE: Users and Doctors should be created through the application
-- after Supabase Auth is configured. The super admin should be
-- created manually in Supabase dashboard.
-- ============================================
