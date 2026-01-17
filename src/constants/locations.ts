export interface Location {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  tier: 1 | 2;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  timings: string;
  services: string[];
  facilities: string[];
  image?: string;
}

export const DEFAULT_LOCATIONS: Location[] = [
  {
    id: 'mumbai-andheri',
    name: 'H2H Mumbai - Andheri',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Shop 12, Ground Floor, Andheri West, Mumbai - 400058',
    tier: 1,
    latitude: 19.1197,
    longitude: 72.8464,
    phone: '+91 1800 123 4567',
    email: 'mumbai@healtohealth.in',
    timings: 'Mon-Sat: 8:00 AM - 8:00 PM, Sun: 9:00 AM - 5:00 PM',
    services: ['Sports Rehabilitation', 'Pain Management', 'Physiotherapy', 'Yoga & Wellness'],
    facilities: ['Advanced Equipment', 'Private Rooms', 'Parking Available', 'Wheelchair Accessible'],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop',
  },
  {
    id: 'bangalore-koramangala',
    name: 'H2H Bangalore - Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    address: '3rd Floor, 80 Feet Road, Koramangala, Bangalore - 560034',
    tier: 1,
    latitude: 12.9352,
    longitude: 77.6245,
    phone: '+91 1800 123 4567',
    email: 'bangalore@healtohealth.in',
    timings: 'Mon-Sat: 8:00 AM - 8:00 PM, Sun: 9:00 AM - 5:00 PM',
    services: ['Sports Rehabilitation', 'Pain Management', 'Physiotherapy', 'Yoga & Wellness'],
    facilities: ['Advanced Equipment', 'Private Rooms', 'Parking Available', 'Wheelchair Accessible'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
  },
  {
    id: 'delhi-saket',
    name: 'H2H Delhi - Saket',
    city: 'Delhi',
    state: 'Delhi',
    address: 'B-12, Select Citywalk Mall, Saket, New Delhi - 110017',
    tier: 1,
    latitude: 28.5274,
    longitude: 77.2190,
    phone: '+91 1800 123 4567',
    email: 'delhi@healtohealth.in',
    timings: 'Mon-Sat: 8:00 AM - 8:00 PM, Sun: 9:00 AM - 5:00 PM',
    services: ['Sports Rehabilitation', 'Pain Management', 'Physiotherapy', 'Yoga & Wellness'],
    facilities: ['Advanced Equipment', 'Private Rooms', 'Parking Available', 'Wheelchair Accessible'],
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop',
  },
  {
    id: 'pune-kothrud',
    name: 'H2H Pune - Kothrud',
    city: 'Pune',
    state: 'Maharashtra',
    address: '45, Paud Road, Kothrud, Pune - 411038',
    tier: 2,
    latitude: 18.5074,
    longitude: 73.8077,
    phone: '+91 1800 123 4567',
    email: 'pune@healtohealth.in',
    timings: 'Mon-Sat: 8:00 AM - 8:00 PM, Sun: 9:00 AM - 5:00 PM',
    services: ['Pain Management', 'Physiotherapy', 'Yoga & Wellness'],
    facilities: ['Modern Equipment', 'Parking Available', 'Wheelchair Accessible'],
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop',
  },
  {
    id: 'hyderabad-banjara',
    name: 'H2H Hyderabad - Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Road No. 12, Banjara Hills, Hyderabad - 500034',
    tier: 1,
    latitude: 17.4156,
    longitude: 78.4347,
    phone: '+91 1800 123 4567',
    email: 'hyderabad@healtohealth.in',
    timings: 'Mon-Sat: 8:00 AM - 8:00 PM, Sun: 9:00 AM - 5:00 PM',
    services: ['Sports Rehabilitation', 'Pain Management', 'Physiotherapy', 'Yoga & Wellness'],
    facilities: ['Advanced Equipment', 'Private Rooms', 'Parking Available', 'Wheelchair Accessible'],
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
  },
  {
    id: 'jaipur-malviya',
    name: 'H2H Jaipur - Malviya Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: 'D-45, Malviya Nagar, Jaipur - 302017',
    tier: 2,
    latitude: 26.8505,
    longitude: 75.8010,
    phone: '+91 1800 123 4567',
    email: 'jaipur@healtohealth.in',
    timings: 'Mon-Sat: 8:00 AM - 8:00 PM, Sun: 9:00 AM - 5:00 PM',
    services: ['Pain Management', 'Physiotherapy', 'Yoga & Wellness'],
    facilities: ['Modern Equipment', 'Parking Available', 'Wheelchair Accessible'],
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop',
  },
  {
    id: 'kolkata-saltlake',
    name: 'H2H Kolkata - Salt Lake',
    city: 'Kolkata',
    state: 'West Bengal',
    address: 'Sector V, Salt Lake City, Kolkata - 700091',
    tier: 2,
    latitude: 22.5726,
    longitude: 88.4312,
    phone: '+91 1800 123 4567',
    email: 'kolkata@healtohealth.in',
    timings: 'Mon-Sat: 8:00 AM - 8:00 PM, Sun: 9:00 AM - 5:00 PM',
    services: ['Pain Management', 'Physiotherapy', 'Yoga & Wellness'],
    facilities: ['Modern Equipment', 'Parking Available', 'Wheelchair Accessible'],
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
  },
  {
    id: 'chennai-tnagar',
    name: 'H2H Chennai - T Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: '23, Usman Road, T Nagar, Chennai - 600017',
    tier: 1,
    latitude: 13.0418,
    longitude: 80.2341,
    phone: '+91 1800 123 4567',
    email: 'chennai@healtohealth.in',
    timings: 'Mon-Sat: 8:00 AM - 8:00 PM, Sun: 9:00 AM - 5:00 PM',
    services: ['Sports Rehabilitation', 'Pain Management', 'Physiotherapy', 'Yoga & Wellness'],
    facilities: ['Advanced Equipment', 'Private Rooms', 'Parking Available', 'Wheelchair Accessible'],
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop',
  },
];

export const INDIAN_CITIES = [
  { name: 'Mumbai', state: 'Maharashtra', tier: 1 },
  { name: 'Delhi', state: 'Delhi', tier: 1 },
  { name: 'Bangalore', state: 'Karnataka', tier: 1 },
  { name: 'Hyderabad', state: 'Telangana', tier: 1 },
  { name: 'Chennai', state: 'Tamil Nadu', tier: 1 },
  { name: 'Kolkata', state: 'West Bengal', tier: 2 },
  { name: 'Pune', state: 'Maharashtra', tier: 2 },
  { name: 'Jaipur', state: 'Rajasthan', tier: 2 },
  { name: 'Ahmedabad', state: 'Gujarat', tier: 2 },
  { name: 'Lucknow', state: 'Uttar Pradesh', tier: 2 },
] as const;

export const LOCATION_TIERS = {
  1: {
    name: 'Tier 1 (Metro)',
    description: 'Major metropolitan cities',
    priceMultiplier: 1,
  },
  2: {
    name: 'Tier 2',
    description: 'Growing cities with lower cost of living',
    priceMultiplier: 0.7,
  },
} as const;
