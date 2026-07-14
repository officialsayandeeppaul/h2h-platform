import { validateIndianMobile } from '@/lib/validation/indian-phone';

export interface ContactDetails {
  name: string;
  email: string;
  phone: string;
}

export type ContactFieldErrors = Partial<Record<keyof ContactDetails, string>>;

export function validateContactDetails(
  contact: ContactDetails
): { valid: boolean; errors: ContactFieldErrors; phoneNormalized: string | null } {
  const errors: ContactFieldErrors = {};

  if (!contact.name.trim()) errors.name = 'Full name is required';
  if (!contact.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  const phoneCheck = validateIndianMobile(contact.phone);
  if (!phoneCheck.valid) errors.phone = phoneCheck.error;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    phoneNormalized: phoneCheck.normalized,
  };
}
