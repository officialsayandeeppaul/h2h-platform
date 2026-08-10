/** Indian mobile: exactly 10 digits, starting with 6–9. */
export const INDIAN_MOBILE_10 = /^[6-9]\d{9}$/;

/**
 * Normalize typed/pasted phone to exactly 10 Indian mobile digits.
 * Handles +91 / 91 / leading 0.
 */
export function formatPhoneInput(raw: string): string {
  let d = raw.replace(/\D/g, '');
  if (d.length >= 12 && d.startsWith('91')) d = d.slice(-10);
  else if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  else if (d.length === 11 && d.startsWith('91')) d = d.slice(1);
  else if (d.length > 10) d = d.slice(-10);
  return d.slice(0, 10);
}

export function validateIndianMobile(phone: string): {
  valid: boolean;
  normalized: string | null;
  error?: string;
} {
  const d = formatPhoneInput(phone);

  if (d.length !== 10) {
    return {
      valid: false,
      normalized: null,
      error: 'Enter exactly 10-digit mobile number',
    };
  }
  if (!INDIAN_MOBILE_10.test(d)) {
    return {
      valid: false,
      normalized: null,
      error: 'Mobile must start with 6, 7, 8, or 9',
    };
  }
  return { valid: true, normalized: d };
}
