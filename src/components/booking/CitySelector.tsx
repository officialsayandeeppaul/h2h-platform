'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Building2, 
  ChevronDown,
  CheckCircle2,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface City {
  name: string;
  centerCount: number;
  tier: number;
}

interface CitySelectorProps {
  cities: City[];
  selectedCity: string | null;
  onSelectCity: (city: string) => void;
  loading?: boolean;
}

const CITY_IMAGES: Record<string, string> = {
  'Bangalore': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=300&fit=crop',
  'Delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
  'Mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop',
  'Hyderabad': 'https://images.unsplash.com/photo-1572445271230-a78b4e0f4c85?w=400&h=300&fit=crop',
  'Chennai': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop',
  'Pune': 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&h=300&fit=crop',
  'Kolkata': 'https://images.unsplash.com/photo-1558431382-27e303142255?w=400&h=300&fit=crop',
  'Jaipur': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=300&fit=crop',
};

export function CitySelector({ 
  cities, 
  selectedCity, 
  onSelectCity,
  loading = false 
}: CitySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort cities: Tier 1 first, then by center count
  const sortedCities = [...filteredCities].sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return b.centerCount - a.centerCount;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="h-32 rounded-2xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search cities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-[15px]"
        />
      </div>

      {/* City Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedCities.map((city) => (
          <div
            key={city.name}
            className={cn(
              'group relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-200',
              'hover:shadow-xl hover:scale-[1.02]',
              selectedCity === city.name 
                ? 'ring-3 ring-cyan-500 shadow-lg' 
                : 'shadow-md'
            )}
            onClick={() => onSelectCity(city.name)}
          >
            {/* Background Image */}
            <div className="relative h-32">
              <img
                src={CITY_IMAGES[city.name] || `https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop`}
                alt={city.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              
              {/* Selection Indicator */}
              {selectedCity === city.name && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}

              {/* Tier Badge */}
              <div className="absolute top-3 left-3">
                <Badge 
                  className={cn(
                    "text-[10px] font-medium border-0",
                    city.tier === 1 
                      ? 'bg-cyan-500 text-white' 
                      : 'bg-teal-500 text-white'
                  )}
                >
                  Tier {city.tier}
                </Badge>
              </div>

              {/* City Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-semibold text-[16px] mb-1">
                  {city.name}
                </h3>
                <div className="flex items-center gap-1.5 text-white/80 text-[12px]">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{city.centerCount} center{city.centerCount !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {sortedCities.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No cities found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}

export default CitySelector;
