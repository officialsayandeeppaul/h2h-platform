'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle2, 
  Phone,
  Users,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CenterAvailability {
  dayOfWeek: number;
  dayName: string;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
  availableSlots: number;
}

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

interface ClinicCenterCardProps {
  center: ClinicCenter;
  isSelected: boolean;
  onSelect: (center: ClinicCenter) => void;
  showDetails?: boolean;
}

const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ClinicCenterCard({ 
  center, 
  isSelected, 
  onSelect,
  showDetails = false 
}: ClinicCenterCardProps) {
  const today = new Date().getDay();

  return (
    <div
      className={cn(
        'group relative cursor-pointer rounded-2xl border bg-white p-5 transition-all duration-200',
        'hover:shadow-lg hover:border-cyan-200',
        isSelected 
          ? 'border-cyan-500 ring-2 ring-cyan-100 shadow-lg' 
          : 'border-gray-200'
      )}
      onClick={() => onSelect(center)}
    >
      {/* Featured Badge */}
      {center.is_featured && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-md">
            <Sparkles className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4">
          <CheckCircle2 className="h-6 w-6 text-cyan-500" />
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-[17px] font-semibold text-gray-900 pr-8">
            {center.name}
          </h3>
        </div>
        
        {/* Status Badge */}
        <div className="flex items-center gap-2 mb-3">
          {center.isOpenNow ? (
            <Badge className="bg-green-100 text-green-700 border-0 text-[11px]">
              Open Now
            </Badge>
          ) : center.todayAvailability?.isOpen ? (
            <Badge className="bg-amber-100 text-amber-700 border-0 text-[11px]">
              Opens at {center.todayAvailability.openTime}
            </Badge>
          ) : (
            <Badge className="bg-gray-100 text-gray-600 border-0 text-[11px]">
              {center.nextOpenDay ? `Opens ${center.nextOpenDay}` : 'Closed Today'}
            </Badge>
          )}
          
          {center.availableSlots > 0 && (
            <Badge className="bg-cyan-50 text-cyan-700 border-0 text-[11px]">
              <Users className="h-3 w-3 mr-1" />
              {center.availableSlots} slots
            </Badge>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 text-[13px] text-gray-500 mb-3">
        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-cyan-600" />
        <div>
          <span className="line-clamp-2">{center.address}</span>
          {center.landmark && (
            <span className="text-gray-400 text-[12px]"> • {center.landmark}</span>
          )}
        </div>
      </div>

      {/* Timing */}
      {center.todayAvailability && (
        <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-3">
          <Clock className="h-4 w-4 flex-shrink-0 text-cyan-600" />
          <span>
            {center.todayAvailability.openTime} - {center.todayAvailability.closeTime}
          </span>
        </div>
      )}

      {/* Rating & Reviews */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-amber-400 fill-current" />
          <span className="text-[14px] font-medium text-gray-900">
            {center.rating?.toFixed(1) || '4.5'}
          </span>
        </div>
        <span className="text-[12px] text-gray-400">
          ({center.total_reviews || 0} reviews)
        </span>
      </div>

      {/* Facilities */}
      {center.facilities && center.facilities.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {center.facilities.slice(0, 3).map((facility, idx) => (
            <Badge 
              key={idx} 
              variant="outline" 
              className="text-[10px] text-gray-500 border-gray-200 bg-gray-50"
            >
              {facility}
            </Badge>
          ))}
          {center.facilities.length > 3 && (
            <Badge 
              variant="outline" 
              className="text-[10px] text-gray-500 border-gray-200 bg-gray-50"
            >
              +{center.facilities.length - 3} more
            </Badge>
          )}
        </div>
      )}

      {/* Phone */}
      {center.phone && showDetails && (
        <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-3">
          <Phone className="h-4 w-4 flex-shrink-0 text-cyan-600" />
          <span>{center.phone}</span>
        </div>
      )}

      {/* Action Button */}
      <Button
        variant={isSelected ? "default" : "outline"}
        size="sm"
        className={cn(
          "w-full mt-2 rounded-full text-[13px]",
          isSelected 
            ? "bg-cyan-500 hover:bg-cyan-600 text-white" 
            : "border-gray-200 hover:border-cyan-300 hover:bg-cyan-50"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(center);
        }}
      >
        {isSelected ? 'Selected' : 'Select This Center'}
        {!isSelected && <ChevronRight className="h-4 w-4 ml-1" />}
      </Button>
    </div>
  );
}

export default ClinicCenterCard;
