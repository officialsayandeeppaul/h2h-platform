/**
 * H2H Healthcare - Clinic Center Types
 */

export interface ClinicCenter {
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

export interface CenterAvailability {
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

export interface CenterWithAvailability extends ClinicCenter {
  location: {
    id: string;
    name: string;
    city: string;
    tier: number;
  };
  availability: CenterAvailability[];
  todayAvailability: {
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    availableSlots: number;
  } | null;
  isOpenNow: boolean;
  nextOpenDay: string | null;
  availableSlots: number;
}

export interface DayAvailability {
  dayOfWeek: number;
  dayName: string;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
  breakStart: string | null;
  breakEnd: string | null;
  availableSlots: number;
  specialNote: string | null;
}

export interface CenterDoctor {
  id: string;
  name: string;
  avatar: string | null;
  specializations: string[];
  experience_years: number;
  rating: number;
  total_reviews: number;
  consultation_fee: number;
  google_meet_enabled: boolean;
  is_primary: boolean;
}

export interface CenterService {
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
  price_override: number | null;
  effective_price: number;
}

export interface City {
  name: string;
  centerCount: number;
  tier: number;
}

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
export const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
