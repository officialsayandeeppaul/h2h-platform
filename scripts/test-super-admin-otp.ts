/**
 * Quick sanity checks for super-admin OTP helpers.
 * Run: npx tsx scripts/test-super-admin-otp.ts
 */

process.env.RESEND_API_KEY = process.env.RESEND_API_KEY || 're_test_placeholder';

import { setOTP } from '../src/lib/otp-store';
import {
  getSuperAdminOtpEmail,
  maskEmail,
  verifySuperAdminCreationOtp,
} from '../src/lib/super-admin-otp';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const email = 'candidate@example.com';
setOTP(`super-admin-create:${email}`, '123456', 60_000);

assert(maskEmail('official.sayandeeppaul@gmail.com').includes('***@'), 'maskEmail failed');
assert(getSuperAdminOtpEmail().includes('@'), 'otp email missing');

const bad = verifySuperAdminCreationOtp(email, '000000');
assert(!bad.ok, 'wrong otp should fail');

const good = verifySuperAdminCreationOtp(email, '123456');
assert(good.ok, 'correct otp should pass');

const reused = verifySuperAdminCreationOtp(email, '123456');
assert(!reused.ok, 'otp should be single-use');

console.log('✓ super-admin OTP checks passed');
console.log('  default OTP inbox:', getSuperAdminOtpEmail());
console.log('  masked sample:', maskEmail(getSuperAdminOtpEmail()));
