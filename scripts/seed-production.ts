/**
 * H2H Production seed — real clinics, doctors, services only.
 * Wipes demo data; keeps super_admin users.
 *
 * Run: npm run db:seed
 * Requires: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env or .env.local
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.error('   Add them to .env or .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const PHONE_MAIN = '+91 62916 15560';
const EMAIL_MAIN = 'official@healtohealth.in';

// ─── Locations ─────────────────────────────────────────────────────────────

const LOC_KOLKATA = '11111111-1111-1111-1111-111111111111';
const LOC_BBSR = '22222222-2222-2222-2222-222222222222';
const LOC_ONLINE = '33333333-3333-3333-3333-333333333333';
const LOC_DELHI = '44444444-4444-4444-4444-444444444444';
const LOC_PURI = '55555555-5555-5555-5555-555555555555';
const LOC_MOHALI = '66666666-6666-6666-6666-666666666666';
const LOC_CHANDIGARH = '77777777-7777-7777-7777-777777777771';
const LOC_ZIRAKPUR = '88888888-8888-8888-8888-888888888881';
const LOC_DERABASSI = '99999999-9999-9999-9999-999999999991';
const LOC_INDORE = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const LOC_DEWAS = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const LOC_DEHRADUN = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

const LOCATIONS = [
  {
    id: LOC_KOLKATA,
    name: 'H2H Kolkata',
    city: 'Kolkata',
    address: '275/1 Bidhanpally Road, near Sonali Park, Basdroni, Kolkata - 700084',
    tier: 2,
    latitude: 22.4758,
    longitude: 88.3575,
    phone: PHONE_MAIN,
    email: EMAIL_MAIN,
    is_active: true,
  },
  {
    id: LOC_BBSR,
    name: 'H2H Bhubaneswar',
    city: 'Bhubaneswar',
    address: 'Motive Physiocare & Physical Fitness Clinic, S-4/96, Neeladri Vihar, CS PUR, Bhubaneswar',
    tier: 2,
    latitude: 20.2961,
    longitude: 85.8245,
    phone: PHONE_MAIN,
    email: EMAIL_MAIN,
    is_active: true,
  },
  {
    id: LOC_ONLINE,
    name: 'H2H Online',
    city: 'Worldwide',
    address: 'Telehealth — available globally',
    tier: 1,
    latitude: null,
    longitude: null,
    phone: PHONE_MAIN,
    email: EMAIL_MAIN,
    is_active: true,
  },
  { id: LOC_DELHI, name: 'H2H Home Visit — Delhi', city: 'Delhi', address: 'Home physiotherapy visits', tier: 1, latitude: 28.6139, longitude: 77.209, phone: PHONE_MAIN, email: EMAIL_MAIN, is_active: true },
  { id: LOC_PURI, name: 'H2H Home Visit — Puri', city: 'Puri', address: 'Home physiotherapy visits', tier: 2, latitude: 19.8135, longitude: 85.8312, phone: PHONE_MAIN, email: EMAIL_MAIN, is_active: true },
  { id: LOC_MOHALI, name: 'H2H Home Visit — Mohali', city: 'Mohali', address: 'Home physiotherapy visits', tier: 2, latitude: 30.7046, longitude: 76.7179, phone: PHONE_MAIN, email: EMAIL_MAIN, is_active: true },
  { id: LOC_CHANDIGARH, name: 'H2H Home Visit — Chandigarh', city: 'Chandigarh', address: 'Home physiotherapy visits', tier: 2, latitude: 30.7333, longitude: 76.7794, phone: PHONE_MAIN, email: EMAIL_MAIN, is_active: true },
  { id: LOC_ZIRAKPUR, name: 'H2H Home Visit — Zirakpur', city: 'Zirakpur', address: 'Home physiotherapy visits', tier: 2, latitude: 30.6425, longitude: 76.8172, phone: PHONE_MAIN, email: EMAIL_MAIN, is_active: true },
  { id: LOC_DERABASSI, name: 'H2H Home Visit — Dera Bassi', city: 'Dera Bassi', address: 'Home physiotherapy visits', tier: 2, latitude: 30.5872, longitude: 76.8428, phone: PHONE_MAIN, email: EMAIL_MAIN, is_active: true },
  { id: LOC_INDORE, name: 'H2H Home Visit — Indore', city: 'Indore', address: 'Home physiotherapy visits', tier: 2, latitude: 22.7196, longitude: 75.8577, phone: PHONE_MAIN, email: EMAIL_MAIN, is_active: true },
  { id: LOC_DEWAS, name: 'H2H Home Visit — Dewas', city: 'Dewas', address: 'Home physiotherapy visits', tier: 2, latitude: 22.9676, longitude: 76.0534, phone: PHONE_MAIN, email: EMAIL_MAIN, is_active: true },
  { id: LOC_DEHRADUN, name: 'H2H Home Visit — Dehradun', city: 'Dehradun', address: 'Home physiotherapy visits', tier: 2, latitude: 30.3165, longitude: 78.0322, phone: PHONE_MAIN, email: EMAIL_MAIN, is_active: true },
];

const CENTER_KOLKATA = 'c1111111-1111-1111-1111-111111111111';
const CENTER_BBSR = 'c2222222-2222-2222-2222-222222222221';

const CLINIC_CENTERS = [
  {
    id: CENTER_KOLKATA,
    location_id: LOC_KOLKATA,
    name: 'H2H Kolkata — Basdroni',
    slug: 'h2h-kolkata-basdroni',
    address: '275/1 Bidhanpally Road, near Sonali Park, Basdroni',
    pincode: '700084',
    phone: PHONE_MAIN,
    email: EMAIL_MAIN,
    facilities: ['Parking', 'Wheelchair Access', 'Treatment Rooms', 'Rehab Equipment'],
    rating: 4.9,
    total_reviews: 0,
    is_featured: true,
    is_active: true,
  },
  {
    id: CENTER_BBSR,
    location_id: LOC_BBSR,
    name: 'H2H × Motive Physiocare',
    slug: 'h2h-bhubaneswar-motive',
    address: 'Motive Physiocare & Physical Fitness Clinic, S-4/96, Neeladri Vihar, CS PUR',
    pincode: '751021',
    phone: PHONE_MAIN,
    email: EMAIL_MAIN,
    facilities: ['Parking', 'Wheelchair Access', 'Gym', 'Physio Lab'],
    rating: 4.8,
    total_reviews: 0,
    is_featured: true,
    is_active: true,
  },
];

// ─── Services (7 categories) ─────────────────────────────────────────────────

const SERVICES = [
  { name: 'Pain Relief Physiotherapy', slug: 'pain-relief-physiotherapy', category: 'pain_relief_physiotherapy', description: 'Hands-on assessment and treatment for pain, stiffness, and mobility.', duration_minutes: 45, tier1_price: 1500, tier2_price: 1000, online_available: true, offline_available: true, home_visit_available: true, is_active: true },
  { name: 'Sports Injury Physiotherapy', slug: 'sports-injury-physiotherapy', category: 'pain_relief_physiotherapy', description: 'Cricket, football, hockey and multi-sport injury care.', duration_minutes: 45, tier1_price: 1800, tier2_price: 1200, online_available: true, offline_available: true, home_visit_available: true, is_active: true },
  { name: 'Advanced Rehabilitation', slug: 'advanced-rehabilitation', category: 'advanced_rehabilitation', description: 'Post-surgery, ACL, and return-to-sport rehabilitation.', duration_minutes: 60, tier1_price: 2000, tier2_price: 1500, online_available: true, offline_available: true, home_visit_available: true, is_active: true },
  { name: 'Return to Sport Program', slug: 'return-to-sport', category: 'advanced_rehabilitation', description: 'Structured load management and RTP testing for athletes.', duration_minutes: 60, tier1_price: 2200, tier2_price: 1600, online_available: false, offline_available: true, home_visit_available: true, is_active: true },
  { name: 'Nutrition & Lifestyle Coaching', slug: 'nutrition-lifestyle-coaching', category: 'nutrition_lifestyle', description: 'Meal planning and lifestyle habits for recovery and performance.', duration_minutes: 45, tier1_price: 1200, tier2_price: 900, online_available: true, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Mental Wellness & Performance', slug: 'mental-wellness-performance', category: 'mental_wellness', description: 'Stress, focus, and performance mindset support.', duration_minutes: 45, tier1_price: 1500, tier2_price: 1000, online_available: true, offline_available: false, home_visit_available: false, is_active: true },
  { name: 'Therapeutic Yoga', slug: 'therapeutic-yoga', category: 'therapeutic_yoga', description: 'Clinical yoga for mobility, breath, and recovery.', duration_minutes: 60, tier1_price: 900, tier2_price: 600, online_available: true, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Sports Performance Assessment', slug: 'sports-performance-assessment', category: 'sports_performance', description: 'Biomechanics, screening, and performance testing for athletes.', duration_minutes: 60, tier1_price: 2500, tier2_price: 1800, online_available: true, offline_available: true, home_visit_available: false, is_active: true },
  { name: 'Elite Athlete Load Management', slug: 'elite-athlete-load-management', category: 'sports_performance', description: 'Tournament prep, workload monitoring, and injury prevention.', duration_minutes: 60, tier1_price: 2200, tier2_price: 1600, online_available: true, offline_available: true, home_visit_available: true, is_active: true },
  { name: 'Tele-Rehabilitation', slug: 'tele-rehabilitation', category: 'digital_health', description: 'Online physiotherapy and exercise review — worldwide.', duration_minutes: 45, tier1_price: 800, tier2_price: 600, online_available: true, offline_available: false, home_visit_available: false, is_active: true },
  { name: 'Home Exercise Program Design', slug: 'home-exercise-program', category: 'digital_health', description: 'Custom home programs with video follow-up.', duration_minutes: 30, tier1_price: 600, tier2_price: 400, online_available: true, offline_available: false, home_visit_available: false, is_active: true },
];

// ─── Doctors ─────────────────────────────────────────────────────────────────

const U_SUKDEB = 'a0d01111-1111-1111-1111-111111111111';
const U_AKSHAT = 'a0d02222-2222-2222-2222-222222222222';
const U_DEEPTI = 'a0d03333-3333-3333-3333-333333333333';

const D_SUKDEB = 'd1111111-1111-1111-1111-111111111111';
const D_AKSHAT = 'd2222222-2222-2222-2222-222222222222';
const D_DEEPTI = 'd3333333-3333-3333-3333-333333333333';

const DOCTOR_USERS = [
  {
    id: U_SUKDEB,
    email: 'sukdebmahanta2@gmail.com',
    full_name: 'Dr. Sukdeb Mahanta',
    phone: '+91 9007086969',
    avatar_url: '/images/about/founders-group.webp',
    role: 'doctor',
    is_active: true,
  },
  {
    id: U_AKSHAT,
    email: 'akshatchouhan83@gmail.com',
    full_name: 'Dr. Akshat Singh Chouhan',
    phone: '+91 62644 25941',
    avatar_url: '/images/about/dr-akshat-chouhan.webp',
    role: 'doctor',
    is_active: true,
  },
  {
    id: U_DEEPTI,
    email: '9778570900jitu@gmail.com',
    full_name: 'Dr. Deepti Ranjan Parida',
    phone: '+91 7978205409',
    avatar_url: '/images/about/team-deepti.webp',
    role: 'doctor',
    is_active: true,
  },
];

const SUKDEB_BIO =
  'Founder & High-Performance Director with 17+ years in elite sports physiotherapy across cricket, football, hockey, and Olympic pathways. Leads National Excellence Centre programmes (MoYAS/SAI), with FIFA and IOC credentials and HPCP (Loughborough). License No. 24395-L.';

const AKSHAT_BIO =
  'Sports Physiotherapist — 38th National Games (Uttarakhand), U-22 Asian Boxing selection trials (ASI Pune), and SAI NCOE internship. First Rank BPT (83.8%); pursuing MPT (Sports). On-field care, rehab, and return-to-sport for boxing, cricket, hockey, and gymnastics.';

const DEEPTI_BIO =
  'Physiotherapist & sports medicine specialist — Bengal U-25 men\'s team physio, CAB U-19/U-25 cricket, Byju\'s Bengal T-20 Challenge. Expert in acute sports injury rehab, prehab, manual therapy, taping, and cricket workload management. MPT Sports Medicine (Utkal University).';

const DOCTORS = [
  {
    id: D_SUKDEB,
    user_id: U_SUKDEB,
    location_id: LOC_KOLKATA,
    specializations: ['High-Performance Physiotherapy', 'Sports Medicine', 'Cricket', 'Football & Hockey'],
    qualifications: ['MPT', 'M.I.A.P', 'M.N.L.S', 'F.C.K.T (U.K)', 'D. USG', 'DNT (HSS-NY)', 'HPCP (Loughborough)', 'FIFA Sports Medicine'],
    experience_years: 17,
    bio: SUKDEB_BIO,
    consultation_fee: 2500,
    rating: 4.9,
    total_reviews: 0,
    google_meet_enabled: true,
    offers_online: true,
    offers_clinic: true,
    offers_home_visit: true,
    home_visit_radius_km: 50,
    is_active: true,
  },
  {
    id: D_AKSHAT,
    user_id: U_AKSHAT,
    location_id: LOC_BBSR,
    specializations: ['Sports Physiotherapy', 'Boxing & Combat Sports', 'Cricket', 'Return to Sport'],
    qualifications: ['BPT (First Rank 83.8%)', 'MPT Sports (Pursuing)', 'EMG Research'],
    experience_years: 4,
    bio: AKSHAT_BIO,
    consultation_fee: 1200,
    rating: 4.8,
    total_reviews: 0,
    google_meet_enabled: true,
    offers_online: true,
    offers_clinic: true,
    offers_home_visit: true,
    home_visit_radius_km: 30,
    is_active: true,
  },
  {
    id: D_DEEPTI,
    user_id: U_DEEPTI,
    location_id: LOC_KOLKATA,
    specializations: ['Sports Physiotherapy', 'Cricket & Sports Medicine', 'Manual Therapy', 'Prehab & Taping', 'Sports Injury Rehab', 'Return to Play'],
    qualifications: ['BPT', 'MPT Sports Medicine', 'Dry Needling', 'ACL Rehab (Physioplus)'],
    experience_years: 10,
    bio: DEEPTI_BIO,
    consultation_fee: 1200,
    rating: 4.8,
    total_reviews: 0,
    google_meet_enabled: true,
    offers_online: true,
    offers_clinic: true,
    offers_home_visit: true,
    home_visit_radius_km: 40,
    is_active: true,
  },
];

function weekdaySlots(
  doctorId: string,
  centerId: string | null,
  days: number[],
  start: string,
  end: string,
  mode: 'online' | 'offline' | 'both'
) {
  return days.map((day_of_week) => ({
    doctor_id: doctorId,
    center_id: centerId,
    day_of_week,
    start_time: start,
    end_time: end,
    mode,
  }));
}

const DOCTOR_AVAILABILITY = [
  ...weekdaySlots(D_SUKDEB, CENTER_KOLKATA, [1, 2, 3, 4, 5, 6], '09:00', '18:00', 'both'),
  ...weekdaySlots(D_SUKDEB, null, [0], '10:00', '14:00', 'online'),
  ...weekdaySlots(D_AKSHAT, CENTER_BBSR, [1, 2, 3, 4, 5, 6], '09:00', '18:00', 'both'),
  ...weekdaySlots(D_AKSHAT, null, [0], '10:00', '13:00', 'online'),
  ...weekdaySlots(D_DEEPTI, CENTER_KOLKATA, [1, 2, 3, 4, 5], '09:00', '17:00', 'both'),
  ...weekdaySlots(D_DEEPTI, null, [6], '09:00', '13:00', 'online'),
];

async function deleteAllData() {
  console.log('\n🗑️  Wiping demo data (keeping super_admin users)...');

  const tables = [
    'notifications',
    'prescriptions',
    'reviews',
    'contact_messages',
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
    const { error } =
      table === 'doctor_services' || table === 'doctor_availability'
        ? await supabase.from(table).delete().gte('doctor_id', '00000000-0000-0000-0000-000000000000')
        : await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) console.log(`  ⚠️  ${table}: ${error.message}`);
    else console.log(`  ✅ ${table}`);
  }

  const { error: uErr } = await supabase.from('users').delete().neq('role', 'super_admin');
  if (uErr) console.log(`  ⚠️  users: ${uErr.message}`);
  else console.log('  ✅ users (kept super_admin)');
}

async function linkDoctorServices() {
  const { data: allServices } = await supabase.from('services').select('id, category');
  if (!allServices?.length) return;

  const ds: { doctor_id: string; service_id: string }[] = [];

  const addAll = (doctorId: string) => {
    allServices.forEach((s) => ds.push({ doctor_id: doctorId, service_id: s.id }));
  };

  addAll(D_SUKDEB);
  allServices
    .filter((s) => s.category !== 'nutrition_lifestyle' && s.category !== 'mental_wellness')
    .forEach((s) => {
      ds.push({ doctor_id: D_AKSHAT, service_id: s.id });
      ds.push({ doctor_id: D_DEEPTI, service_id: s.id });
    });

  const unique = Array.from(new Map(ds.map((x) => [`${x.doctor_id}:${x.service_id}`, x])).values());
  const { error } = await supabase.from('doctor_services').insert(unique);
  if (error) console.error('  ❌ doctor_services:', error.message);
  else console.log(`  ✅ ${unique.length} doctor-service links`);
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   H2H Production Seed — Kolkata, BBSR, 3 doctors        ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  await deleteAllData();

  console.log('\n📍 Locations...');
  const { error: locErr } = await supabase.from('locations').insert(LOCATIONS);
  if (locErr) throw new Error(`locations: ${locErr.message}`);
  console.log(`  ✅ ${LOCATIONS.length} locations (2 clinics + online + home-visit cities)`);

  console.log('🏥 Clinic centers...');
  const { error: cErr } = await supabase.from('clinic_centers').insert(CLINIC_CENTERS);
  if (cErr) throw new Error(`clinic_centers: ${cErr.message}`);
  console.log(`  ✅ ${CLINIC_CENTERS.length} centers`);

  console.log('💊 Services...');
  const { error: sErr } = await supabase.from('services').insert(SERVICES);
  if (sErr) throw new Error(`services: ${sErr.message}`);
  console.log(`  ✅ ${SERVICES.length} services`);

  console.log('👤 Doctor users...');
  const { error: duErr } = await supabase.from('users').insert(DOCTOR_USERS);
  if (duErr) throw new Error(`users: ${duErr.message}`);
  console.log(`  ✅ ${DOCTOR_USERS.length} doctors`);

  console.log('👨‍⚕️ Doctor profiles...');
  const { error: dErr } = await supabase.from('doctors').insert(DOCTORS);
  if (dErr) throw new Error(`doctors: ${dErr.message}`);
  console.log(`  ✅ ${DOCTORS.length} profiles`);

  console.log('📅 Availability...');
  const { error: aErr } = await supabase.from('doctor_availability').insert(DOCTOR_AVAILABILITY);
  if (aErr) throw new Error(`availability: ${aErr.message}`);
  console.log(`  ✅ ${DOCTOR_AVAILABILITY.length} slots`);

  console.log('🔗 Services per doctor...');
  await linkDoctorServices();

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                  ✅ PRODUCTION SEED DONE                  ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('\n📋 Admin portal:');
  console.log('   1. Sign up / login at http://localhost:3000/login');
  console.log('   2. First time: http://localhost:3000/super-admin/login');
  console.log('      → Setup with SUPER_ADMIN_SECRET_KEY from .env');
  console.log('   3. Dashboard: http://localhost:3000/super-admin');
  console.log('\n🗄️  Database access: Supabase Dashboard → Table Editor');
  console.log(`   Project URL: ${supabaseUrl}`);
  console.log('\n⚠️  No demo patients or appointments seeded.');
  console.log('   Delete orphan auth users in Supabase → Authentication if needed.\n');
}

main().catch((err) => {
  console.error('\n❌ Seed failed:', err.message || err);
  process.exit(1);
});
