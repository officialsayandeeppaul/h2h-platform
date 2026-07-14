/** Indian mobile: exactly 10 digits, starting with 6–9. */
export const INDIAN_MOBILE_10 = /^[6-9]\d{9}$/;

/** Strip non-digits and cap at 10 characters for input fields. */
export function formatPhoneInput(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 10);
}

export function validateIndianMobile(phone: string): {
  valid: boolean;
  normalized: string | null;
  error?: string;
} {
  let d = phone.replace(/\D/g, '');
  if (d.length >= 12 && d.startsWith('91')) d = d.slice(-10);
  else if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  d = d.slice(0, 10);

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
