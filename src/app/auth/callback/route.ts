import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getRequestOrigin } from '@/lib/auth/app-url';
import { getSupabaseAuthOptions } from '@/lib/supabase/auth-config';
import type { Database } from '@/types/database';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/dashboard';
  const redirect = searchParams.get('redirect');

  // Always redirect on the same host that received OAuth
  const baseUrl = getRequestOrigin(request);

  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      `${baseUrl}/login?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || '')}`
    );
  }

  if (code) {
    const cookieStore = await cookies();
    const authOptions = getSupabaseAuthOptions();
    let redirectPath =
      type === 'recovery'
        ? '/reset-password'
        : type === 'signup'
          ? '/login?verified=true'
          : redirect || next;
    if (!redirectPath.startsWith('/')) redirectPath = `/${redirectPath}`;

    const response = NextResponse.redirect(`${baseUrl}${redirectPath}`);

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        ...authOptions,
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return response;
    }

    console.error('Code exchange error:', exchangeError.message, exchangeError);
    return NextResponse.redirect(
      `${baseUrl}/login?error=auth_failed&error_description=${encodeURIComponent(exchangeError.message)}`
    );
  }

  return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`);
}
