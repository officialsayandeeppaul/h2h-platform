/**
 * H2H Healthcare - Doctor Profile API
 * GET: full profile (user + doctor + services + location)
 * PATCH: update profile (full_name, phone, bio, specializations, qualifications, experience_years, consultation_fee)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDoctorFromRequest } from '@/lib/doctor-api';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const doctor = await getDoctorFromRequest();
    if (!doctor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminClient = createAdminClient();
    const { data: row, error } = await adminClient
      .from('doctors')
      .select(`
        id, user_id, location_id, specializations, qualifications, experience_years,
        bio, google_calendar_id, google_meet_enabled, consultation_fee, rating, total_reviews,
        is_active, created_at,
        user:user_id(id, full_name, email, phone, avatar_url),
        location:location_id(id, name, city, address),
        doctor_services(service_id)
      `)
      .eq('id', doctor.doctorId)
      .single();

    if (error || !row) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const raw = row as any;
    const services = raw.doctor_services?.map((ds: any) => ds.service_id) ?? [];

    const profile = {
      id: raw.id,
      userId: raw.user_id,
      fullName: raw.user?.full_name ?? doctor.fullName,
      email: raw.user?.email ?? doctor.email,
      phone: raw.user?.phone ?? null,
      avatarUrl: raw.user?.avatar_url ?? null,
      specializations: Array.isArray(raw.specializations) ? raw.specializations : [],
      qualifications: Array.isArray(raw.qualifications) ? raw.qualifications : [],
      experienceYears: raw.experience_years ?? 0,
      bio: raw.bio ?? '',
      consultationFee: Number(raw.consultation_fee ?? 1000),
      googleMeetEnabled: raw.google_meet_enabled ?? true,
      rating: Number(raw.rating ?? 0),
      totalReviews: raw.total_reviews ?? 0,
      isActive: raw.is_active ?? true,
      locationId: raw.location_id,
      location: raw.location
        ? { id: raw.location.id, name: raw.location.name, city: raw.location.city, address: raw.location.address }
        : null,
      services,
      createdAt: raw.created_at,
    };

    return NextResponse.json({ success: true, data: profile });
  } catch (e) {
    console.error('Doctor profile GET error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const doctor = await getDoctorFromRequest();
    if (!doctor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const adminClient = createAdminClient();

    const { data: doctorRow } = await adminClient
      .from('doctors')
      .select('user_id')
      .eq('id', doctor.doctorId)
      .single();

    if (!doctorRow) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const userId = (doctorRow as any).user_id;

    const userUpdates: Record<string, unknown> = {};
    if (typeof body.fullName === 'string') userUpdates.full_name = body.fullName.trim();
    if (typeof body.phone === 'string') userUpdates.phone = body.phone.trim() || null;
    if (typeof body.avatarUrl === 'string') userUpdates.avatar_url = body.avatarUrl.trim() || null;

    const doctorUpdates: Record<string, unknown> = {};
    if (typeof body.bio === 'string') doctorUpdates.bio = body.bio.trim() || null;
    if (Array.isArray(body.specializations)) doctorUpdates.specializations = body.specializations.filter(Boolean);
    if (Array.isArray(body.qualifications)) doctorUpdates.qualifications = body.qualifications.filter(Boolean);
    if (typeof body.experienceYears === 'number') doctorUpdates.experience_years = Math.max(0, body.experienceYears);
    // consultation_fee and google_meet_enabled: doctors cannot modify — only admin can. Ignored here.

    if (Object.keys(userUpdates).length > 0) {
      const { error: userErr } = await adminClient.from('users').update(userUpdates).eq('id', userId);
      if (userErr) {
        console.error('Doctor profile user update error:', userErr);
        return NextResponse.json({ error: userErr.message }, { status: 500 });
      }
    }

    if (Object.keys(doctorUpdates).length > 0) {
      const { error: doctorErr } = await adminClient
        .from('doctors')
        .update(doctorUpdates)
        .eq('id', doctor.doctorId);
      if (doctorErr) {
        console.error('Doctor profile doctor update error:', doctorErr);
        return NextResponse.json({ error: doctorErr.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Profile updated' });
  } catch (e) {
    console.error('Doctor profile PATCH error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
