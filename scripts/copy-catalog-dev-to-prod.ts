/**
 * Copy catalog data DEV → PROD without wiping existing production rows.
 *
 * Copies ONLY:
 *   locations, clinic_centers, services,
 *   doctor users (Sukdeb / Akshat / Deepti), doctors,
 *   doctor_services, doctor_availability
 *
 * Skips: patients, payments, appointments, reviews, etc.
 *
 * Usage (PowerShell):
 *   $env:DEV_DATABASE_URL  = "postgresql://postgres:DEV_PASS@db.njfkgczmuaoqqkpmufun.supabase.co:5432/postgres"
 *   $env:PROD_DATABASE_URL = "postgresql://postgres:PROD_PASS@db.wnswqgdvmoyooyuldxdc.supabase.co:5432/postgres"
 *   npm run db:copy-catalog
 *   npm run db:copy-catalog -- --dry-run
 *
 * Safety: UPSERT only (ON CONFLICT). Never DELETE on production.
 */

import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

const DEV_URL = process.env.DEV_DATABASE_URL || process.env.DATABASE_URL_DEV || '';
const PROD_URL = process.env.PROD_DATABASE_URL || process.env.DATABASE_URL_PROD || '';

const DOCTOR_EMAILS = [
  'sukdebmahanta2@gmail.com',
  'akshatchouhan83@gmail.com',
  '9778570900jitu@gmail.com',
];

type Row = Record<string, unknown>;

function assertUrls() {
  if (!DEV_URL || !PROD_URL) {
    console.error(`
❌ Missing database URLs.

PowerShell:
  $env:DEV_DATABASE_URL  = "postgresql://postgres:YOUR_DEV_PASSWORD@db.njfkgczmuaoqqkpmufun.supabase.co:5432/postgres"
  $env:PROD_DATABASE_URL = "postgresql://postgres:YOUR_PROD_PASSWORD@db.wnswqgdvmoyooyuldxdc.supabase.co:5432/postgres"
  npm run db:copy-catalog

Or add DEV_DATABASE_URL / PROD_DATABASE_URL to .env.local
`);
    process.exit(1);
  }

  const host = (url: string) => new URL(url.replace(/^postgresql:/, 'http:')).hostname;
  if (host(DEV_URL) === host(PROD_URL)) {
    console.error('❌ DEV and PROD URLs point at the same host — aborting.');
    process.exit(1);
  }
}

function sqlLiteral(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'NULL';
  if (value instanceof Date) return `'${value.toISOString()}'`;
  return `'${String(value).replace(/'/g, "''")}'`;
}

function textArrayLiteral(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (!Array.isArray(value)) return sqlLiteral(value);
  if (value.length === 0) return `'{}'::text[]`;
  const parts = value.map((v) => `"${String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);
  return `'${`{${parts.join(',')}}`}'::text[]`;
}

function jsonbLiteral(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

async function fetchAll(client: Client, sql: string, params: unknown[] = []) {
  const res = await client.query(sql, params);
  return res.rows as Row[];
}

async function upsertRows(
  client: Client,
  table: string,
  rows: Row[],
  conflictCols: string[],
  columns: string[],
  opts: { arrayCols?: Set<string>; jsonbCols?: Set<string> } = {}
) {
  if (!rows.length) {
    console.log(`  ⏭  ${table}: 0 rows`);
    return;
  }

  const arrayCols = opts.arrayCols || new Set<string>();
  const jsonbCols = opts.jsonbCols || new Set<string>();
  const updateCols = columns.filter((c) => !conflictCols.includes(c));

  for (const row of rows) {
    const values = columns.map((col) => {
      const v = row[col];
      if (arrayCols.has(col)) return textArrayLiteral(v);
      if (jsonbCols.has(col)) return jsonbLiteral(v);
      return sqlLiteral(v);
    });

    const sql = `
INSERT INTO public.${table} (${columns.join(', ')})
VALUES (${values.join(', ')})
ON CONFLICT (${conflictCols.join(', ')}) DO UPDATE SET
  ${updateCols.map((c) => `${c} = EXCLUDED.${c}`).join(',\n  ')};
`;
    await client.query(sql);
  }

  console.log(`  ✅ ${table}: upserted ${rows.length}`);
}

async function ensureAuthUser(prod: Client, user: { id: string; email: string; full_name: string }) {
  const email = user.email.toLowerCase();

  const existing = await fetchAll(
    prod,
    `SELECT id FROM auth.users WHERE id = $1 OR lower(email) = $2 LIMIT 1`,
    [user.id, email]
  );

  if (existing.length) {
    console.log(`  ⏭  auth.users already has ${email}`);
    return existing[0].id as string;
  }

  await prod.query(
    `
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  email_change_token_new, email_change
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  $1, 'authenticated', 'authenticated', $2,
  crypt(gen_random_uuid()::text, gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('full_name', $3::text, 'role', 'doctor'),
  now(), now(), '', '', '', ''
)
ON CONFLICT (id) DO NOTHING;
`,
    [user.id, email, user.full_name]
  );

  try {
    await prod.query(
      `
INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) VALUES (
  $1, $1,
  jsonb_build_object('sub', $1::text, 'email', $2::text),
  'email', $1, now(), now(), now()
)
ON CONFLICT DO NOTHING;
`,
      [user.id, email]
    );
  } catch {
    // identities schema varies across Supabase versions
  }

  console.log(`  ✅ created auth.users for ${email}`);
  return user.id;
}

function pickCols(row: Row, candidates: string[]) {
  return candidates.filter((c) => c in row);
}

async function main() {
  assertUrls();
  const dryRun = process.argv.includes('--dry-run');

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  Copy catalog DEV → PROD (no wipe)                       ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  if (dryRun) console.log('🔎 DRY RUN — will not write to production\n');

  const dev = new Client({ connectionString: DEV_URL, ssl: { rejectUnauthorized: false } });
  const prod = new Client({ connectionString: PROD_URL, ssl: { rejectUnauthorized: false } });

  await dev.connect();
  await prod.connect();
  console.log('✅ Connected to DEV + PROD\n');

  try {
    const locations = await fetchAll(dev, `SELECT * FROM public.locations ORDER BY name`);
    const centers = await fetchAll(dev, `SELECT * FROM public.clinic_centers ORDER BY name`);
    const services = await fetchAll(dev, `SELECT * FROM public.services ORDER BY name`);

    const doctorUsers = await fetchAll(
      dev,
      `SELECT * FROM public.users WHERE lower(email) = ANY($1::text[])`,
      [DOCTOR_EMAILS.map((e) => e.toLowerCase())]
    );

    console.log(`📥 locations: ${locations.length}`);
    console.log(`📥 clinic_centers: ${centers.length}`);
    console.log(`📥 services: ${services.length}`);
    console.log(`📥 doctor users: ${doctorUsers.length}`);
    for (const u of doctorUsers) console.log(`   - ${u.full_name} <${u.email}>`);

    if (!doctorUsers.length) {
      throw new Error('No doctor users found on DEV for Sukdeb/Akshat/Deepti');
    }

    const doctors = await fetchAll(
      dev,
      `SELECT * FROM public.doctors WHERE user_id = ANY($1::uuid[])`,
      [doctorUsers.map((u) => u.id)]
    );
    console.log(`📥 doctors: ${doctors.length}`);

    const doctorIds = doctors.map((d) => d.id);
    const doctorServices = doctorIds.length
      ? await fetchAll(dev, `SELECT * FROM public.doctor_services WHERE doctor_id = ANY($1::uuid[])`, [doctorIds])
      : [];
    const availability = doctorIds.length
      ? await fetchAll(dev, `SELECT * FROM public.doctor_availability WHERE doctor_id = ANY($1::uuid[])`, [doctorIds])
      : [];

    console.log(`📥 doctor_services: ${doctorServices.length}`);
    console.log(`📥 doctor_availability: ${availability.length}`);

    if (dryRun) {
      console.log('\n✅ Dry run complete — no writes.');
      return;
    }

    await prod.query('BEGIN');
    try {
      if (locations.length) {
        await upsertRows(
          prod,
          'locations',
          locations,
          ['id'],
          pickCols(locations[0], [
            'id',
            'name',
            'city',
            'address',
            'tier',
            'latitude',
            'longitude',
            'phone',
            'email',
            'is_active',
          ])
        );
      }

      if (centers.length) {
        await upsertRows(
          prod,
          'clinic_centers',
          centers,
          ['id'],
          pickCols(centers[0], [
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
          ]),
          { jsonbCols: new Set(['facilities']) }
        );
      }

      if (services.length) {
        await upsertRows(
          prod,
          'services',
          services,
          ['id'],
          pickCols(services[0], [
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
          ])
        );
      }

      console.log('\n🔐 Ensuring auth.users for doctors…');
      const finalUserIdByDevId = new Map<string, string>();
      for (const u of doctorUsers) {
        const finalId = await ensureAuthUser(prod, {
          id: u.id as string,
          email: u.email as string,
          full_name: (u.full_name as string) || (u.email as string),
        });
        finalUserIdByDevId.set(u.id as string, finalId);
        u.id = finalId;
      }

      for (const d of doctors) {
        const mapped = finalUserIdByDevId.get(d.user_id as string);
        if (mapped) d.user_id = mapped;
      }

      await upsertRows(
        prod,
        'users',
        doctorUsers,
        ['id'],
        pickCols(doctorUsers[0], [
          'id',
          'email',
          'phone',
          'full_name',
          'avatar_url',
          'role',
          'location_id',
          'is_active',
        ])
      );

      if (doctors.length) {
        const doctorCols = Object.keys(doctors[0]).filter((c) => !['created_at', 'updated_at'].includes(c));
        await upsertRows(prod, 'doctors', doctors, ['id'], doctorCols, {
          arrayCols: new Set(['specializations', 'qualifications']),
        });
      }

      for (const row of doctorServices) {
        await prod.query(
          `
INSERT INTO public.doctor_services (doctor_id, service_id, is_primary)
VALUES ($1, $2, COALESCE($3, false))
ON CONFLICT (doctor_id, service_id) DO UPDATE SET
  is_primary = EXCLUDED.is_primary;
`,
          [row.doctor_id, row.service_id, row.is_primary ?? false]
        );
      }
      if (doctorServices.length) console.log(`  ✅ doctor_services: upserted ${doctorServices.length}`);

      if (availability.length) {
        const availCols = Object.keys(availability[0]).filter((c) => c !== 'created_at');
        await upsertRows(prod, 'doctor_availability', availability, ['id'], availCols);
      }

      await prod.query('COMMIT');
      console.log('\n✅ Done. Production was NOT wiped — only catalog + 3 doctors upserted.');
    } catch (err) {
      await prod.query('ROLLBACK');
      throw err;
    }
  } finally {
    await dev.end().catch(() => {});
    await prod.end().catch(() => {});
  }
}

main().catch((err) => {
  console.error('\n❌ Copy failed:', err.message || err);
  process.exit(1);
});
