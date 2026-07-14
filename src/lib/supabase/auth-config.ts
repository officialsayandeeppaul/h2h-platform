/**
 * Shared Supabase auth cookie/storage settings.
 * Must match across browser + server clients — especially when the browser
 * uses /api/supabase-proxy while the server uses the real Supabase URL.
 * Mismatched keys cause: "PKCE code verifier not found in storage".
 */
export const SUPABASE_AUTH_STORAGE_KEY = 'sb-h2h-auth';

export function getSupabaseAuthOptions() {
  return {
    auth: {
      flowType: 'pkce' as const,
      storageKey: SUPABASE_AUTH_STORAGE_KEY,
      detectSessionInUrl: true,
    },
    cookieOptions: {
      name: SUPABASE_AUTH_STORAGE_KEY,
      path: '/',
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
    },
  };
}
