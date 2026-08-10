/**
 * Unit tests for Quick Booking validation / amount resolution.
 * Run: npx tsx --test src/lib/quick-booking.test.ts
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveQuickBookingAmount,
  validateQuickBookingInput,
} from './quick-booking';

describe('validateQuickBookingInput', () => {
  it('requires name', () => {
    const r = validateQuickBookingInput({
      serviceId: 'svc-1',
      name: 'A',
      phone: '9876543210',
    });
    assert.equal(r.ok, false);
  });

  it('requires service', () => {
    const r = validateQuickBookingInput({
      name: 'Test User',
      phone: '9876543210',
    });
    assert.equal(r.ok, false);
  });

  it('requires valid Indian mobile', () => {
    const r = validateQuickBookingInput({
      serviceId: 'svc-1',
      name: 'Test User',
      phone: '12345',
    });
    assert.equal(r.ok, false);
  });

  it('accepts valid payload and normalizes phone', () => {
    const r = validateQuickBookingInput({
      serviceId: 'svc-1',
      name: '  Test User  ',
      phone: '+91 98765 43210',
      email: 'a@b.com',
    });
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.data.phone, '9876543210');
      assert.equal(r.data.name, 'Test User');
      assert.equal(r.data.email, 'a@b.com');
    }
  });

  it('rejects bad email when provided', () => {
    const r = validateQuickBookingInput({
      serviceId: 'svc-1',
      name: 'Test User',
      phone: '9876543210',
      email: 'not-an-email',
    });
    assert.equal(r.ok, false);
  });
});

describe('resolveQuickBookingAmount', () => {
  it('returns null when payment disabled', () => {
    assert.equal(
      resolveQuickBookingAmount(
        { payment_enabled: false, default_amount: 500, require_payment: true },
        900
      ),
      null
    );
  });

  it('prefers default_amount over service price', () => {
    assert.equal(
      resolveQuickBookingAmount(
        { payment_enabled: true, default_amount: 499, require_payment: true },
        900
      ),
      499
    );
  });

  it('falls back to service tier1 price', () => {
    assert.equal(
      resolveQuickBookingAmount(
        { payment_enabled: true, default_amount: null, require_payment: true },
        1200
      ),
      1200
    );
  });
});
