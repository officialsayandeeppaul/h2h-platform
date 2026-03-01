/**
 * H2H Healthcare - Services API
 * Fetch services from database (fully dynamic)
 */

import { createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  duration_minutes: number;
  tier1_price: number;
  tier2_price: number;
  online_available: boolean;
  offline_available: boolean;
  home_visit_available: boolean;
  is_active: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const searchParams = request.nextUrl.searchParams;
    
    const category = searchParams.get('category');
    const mode = searchParams.get('mode');
    const locationId = searchParams.get('locationId');
    const centerId = searchParams.get('centerId');

    let services: any[] = [];
    let tier = 1;

    // If centerId is provided, fetch services available at that center
    if (centerId) {
      // First get center's location tier
      const { data: center } = await supabase
        .from('clinic_centers')
        .select('location:locations!clinic_centers_location_id_fkey(id, tier)')
        .eq('id', centerId)
        .single();
      
      if (center && (center as any).location?.tier) {
        tier = (center as any).location.tier;
      }
      
      // Step 1: Get doctor IDs who have availability at this specific center
      const { data: availabilityAtCenter } = await supabase
        .from('doctor_availability')
        .select('doctor_id')
        .eq('center_id', centerId);
      
      if (availabilityAtCenter && availabilityAtCenter.length > 0) {
        const doctorIdsAtCenter = [...new Set(availabilityAtCenter.map((a: any) => a.doctor_id))];
        
        // Step 2: Get these doctors with their services
        const { data: doctors } = await supabase
          .from('doctors')
          .select(`
            id, 
            offers_clinic,
            doctor_services(service_id)
          `)
          .in('id', doctorIdsAtCenter)
          .eq('is_active', true);
        
        if (doctors && doctors.length > 0) {
          // Filter to doctors who offer clinic (default true if null)
          const clinicDoctors = doctors.filter((d: any) => d.offers_clinic !== false);
          
          // Collect all service IDs from doctor_services
          const serviceIds = new Set<string>();
          clinicDoctors.forEach((doc: any) => {
            if (doc.doctor_services && Array.isArray(doc.doctor_services)) {
              doc.doctor_services.forEach((ds: any) => {
                if (ds.service_id) serviceIds.add(ds.service_id);
              });
            }
          });
          
          if (serviceIds.size > 0) {
            // Fetch the actual service details
            const { data: fetchedServices } = await supabase
              .from('services')
              .select('*')
              .in('id', Array.from(serviceIds))
              .eq('is_active', true)
              .eq('offline_available', true)
              .order('name');
            
            if (fetchedServices) {
              services = fetchedServices.map((service: any) => ({
                ...service,
                price: tier === 1 ? service.tier1_price : service.tier2_price,
              }));
            }
          }
        }
      }
    } else if (mode === 'online') {
      // Online mode: Get services from doctors who offer online consultations
      const { data: doctors } = await supabase
        .from('doctors')
        .select(`
          id, 
          offers_online,
          doctor_services(service_id)
        `)
        .eq('is_active', true)
        .eq('offers_online', true);
      
      if (doctors && doctors.length > 0) {
        // Collect all service IDs from doctors who offer online
        const serviceIds = new Set<string>();
        doctors.forEach((doc: any) => {
          if (doc.doctor_services && Array.isArray(doc.doctor_services)) {
            doc.doctor_services.forEach((ds: any) => {
              if (ds.service_id) serviceIds.add(ds.service_id);
            });
          }
        });
        
        if (serviceIds.size > 0) {
          // Fetch the actual service details - only online-available services
          let query = supabase
            .from('services')
            .select('*')
            .in('id', Array.from(serviceIds))
            .eq('is_active', true)
            .eq('online_available', true)
            .order('name');
          
          if (category) {
            query = query.eq('category', category);
          }
          
          const { data: fetchedServices } = await query;
          
          if (fetchedServices) {
            services = fetchedServices.map((service: any) => ({
              ...service,
              price: service.tier1_price, // Online uses tier1 pricing
            }));
          }
        }
      }
    } else {
      // Normal flow - fetch all services
      let query = supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (category) {
        query = query.eq('category', category);
      }

      if (mode === 'offline') {
        query = query.eq('offline_available', true);
      } else if (mode === 'home_visit') {
        query = query.eq('home_visit_available', true);
      }

      const { data: fetchedServices, error } = await query;

      if (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json({
          success: false,
          error: 'Failed to fetch services',
          data: [],
          count: 0,
        }, { status: 500 });
      }

      // Get tier for pricing
      if (locationId && locationId !== 'online') {
        const { data: location } = await supabase
          .from('locations')
          .select('tier')
          .eq('id', locationId)
          .single();
        
        if (location) {
          tier = (location as any).tier || 1;
        }
      }

      services = (fetchedServices || []).map((service: any) => ({
        ...service,
        price: tier === 1 ? service.tier1_price : service.tier2_price,
      }));
    }

    // Apply mode filter if provided (for center services too)
    if (mode && services.length > 0) {
      if (mode === 'online') {
        services = services.filter((s: any) => s.online_available);
      } else if (mode === 'offline') {
        services = services.filter((s: any) => s.offline_available);
      } else if (mode === 'home_visit') {
        services = services.filter((s: any) => s.home_visit_available);
      }
    }

    // Apply category filter if provided (for center services too)
    if (category && services.length > 0) {
      services = services.filter((s: any) => s.category === category);
    }

    return NextResponse.json({
      success: true,
      data: services,
      count: services.length,
      source: centerId ? 'center_services' : 'database',
    });
  } catch (error) {
    console.error('Error in services API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      data: [],
      count: 0,
    }, { status: 500 });
  }
}
