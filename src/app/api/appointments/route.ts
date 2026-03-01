import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    const adminClient = createAdminClient();

    let query = adminClient
      .from('appointments')
      .select(`
        *,
        patient:users!appointments_patient_id_fkey(id, full_name, email, phone),
        doctor:doctors(id, user_id, specializations, users(full_name)),
        service:services(id, name, slug, category, duration_minutes),
        location:locations(id, name, city, address)
      `, { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    if (dateFrom) {
      query = query.gte('appointment_date', dateFrom);
    }

    if (dateTo) {
      query = query.lte('appointment_date', dateTo);
    }

    query = query
      .order('appointment_date', { ascending: true })
      .order('start_time', { ascending: true })
      .range((page - 1) * pageSize, page * pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data,
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Static service pricing for demo mode
const STATIC_SERVICE_PRICING: Record<string, { tier1_price: number; tier2_price: number; duration_minutes: number }> = {
  'svc-sports-injury': { tier1_price: 1500, tier2_price: 1000, duration_minutes: 60 },
  'svc-back-pain': { tier1_price: 1200, tier2_price: 800, duration_minutes: 45 },
  'svc-neck-pain': { tier1_price: 1200, tier2_price: 800, duration_minutes: 45 },
  'svc-post-surgery': { tier1_price: 1800, tier2_price: 1200, duration_minutes: 60 },
  'svc-therapeutic-yoga': { tier1_price: 800, tier2_price: 500, duration_minutes: 60 },
  'svc-posture-correction': { tier1_price: 1200, tier2_price: 800, duration_minutes: 45 },
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    console.log('[Appointments API] User:', user?.id, user?.email);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = createAdminClient();

    // Ensure user exists in users table (auto-create if not)
    const { data: existingUser } = await adminClient
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!existingUser) {
      const { error: userError } = await (adminClient
        .from('users') as any)
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          role: 'patient',
        });
      
      if (userError) {
        console.error('Error creating user record:', userError);
        return NextResponse.json({ error: 'Failed to create user record' }, { status: 500 });
      }
    }

    const body = await request.json();
    const {
      doctorId,
      serviceId,
      locationId,
      appointmentDate,
      startTime,
      endTime,
      mode,
      notes,
    } = body;

    if (!doctorId || !serviceId || !locationId || !appointmentDate || !startTime || !mode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if using static/demo data (non-UUID IDs are static)
    const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    const isStaticService = !isUUID(serviceId);
    const isStaticDoctor = !isUUID(doctorId);
    const isStaticLocation = !isUUID(locationId);

    let amount = 1200; // Default amount
    let durationMinutes = 45; // Default duration

    if (isStaticService) {
      // Use static pricing for demo services
      const staticService = STATIC_SERVICE_PRICING[serviceId];
      if (staticService) {
        amount = staticService.tier1_price; // Use tier 1 pricing for demo
        durationMinutes = staticService.duration_minutes;
      }
    } else {
      // Fetch from database
      const { data: service } = await adminClient
        .from('services')
        .select('tier1_price, tier2_price, duration_minutes')
        .eq('id', serviceId)
        .single() as { data: { tier1_price: number; tier2_price: number; duration_minutes: number } | null };

      if (!isStaticLocation) {
        const { data: location } = await adminClient
          .from('locations')
          .select('tier')
          .eq('id', locationId)
          .single() as { data: { tier: number } | null };

        if (service && location) {
          amount = location.tier === 1 ? service.tier1_price : service.tier2_price;
          durationMinutes = service.duration_minutes;
        }
      } else if (service) {
        amount = service.tier1_price;
        durationMinutes = service.duration_minutes;
      }
    }

    const calculatedEndTime = endTime || calculateEndTime(startTime, durationMinutes);

    const { data: appointment, error } = await (adminClient
      .from('appointments') as any)
      .insert({
        patient_id: user.id,
        doctor_id: isStaticDoctor ? null : doctorId, // Store null for static doctors
        service_id: isStaticService ? null : serviceId, // Store null for static services
        location_id: isStaticLocation ? null : locationId,
        appointment_date: appointmentDate,
        start_time: startTime,
        end_time: calculatedEndTime,
        mode,
        amount,
        notes,
        status: 'pending',
        payment_status: 'pending',
        // Store static IDs in metadata for reference
        metadata: {
          static_doctor_id: isStaticDoctor ? doctorId : null,
          static_service_id: isStaticService ? serviceId : null,
          static_location_id: isStaticLocation ? locationId : null,
        },
      })
      .select()
      .single();

    if (error) {
      console.error('Appointment creation error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}
