/**
 * H2H Healthcare - Clinic Centers API
 * Fetch clinic centers with availability by city/location
 *
 * Note: Does NOT require clinic_center_availability (missing on some prod DBs).
 * That join was causing 500s and hiding Clinic Visit on booking.
 */

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import {
  H2H_FALLBACK_CLINIC_CENTERS,
  groupCentersByCity,
} from '@/constants/clinic-centers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CenterAvailability {
  id: string;
  center_id: string;
  day_of_week: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
  break_start: string | null;
  break_end: string | null;
  max_appointments: number;
  current_bookings: number;
  special_note: string | null;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function isOpenNow(availability: CenterAvailability | null): boolean {
  if (!availability || !availability.is_open) return false;

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const [openHour, openMin] = availability.open_time.split(':').map(Number);
  const [closeHour, closeMin] = availability.close_time.split(':').map(Number);

  const openTime = openHour * 60 + openMin;
  const closeTime = closeHour * 60 + closeMin;

  if (availability.break_start && availability.break_end) {
    const [breakStartHour, breakStartMin] = availability.break_start.split(':').map(Number);
    const [breakEndHour, breakEndMin] = availability.break_end.split(':').map(Number);
    const breakStart = breakStartHour * 60 + breakStartMin;
    const breakEnd = breakEndHour * 60 + breakEndMin;

    if (currentTime >= breakStart && currentTime < breakEnd) {
      return false;
    }
  }

  return currentTime >= openTime && currentTime < closeTime;
}

function getNextOpenDay(availability: CenterAvailability[], currentDayOfWeek: number): string | null {
  for (let i = 1; i <= 7; i++) {
    const checkDay = (currentDayOfWeek + i) % 7;
    const dayAvail = availability.find((a) => a.day_of_week === checkDay);
    if (dayAvail?.is_open) {
      return DAY_NAMES[checkDay];
    }
  }
  return null;
}

function calculateAvailableSlots(availability: CenterAvailability | null): number {
  if (!availability || !availability.is_open) return 0;
  return Math.max(0, availability.max_appointments - availability.current_bookings);
}

async function resolveServiceDoctorCenterIds(
  supabase: ReturnType<typeof createAdminClient>,
  serviceId: string | null,
  serviceSlug: string | null
): Promise<string[] | null> {
  if (!serviceId && !serviceSlug) return null;

  let serviceIds: string[] = [];

  if (serviceId) {
    serviceIds = [serviceId];
  } else if (serviceSlug) {
    const raw = serviceSlug.toLowerCase().trim();
    const normalizedSlug = raw.replace(/[\s_]/g, '-').replace(/-+/g, '-');
    const categoryKey = raw.replace(/[-\s]/g, '_');

    const { data: byCategory } = await supabase
      .from('services')
      .select('id')
      .eq('is_active', true)
      .eq('category', categoryKey);

    if (byCategory && byCategory.length > 0) {
      serviceIds = byCategory.map((s: any) => s.id);
    }

    if (serviceIds.length === 0) {
      const { data: bySlug } = await supabase
        .from('services')
        .select('id')
        .eq('slug', normalizedSlug)
        .eq('is_active', true);
      if (bySlug?.length) serviceIds = bySlug.map((s: any) => s.id);
    }

    if (serviceIds.length === 0) {
      const { data: allServices } = await supabase
        .from('services')
        .select('id, slug, name, category')
        .eq('is_active', true);

      if (allServices) {
        const searchTerms = raw.replace(/[-_]/g, ' ').split(' ').filter(Boolean);
        const matched = allServices.filter((s: any) => {
          if (s.category === categoryKey || s.category === raw) return true;
          const slugMatch =
            s.slug === normalizedSlug ||
            s.slug?.includes(normalizedSlug) ||
            normalizedSlug.includes(s.slug || '');
          const nameWords = s.name.toLowerCase().replace(/[&]/g, 'and').split(/\s+/);
          const nameMatch = searchTerms.some((term: string) =>
            nameWords.some((word: string) => word.includes(term) || term.includes(word))
          );
          return slugMatch || nameMatch;
        });
        serviceIds = matched.map((s: any) => s.id);
      }
    }
  }

  if (serviceIds.length === 0) return null;

  const { data: doctorServices } = await supabase
    .from('doctor_services')
    .select('doctor_id')
    .in('service_id', serviceIds);

  if (!doctorServices?.length) return null;

  const doctorIds = [...new Set(doctorServices.map((ds: any) => ds.doctor_id))];
  const centerIdSet = new Set<string>();

  const { data: availability } = await supabase
    .from('doctor_availability')
    .select('center_id, mode, doctor_id')
    .in('doctor_id', doctorIds)
    .eq('is_available', true);

  const clinicCapable = (availability || []).filter((a: any) => {
    const mode = a.mode || 'both';
    return mode === 'offline' || mode === 'both';
  });

  for (const row of clinicCapable) {
    if (row.center_id) centerIdSet.add(row.center_id);
  }

  const { data: doctorsMeta } = await supabase
    .from('doctors')
    .select('id, location_id, offers_clinic')
    .in('id', doctorIds)
    .eq('is_active', true);

  const locationIds = [
    ...new Set(
      (doctorsMeta || [])
        .filter((d: any) => {
          if (d.offers_clinic === false || !d.location_id) return false;
          const rows = clinicCapable.filter((a: any) => a.doctor_id === d.id);
          if (rows.length === 0) return d.offers_clinic === true;
          return rows.some((a: any) => !a.center_id) || d.offers_clinic === true;
        })
        .map((d: any) => d.location_id as string)
    ),
  ];

  if (locationIds.length > 0) {
    const { data: fallbackCenters } = await supabase
      .from('clinic_centers')
      .select('id')
      .in('location_id', locationIds)
      .eq('is_active', true);

    for (const c of fallbackCenters || []) {
      if (c.id) centerIdSet.add(c.id);
    }
  }

  if (centerIdSet.size === 0) {
    const anyClinicDoctor = (doctorsMeta || []).some((d: any) => d.offers_clinic !== false);
    if (anyClinicDoctor || clinicCapable.length > 0) {
      const { data: allCenters } = await supabase
        .from('clinic_centers')
        .select('id')
        .eq('is_active', true);
      for (const c of allCenters || []) {
        if (c.id) centerIdSet.add(c.id);
      }
    }
  }

  return centerIdSet.size > 0 ? [...centerIdSet] : null;
}

/**
 * GET /api/clinic-centers
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const locationId = searchParams.get('locationId');
    const featured = searchParams.get('featured') === 'true';
    const dateParam = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');
    const serviceSlug = searchParams.get('serviceSlug');

    const supabase = createAdminClient();

    const centerIdsWithService = await resolveServiceDoctorCenterIds(
      supabase,
      serviceId,
      serviceSlug
    );

    // Minimal columns — avoid missing-column / missing-table joins that 500 on prod
    let query = supabase
      .from('clinic_centers')
      .select(
        `
        id,
        location_id,
        name,
        slug,
        address,
        phone,
        email,
        facilities,
        rating,
        total_reviews,
        is_featured,
        is_active,
        location:locations (
          id,
          name,
          city,
          tier
        )
      `
      )
      .eq('is_active', true)
      .order('is_featured', { ascending: false });

    if (locationId) {
      query = query.eq('location_id', locationId);
    }

    if (featured) {
      query = query.eq('is_featured', true);
    }

    if (centerIdsWithService) {
      query = query.in('id', centerIdsWithService);
    }

    let { data: centers, error } = await query;

    // Fallback if location embed fails (ambiguous FK / missing constraint name)
    if (error) {
      console.error('clinic-centers embed error, retrying flat:', error.message || error);
      let flat = supabase
        .from('clinic_centers')
        .select('id, location_id, name, slug, address, phone, email, facilities, rating, total_reviews, is_featured, is_active')
        .eq('is_active', true)
        .order('is_featured', { ascending: false });

      if (locationId) flat = flat.eq('location_id', locationId);
      if (featured) flat = flat.eq('is_featured', true);
      if (centerIdsWithService) flat = flat.in('id', centerIdsWithService);

      const flatRes = await flat;
      if (flatRes.error) {
        console.error('Error fetching clinic centers:', flatRes.error);
        // Never leave booking online-only — return known H2H centers
        const fallback = [...H2H_FALLBACK_CLINIC_CENTERS];
        const grouped = groupCentersByCity(fallback);
        return NextResponse.json({
          success: true,
          version: 'centers-v2-fallback',
          detail: flatRes.error.message,
          data: {
            centers: fallback,
            groupedByCity: grouped,
            cities: Object.keys(grouped).sort(),
            totalCenters: fallback.length,
            currentDay: DAY_NAMES[new Date().getDay()],
            currentDayOfWeek: new Date().getDay(),
          },
        });
      }

      const locIds = [
        ...new Set((flatRes.data || []).map((c: any) => c.location_id).filter(Boolean)),
      ];
      let locMap: Record<string, any> = {};
      if (locIds.length > 0) {
        const { data: locs } = await supabase
          .from('locations')
          .select('id, name, city, tier')
          .in('id', locIds);
        for (const loc of locs || []) {
          locMap[loc.id] = loc;
        }
      }

      centers = (flatRes.data || []).map((c: any) => ({
        ...c,
        location: locMap[c.location_id] || null,
      }));
      error = null;
    }

    // Empty DB rows → still show known centers
    if (!centers || centers.length === 0) {
      const fallback = [...H2H_FALLBACK_CLINIC_CENTERS];
      const grouped = groupCentersByCity(fallback);
      return NextResponse.json({
        success: true,
        version: 'centers-v2-empty-fallback',
        data: {
          centers: fallback,
          groupedByCity: grouped,
          cities: Object.keys(grouped).sort(),
          totalCenters: fallback.length,
          currentDay: DAY_NAMES[new Date().getDay()],
          currentDayOfWeek: new Date().getDay(),
        },
      });
    }

    let filteredCenters = centers || [];
    if (city) {
      filteredCenters = filteredCenters.filter(
        (center: any) => center.location?.city?.toLowerCase() === city.toLowerCase()
      );
    }

    const now = new Date();
    const currentDayOfWeek = dateParam ? new Date(dateParam).getDay() : now.getDay();

    // Optional hours — ignore if table missing
    let availByCenter: Record<string, CenterAvailability[]> = {};
    try {
      const centerIds = filteredCenters.map((c: any) => c.id).filter(Boolean);
      if (centerIds.length > 0) {
        const { data: hours, error: hoursErr } = await supabase
          .from('clinic_center_availability')
          .select(
            'id, center_id, day_of_week, is_open, open_time, close_time, break_start, break_end, max_appointments, current_bookings, special_note'
          )
          .in('center_id', centerIds);

        if (!hoursErr && hours) {
          for (const row of hours as CenterAvailability[]) {
            if (!availByCenter[row.center_id]) availByCenter[row.center_id] = [];
            availByCenter[row.center_id].push(row);
          }
        }
      }
    } catch {
      // table may not exist
    }

    const processedCenters = filteredCenters.map((center: any) => {
      const availability = availByCenter[center.id] || [];
      const todayAvailability =
        availability.find((a) => a.day_of_week === currentDayOfWeek) || null;

      return {
        ...center,
        availability,
        todayAvailability,
        isOpenNow: todayAvailability
          ? dateParam
            ? todayAvailability.is_open
            : isOpenNow(todayAvailability)
          : true, // no hours row → treat as open for booking UI
        nextOpenDay: todayAvailability?.is_open
          ? null
          : getNextOpenDay(availability, currentDayOfWeek),
        availableSlots: todayAvailability ? calculateAvailableSlots(todayAvailability) : 20,
      };
    });

    const groupedByCity: Record<string, typeof processedCenters> = {};
    processedCenters.forEach((center) => {
      const cityName = center.location?.city || 'Unknown';
      if (!groupedByCity[cityName]) groupedByCity[cityName] = [];
      groupedByCity[cityName].push(center);
    });

    const cities = Object.keys(groupedByCity).sort();

    return NextResponse.json({
      success: true,
      version: 'centers-v2',
      data: {
        centers: processedCenters,
        groupedByCity,
        cities,
        totalCenters: processedCenters.length,
        currentDay: DAY_NAMES[currentDayOfWeek],
        currentDayOfWeek,
      },
    });
  } catch (error) {
    console.error('Error in clinic centers API:', error);
    const fallback = [...H2H_FALLBACK_CLINIC_CENTERS];
    const grouped = groupCentersByCity(fallback);
    return NextResponse.json({
      success: true,
      version: 'centers-v2-catch-fallback',
      data: {
        centers: fallback,
        groupedByCity: grouped,
        cities: Object.keys(grouped).sort(),
        totalCenters: fallback.length,
        currentDay: DAY_NAMES[new Date().getDay()],
        currentDayOfWeek: new Date().getDay(),
      },
    });
  }
}
