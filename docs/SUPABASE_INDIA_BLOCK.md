# Supabase Blocked in India – Fix with Cloudflare Worker

## The Problem

Indian ISPs (Jio, Airtel, ACT) have DNS-blocked `*.supabase.co`. Browser requests fail with:

- `net::ERR_NAME_NOT_RESOLVED`
- `AuthRetryableFetchError: Failed to fetch`
- Login/auth pages hang
- Realtime, storage, and DB calls from the browser fail

Server-side code (API routes, Vercel server) may work because it runs outside India.

## The Fix: Cloudflare Worker Proxy (Free)

Route browser Supabase requests through a Cloudflare Worker. The Worker runs on `*.workers.dev`, which is reachable in India.

### Step 1: Create the Cloudflare Worker

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com/) → **Workers & Pages** → **Create Worker**
2. Name it `supabase-proxy` → **Deploy**
3. **Edit code** and replace with:

```javascript
const SUPABASE_ORIGIN = 'https://njfkgczmuaoqqkpmufun.supabase.co';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const targetUrl = SUPABASE_ORIGIN + url.pathname + url.search;

    const headers = new Headers(request.headers);
    headers.set('host', new URL(SUPABASE_ORIGIN).host);

    if (request.headers.get('Upgrade') === 'websocket') {
      return fetch(targetUrl, { headers, method: request.method });
    }

    return fetch(targetUrl, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'follow',
    });
  },
};
```

4. **Deploy** and copy your Worker URL, e.g. `https://supabase-proxy.<account>.workers.dev`

### Step 2: Update Vercel Environment Variable

1. Vercel → Project → **Settings** → **Environment Variables**
2. Edit `NEXT_PUBLIC_SUPABASE_URL`:
   - **Before:** `https://njfkgczmuaoqqkpmufun.supabase.co`
   - **After:** `https://supabase-proxy.<your-account>.workers.dev`
3. **Save** → **Redeploy**

`NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` stay the same.

### Step 3: Verify

- Open the app from an Indian network
- DevTools → Network: requests should go to `*.workers.dev` with 200 OK instead of `ERR_NAME_NOT_RESOLVED`

## Alternative: JioBase (Managed Proxy)

[JioBase](https://app.jiobase.com) offers a managed Supabase proxy. Sign up, add your Supabase URL, and use their proxy URL instead of `supabase.co`.

## References

- [Dev.to: Supabase India fix with Cloudflare Worker](https://dev.to/ritvikdayal/supabase-is-blocked-in-india-heres-the-exact-fix-using-a-cloudflare-worker-2ejf)
- [JioBase](https://github.com/sunithvs/jiobase)
