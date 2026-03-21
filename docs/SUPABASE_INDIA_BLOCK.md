# Supabase Blocked in India – Fix

## The Problem

Indian ISPs (Jio, Airtel, ACT) have DNS-blocked `*.supabase.co`. Browser requests fail with:

- `net::ERR_NAME_NOT_RESOLVED`
- `AuthRetryableFetchError: Failed to fetch`
- Google login gives **Cloudflare Error 1016** (Cloudflare's edge in India also can't resolve Supabase)

## Fix 1: Vercel API Proxy (Recommended)

This app includes a built-in proxy. Vercel runs in US/EU where Supabase is reachable.

### Step 1: Add Vercel Environment Variables

1. Vercel → Project → **Settings** → **Environment Variables**
2. Add/update:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_USE_PROXY` | `true` |
| `SUPABASE_DIRECT_URL` | `https://njfkgczmuaoqqkpmufun.supabase.co` |

3. Keep `NEXT_PUBLIC_SUPABASE_URL` as `https://njfkgczmuaoqqkpmufun.supabase.co` (used server-side and as fallback)
4. **Save** → **Redeploy**

The browser will use `your-domain.com/api/supabase-proxy` automatically.

**Note:** Supabase Realtime (WebSockets) may not work through this proxy. Auth and REST API will work.

---

## Fix 2: Cloudflare Worker (Alternative)

Cloudflare Workers can hit Error 1016 if the Worker runs in India (same DNS block). Try first; if it fails, use the Vercel proxy above.

1. [dash.cloudflare.com](https://dash.cloudflare.com/) → **Workers & Pages** → **Create Worker**
2. Replace code with the proxy script from the [Dev.to guide](https://dev.to/ritvikdayal/supabase-is-blocked-in-india-heres-the-exact-fix-using-a-cloudflare-worker-2ejf)
3. Set `NEXT_PUBLIC_SUPABASE_URL` to your Worker URL

---

## Fix 3: JioBase (Managed Proxy)

[JioBase](https://app.jiobase.com) offers a managed Supabase proxy. Sign up, add your Supabase URL, and use their proxy URL.
