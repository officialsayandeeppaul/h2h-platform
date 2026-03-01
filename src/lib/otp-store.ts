/**
 * H2H Healthcare - In-memory OTP Store
 * Shared between send-otp and verify-otp routes.
 * Uses globalThis to survive Next.js dev recompilations.
 * In production, replace with Redis or database storage.
 */

interface OTPEntry {
  otp: string;
  expiresAt: number;
  attempts: number;
}

// Use globalThis so the store survives hot reloads / recompilations in dev
const globalStore = globalThis as unknown as { __h2h_otp_store?: Map<string, OTPEntry> };
if (!globalStore.__h2h_otp_store) {
  globalStore.__h2h_otp_store = new Map<string, OTPEntry>();
}
const store = globalStore.__h2h_otp_store;

export function setOTP(email: string, otp: string, ttlMs: number = 5 * 60 * 1000) {
  store.set(email.toLowerCase().trim(), {
    otp,
    expiresAt: Date.now() + ttlMs,
    attempts: 0,
  });
}

export function getOTP(email: string): OTPEntry | undefined {
  return store.get(email.toLowerCase().trim());
}

export function incrementAttempts(email: string) {
  const entry = store.get(email.toLowerCase().trim());
  if (entry) {
    entry.attempts += 1;
  }
}

export function deleteOTP(email: string) {
  store.delete(email.toLowerCase().trim());
}
