'use client';

import { AmPmTimePicker } from '@/components/scheduling/AmPmTimePicker';
import { cn } from '@/lib/utils';

export interface ScheduleSlotValues {
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

export type ScheduleSlotErrors = Partial<Record<keyof ScheduleSlotValues, string>>;

interface ScheduleSlotFieldsProps {
  values: ScheduleSlotValues;
  onChange: (values: ScheduleSlotValues) => void;
  errors?: ScheduleSlotErrors;
}

export function validateScheduleSlot(
  values: ScheduleSlotValues
): { valid: boolean; errors: ScheduleSlotErrors } {
  const errors: ScheduleSlotErrors = {};
  if (!values.preferredDate) errors.preferredDate = 'Pick a date';
  if (!values.preferredTime) errors.preferredTime = 'Pick a time';
  return { valid: Object.keys(errors).length === 0, errors };
}

export function ScheduleSlotFields({
  values,
  onChange,
  errors = {},
}: ScheduleSlotFieldsProps) {
  const set = (patch: Partial<ScheduleSlotValues>) => onChange({ ...values, ...patch });
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-3">
      <div>
        <label className="schedule-step-label">
          Preferred date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          min={today}
          value={values.preferredDate}
          onChange={(e) => set({ preferredDate: e.target.value })}
          className={cn('schedule-step-input', errors.preferredDate && 'border-red-300')}
        />
        {errors.preferredDate && (
          <p className="mt-1 text-xs text-red-600">{errors.preferredDate}</p>
        )}
      </div>

      <div>
        <label className="schedule-step-label">
          Preferred time <span className="text-red-500">*</span>
        </label>
        <AmPmTimePicker
          value={values.preferredTime}
          onChange={(preferredTime) => set({ preferredTime })}
          error={errors.preferredTime}
        />
      </div>

      <div>
        <label className="schedule-step-label">
          Notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={values.notes}
          onChange={(e) => set({ notes: e.target.value })}
          rows={2}
          placeholder="Pain area, sports injury, home visit need, etc."
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-cyan-500/25 focus:border-cyan-400"
        />
      </div>
    </div>
  );
}
