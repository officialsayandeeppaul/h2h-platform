'use client';

import { formatPhoneInput, validateIndianMobile } from '@/lib/validation/indian-phone';
import { AmPmTimePicker } from '@/components/scheduling/AmPmTimePicker';
import { cn } from '@/lib/utils';

export interface ScheduleRequestFormValues {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

export type ScheduleFieldErrors = Partial<
  Record<keyof ScheduleRequestFormValues, string>
>;

interface ScheduleRequestFieldsProps {
  values: ScheduleRequestFormValues;
  onChange: (values: ScheduleRequestFormValues) => void;
  errors?: ScheduleFieldErrors;
  className?: string;
}

const inputClass =
  'h-10 w-full rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400';

export function validateScheduleRequestFields(
  values: ScheduleRequestFormValues
): { valid: boolean; errors: ScheduleFieldErrors; phoneNormalized: string | null } {
  const errors: ScheduleFieldErrors = {};

  if (!values.name.trim()) errors.name = 'Full name is required';
  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  const phoneCheck = validateIndianMobile(values.phone);
  if (!phoneCheck.valid) errors.phone = phoneCheck.error;

  if (!values.preferredDate) errors.preferredDate = 'Pick a date';
  if (!values.preferredTime) errors.preferredTime = 'Pick a time';

  const valid = Object.keys(errors).length === 0;
  return { valid, errors, phoneNormalized: phoneCheck.normalized };
}

export function ScheduleRequestFields({
  values,
  onChange,
  errors = {},
  className,
}: ScheduleRequestFieldsProps) {
  const set = (patch: Partial<ScheduleRequestFormValues>) =>
    onChange({ ...values, ...patch });

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            value={values.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="Your name"
            className={cn(inputClass, errors.name && 'border-red-300')}
            autoComplete="name"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={values.email}
            onChange={(e) => set({ email: e.target.value })}
            placeholder="you@email.com"
            className={cn(inputClass, errors.email && 'border-red-300')}
            autoComplete="email"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Mobile <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <span className="inline-flex h-10 items-center rounded-l-md border border-r-0 border-gray-200 bg-gray-50 px-2.5 text-sm text-gray-600">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={values.phone}
              onChange={(e) => set({ phone: formatPhoneInput(e.target.value) })}
              placeholder="10-digit number"
              className={cn(
                inputClass,
                'rounded-l-none',
                errors.phone && 'border-red-300'
              )}
              autoComplete="tel-national"
            />
          </div>
          <p className="mt-1 text-[11px] text-gray-400">
            {values.phone.length}/10 digits
          </p>
          {errors.phone && <p className="mt-0.5 text-xs text-red-600">{errors.phone}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Preferred date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            min={today}
            value={values.preferredDate}
            onChange={(e) => set({ preferredDate: e.target.value })}
            className={cn(inputClass, errors.preferredDate && 'border-red-300')}
          />
          {errors.preferredDate && (
            <p className="mt-1 text-xs text-red-600">{errors.preferredDate}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Preferred time <span className="text-red-500">*</span>
        </label>
        <AmPmTimePicker
          value={values.preferredTime}
          onChange={(preferredTime) => set({ preferredTime })}
          error={errors.preferredTime}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={values.notes}
          onChange={(e) => set({ notes: e.target.value })}
          rows={3}
          placeholder="Condition, location, or any specific preference"
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400"
        />
      </div>
    </div>
  );
}
