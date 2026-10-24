/**
 * Expense rules shared by the API routes and the page form.
 *
 * Dependency-free on purpose: the super-admin UI imports this too, so the
 * client and server can never drift apart on what a valid expense is.
 *
 * Rules mirror the audit-booking discipline:
 *   - title/category: trimmed, whitespace collapsed, bounded length
 *   - amount: finite, > 0, capped at ₹1,00,00,000, rounded to 2 decimals
 *   - date: real calendar day (YYYY-MM-DD), not in the future (IST), sane floor
 *   - paid_via: closed enum; paid_to / notes optional with length caps
 *   - blank optional fields mean "clear"; missing fields in a PATCH are left
 *     untouched — an update can never overwrite a value with a fallback
 *   - database CHECK constraints re-enforce all of this on the way in
 */

/** Preset categories in the form — any custom category is also accepted. */
export const EXPENSE_CATEGORIES = [
  'Salary',
  'Office cost',
  'Rent',
  'Utilities',
  'Supplies',
  'Equipment',
  'Marketing',
  'Travel',
  'Maintenance',
  'Software',
  'Other',
] as const;

export const PAID_VIA_OPTIONS = ['cash', 'upi', 'bank', 'card', 'other'] as const;
export type PaidVia = (typeof PAID_VIA_OPTIONS)[number];

export const PAID_VIA_LABELS: Record<PaidVia, string> = {
  cash: 'Cash',
  upi: 'UPI',
  bank: 'Bank transfer',
  card: 'Card',
  other: 'Other',
};

export const EXPENSE_LIMITS = {
  titleMin: 2,
  titleMax: 120,
  categoryMax: 60,
  /** ₹1 crore — NUMERIC(12,2) stores far more, this keeps entries human. */
  amountMax: 100_000_000,
  paidToMax: 120,
  notesMax: 1000,
  /** No 1970s typos: expenses start in the modern era of the clinic. */
  dateMin: '2000-01-01',
} as const;

/** "Today" at the clinic's timezone (IST, UTC+5:30), as YYYY-MM-DD. */
export function istTodayIso(now: number = Date.now()): string {
  return new Date(now + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** True only for a real calendar day in strict YYYY-MM-DD form. */
export function isValidCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return false;
  return parsed.toISOString().slice(0, 10) === value;
}

/** Collapse runs of whitespace so titles never store as "Pay  to  vendor". */
function normalizeText(value: unknown): string {
  return String(value).replace(/\s+/g, ' ').trim();
}

export interface NormalizedExpense {
  title: string;
  category: string;
  amount: number;
  date: string;
  paid_via: PaidVia;
  paid_to: string | null;
  notes: string | null;
}

type ValidationResult<M extends 'create' | 'update'> =
  | { ok: true; value: M extends 'create' ? NormalizedExpense : Partial<NormalizedExpense> }
  | { ok: false; error: string };

type CreateResult = { ok: true; value: NormalizedExpense } | { ok: false; error: string };
type UpdateResult = { ok: true; value: Partial<NormalizedExpense> } | { ok: false; error: string };

const CORE_FIELDS = ['title', 'category', 'amount', 'date'] as const;
const ALL_FIELDS = [...CORE_FIELDS, 'paidVia', 'paidTo', 'notes'] as const;

/** Field explicitly present (undefined/null count as "leave it alone"). */
function specified(raw: Record<string, unknown>, key: string): boolean {
  return raw[key] !== undefined && raw[key] !== null;
}

/** Field present with actual content ("" / whitespace = blank, not missing). */
function hasContent(raw: Record<string, unknown>, key: string): boolean {
  return specified(raw, key) && String(raw[key]).trim() !== '';
}

/**
 * Validate + normalize an expense payload.
 *
 * mode `'create'` — every core field required; returns a full NormalizedExpense.
 * mode `'update'` — validates only the specified fields; returns just those
 * fields (a PATCH never fills in defaults for what it didn't receive).
 */
export function validateExpenseFields(raw: Record<string, unknown>, mode: 'create'): CreateResult;
export function validateExpenseFields(raw: Record<string, unknown>, mode: 'update'): UpdateResult;
export function validateExpenseFields(
  raw: Record<string, unknown>,
  mode: 'create' | 'update'
): ValidationResult<'create' | 'update'> {
  if (mode === 'update') {
    const hasAny = ALL_FIELDS.some((key) => raw[key] !== undefined);
    if (!hasAny) return { ok: false, error: 'Nothing to update.' };
  }

  const value: Partial<NormalizedExpense> = {};

  // --- Title -----------------------------------------------------------
  if (specified(raw, 'title')) {
    if (!hasContent(raw, 'title')) {
      return { ok: false, error: 'Title is required.' };
    }
    const title = normalizeText(raw.title);
    if (title.length < EXPENSE_LIMITS.titleMin) {
      return {
        ok: false,
        error: `Add a short title (at least ${EXPENSE_LIMITS.titleMin} characters).`,
      };
    }
    if (title.length > EXPENSE_LIMITS.titleMax) {
      return { ok: false, error: `Title must be ${EXPENSE_LIMITS.titleMax} characters or fewer.` };
    }
    value.title = title;
  } else if (mode === 'create') {
    return { ok: false, error: 'Title is required.' };
  }

  // --- Category --------------------------------------------------------
  if (specified(raw, 'category')) {
    const category = normalizeText(raw.category);
    if (!category) {
      return { ok: false, error: 'Choose or enter a category.' };
    }
    if (category.length > EXPENSE_LIMITS.categoryMax) {
      return {
        ok: false,
        error: `Category must be ${EXPENSE_LIMITS.categoryMax} characters or fewer.`,
      };
    }
    value.category = category;
  } else if (mode === 'create') {
    return { ok: false, error: 'Choose or enter a category.' };
  }

  // --- Amount ----------------------------------------------------------
  if (specified(raw, 'amount')) {
    if (!hasContent(raw, 'amount')) {
      return { ok: false, error: 'Amount is required.' };
    }
    const parsed = Number(raw.amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return { ok: false, error: 'Enter an amount greater than 0.' };
    }
    if (parsed > EXPENSE_LIMITS.amountMax) {
      return { ok: false, error: 'Amount cannot exceed ₹1,00,00,000 per entry.' };
    }
    value.amount = Math.round(parsed * 100) / 100;
  } else if (mode === 'create') {
    return { ok: false, error: 'Amount is required.' };
  }

  // --- Date ------------------------------------------------------------
  if (specified(raw, 'date')) {
    if (!hasContent(raw, 'date')) {
      return { ok: false, error: 'Date is required.' };
    }
    const date = normalizeText(raw.date);
    if (!isValidCalendarDate(date)) {
      return { ok: false, error: 'Invalid date — expected YYYY-MM-DD.' };
    }
    const today = istTodayIso();
    if (date > today) {
      return {
        ok: false,
        error: 'Expenses cannot be dated in the future — pick today or an earlier date.',
      };
    }
    if (date < EXPENSE_LIMITS.dateMin) {
      return { ok: false, error: `Date must be ${EXPENSE_LIMITS.dateMin} or later.` };
    }
    value.date = date;
  } else if (mode === 'create') {
    return { ok: false, error: 'Date is required.' };
  }

  // --- Paid via (optional) --------------------------------------------
  if (specified(raw, 'paidVia')) {
    if (hasContent(raw, 'paidVia')) {
      const method = String(raw.paidVia).toLowerCase();
      if (!(PAID_VIA_OPTIONS as readonly string[]).includes(method)) {
        return {
          ok: false,
          error: `Payment method must be one of: ${PAID_VIA_OPTIONS.join(', ')}.`,
        };
      }
      value.paid_via = method as PaidVia;
    }
  } else if (mode === 'create') {
    value.paid_via = 'cash';
  }

  // --- Paid to (optional; blank clears) --------------------------------
  if (specified(raw, 'paidTo')) {
    const paidTo = normalizeText(raw.paidTo);
    if (paidTo.length > EXPENSE_LIMITS.paidToMax) {
      return {
        ok: false,
        error: `“Paid to” must be ${EXPENSE_LIMITS.paidToMax} characters or fewer.`,
      };
    }
    value.paid_to = paidTo || null;
  } else if (mode === 'create') {
    value.paid_to = null;
  }

  // --- Notes (optional; blank clears) ----------------------------------
  if (specified(raw, 'notes')) {
    const notes = String(raw.notes).trim();
    if (notes.length > EXPENSE_LIMITS.notesMax) {
      return {
        ok: false,
        error: `Notes must be ${EXPENSE_LIMITS.notesMax} characters or fewer.`,
      };
    }
    value.notes = notes || null;
  } else if (mode === 'create') {
    value.notes = null;
  }

  return { ok: true, value };
}
