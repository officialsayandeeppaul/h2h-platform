/**
 * H2H Healthcare - Video Consultation Link Generator
 * When DAILY_API_KEY is set: uses Daily.co - doctor & super admin get owner (host) links.
 * Otherwise: Jitsi Meet fallback - single link for all (first to join is host).
 */
import { createVideoRoom } from './daily';

export function generateJitsiLink(appointmentId: string): string {
  const safeId = appointmentId.replace(/-/g, '').slice(0, 20);
  return `https://meet.jit.si/h2h-${safeId}`;
}

export interface VideoRoomUrls {
  patientUrl: string;
  doctorUrl?: string;
  adminUrl?: string;
}

/**
 * Create video room URLs. Uses Daily.co when API key is set (doctor = host).
 * Falls back to Jitsi otherwise.
 */
function parseAppointmentTime(params: { appointmentDate: string; time?: string }): Date {
  const date = params.appointmentDate || '';
  const time = (params.time || '00:00').slice(0, 5);
  const iso = `${date}T${time}:00+05:30`; // IST
  return new Date(iso);
}

export async function createVideoRoomUrls(params: {
  appointmentId: string;
  doctorName?: string;
  appointmentDate: string;
  startTime?: string;
  endTime?: string;
}): Promise<VideoRoomUrls> {
  const dailyKey = process.env.DAILY_API_KEY?.trim();
  if (dailyKey && dailyKey.length >= 20) {
    try {
      const startDate = parseAppointmentTime({ appointmentDate: params.appointmentDate, time: params.startTime });
      const endDate = parseAppointmentTime({ appointmentDate: params.appointmentDate, time: params.endTime });
      const result = await createVideoRoom({
        appointmentId: params.appointmentId,
        doctorName: params.doctorName || 'Doctor',
        appointmentStartTime: startDate,
        appointmentEndTime: endDate,
      });
      return {
        patientUrl: result.patientUrl,
        doctorUrl: result.doctorUrl,
        adminUrl: result.adminUrl,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[H2H Video] Daily.co failed:', msg);
      if (process.env.NODE_ENV === 'development') {
        console.error('[H2H Video] Tip: Restart dev server after adding DAILY_API_KEY. Test: GET /api/video/test');
      }
    }
  } else if (dailyKey) {
    console.warn('[H2H Video] DAILY_API_KEY too short or invalid, using Jitsi');
  }
  const url = generateJitsiLink(params.appointmentId);
  return { patientUrl: url, doctorUrl: url, adminUrl: url };
}
