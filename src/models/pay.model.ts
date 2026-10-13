/** Secret /pay/<key> page: card payment for a contract made outside the booking flow (backend custompayment). */

export type CustomPaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'NEEDS_REVIEW';

export const CUSTOM_PAYMENT_STATUSES: readonly CustomPaymentStatus[] = [
  'PENDING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
  'NEEDS_REVIEW',
];

/** GET /public/payments/custom/config (the fields the page uses). */
export interface PayConfig {
  enabled: boolean;
  minAmountMinor: number;
  maxAmountMinor: number;
}

/** GET /public/payments/custom/orders/{ref} (the fields the page uses). */
export interface PaymentStatusInfo {
  status: CustomPaymentStatus;
  amountMinor: number;
  reference: string;
}

/** Contract / booking confirmation number as printed (backend CHECK, after trim). */
export const PAY_REFERENCE_PATTERN = /^[A-Za-z0-9/_\-. ]{3,64}$/;

export const isPayReference = (value: string): boolean => PAY_REFERENCE_PATTERN.test(value.trim());

/** The payment's public token (UUID) — anything else never reaches the API. */
export const isPaymentRef = (value: unknown): value is string =>
  typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

/** Revolut hosted checkout origins the browser may be sent to (prod, sandbox). */
export const PAY_CHECKOUT_ORIGINS: readonly string[] = [
  'https://checkout.revolut.com',
  'https://sandbox-checkout.revolut.com',
];
