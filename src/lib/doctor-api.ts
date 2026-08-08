/**
 * H2H Healthcare - Doctor API Helper
 * Resolves the logged-in doctor from doctor_session cookie and returns doctor record id.
 * Use in all /api/doctor/* routes.
 */

import { cookies } from 'next/headers';
import { verifyDoctorSession } from '@/lib/doctor-session';
import { createAdminClient } from '@/lib/supabase/server';

export interface DoctorApiContext {
  userId: string;
  email: string;
  fullName: string;
  doctorId: string;
}

/**
 * Ensure a doctors profile row exists for a user with role=doctor.
 * Manual role flips in Table Editor often skip this row → APIs return Unauthorized.
 */
async function ensureDoctorProfile(
  adminClient: ReturnType<typeof createAdminClient>,
  userId: string
): Promise<string | null> {
  const { data: existing } = await adminClient
    .from('doctors')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing?.id) {
    // Reactivate if previously soft-disabled
    await adminClient.from('doctors').update({ is_active: true }).eq('id', existing.id);
    return existing.id as string;
  }

  const { data: userRow } = await adminClient
    .from('users')
    .select('id, role')
    .eq('id', userId)
    .maybeSingle();

  if (!userRow || (userRow as { role?: string }).role !== 'doctor') {
    return null;
  }

  const { data: created, error } = await adminClient
    .from('doctors')
    .insert({
      user_id: userId,
      specializations: [] as string[],
      qualifications: [] as string[],
      experience_years: 0,
      consultation_fee: 1000,
      rating: 5,
      total_reviews: 0,
      google_meet_enabled: true,
      offers_online: true,
      offers_clinic: true,
      offers_home_visit: false,
      home_visit_radius_km: 30,
      is_active: true,
    })
    .select('id')
    .single();

  if (error || !created) {
    console.error('Failed to auto-create doctor profile:', error?.message);
    return null;
  }

  return (created as { id: string }).id;
}

/**
 * Returns the current doctor context from the request (cookie).
 * Use in server-side API routes. Returns null if not authenticated or not a doctor.
 */
export async function getDoctorFromRequest(): Promise<DoctorApiContext | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('doctor_session')?.value;
  if (!token) return null;

  const session = verifyDoctorSession(token);
  if (!session) return null;

  const adminClient = createAdminClient();

  const { data: activeDoctor } = await adminClient
    .from('doctors')
    .select('id')
    .eq('user_id', session.id)
    .eq('is_active', true)
    .maybeSingle();

  let doctorId = (activeDoctor as { id?: string } | null)?.id ?? null;

  if (!doctorId) {
    doctorId = await ensureDoctorProfile(adminClient, session.id);
  }

  if (!doctorId) return null;

  return {
    userId: session.id,
    email: session.email,
    fullName: session.fullName,
    doctorId,
  };
}
