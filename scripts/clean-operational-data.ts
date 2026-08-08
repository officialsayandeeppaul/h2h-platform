/**
 * Clean operational/demo data from DB.
 * KEEPS: users, services, doctors, locations (+ clinic_centers, doctor_services, doctor_availability)
 *
 * Run: npx tsx scripts/clean-operational-data.ts
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** Wipe these — bookings, messages, payments, logs, etc. */
const CLEAR_TABLES: { table: string; filter: 'id' | 'created_at' | 'doctor_id' | 'all' }[] = [
  { table: 'notifications', filter: 'id' },
  { table: 'prescriptions', filter: 'id' },
  { table: 'reviews', filter: 'id' },
  { table: 'payments', filter: 'id' },
  { table: 'appointments', filter: 'id' },
  { table: 'contact_messages', filter: 'id' },
  { table: 'doctor_activity_log', filter: 'id' },
  { table: 'doctor_schedule_change_requests', filter: 'id' },
  { table: 'doctor_date_overrides', filter: 'id' },
  { table: 'invoices', filter: 'id' },
  { table: 'medical_records', filter: 'id' },
  { table: 'video_sessions', filter: 'id' },
  { table: 'call_requests', filter: 'id' },
  { table: 'schedule_requests', filter: 'id' },
  { table: 'blocked_slots', filter: 'id' },
  { table: 'consultation_slot_types', filter: 'id' },
];

/** Keep untouched */
const KEEP = [
  'users',
  'services',
  'doctors',
  'locations',
  'clinic_centers',
  'doctor_services',
  'doctor_availability',
];

async function clearTable(table: string, filter: 'id' | 'created_at' | 'doctor_id' | 'all') {
  let q;
  if (filter === 'doctor_id') {
    q = supabase.from(table).delete().gte('doctor_id', '00000000-0000-0000-0000-000000000000');
  } else if (filter === 'created_at') {
    q = supabase.from(table).delete().gte('created_at', '1970-01-01');
  } else if (filter === 'all') {
    q = supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  } else {
    q = supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  }

  const { error, count } = await q;
  if (error) {
    // Table may not exist — that's fine
    if (/does not exist|schema cache|Could not find/i.test(error.message)) {
      console.log(`  ⏭  ${table} (not present)`);
      return;
    }
    console.log(`  ⚠️  ${table}: ${error.message}`);
    return;
  }
  console.log(`  ✅ ${table} cleared`);
}

async function counts() {
  const tables = [
    ...KEEP,
    'appointments',
    'payments',
    'contact_messages',
    'prescriptions',
    'notifications',
    'reviews',
  ];
  console.log('\n📊 Current counts:');
  for (const t of tables) {
    const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
    if (error) console.log(`  ${t}: —`);
    else console.log(`  ${t}: ${count ?? 0}`);
  }
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  Clean DB — KEEP users / services / doctors / locations  ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('\nKeeping:', KEEP.join(', '));
  console.log('Clearing operational tables…\n');

  await counts();

  console.log('\n🗑️  Clearing…');
  for (const { table, filter } of CLEAR_TABLES) {
    await clearTable(table, filter);
  }

  await counts();
  console.log('\n✨ Done. Core catalog + accounts kept intact.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
