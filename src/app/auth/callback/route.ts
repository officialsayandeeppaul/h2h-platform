import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/dashboard';

  // Handle OAuth errors (like bad_oauth_state)
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || '')}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!exchangeError) {
      // Handle different auth types
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/reset-password`);
      }
      if (type === 'signup') {
        return NextResponse.redirect(`${origin}/login?verified=true`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
    
    console.error('Code exchange error:', exchangeError);
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
