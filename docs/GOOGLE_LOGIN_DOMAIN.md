# Google Login - Show Your Domain Instead of supabase.co

When users click "Sign in with Google", the consent screen shows `njfkgczmuaoqqkpmufun.supabase.co` because Supabase handles the OAuth callback on their domain.

## Quick Fix (Supabase Dashboard)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. **Authentication** → **URL Configuration**
3. Set **Site URL** to `https://beta.healtohealth.in`
4. Add to **Redirect URLs**: `https://beta.healtohealth.in/auth/callback`, `https://beta.healtohealth.in/**`
5. Save

This ensures users are redirected to your domain after login. The Google consent screen will still show `supabase.co` during the OAuth step.

## Show Your Domain on Google Consent Screen (Pro Plan)

To show `beta.healtohealth.in` on the Google consent screen instead of supabase.co:

1. **Supabase Pro plan** – enables Custom Auth domains
2. Set up a custom auth domain in Supabase (e.g. `auth.healtohealth.in`)
3. Configure Google OAuth client with the custom domain

## Alternative: Custom OAuth Implementation

Implement your own OAuth flow with redirect to your domain and exchange the code with Supabase – requires more development.
