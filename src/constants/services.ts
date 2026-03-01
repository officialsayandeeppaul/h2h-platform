export const SERVICE_CATEGORIES = {
  pain_relief_physiotherapy: {
    name: 'Pain Relief & Physiotherapy Care',
    slug: 'pain-relief-physiotherapy',
    description: 'Comprehensive pain relief and mobilization therapy for chronic and acute conditions',
    icon: 'Heart',
    color: 'bg-red-500',
    gradient: 'from-red-500 to-rose-500',
  },
  advanced_rehabilitation: {
    name: 'Advanced Rehabilitation & Recovery',
    slug: 'advanced-rehabilitation',
    description: 'Ortho, Neuro & Post-surgical rehabilitation for complete recovery',
    icon: 'Activity',
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-indigo-500',
  },
  nutrition_lifestyle: {
    name: 'Nutrition & Lifestyle Care',
    slug: 'nutrition-lifestyle',
    description: 'Personalized nutrition plans and lifestyle modification coaching',
    icon: 'Apple',
    color: 'bg-green-500',
    gradient: 'from-green-500 to-emerald-500',
  },
  mental_wellness: {
    name: 'Mental Wellness & Performance Care',
    slug: 'mental-wellness',
    description: 'Sports psychology, stress management, and mental performance coaching',
    icon: 'Brain',
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-violet-500',
  },
  therapeutic_yoga: {
    name: 'Therapeutic Yoga & Wellness',
    slug: 'therapeutic-yoga',
    description: 'Yoga sessions designed for healing, rehabilitation, and mind-body wellness',
    icon: 'Leaf',
    color: 'bg-teal-500',
    gradient: 'from-teal-500 to-cyan-500',
  },
  sports_performance: {
    name: 'Sports Performance & Athlete Development',
    slug: 'sports-performance',
    description: 'Integrated sports performance analysis, injury prevention, and athletic training',
    icon: 'Trophy',
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-amber-500',
  },
  digital_health: {
    name: 'Digital Health & Web Solutions',
    slug: 'digital-health',
    description: 'Tele-rehabilitation, virtual assessments, and remote health monitoring',
    icon: 'Monitor',
    color: 'bg-cyan-500',
    gradient: 'from-cyan-500 to-sky-500',
  },
} as const;

export const DEFAULT_SERVICES = [
  // Pain Relief & Physiotherapy Care
  { name: 'Back Pain Treatment', slug: 'back-pain-treatment', category: 'pain_relief_physiotherapy', description: 'Expert treatment for chronic and acute back pain', duration_minutes: 45, tier1_price: 1200, tier2_price: 800, online_available: true, offline_available: true, home_visit_available: true },
  { name: 'Neck Pain & Cervical Care', slug: 'neck-pain-cervical-care', category: 'pain_relief_physiotherapy', description: 'Specialized care for neck pain and cervical conditions', duration_minutes: 45, tier1_price: 1200, tier2_price: 800, online_available: true, offline_available: true, home_visit_available: true },
  { name: 'Joint Pain Management', slug: 'joint-pain-management', category: 'pain_relief_physiotherapy', description: 'Comprehensive treatment for joint pain', duration_minutes: 45, tier1_price: 1300, tier2_price: 900, online_available: true, offline_available: true, home_visit_available: true },
  
  // Advanced Rehabilitation & Recovery
  { name: 'Post-Surgery Rehabilitation', slug: 'post-surgery-rehabilitation', category: 'advanced_rehabilitation', description: 'Comprehensive rehabilitation after orthopedic surgeries', duration_minutes: 60, tier1_price: 1800, tier2_price: 1200, online_available: false, offline_available: true, home_visit_available: true },
  { name: 'Stroke Rehabilitation', slug: 'stroke-rehabilitation', category: 'advanced_rehabilitation', description: 'Specialized physiotherapy for stroke recovery', duration_minutes: 60, tier1_price: 2000, tier2_price: 1500, online_available: false, offline_available: true, home_visit_available: true },
  { name: 'ACL Reconstruction Rehab', slug: 'acl-reconstruction-rehab', category: 'advanced_rehabilitation', description: 'Specialized ACL reconstruction recovery program', duration_minutes: 60, tier1_price: 1800, tier2_price: 1400, online_available: false, offline_available: true, home_visit_available: true },
  
  // Nutrition & Lifestyle Care
  { name: 'Sports Nutrition Consultation', slug: 'sports-nutrition-consultation', category: 'nutrition_lifestyle', description: 'Personalized nutrition plans for athletes', duration_minutes: 45, tier1_price: 1500, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Weight Management Program', slug: 'weight-management-program', category: 'nutrition_lifestyle', description: 'Comprehensive weight management with diet guidance', duration_minutes: 45, tier1_price: 1200, tier2_price: 800, online_available: true, offline_available: true, home_visit_available: false },
  
  // Mental Wellness & Performance Care
  { name: 'Sports Psychology Consultation', slug: 'sports-psychology-consultation', category: 'mental_wellness', description: 'Mental performance coaching for athletes', duration_minutes: 60, tier1_price: 2000, tier2_price: 1500, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Stress & Anxiety Management', slug: 'stress-anxiety-management', category: 'mental_wellness', description: 'Therapeutic sessions for stress management', duration_minutes: 45, tier1_price: 1500, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: false },
  
  // Therapeutic Yoga & Wellness
  { name: 'Therapeutic Yoga', slug: 'therapeutic-yoga', category: 'therapeutic_yoga', description: 'Yoga sessions for healing and rehabilitation', duration_minutes: 60, tier1_price: 800, tier2_price: 500, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Prenatal Yoga', slug: 'prenatal-yoga', category: 'therapeutic_yoga', description: 'Safe yoga practices for expecting mothers', duration_minutes: 45, tier1_price: 1000, tier2_price: 700, online_available: true, offline_available: true, home_visit_available: false },
  
  // Sports Performance & Athlete Development
  { name: 'Sports Injury Assessment', slug: 'sports-injury-assessment', category: 'sports_performance', description: 'Comprehensive sports injury evaluation', duration_minutes: 60, tier1_price: 1500, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: false },
  { name: 'Biomechanical Analysis', slug: 'biomechanical-analysis', category: 'sports_performance', description: 'Advanced movement analysis for performance', duration_minutes: 90, tier1_price: 3000, tier2_price: 2500, online_available: false, offline_available: true, home_visit_available: false },
  
  // Digital Health & Web Solutions
  { name: 'Tele-Rehabilitation', slug: 'tele-rehabilitation', category: 'digital_health', description: 'Remote physiotherapy via video consultation', duration_minutes: 45, tier1_price: 800, tier2_price: 600, online_available: true, offline_available: false, home_visit_available: false },
  { name: 'Virtual Fitness Assessment', slug: 'virtual-fitness-assessment', category: 'digital_health', description: 'Online fitness and mobility assessment', duration_minutes: 45, tier1_price: 700, tier2_price: 500, online_available: true, offline_available: false, home_visit_available: false },
] as const;

export const APPOINTMENT_MODES = {
  online: {
    name: 'Online Consultation',
    description: 'Video call with doctor via Google Meet',
    icon: 'Video',
  },
  offline: {
    name: 'Clinic Visit',
    description: 'In-person consultation at the clinic',
    icon: 'Building2',
  },
  home_visit: {
    name: 'Home Visit',
    description: 'Doctor visits your home (Premium)',
    icon: 'Home',
  },
} as const;

export const APPOINTMENT_STATUSES = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  no_show: { label: 'No Show', color: 'bg-gray-100 text-gray-800' },
} as const;

export const PAYMENT_STATUSES = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
  refunded: { label: 'Refunded', color: 'bg-blue-100 text-blue-800' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800' },
} as const;
