/**
 * H2H Healthcare - Clinic Centers API
 * Fetch clinic centers with availability by city/location
 */

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ClinicCenter {
  id: string;
  location_id: string;
  name: string;
  slug: string;
  address: string;
  landmark: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  image_url: string | null;
  facilities: string[];
  rating: number;
  total_reviews: number;
  is_featured: boolean;
  is_active: boolean;
}

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

interface CenterWithAvailability extends ClinicCenter {
  location: {
    id: string;
    name: string;
    city: string;
    tier: number;
  };
  availability: CenterAvailability[];
  todayAvailability: CenterAvailability | null;
  isOpenNow: boolean;
  nextOpenDay: string | null;
  availableSlots: number;
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
  
  // Check if during break
  if (availability.break_start && availability.break_end) {
    const [breakStartHour, breakStartMin] = availability.break_start.split(':').map(Number);
    const [breakEndHour, breakEndMin] = availability.break_end.split(':').map(Number);
    const breakStart = breakStartHour * 60 + breakStartMin;
    const breakEnd = breakEndHour * 60 + breakEndMin;
    
    if (currentTime >= breakStart && currentTime < breakEnd) {
      return false; // Currently on break
    }
  }
  
  return currentTime >= openTime && currentTime < closeTime;
}

function getNextOpenDay(availability: CenterAvailability[], currentDayOfWeek: number): string | null {
  // Check next 7 days
  for (let i = 1; i <= 7; i++) {
    const checkDay = (currentDayOfWeek + i) % 7;
    const dayAvail = availability.find(a => a.day_of_week === checkDay);
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

/**
 * GET /api/clinic-centers
 * Query params:
 * - city: Filter by city name
 * - locationId: Filter by location ID
 * - featured: Only featured centers
 * - date: Get availability for specific date (YYYY-MM-DD)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const locationId = searchParams.get('locationId');
    const featured = searchParams.get('featured') === 'true';
    const dateParam = searchParams.get('date');
    const serviceId = searchParams.get('serviceId'); // Filter by service
    const serviceSlug = searchParams.get('serviceSlug'); // Filter by service slug
    
    const supabase = createAdminClient();
    
    // If serviceId or serviceSlug is provided, first get centers that support this service
    let centerIdsWithService: string[] | null = null;
    
    if (serviceId || serviceSlug) {
      // Resolve one or many service IDs (booking often passes category keys like pain_relief_physiotherapy)
      let serviceIds: string[] = [];

      if (serviceId) {
        serviceIds = [serviceId];
      } else if (serviceSlug) {
        const raw = serviceSlug.toLowerCase().trim();
        const normalizedSlug = raw.replace(/[\s_]/g, '-').replace(/-+/g, '-');
        const categoryKey = raw.replace(/[-\s]/g, '_');

        // Category match (e.g. pain_relief_physiotherapy → all services in category)
        const { data: byCategory } = await supabase
          .from('services')
          .select('id')
          .eq('is_active', true)
          .eq('category', categoryKey);

        if (byCategory && byCategory.length > 0) {
          serviceIds = byCategory.map((s: any) => s.id);
        }

        // Exact slug match
        if (serviceIds.length === 0) {
          const { data: bySlug } = await supabase
            .from('services')
            .select('id')
            .eq('slug', normalizedSlug)
            .eq('is_active', true);
          if (bySlug?.length) serviceIds = bySlug.map((s: any) => s.id);
        }

        // Fuzzy fallback
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

      if (serviceIds.length > 0) {
        const { data: doctorServices } = await supabase
          .from('doctor_services')
          .select('doctor_id')
          .in('service_id', serviceIds);

        if (doctorServices && doctorServices.length > 0) {
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

          // Location fallback for Both/Clinic slots with null center_id, or offers_clinic doctors
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

          // Last resort: any doctor offering this service with clinic enabled → all active centers
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

          if (centerIdSet.size > 0) {
            centerIdsWithService = [...centerIdSet];
          }
        }

        // Never hide Clinic Visit when centers exist — if service linking failed, show all active centers
        if (!centerIdsWithService || centerIdsWithService.length === 0) {
          centerIdsWithService = null;
        }
      }
    }
    
    // Build query for clinic centers
    let query = supabase
      .from('clinic_centers')
      .select(`
        *,
        location:locations!clinic_centers_location_id_fkey (
          id,
          name,
          city,
          tier
        ),
        availability:clinic_center_availability (
          id,
          center_id,
          day_of_week,
          is_open,
          open_time,
          close_time,
          break_start,
          break_end,
          max_appointments,
          current_bookings,
          special_note
        )
      `)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false });

    if (locationId) {
      query = query.eq('location_id', locationId);
    }

    if (featured) {
      query = query.eq('is_featured', true);
    }
    
    // Filter by centers that support the service
    if (centerIdsWithService) {
      query = query.in('id', centerIdsWithService);
    }

    const { data: centers, error } = await query;

    if (error) {
      console.error('Error fetching clinic centers:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch clinic centers',
      }, { status: 500 });
    }

    // Filter by city if provided (case-insensitive)
    let filteredCenters = centers || [];
    if (city) {
      filteredCenters = filteredCenters.filter((center: any) => 
        center.location?.city?.toLowerCase() === city.toLowerCase()
      );
    }

    // Get current day of week and time
    const now = new Date();
    const currentDayOfWeek = dateParam 
      ? new Date(dateParam).getDay() 
      : now.getDay();

    // Process centers with availability info
    const processedCenters: CenterWithAvailability[] = filteredCenters.map((center: any) => {
      const availability = center.availability || [];
      const todayAvailability = availability.find((a: CenterAvailability) => 
        a.day_of_week === currentDayOfWeek
      ) || null;
      
      return {
        ...center,
        todayAvailability,
        isOpenNow: dateParam ? todayAvailability?.is_open || false : isOpenNow(todayAvailability),
        nextOpenDay: todayAvailability?.is_open ? null : getNextOpenDay(availability, currentDayOfWeek),
        availableSlots: calculateAvailableSlots(todayAvailability),
      };
    });

    // Group by city for easier frontend consumption
    const groupedByCity: Record<string, CenterWithAvailability[]> = {};
    processedCenters.forEach(center => {
      const cityName = center.location?.city || 'Unknown';
      if (!groupedByCity[cityName]) {
        groupedByCity[cityName] = [];
      }
      groupedByCity[cityName].push(center);
    });

    // Get unique cities
    const cities = Object.keys(groupedByCity).sort();

    return NextResponse.json({
      success: true,
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
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
