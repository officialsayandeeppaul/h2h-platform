'use client';

import { formatPhoneInput } from '@/lib/validation/indian-phone';
import type { ContactDetails, ContactFieldErrors } from '@/lib/validation/schedule-contact';
import { cn } from '@/lib/utils';

interface ContactDetailsStepProps {
  values: ContactDetails;
  onChange: (values: ContactDetails) => void;
  errors?: ContactFieldErrors;
  /** Enter key in any field submits the step */
  onSubmit?: () => void;
}

export function ContactDetailsStep({
  values,
  onChange,
  errors = {},
  onSubmit,
}: ContactDetailsStepProps) {
  const set = (patch: Partial<ContactDetails>) => onChange({ ...values, ...patch });

  return (
    <form
      id="booking-contact-form"
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <div>
        <label className="schedule-step-label">
          Full name <span className="text-red-500">*</span>
        </label>
        <input
          value={values.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="Your full name"
          className={cn('schedule-step-input', errors.name && 'border-red-300')}
          autoComplete="name"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label className="schedule-step-label">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={values.email}
          onChange={(e) => set({ email: e.target.value })}
          placeholder="you@email.com"
          className={cn('schedule-step-input', errors.email && 'border-red-300')}
          autoComplete="email"
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label className="schedule-step-label">
          Mobile (India) <span className="text-red-500">*</span>
        </label>
        <div
          className={cn(
            'flex overflow-hidden rounded-lg border bg-white transition-shadow',
            'focus-within:ring-2 focus-within:ring-cyan-500/25 focus-within:border-cyan-400',
            errors.phone ? 'border-red-300' : 'border-gray-200'
          )}
        >
          <span className="flex h-10 shrink-0 items-center bg-gray-50 px-3 text-sm font-medium text-gray-600">
            +91
          </span>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={values.phone}
            onChange={(e) => set({ phone: formatPhoneInput(e.target.value) })}
            placeholder="10-digit mobile"
            className="h-10 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm outline-none focus:ring-0"
            autoComplete="tel-national"
          />
        </div>
        <p className="mt-1 text-[11px] text-gray-400">{values.phone.length}/10 digits</p>
        {errors.phone && <p className="mt-0.5 text-xs text-red-600">{errors.phone}</p>}
      </div>
    </form>
  );
}
