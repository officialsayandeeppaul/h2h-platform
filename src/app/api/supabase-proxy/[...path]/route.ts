/**
 * Supabase proxy - bypasses India DNS block on *.supabase.co
 * Vercel runs in US/EU where Supabase is reachable.
 * Use: set NEXT_PUBLIC_SUPABASE_URL to https://your-domain.com/api/supabase-proxy
 */

import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_ORIGIN =
  process.env.SUPABASE_DIRECT_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400',
    },
  });
}

async function proxy(
  request: NextRequest,
  { path }: { path: string[] }
): Promise<NextResponse> {
  if (!SUPABASE_ORIGIN || !SUPABASE_ORIGIN.includes('supabase.co')) {
    return NextResponse.json(
      { error: 'SUPABASE_DIRECT_URL or NEXT_PUBLIC_SUPABASE_URL not configured' },
      { status: 500 }
    );
  }

  const pathStr = path.join('/');
  const targetUrl = `${SUPABASE_ORIGIN.replace(/\/$/, '')}/${pathStr}${request.nextUrl.search}`;

  // Forward only auth/API headers — avoid leaking browser hop-by-hop headers
  // (accept-encoding mismatches cause ERR_CONTENT_DECODING_FAILED).
  const headers = new Headers();
  const allowList = [
    'authorization',
    'apikey',
    'content-type',
    'accept',
    'prefer',
    'x-supabase-api-version',
    'x-client-info',
  ];
  for (const name of allowList) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set('host', new URL(SUPABASE_ORIGIN).host);
  headers.set('accept-encoding', 'identity');

  const body = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer();

  try {
    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      redirect: 'manual', // Pass 302 through for OAuth redirects
    });

    // Node fetch may decompress; never forward encoding headers to the browser
    const resHeaders = new Headers();
    res.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (
        lower === 'content-encoding' ||
        lower === 'content-length' ||
        lower === 'transfer-encoding' ||
        lower === 'connection'
      ) {
        return;
      }
      resHeaders.set(key, value);
    });
    resHeaders.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');

    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      return NextResponse.redirect(res.headers.get('location')!, res.status);
    }

    const responseBody = await res.arrayBuffer();
    return new NextResponse(responseBody, {
      status: res.status,
      statusText: res.statusText,
      headers: resHeaders,
    });
  } catch (err) {
    console.error('Supabase proxy error:', err);
    return NextResponse.json(
      { error: 'Failed to reach Supabase' },
      { status: 502 }
    );
  }
}
