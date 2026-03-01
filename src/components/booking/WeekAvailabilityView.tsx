'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DayAvailability {
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

interface WeekAvailabilityViewProps {
  availability: DayAvailability[];
  selectedDay?: number;
  onSelectDay?: (dayOfWeek: number) => void;
  compact?: boolean;
}

const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function WeekAvailabilityView({ 
  availability, 
  selectedDay,
  onSelectDay,
  compact = false 
}: WeekAvailabilityViewProps) {
  const today = new Date().getDay();

  if (compact) {
    return (
      <div className="flex gap-1">
        {availability.map((day) => (
          <div
            key={day.dayOfWeek}
            className={cn(
              'flex flex-col items-center justify-center w-9 h-12 rounded-lg text-[10px] font-medium transition-all',
              day.isOpen 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-gray-50 text-gray-400 border border-gray-100',
              day.dayOfWeek === today && 'ring-2 ring-cyan-300',
              onSelectDay && day.isOpen && 'cursor-pointer hover:bg-green-100'
            )}
            onClick={() => day.isOpen && onSelectDay?.(day.dayOfWeek)}
          >
            <span>{DAY_NAMES_SHORT[day.dayOfWeek]}</span>
            {day.isOpen && (
              <span className="text-[8px] text-green-600">{day.availableSlots}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-[13px] font-medium text-gray-700 mb-3">Weekly Schedule</h4>
      <div className="grid grid-cols-7 gap-2">
        {availability.map((day) => (
          <div
            key={day.dayOfWeek}
            className={cn(
              'flex flex-col items-center p-3 rounded-xl text-center transition-all',
              day.isOpen 
                ? 'bg-gradient-to-b from-green-50 to-emerald-50 border border-green-200' 
                : 'bg-gray-50 border border-gray-100',
              day.dayOfWeek === today && 'ring-2 ring-cyan-400',
              selectedDay === day.dayOfWeek && 'ring-2 ring-cyan-500 bg-cyan-50',
              onSelectDay && day.isOpen && 'cursor-pointer hover:shadow-md'
            )}
            onClick={() => day.isOpen && onSelectDay?.(day.dayOfWeek)}
          >
            <span className={cn(
              'text-[11px] font-semibold mb-1',
              day.isOpen ? 'text-gray-700' : 'text-gray-400'
            )}>
              {day.dayName.slice(0, 3)}
            </span>
            
            {day.isOpen ? (
              <>
                <span className="text-[10px] text-gray-500">
                  {day.openTime}
                </span>
                <span className="text-[10px] text-gray-500">
                  {day.closeTime}
                </span>
                {day.breakStart && (
                  <span className="text-[9px] text-amber-600 mt-1">
                    Break: {day.breakStart}-{day.breakEnd}
                  </span>
                )}
                <Badge 
                  className={cn(
                    'mt-2 text-[9px] border-0',
                    day.availableSlots > 10 
                      ? 'bg-green-100 text-green-700'
                      : day.availableSlots > 0
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                  )}
                >
                  {day.availableSlots} slots
                </Badge>
              </>
            ) : (
              <span className="text-[10px] text-gray-400 mt-2">Closed</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeekAvailabilityView;
