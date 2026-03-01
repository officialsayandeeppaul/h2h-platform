'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Video, 
  Building2, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Globe,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CitySelector } from './CitySelector';
import { ClinicCenterCard } from './ClinicCenterCard';
import { WeekAvailabilityView } from './WeekAvailabilityView';

interface ClinicCenter {
  id: string;
  name: string;
  slug: string;
  address: string;
  landmark: string | null;
  pincode: string | null;
  phone: string | null;
  facilities: string[];
  rating: number;
  total_reviews: number;
  is_featured: boolean;
  isOpenNow: boolean;
  nextOpenDay: string | null;
  availableSlots: number;
  todayAvailability: {
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    availableSlots: number;
  } | null;
  availability?: any[];
  location: {
    id?: string;
    city: string;
    tier: number;
  };
}

interface City {
  name: string;
  centerCount: number;
  tier: number;
}

interface LocationCentricBookingProps {
  onSelectLocation: (location: { 
    id: string; 
    name: string; 
    city: string; 
    address: string; 
    tier: number;
    centerId?: string;
    centerName?: string;
  }) => void;
  onSelectMode: (mode: 'online' | 'offline' | 'home_visit') => void;
  selectedMode: 'online' | 'offline' | 'home_visit';
  onContinue: () => void;
}

export function LocationCentricBooking({
  onSelectLocation,
  onSelectMode,
  selectedMode,
  onContinue
}: LocationCentricBookingProps) {
  const [step, setStep] = useState<'mode' | 'city' | 'center'>('mode');
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [centers, setCenters] = useState<ClinicCenter[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<ClinicCenter | null>(null);
  const [groupedCenters, setGroupedCenters] = useState<Record<string, ClinicCenter[]>>({});

  // Fetch cities and centers on mount
  useEffect(() => {
    const fetchCenters = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/clinic-centers');
        const data = await res.json();
        
        if (data.success) {
          setCenters(data.data.centers || []);
          setGroupedCenters(data.data.groupedByCity || {});
          
          // Build cities list with center counts
          const cityList: City[] = Object.entries(data.data.groupedByCity || {}).map(
            ([cityName, cityCenters]: [string, any]) => ({
              name: cityName,
              centerCount: cityCenters.length,
              tier: cityCenters[0]?.location?.tier || 1,
            })
          );
          setCities(cityList);
        }
      } catch (err) {
        console.error('Failed to fetch clinic centers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  // Handle online mode selection
  const handleOnlineSelect = () => {
    onSelectMode('online');
    onSelectLocation({
      id: 'online',
      name: 'Online Consultation',
      city: 'Online',
      address: 'Video Consultation from anywhere',
      tier: 1,
    });
  };

  // Handle city selection
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setSelectedCenter(null);
    setStep('center');
  };

  // Handle center selection
  const handleCenterSelect = (center: ClinicCenter) => {
    setSelectedCenter(center);
    onSelectMode('offline');
    onSelectLocation({
      id: center.location.id || center.id,
      name: center.location.city,
      city: center.location.city,
      address: center.address,
      tier: center.location.tier,
      centerId: center.id,
      centerName: center.name,
    });
  };

  // Get centers for selected city
  const cityCenters = selectedCity ? (groupedCenters[selectedCity] || []) : [];

  // Sort centers: featured first, then by rating
  const sortedCenters = [...cityCenters].sort((a, b) => {
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
    return (b.rating || 0) - (a.rating || 0);
  });

  return (
    <div>
      {/* Step: Mode Selection */}
      {step === 'mode' && (
        <div>
          <div className="text-center mb-10">
            <h1 className="text-[32px] md:text-[40px] font-medium text-gray-900 tracking-tight mb-3">
              How would you like to consult?
            </h1>
            <p className="text-[15px] text-gray-500">
              Choose your preferred consultation mode
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Online Option */}
            <div
              className={cn(
                'group cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200',
                'hover:shadow-xl hover:border-cyan-400',
                selectedMode === 'online' 
                  ? 'border-cyan-500 bg-cyan-50 shadow-lg' 
                  : 'border-gray-200 bg-white'
              )}
              onClick={() => {
                handleOnlineSelect();
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                  <Video className="h-7 w-7 text-white" />
                </div>
                {selectedMode === 'online' && (
                  <CheckCircle2 className="h-6 w-6 text-cyan-500" />
                )}
              </div>
              <h3 className="text-[18px] font-semibold text-gray-900 mb-2">
                Online Consultation
              </h3>
              <p className="text-[14px] text-gray-500 mb-4">
                Connect with our specialists via secure video call from the comfort of your home
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-cyan-100 text-cyan-700 border-0 text-[11px]">
                  <Globe className="h-3 w-3 mr-1" />
                  Available Anywhere
                </Badge>
                <Badge className="bg-green-100 text-green-700 border-0 text-[11px]">
                  No Travel
                </Badge>
              </div>
            </div>

            {/* Clinic Visit Option */}
            <div
              className={cn(
                'group cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200',
                'hover:shadow-xl hover:border-cyan-400',
                selectedMode === 'offline' 
                  ? 'border-cyan-500 bg-cyan-50 shadow-lg' 
                  : 'border-gray-200 bg-white'
              )}
              onClick={() => {
                onSelectMode('offline');
                setStep('city');
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                {selectedMode === 'offline' && (
                  <CheckCircle2 className="h-6 w-6 text-cyan-500" />
                )}
              </div>
              <h3 className="text-[18px] font-semibold text-gray-900 mb-2">
                Visit a Clinic
              </h3>
              <p className="text-[14px] text-gray-500 mb-4">
                Visit one of our state-of-the-art clinics for in-person consultation and treatment
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-teal-100 text-teal-700 border-0 text-[11px]">
                  <MapPin className="h-3 w-3 mr-1" />
                  {cities.length} Cities
                </Badge>
                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[11px]">
                  {centers.length}+ Centers
                </Badge>
              </div>
            </div>
          </div>

          {/* Continue button for online */}
          {selectedMode === 'online' && (
            <div className="flex justify-center mt-10">
              <Button 
                onClick={onContinue}
                className="h-12 px-10 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-full text-[15px] font-medium shadow-lg"
              >
                Continue with Online
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step: City Selection */}
      {step === 'city' && (
        <div>
          <div className="text-center mb-8">
            <h1 className="text-[28px] md:text-[36px] font-medium text-gray-900 tracking-tight mb-3">
              Select Your City
            </h1>
            <p className="text-[15px] text-gray-500">
              Choose a city to view available clinic centers
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
            </div>
          ) : cities.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <AlertCircle className="h-14 w-14 mx-auto mb-4 text-gray-300" />
              <p className="text-[16px]">No clinic locations available at the moment.</p>
              <p className="text-[14px] mt-2">Please try online consultation instead.</p>
            </div>
          ) : (
            <CitySelector
              cities={cities}
              selectedCity={selectedCity}
              onSelectCity={handleCitySelect}
              loading={loading}
            />
          )}

          <div className="flex justify-between mt-10">
            <Button 
              variant="outline" 
              onClick={() => setStep('mode')}
              className="h-11 px-6 rounded-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
        </div>
      )}

      {/* Step: Center Selection */}
      {step === 'center' && (
        <div>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Badge className="bg-cyan-100 text-cyan-700 border-0">
                <MapPin className="h-3 w-3 mr-1" />
                {selectedCity}
              </Badge>
            </div>
            <h1 className="text-[28px] md:text-[36px] font-medium text-gray-900 tracking-tight mb-3">
              Choose a Clinic Center
            </h1>
            <p className="text-[15px] text-gray-500">
              Select from {sortedCenters.length} center{sortedCenters.length !== 1 ? 's' : ''} in {selectedCity}
            </p>
          </div>

          {sortedCenters.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Building2 className="h-14 w-14 mx-auto mb-4 text-gray-300" />
              <p className="text-[16px]">No centers available in {selectedCity}.</p>
              <Button 
                variant="outline" 
                onClick={() => setStep('city')}
                className="mt-4"
              >
                Choose Another City
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedCenters.map((center) => (
                <ClinicCenterCard
                  key={center.id}
                  center={center}
                  isSelected={selectedCenter?.id === center.id}
                  onSelect={handleCenterSelect}
                />
              ))}
            </div>
          )}

          {/* Week Availability for Selected Center */}
          {selectedCenter && selectedCenter.availability && (
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
              <h3 className="text-[16px] font-semibold text-gray-900 mb-4">
                {selectedCenter.name} - Weekly Schedule
              </h3>
              <WeekAvailabilityView 
                availability={selectedCenter.availability.map((a: any) => ({
                  dayOfWeek: a.day_of_week,
                  dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][a.day_of_week],
                  isOpen: a.is_open,
                  openTime: a.open_time?.substring(0, 5) || null,
                  closeTime: a.close_time?.substring(0, 5) || null,
                  breakStart: a.break_start?.substring(0, 5) || null,
                  breakEnd: a.break_end?.substring(0, 5) || null,
                  availableSlots: Math.max(0, (a.max_appointments || 0) - (a.current_bookings || 0)),
                  specialNote: a.special_note || null,
                }))}
              />
            </div>
          )}

          <div className="flex justify-between mt-10">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedCenter(null);
                setStep('city');
              }}
              className="h-11 px-6 rounded-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cities
            </Button>
            <Button 
              onClick={onContinue}
              disabled={!selectedCenter}
              className="h-11 px-8 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-full text-[14px] font-medium disabled:opacity-50"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationCentricBooking;
