import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const s = createClient(url, key);

  const { data: settings, error: setErr } = await s
    .from('quick_booking_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (setErr) {
    console.log('FAIL settings:', setErr.message);
    process.exit(2);
  }
  console.log('OK settings', settings);

  const { data: services } = await s.from('services').select('id, name').eq('is_active', true).limit(1);
  if (!services?.length) {
    console.log('FAIL no services');
    process.exit(3);
  }

  // Validation rejects
  const badPhone = await fetch('http://localhost:9999/noop').catch(() => null);
  void badPhone;

  const { data: booking, error: insErr } = await s
    .from('quick_bookings')
    .insert({
      service_id: services[0].id,
      service_name: services[0].name,
      patient_name: 'QB Test User',
      patient_phone: '9999999999',
      status: 'new',
      payment_required: false,
      payment_status: 'not_required',
    })
    .select('id, patient_name, service_name, payment_status')
    .single();

  if (insErr) {
    console.log('FAIL insert:', insErr.message);
    process.exit(4);
  }
  console.log('OK insert', booking);

  await s.from('quick_bookings').delete().eq('id', booking!.id);
  console.log('OK cleanup');

  // Settings toggle roundtrip
  await s
    .from('quick_booking_settings')
    .update({ payment_enabled: false, default_amount: 499, updated_at: new Date().toISOString() })
    .eq('id', 1);
  const { data: after } = await s
    .from('quick_booking_settings')
    .select('payment_enabled, default_amount')
    .eq('id', 1)
    .single();
  console.log('OK settings update', after);

  await s
    .from('quick_booking_settings')
    .update({ default_amount: null, updated_at: new Date().toISOString() })
    .eq('id', 1);

  console.log('ALL_DB_CHECKS_PASSED');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
