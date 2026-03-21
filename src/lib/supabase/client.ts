import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export function createClient() {
  // Use proxy when SUPABASE_USE_PROXY=true (for India block workaround)
  const useProxy = process.env.NEXT_PUBLIC_SUPABASE_USE_PROXY === 'true';
  const baseUrl = useProxy && typeof window !== 'undefined'
    ? `${window.location.origin}/api/supabase-proxy`
    : process.env.NEXT_PUBLIC_SUPABASE_URL!;

  return createBrowserClient<Database>(
    baseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
