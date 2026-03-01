/**
 * H2H Healthcare - Single Clinic Center API
 * Get details for a specific clinic center
 */

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ centerId: string }>;
}

/**
 * GET /api/clinic-centers/[centerId]
 * Get a single clinic center with full details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { centerId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date'); // Optional: YYYY-MM-DD
    
    const supabase = await createClient();
    
    // Fetch center with all related data
    const { data: center, error } = await supabase
      .from('clinic_centers')
      .select(`
        *,
        location:locations!clinic_centers_location_id_fkey (
          id,
          name,
          city,
          tier,
          address
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
        ),
        doctors:clinic_center_doctors (
          id,
          is_primary,
          consultation_fee_override,
          doctor:doctors (
            id,
            specializations,
            experience_years,
            rating,
            total_reviews,
            consultation_fee,
            google_meet_enabled,
            user:users!doctors_user_id_fkey (
              full_name,
              avatar_url
            )
          )
        ),
        services:clinic_center_services (
          id,
          price_override,
          service:services (
            id,
            name,
            slug,
            category,
            description,
            duration_minutes,
            tier1_price,
            tier2_price,
            online_available,
            offline_available,
            home_visit_available
          )
        )
      `)
      .eq('id', centerId)
      .eq('is_active', true)
      .single();

    if (error || !center) {
      return NextResponse.json({
        success: false,
        error: 'Clinic center not found',
      }, { status: 404 });
    }

    const centerData = center as any;

    // Check for closures on the specified date
    let closureInfo = null;
    if (date) {
      const { data: closure } = await supabase
        .from('clinic_center_closures')
        .select('*')
        .eq('center_id', centerId)
        .eq('closure_date', date)
        .single();
      
      if (closure) {
        closureInfo = closure;
      }
    }

    // Get current day availability
    const now = new Date();
    const targetDate = date ? new Date(date) : now;
    const dayOfWeek = targetDate.getDay();
    
    const todayAvailability = (centerData.availability as any[])?.find(
      (a: any) => a.day_of_week === dayOfWeek
    );

    // Calculate if open now
    let isOpenNow = false;
    if (todayAvailability?.is_open && !closureInfo) {
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const [openHour, openMin] = todayAvailability.open_time.split(':').map(Number);
      const [closeHour, closeMin] = todayAvailability.close_time.split(':').map(Number);
      const openTime = openHour * 60 + openMin;
      const closeTime = closeHour * 60 + closeMin;
      
      isOpenNow = currentTime >= openTime && currentTime < closeTime;
      
      // Check break time
      if (isOpenNow && todayAvailability.break_start && todayAvailability.break_end) {
        const [breakStartHour, breakStartMin] = todayAvailability.break_start.split(':').map(Number);
        const [breakEndHour, breakEndMin] = todayAvailability.break_end.split(':').map(Number);
        const breakStart = breakStartHour * 60 + breakStartMin;
        const breakEnd = breakEndHour * 60 + breakEndMin;
        
        if (currentTime >= breakStart && currentTime < breakEnd) {
          isOpenNow = false;
        }
      }
    }

    // Process doctors
    const doctors = ((centerData.doctors as any[]) || [])
      .filter((d: any) => d.doctor)
      .map((d: any) => ({
        id: d.doctor.id,
        name: d.doctor.user?.full_name || 'Doctor',
        avatar: d.doctor.user?.avatar_url,
        specializations: d.doctor.specializations || [],
        experience_years: d.doctor.experience_years,
        rating: d.doctor.rating,
        total_reviews: d.doctor.total_reviews,
        consultation_fee: d.consultation_fee_override || d.doctor.consultation_fee,
        google_meet_enabled: d.doctor.google_meet_enabled,
        is_primary: d.is_primary,
      }));

    // Process services
    const services = ((centerData.services as any[]) || [])
      .filter((s: any) => s.service)
      .map((s: any) => ({
        ...s.service,
        price_override: s.price_override,
        effective_price: s.price_override || 
          ((centerData.location as any)?.tier === 1 ? s.service.tier1_price : s.service.tier2_price),
      }));

    // Format availability for week view
    const weekAvailability = Array.from({ length: 7 }, (_, i) => {
      const dayAvail = ((centerData.availability as any[]) || []).find(
        (a: any) => a.day_of_week === i
      );
      return {
        dayOfWeek: i,
        dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i],
        isOpen: dayAvail?.is_open || false,
        openTime: dayAvail?.open_time?.substring(0, 5) || null,
        closeTime: dayAvail?.close_time?.substring(0, 5) || null,
        breakStart: dayAvail?.break_start?.substring(0, 5) || null,
        breakEnd: dayAvail?.break_end?.substring(0, 5) || null,
        maxAppointments: dayAvail?.max_appointments || 0,
        availableSlots: Math.max(0, (dayAvail?.max_appointments || 0) - (dayAvail?.current_bookings || 0)),
        specialNote: dayAvail?.special_note || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        id: centerData.id,
        name: centerData.name,
        slug: centerData.slug,
        address: centerData.address,
        landmark: centerData.landmark,
        pincode: centerData.pincode,
        latitude: centerData.latitude,
        longitude: centerData.longitude,
        phone: centerData.phone,
        email: centerData.email,
        image_url: centerData.image_url,
        facilities: centerData.facilities || [],
        rating: centerData.rating,
        total_reviews: centerData.total_reviews,
        is_featured: centerData.is_featured,
        location: centerData.location,
        isOpenNow,
        isClosed: !!closureInfo,
        closureInfo,
        todayAvailability: todayAvailability ? {
          isOpen: todayAvailability.is_open,
          openTime: todayAvailability.open_time?.substring(0, 5),
          closeTime: todayAvailability.close_time?.substring(0, 5),
          breakStart: todayAvailability.break_start?.substring(0, 5),
          breakEnd: todayAvailability.break_end?.substring(0, 5),
          availableSlots: Math.max(0, todayAvailability.max_appointments - (todayAvailability.current_bookings || 0)),
        } : null,
        weekAvailability,
        doctors,
        services,
        doctorCount: doctors.length,
        serviceCount: services.length,
      },
    });
  } catch (error) {
    console.error('Error fetching clinic center:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
