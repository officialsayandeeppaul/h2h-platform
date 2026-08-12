/** Known H2H clinic centers — used when /api/clinic-centers fails so booking isn't online-only. */
export const H2H_FALLBACK_CLINIC_CENTERS = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    location_id: '11111111-1111-1111-1111-111111111111',
    name: 'H2H Kolkata — Basdroni',
    slug: 'h2h-kolkata-basdroni',
    address: '275/1 Bidhanpally Road, near Sonali Park, Basdroni',
    pincode: '700084',
    phone: '+91 62916 15560',
    email: 'official@healtohealth.in',
    facilities: ['Parking', 'Wheelchair Access', 'Treatment Rooms', 'Rehab Equipment'],
    rating: 4.9,
    total_reviews: 0,
    is_featured: true,
    is_active: true,
    location: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'H2H Kolkata',
      city: 'Kolkata',
      tier: 2,
    },
    availability: [] as unknown[],
    todayAvailability: null,
    isOpenNow: true,
    nextOpenDay: null,
    availableSlots: 20,
  },
  {
    id: 'c2222222-2222-2222-2222-222222222221',
    location_id: '22222222-2222-2222-2222-222222222222',
    name: 'H2H × Motive Physiocare',
    slug: 'h2h-bhubaneswar-motive',
    address: 'Motive Physiocare & Physical Fitness Clinic, S-4/96, Neeladri Vihar, CS PUR',
    pincode: '751021',
    phone: '+91 62916 15560',
    email: 'official@healtohealth.in',
    facilities: ['Parking', 'Wheelchair Access', 'Gym', 'Physio Lab'],
    rating: 4.8,
    total_reviews: 0,
    is_featured: true,
    is_active: true,
    location: {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'H2H Bhubaneswar',
      city: 'Bhubaneswar',
      tier: 2,
    },
    availability: [] as unknown[],
    todayAvailability: null,
    isOpenNow: true,
    nextOpenDay: null,
    availableSlots: 20,
  },
] as const;

export function groupCentersByCity<T extends { location?: { city?: string } | null }>(
  centers: T[]
): Record<string, T[]> {
  const grouped: Record<string, T[]> = {};
  for (const center of centers) {
    const cityName = center.location?.city || 'Unknown';
    if (!grouped[cityName]) grouped[cityName] = [];
    grouped[cityName].push(center);
  }
  return grouped;
}
