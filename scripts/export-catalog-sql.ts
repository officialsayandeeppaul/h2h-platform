/**
 * Export DEV catalog (locations/services/3 doctors) to a SQL upsert file.
 * No production connection needed — run the generated SQL in Supabase SQL Editor on PROD.
 *
 * Usage: npm run db:export-catalog
 * Output: scripts/output/catalog-upsert-prod.sql
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const DOCTOR_EMAILS = [
  'sukdebmahanta2@gmail.com',
  'akshatchouhan83@gmail.com',
  '9778570900jitu@gmail.com',
];

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type Row = Record<string, unknown>;

function lit(v: unknown, cast?: string): string {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL';

  if (Array.isArray(v)) {
    // text[] columns need Postgres array literals; jsonb needs real JSON arrays
    if (cast === 'text[]') {
      if (!v.length) return `'{}'::text[]`;
      const parts = v.map((x) => `"${String(x).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);
      return `'${`{${parts.join(',')}}`}'::text[]`;
    }
    return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
  }

  if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
  const s = `'${String(v).replace(/'/g, "''")}'`;
  return cast && cast !== 'text[]' && cast !== 'jsonb' ? `${s}::${cast}` : s;
}

function upsertSql(
  table: string,
  rows: Row[],
  cols: string[],
  conflict: string,
  castCols: Record<string, string> = {}
) {
  if (!rows.length) return `-- ${table}: nothing to copy\n`;
  const lines: string[] = [`-- ${table}: ${rows.length} rows`];
  for (const row of rows) {
    const values = cols.map((c) => lit(row[c], castCols[c]));
    const conflictSet = new Set(conflict.split(',').map((x) => x.trim()));
    const updates = cols.filter((c) => !conflictSet.has(c));
    lines.push(`INSERT INTO public.${table} (${cols.join(', ')})
VALUES (${values.join(', ')})
ON CONFLICT (${conflict}) DO UPDATE SET
  ${updates.map((c) => `${c} = EXCLUDED.${c}`).join(',\n  ')};`);
  }
  return lines.join('\n\n') + '\n';
}

async function main() {
  console.log('Exporting catalog from DEV…', supabaseUrl);

  const { data: locations, error: locErr } = await supabase.from('locations').select('*');
  if (locErr) throw new Error(locErr.message);

  const { data: centers, error: cErr } = await supabase.from('clinic_centers').select('*');
  if (cErr) throw new Error(cErr.message);

  const { data: services, error: sErr } = await supabase.from('services').select('*');
  if (sErr) throw new Error(sErr.message);

  const { data: doctorUsers, error: uErr } = await supabase
    .from('users')
    .select('*')
    .in('email', DOCTOR_EMAILS);
  if (uErr) throw new Error(uErr.message);

  // Also try case variants
  let users = doctorUsers || [];
  if (!users.length) {
    const { data: allDocs } = await supabase.from('users').select('*').eq('role', 'doctor');
    users = (allDocs || []).filter((u) =>
      DOCTOR_EMAILS.includes(String(u.email).toLowerCase())
    );
  }

  console.log(`locations=${locations?.length || 0} centers=${centers?.length || 0} services=${services?.length || 0} doctors=${users.length}`);
  for (const u of users) console.log(`  - ${u.full_name} <${u.email}>`);

  const userIds = users.map((u) => u.id);
  const { data: doctors } = userIds.length
    ? await supabase.from('doctors').select('*').in('user_id', userIds)
    : { data: [] as Row[] };

  const doctorIds = (doctors || []).map((d) => d.id);
  const { data: doctorServices } = doctorIds.length
    ? await supabase.from('doctor_services').select('*').in('doctor_id', doctorIds)
    : { data: [] as Row[] };
  const { data: availability } = doctorIds.length
    ? await supabase.from('doctor_availability').select('*').in('doctor_id', doctorIds)
    : { data: [] as Row[] };

  const outDir = path.join(process.cwd(), 'scripts', 'output');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'catalog-upsert-prod.sql');

  const parts: string[] = [];
  parts.push(`-- H2H catalog upsert for PRODUCTION
-- Generated from DEV — NO DELETES. Safe to re-run (ON CONFLICT upsert).
-- Doctors: Sukdeb, Akshat, Deepti only. No patients/payments/appointments.
--
-- Run in: Supabase PROD → SQL Editor
-- Project: wnswqgdvmoyooyuldxdc
`);

  parts.push('BEGIN;');

  // Auth users first (minimal) so public.users FK works
  for (const u of users) {
    parts.push(`
-- auth user for ${u.email}
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  email_change_token_new, email_change
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  '${u.id}'::uuid,
  'authenticated',
  'authenticated',
  '${String(u.email).toLowerCase().replace(/'/g, "''")}',
  crypt(gen_random_uuid()::text, gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('full_name', '${String(u.full_name || '').replace(/'/g, "''")}', 'role', 'doctor'),
  now(), now(), '', '', '', ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE id = '${u.id}'::uuid OR lower(email) = '${String(u.email).toLowerCase().replace(/'/g, "''")}'
);`);
  }

  if (locations?.length) {
    parts.push(
      upsertSql(
        'locations',
        locations,
        ['id', 'name', 'city', 'address', 'tier', 'latitude', 'longitude', 'phone', 'email', 'is_active'].filter(
          (c) => c in locations[0]
        ),
        'id'
      )
    );
  }

  if (centers?.length) {
    parts.push(
      upsertSql(
        'clinic_centers',
        centers,
        [
          'id',
          'location_id',
          'name',
          'slug',
          'address',
          'pincode',
          'phone',
          'email',
          'facilities',
          'rating',
          'total_reviews',
          'is_featured',
          'is_active',
        ].filter((c) => c in centers[0]),
        'id',
        { facilities: 'jsonb' }
      )
    );
  }

  if (services?.length) {
    parts.push(
      upsertSql(
        'services',
        services,
        [
          'id',
          'name',
          'slug',
          'category',
          'description',
          'duration_minutes',
          'tier1_price',
          'tier2_price',
          'online_available',
          'offline_available',
          'home_visit_available',
          'is_active',
        ].filter((c) => c in services[0]),
        'id'
      )
    );
  }

  if (users.length) {
    parts.push('-- users: update by email if exists, else insert (never clash on users_email_key)');
    for (const u of users) {
      const email = String(u.email).toLowerCase().replace(/'/g, "''");
      const seedId = u.id;
      const phone = u.phone == null ? 'NULL' : `'${String(u.phone).replace(/'/g, "''")}'`;
      const fullName = u.full_name == null ? 'NULL' : `'${String(u.full_name).replace(/'/g, "''")}'`;
      const avatar = u.avatar_url == null ? 'NULL' : `'${String(u.avatar_url).replace(/'/g, "''")}'`;
      const role = u.role == null ? `'doctor'` : `'${String(u.role).replace(/'/g, "''")}'`;
      const locationId = u.location_id == null ? 'NULL' : `'${u.location_id}'::uuid`;
      const isActive = u.is_active === false ? 'FALSE' : 'TRUE';

      parts.push(`UPDATE public.users SET
  phone = ${phone},
  full_name = ${fullName},
  avatar_url = ${avatar},
  role = ${role},
  location_id = ${locationId},
  is_active = ${isActive}
WHERE lower(email) = '${email}';

INSERT INTO public.users (id, email, phone, full_name, avatar_url, role, location_id, is_active)
SELECT
  COALESCE(
    (SELECT id FROM auth.users WHERE lower(email) = '${email}' LIMIT 1),
    '${seedId}'::uuid
  ),
  '${email}',
  ${phone},
  ${fullName},
  ${avatar},
  ${role},
  ${locationId},
  ${isActive}
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE lower(email) = '${email}'
);`);
    }
  }

  if (doctors?.length) {
    const userIdToEmail = new Map(users.map((u) => [u.id as string, String(u.email).toLowerCase()]));
    parts.push('-- doctors: user_id resolved from prod users.email (not hardcoded DEV uuid)');
    for (const d of doctors) {
      const email = userIdToEmail.get(d.user_id as string);
      if (!email) {
        throw new Error(`No email for doctor user_id ${d.user_id}`);
      }
      const emailSql = email.replace(/'/g, "''");
      const asTextArray = (v: unknown) => {
        if (!Array.isArray(v)) return 'NULL';
        if (!v.length) return `'{}'::text[]`;
        const partsArr = v.map((x) => `"${String(x).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);
        return `'${`{${partsArr.join(',')}}`}'::text[]`;
      };

      parts.push(`INSERT INTO public.doctors (
  id, user_id, location_id, specializations, qualifications, experience_years, bio,
  google_calendar_id, google_meet_enabled, consultation_fee, rating, total_reviews, is_active,
  offers_online, offers_clinic, offers_home_visit, home_visit_radius_km
)
VALUES (
  '${d.id}',
  (SELECT id FROM public.users WHERE lower(email) = '${emailSql}' LIMIT 1),
  ${d.location_id == null ? 'NULL' : `'${d.location_id}'::uuid`},
  ${asTextArray(d.specializations)},
  ${asTextArray(d.qualifications)},
  ${d.experience_years == null ? 'NULL' : Number(d.experience_years)},
  ${d.bio == null ? 'NULL' : `'${String(d.bio).replace(/'/g, "''")}'`},
  ${d.google_calendar_id == null ? 'NULL' : `'${String(d.google_calendar_id).replace(/'/g, "''")}'`},
  ${d.google_meet_enabled === false ? 'FALSE' : 'TRUE'},
  ${d.consultation_fee == null ? 'NULL' : Number(d.consultation_fee)},
  ${d.rating == null ? 'NULL' : Number(d.rating)},
  ${d.total_reviews == null ? '0' : Number(d.total_reviews)},
  ${d.is_active === false ? 'FALSE' : 'TRUE'},
  ${d.offers_online === false ? 'FALSE' : 'TRUE'},
  ${d.offers_clinic === false ? 'FALSE' : 'TRUE'},
  ${d.offers_home_visit === false ? 'FALSE' : 'TRUE'},
  ${d.home_visit_radius_km == null ? 'NULL' : Number(d.home_visit_radius_km)}
)
ON CONFLICT (id) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  location_id = EXCLUDED.location_id,
  specializations = EXCLUDED.specializations,
  qualifications = EXCLUDED.qualifications,
  experience_years = EXCLUDED.experience_years,
  bio = EXCLUDED.bio,
  google_calendar_id = EXCLUDED.google_calendar_id,
  google_meet_enabled = EXCLUDED.google_meet_enabled,
  consultation_fee = EXCLUDED.consultation_fee,
  rating = EXCLUDED.rating,
  total_reviews = EXCLUDED.total_reviews,
  is_active = EXCLUDED.is_active,
  offers_online = EXCLUDED.offers_online,
  offers_clinic = EXCLUDED.offers_clinic,
  offers_home_visit = EXCLUDED.offers_home_visit,
  home_visit_radius_km = EXCLUDED.home_visit_radius_km;`);
    }
  }

  for (const row of doctorServices || []) {
    parts.push(`INSERT INTO public.doctor_services (doctor_id, service_id, is_primary)
VALUES ('${row.doctor_id}', '${row.service_id}', ${row.is_primary ? 'TRUE' : 'FALSE'})
ON CONFLICT (doctor_id, service_id) DO UPDATE SET is_primary = EXCLUDED.is_primary;`);
  }

  if (availability?.length) {
    const cols = Object.keys(availability[0]).filter((c) => c !== 'created_at');
    parts.push(upsertSql('doctor_availability', availability, cols, 'id'));
  }

  parts.push('COMMIT;');
  parts.push('-- Done. No existing production data was deleted.');

  fs.writeFileSync(outFile, parts.join('\n\n') + '\n', 'utf8');
  console.log(`\n✅ Wrote ${outFile}`);
  console.log('Next: open Supabase PROD → SQL Editor → paste & run that file.');
}

main().catch((err) => {
  console.error('❌', err.message || err);
  process.exit(1);
});
