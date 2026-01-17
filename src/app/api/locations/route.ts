import { NextResponse } from 'next/server';
import { DEFAULT_LOCATIONS } from '@/constants/locations';

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

/**
 * GET /api/locations
 * Returns all locations or filtered by city/tier
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const tier = searchParams.get('tier');

    let locations = [...DEFAULT_LOCATIONS];

    // Filter by city if provided
    if (city) {
      locations = locations.filter(
        (loc) => loc.city.toLowerCase() === city.toLowerCase()
      );
    }

    // Filter by tier if provided
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
