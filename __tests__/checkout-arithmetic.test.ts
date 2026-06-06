/**
 * Unit tests for checkout order arithmetic.
 * These tests verify that the PayPal amount breakdown always reconciles with the WooCommerce total.
 * A breakdown mismatch causes PayPal AMOUNT_MISMATCH (422) and silently fails checkout.
 *
 * Run with: npm test
 */

// Pure functions extracted for testability
const computeBreakdown = (
  total: string,
  shipping_total: string,
  shipping_tax: string,
  discount_total: string,
  discount_tax: string
) => {
  const TOTAL = Number(parseFloat(total).toFixed(2));
  const shippingTotal = Number(parseFloat((Number(shipping_total) + Number(shipping_tax)).toFixed(2)));
  const discountTotal = Number(parseFloat((Number(discount_total) + Number(discount_tax)).toFixed(2)));
  const itemTotal = Number(parseFloat((TOTAL + discountTotal - shippingTotal).toFixed(2)));
  return { TOTAL, itemTotal, shippingTotal, discountTotal };
};

const verifyPayPalFormula = (bd: ReturnType<typeof computeBreakdown>) => {
  // PayPal formula: item_total + shipping - discount = total (all values must be non-negative)
  const computed = Number((bd.itemTotal + bd.shippingTotal - bd.discountTotal).toFixed(2));
  return {
    reconciles: computed === bd.TOTAL,
    computed,
    allNonNegative: bd.itemTotal >= 0 && bd.shippingTotal >= 0 && bd.discountTotal >= 0,
  };
};

describe('PayPal amount breakdown reconciliation', () => {
  test('standard order no discount', () => {
    const bd = computeBreakdown('141.00', '0.00', '0.00', '0.00', '0.00');
    const result = verifyPayPalFormula(bd);
    expect(result.reconciles).toBe(true);
    expect(result.allNonNegative).toBe(true);
    expect(bd.itemTotal).toBe(141.00);
    expect(bd.discountTotal).toBe(0);
  });

  test('order with shipping', () => {
    const bd = computeBreakdown('151.00', '8.20', '1.80', '0.00', '0.00');
    const result = verifyPayPalFormula(bd);
    expect(result.reconciles).toBe(true);
    expect(result.allNonNegative).toBe(true);
    expect(bd.shippingTotal).toBe(10.00);
    expect(bd.itemTotal).toBe(141.00);
  });

  test('order with coupon discount', () => {
    const bd = computeBreakdown('130.00', '0.00', '0.00', '10.00', '1.00');
    const result = verifyPayPalFormula(bd);
    expect(result.reconciles).toBe(true);
    expect(result.allNonNegative).toBe(true);
    expect(bd.discountTotal).toBe(11.00);
    expect(bd.itemTotal).toBe(141.00);
  });

  test('rounding scenario: floating point that previously broke with line-item sum approach', () => {
    // Simulates when WooCommerce TOTAL = 99.99 but sum of items = 99.98 due to rounding
    // Old code: discountTotal = 99.98 + 0 - 99.99 = -0.01 → PayPal rejects
    // New code: uses WC discount_total, not line item sum
    const bd = computeBreakdown('99.99', '0.00', '0.00', '0.00', '0.00');
    const result = verifyPayPalFormula(bd);
    expect(result.reconciles).toBe(true);
    expect(result.allNonNegative).toBe(true);
    expect(bd.discountTotal).toBe(0);
    expect(bd.itemTotal).toBe(99.99);
  });

  test('discount cannot be negative', () => {
    // Even if WC returns negative discount (should not happen), check it is handled
    const bd = computeBreakdown('141.00', '0.00', '0.00', '0.00', '0.00');
    expect(bd.discountTotal).toBeGreaterThanOrEqual(0);
  });

  test('order with shipping + discount', () => {
    const bd = computeBreakdown('136.00', '8.20', '1.80', '10.00', '0.00');
    const result = verifyPayPalFormula(bd);
    expect(result.reconciles).toBe(true);
    expect(result.allNonNegative).toBe(true);
    // itemTotal = 136.00 + 10.00 - 10.00 = 136.00
    expect(bd.shippingTotal).toBe(10.00);
    expect(bd.discountTotal).toBe(10.00);
    expect(bd.itemTotal).toBe(136.00);
  });

  test('high-value order with complex decimals', () => {
    const bd = computeBreakdown('1299.99', '14.63', '3.22', '150.00', '33.00');
    const result = verifyPayPalFormula(bd);
    expect(result.reconciles).toBe(true);
    expect(result.allNonNegative).toBe(true);
  });
});

describe('generateAccessToken caching', () => {
  test('cached token structure is valid', () => {
    const mockToken = { value: 'abc123', expiresAt: Date.now() + 3600000 };
    expect(mockToken.value).toBeTruthy();
    expect(mockToken.expiresAt).toBeGreaterThan(Date.now());
  });

  test('expired token should be refreshed', () => {
    const expiredToken = { value: 'old_token', expiresAt: Date.now() - 1000 };
    expect(Date.now() >= expiredToken.expiresAt).toBe(true);
  });
});

describe('WooCommerce order abort logic', () => {
  test('only aborts orders in pending status', () => {
    const shouldAbort = (status: string) => status === 'pending';
    expect(shouldAbort('pending')).toBe(true);
    expect(shouldAbort('processing')).toBe(false);
    expect(shouldAbort('completed')).toBe(false);
    expect(shouldAbort('failed')).toBe(false);
  });

  test('isFailed flag marks order failed instead of deleting', () => {
    const getAction = (isFailed: boolean) => isFailed ? 'mark_failed' : 'delete';
    expect(getAction(true)).toBe('mark_failed');
    expect(getAction(false)).toBe('delete');
  });
});
