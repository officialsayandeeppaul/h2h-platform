/**
 * H2H Healthcare - Daily.co connectivity test
 * GET /api/video/test - Returns whether Daily API is reachable.
 * Use to verify DAILY_API_KEY is set and valid.
 */
import { NextResponse } from 'next/server';

const DAILY_API = 'https://api.daily.co/v1';

export async function GET() {
  const key = process.env.DAILY_API_KEY?.trim();
  if (!key) {
    return NextResponse.json({
      ok: false,
      provider: 'none',
      error: 'DAILY_API_KEY not set. Add it to .env and restart the server.',
    }, { status: 200 });
  }
  if (key.length < 20) {
    return NextResponse.json({
      ok: false,
      provider: 'none',
      error: 'DAILY_API_KEY too short or invalid.',
    }, { status: 200 });
  }

  try {
    const res = await fetch(`${DAILY_API}/rooms`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (res.status === 401) {
      return NextResponse.json({
        ok: false,
        provider: 'daily',
        error: 'Invalid DAILY_API_KEY (401). Check your key at dashboard.daily.co',
      }, { status: 200 });
    }
    if (res.status === 403) {
      return NextResponse.json({
        ok: false,
        provider: 'daily',
        error: 'DAILY_API_KEY forbidden (403). Check your Daily domain/permissions.',
      }, { status: 200 });
    }
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({
        ok: false,
        provider: 'daily',
        error: `Daily API returned ${res.status}: ${text.slice(0, 200)}`,
      }, { status: 200 });
    }

    return NextResponse.json({
      ok: true,
      provider: 'daily',
      message: 'Daily.co API is reachable. New paid appointments will use Daily links.',
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    const isTimeout = msg.includes('timeout') || msg.includes('aborted');
    return NextResponse.json({
      ok: false,
      provider: 'daily',
      error: isTimeout ? 'Request to Daily API timed out. Check network/firewall.' : msg,
    }, { status: 200 });
  }
}
