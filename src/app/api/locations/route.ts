/**
 * H2H Healthcare - Locations API
 * Fetch locations from database (dynamic) with fallback to static data
 */

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { DEFAULT_LOCATIONS } from '@/constants/locations';

// Cache for 5 minutes, revalidate in background
export const revalidate = 300;

interface LocationData {
  id: string;
  name: string;
  city: string;
  address: string;
  tier: number;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  is_active: boolean;
}

/**
 * GET /api/locations
 * Returns all locations or filtered by city/tier
 * Fetches from database with fallback to static data
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const tier = searchParams.get('tier');
    const useStatic = searchParams.get('static') === 'true';

    // Option to use static data (useful during development)
    if (useStatic) {
      let locations = [...DEFAULT_LOCATIONS];
      
      if (city) {
        locations = locations.filter(
          (loc) => loc.city.toLowerCase() === city.toLowerCase()
        );
      }
      
      if (tier) {
        const tierNum = parseInt(tier);
        if (tierNum === 1 || tierNum === 2) {
          locations = locations.filter((loc) => loc.tier === tierNum);
        }
      }

      return NextResponse.json({
        success: true,
        count: locations.length,
        data: locations,
        source: 'static',
      });
    }

    // Fetch from database
    const supabase = createAdminClient();
    
    let query = supabase
      .from('locations')
      .select('*')
      .eq('is_active', true)
      .order('city');

    if (city) {
      query = query.ilike('city', city);
    }

    if (tier) {
      const tierNum = parseInt(tier);
      if (tierNum === 1 || tierNum === 2) {
        query = query.eq('tier', tierNum);
      }
    }

    const { data: locations, error } = await query as { data: LocationData[] | null; error: any };

    if (error) {
      console.error('Database error, falling back to static:', error);
      // Fallback to static data if database fails
      let fallbackLocations = [...DEFAULT_LOCATIONS];
      
      if (city) {
        fallbackLocations = fallbackLocations.filter(
          (loc) => loc.city.toLowerCase() === city.toLowerCase()
        );
      }
      
      if (tier) {
        const tierNum = parseInt(tier);
        if (tierNum === 1 || tierNum === 2) {
          fallbackLocations = fallbackLocations.filter((loc) => loc.tier === tierNum);
        }
      }

      return NextResponse.json({
        success: true,
        count: fallbackLocations.length,
        data: fallbackLocations,
        source: 'static_fallback',
      });
    }

    // If no locations in database, use static
    if (!locations || locations.length === 0) {
      let fallbackLocations = [...DEFAULT_LOCATIONS];
      
      if (city) {
        fallbackLocations = fallbackLocations.filter(
          (loc) => loc.city.toLowerCase() === city.toLowerCase()
        );
      }
      
      if (tier) {
        const tierNum = parseInt(tier);
        if (tierNum === 1 || tierNum === 2) {
          fallbackLocations = fallbackLocations.filter((loc) => loc.tier === tierNum);
        }
      }

      return NextResponse.json({
        success: true,
        count: fallbackLocations.length,
        data: fallbackLocations,
        source: 'static_empty_db',
      });
    }

    return NextResponse.json({
      success: true,
      count: locations.length,
      data: locations,
      source: 'database',
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch locations',
      },
      { status: 500 }
    );
  }
}
