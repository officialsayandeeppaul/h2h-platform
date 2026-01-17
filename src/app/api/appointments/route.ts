import { createClient } from '@/lib/supabase/server';
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

    let query = supabase
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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const { data: service } = await supabase
      .from('services')
      .select('tier1_price, tier2_price, duration_minutes')
      .eq('id', serviceId)
      .single() as { data: { tier1_price: number; tier2_price: number; duration_minutes: number } | null };

    const { data: location } = await supabase
      .from('locations')
      .select('tier')
      .eq('id', locationId)
      .single() as { data: { tier: number } | null };

    if (!service || !location) {
      return NextResponse.json({ error: 'Invalid service or location' }, { status: 400 });
    }

    const amount = location.tier === 1 ? service.tier1_price : service.tier2_price;
    const calculatedEndTime = endTime || calculateEndTime(startTime, service.duration_minutes);

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        patient_id: user.id,
        doctor_id: doctorId,
        service_id: serviceId,
        location_id: locationId,
        appointment_date: appointmentDate,
        start_time: startTime,
        end_time: calculatedEndTime,
        mode,
        amount,
        notes,
        status: 'pending',
        payment_status: 'pending',
      } as any)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: appointment }, { status: 201 });
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
