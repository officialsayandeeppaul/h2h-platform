/**
 * Promote a user to super_admin by email.
 * Creates / syncs the public.users row from Auth if needed.
 *
 * Run: npx tsx scripts/promote-super-admin.ts your@email.com
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

const emailArg = process.argv[2];
if (!emailArg) {
  console.error('Usage: npx tsx scripts/promote-super-admin.ts your@email.com');
  process.exit(1);
}

const email = emailArg.trim().toLowerCase();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

async function findAuthUserByEmail(target: string) {
  // Prefer direct get by listing pages (admin API has no getUserByEmail in all versions)
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const found = data.users.find((u) => u.email?.toLowerCase() === target);
    if (found) return found;
    if (!data.users.length || data.users.length < 200) break;
  }
  return null;
}

async function main() {
  console.log('Looking up:', email);

  let { data: row, error: selectError } = await supabase
    .from('users')
    .select('id, email, full_name, role')
    .ilike('email', email)
    .maybeSingle();

  if (selectError) {
    console.error('users lookup failed:', selectError.message);
    process.exit(1);
  }

  if (!row) {
    console.log('No row in public.users — checking Auth…');
    const authUser = await findAuthUserByEmail(email);
    if (!authUser) {
      console.error('❌ User not found in Auth either.');
      console.error('1) Open the site → /login');
      console.error('2) Sign in once with Google as', email);
      console.error('3) Run this script again.');
      process.exit(1);
    }

    const { data: upserted, error: upsertError } = await supabase
      .from('users')
      .upsert(
        {
          id: authUser.id,
          email: authUser.email,
          full_name:
            authUser.user_metadata?.full_name ||
            authUser.user_metadata?.name ||
            email.split('@')[0],
          role: 'super_admin',
          avatar_url: authUser.user_metadata?.avatar_url || null,
        },
        { onConflict: 'id' }
      )
      .select('id, email, full_name, role')
      .single();

    if (upsertError) {
      console.error('Failed to create users row:', upsertError.message);
      process.exit(1);
    }

    await supabase.auth.admin.updateUserById(authUser.id, {
      user_metadata: { ...authUser.user_metadata, role: 'super_admin' },
      app_metadata: { ...authUser.app_metadata, role: 'super_admin' },
    });

    console.log('✅ Created users row + promoted to super_admin:', upserted);
    console.log('Login: /super-admin/login (or /login?redirect=/super-admin)');
    return;
  }

  const { data, error } = await supabase
    .from('users')
    .update({ role: 'super_admin' })
    .eq('id', row.id)
    .select('id, email, full_name, role')
    .single();

  if (error) {
    console.error('Failed:', error.message);
    process.exit(1);
  }

  await supabase.auth.admin.updateUserById(row.id, {
    user_metadata: { role: 'super_admin' },
    app_metadata: { role: 'super_admin' },
  });

  console.log('✅ Promoted to super_admin:', data);
  console.log('Login: /super-admin/login (or /login?redirect=/super-admin)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
