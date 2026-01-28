import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/dashboard';
  const redirect = searchParams.get('redirect');

  // Use the configured app URL in production, fallback to request origin
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin;

  // Handle OAuth errors (like bad_oauth_state)
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      `${baseUrl}/login?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || '')}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!exchangeError) {
      // Handle different auth types
      if (type === 'recovery') {
        return NextResponse.redirect(`${baseUrl}/reset-password`);
      }
      if (type === 'signup') {
        return NextResponse.redirect(`${baseUrl}/login?verified=true`);
      }
      // Use redirect param if provided, otherwise use next
      const redirectPath = redirect || next;
      return NextResponse.redirect(`${baseUrl}${redirectPath}`);
    }
    
    console.error('Code exchange error:', exchangeError);
  }

  return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`);
}
