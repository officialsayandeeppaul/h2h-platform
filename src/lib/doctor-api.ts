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
  const { data: doctorRow, error } = await adminClient
    .from('doctors')
    .select('id')
    .eq('user_id', session.id)
    .eq('is_active', true)
    .single();

  if (error || !doctorRow) return null;

  return {
    userId: session.id,
    email: session.email,
    fullName: session.fullName,
    doctorId: (doctorRow as { id: string }).id,
  };
}
