/**
 * H2H Healthcare - Daily.co Video API
 * Creates private rooms with doctor/admin as host; patient waits in lobby until admitted.
 * - Room: private, enable_knocking (patient must request access)
 * - Doctor + super admin: owner tokens (admit patients, full permissions)
 * - Patient: token with knocking=true (joins lobby; doctor admits)
 * Free tier: 10,000 min/month.
 */

const DAILY_API = 'https://api.daily.co/v1';
const FETCH_TIMEOUT_MS = 15000; // 15s - payment flow must not hang

interface DailyRoom {
  url: string;
  name: string;
}

interface CreateVideoRoomResult {
  patientUrl: string;
  doctorUrl: string;
  adminUrl: string;
}

/** Room name for a given appointment (used for end-consultation API). */
export function getDailyRoomName(appointmentId: string): string {
  return `h2h-${appointmentId.replace(/-/g, '').slice(0, 20)}`;
}

async function dailyFetch(endpoint: string, options: RequestInit = {}, retries = 1): Promise<any> {
  const key = process.env.DAILY_API_KEY?.trim();
  if (!key || key.length < 20) throw new Error('DAILY_API_KEY not configured or invalid');

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(`${DAILY_API}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
        ...options.headers,
      },
    });
    clearTimeout(id);
    if (!res.ok) {
      const err = await res.text();
      const isRetryable = res.status >= 500 || res.status === 429;
      if (isRetryable && retries > 0) {
        await new Promise(r => setTimeout(r, 500));
        return dailyFetch(endpoint, options, retries - 1);
      }
      throw new Error(`Daily API: ${res.status} ${err}`);
    }
    return res.json();
  } catch (e: any) {
    clearTimeout(id);
    if (e.name === 'AbortError' && retries > 0) {
      await new Promise(r => setTimeout(r, 500));
      return dailyFetch(endpoint, options, retries - 1);
    }
    throw e;
  }
}

/**
 * Create a video room with strict meeting window [start, end].
 * nbf = slot start (can't join before); exp = slot end (eject all).
 */
export async function createVideoRoom(params: {
  appointmentId: string;
  doctorName: string;
  appointmentStartTime: Date;
  appointmentEndTime: Date;
}): Promise<CreateVideoRoomResult> {
  const roomName = `h2h-${params.appointmentId.replace(/-/g, '').slice(0, 20)}`;
  const nowSec = Math.floor(Date.now() / 1000);
  const slotStartSec = Math.floor(params.appointmentStartTime.getTime() / 1000);
  const slotEndSec = Math.floor(params.appointmentEndTime.getTime() / 1000);
  const EARLY_JOIN_MINS = 5; // Allow joining lobby 15 min before slot
  const nbf = Math.max(slotStartSec - EARLY_JOIN_MINS * 60, nowSec - 60); // Join from 5 min before; past nbf ok
  const tokenExp = Math.max(slotEndSec, nowSec + 60); // Eject all at slot end; must be future
  const roomExp = Math.max(slotEndSec + 7200, nowSec + 3600); // Room cleanup 2hr after slot end

  const room = (await dailyFetch('/rooms', {
    method: 'POST',
    body: JSON.stringify({
      name: roomName,
      privacy: 'private',
      properties: { nbf, exp: roomExp, enable_knocking: true },
    }),
  })) as DailyRoom & { url?: string };

  const roomUrl = room?.url;
  if (!roomUrl || typeof roomUrl !== 'string') {
    throw new Error(`Daily API: room created but no url in response: ${JSON.stringify(room)}`);
  }
  const doctorName = (params.doctorName || 'Doctor').replace(/^Dr\.?\s*/i, '');

  const tokenProps = (name: string, isOwner: boolean, extra?: Record<string, unknown>) => ({
    room_name: roomName,
    is_owner: isOwner,
    user_name: name,
    nbf, // Can't join before slot start
    exp: tokenExp,
    eject_at_token_exp: true, // Auto-end meeting at slot end for all
    ...extra,
  });

  const doctorTokenRes = await dailyFetch('/meeting-tokens', {
    method: 'POST',
    body: JSON.stringify({ properties: tokenProps(`Dr. ${doctorName}`, true) }),
  });

  const adminTokenRes = await dailyFetch('/meeting-tokens', {
    method: 'POST',
    body: JSON.stringify({ properties: tokenProps('H2H Admin', true) }),
  }) as { token?: string };

  const patientTokenRes = await dailyFetch('/meeting-tokens', {
    method: 'POST',
    body: JSON.stringify({ properties: tokenProps('Patient', false, { knocking: true }) }),
  }) as { token?: string };

  const doctorToken = (doctorTokenRes as { token?: string }).token;
  const adminToken = adminTokenRes.token;
  const patientToken = patientTokenRes.token;
  if (!doctorToken || !adminToken || !patientToken) {
    throw new Error(`Daily API: meeting token missing in response`);
  }

  return {
    patientUrl: `${roomUrl}?t=${patientToken}`,
    doctorUrl: `${roomUrl}?t=${doctorToken}`,
    adminUrl: `${roomUrl}?t=${adminToken}`,
  };
}
