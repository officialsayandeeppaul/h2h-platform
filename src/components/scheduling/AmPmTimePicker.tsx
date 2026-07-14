'use client';

import { AM_PM_TIME_SLOTS } from '@/lib/scheduling/time-slots';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface AmPmTimePickerProps {
  value: string;
  onChange: (time: string) => void;
  error?: string;
}

/** In-modal time picker — no native select (avoids dropdown escaping the dialog). */
export function AmPmTimePicker({ value, onChange, error }: AmPmTimePickerProps) {
  return (
    <div className="space-y-2">
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border bg-white px-3 h-10 text-sm',
          error ? 'border-red-300' : 'border-gray-200'
        )}
      >
        <Clock className="h-4 w-4 text-cyan-600 shrink-0" />
        <span className={value ? 'font-medium text-gray-900' : 'text-gray-400'}>
          {value || 'Tap a time below (AM / PM)'}
        </span>
      </div>
      <div
        className={cn(
          'rounded-lg border p-2 max-h-[132px] overflow-y-auto overscroll-contain thin-scrollbar',
          error ? 'border-red-200' : 'border-gray-200'
        )}
      >
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
          {AM_PM_TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => onChange(slot)}
              className={cn(
                'py-2 px-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer',
                value === slot
                  ? 'bg-cyan-500 text-white border-cyan-500'
                  : 'bg-white text-gray-600 border-gray-100 hover:bg-cyan-50 hover:border-cyan-200 hover:text-cyan-700'
              )}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
