/**
 * Klarna through Mollie (backend feat/mollie-klarna). Shared by the booking payment step, the /my-bookings
 * "Pay now" modal and the secret /pay/<key> page. Countries, limits and the surcharge always come from the
 * backend; nothing here is hard-coded per country.
 */

/** A billing country Klarna accepts and its limit per payment in cents (surcharge included). */
export interface KlarnaCountry {
  code: string;
  maxAmountMinor: number;
}

/** GET /public/payments/card/klarna (200). A 204 or anything unusable means Klarna is not offered. */
export interface KlarnaConfig {
  countries: KlarnaCountry[];
  maxAmountMinor: number;
  /** Surcharge added to a Klarna booking payment (may be 0, may differ from the card surcharge). */
  surchargePercent: number;
}

/** The `klarna` block of the /pay config (no surcharge on /pay). */
export type KlarnaPayConfig = Omit<KlarnaConfig, 'surchargePercent'>;

/** Billing address sent to the backend (and from there to Mollie and Klarna). Never put into a URL. */
export interface KlarnaBilling {
  givenName: string;
  familyName: string;
  streetAndNumber: string;
  postalCode: string;
  city: string;
  /** ISO 3166-1 alpha-2. */
  country: string;
}

export type KlarnaBillingField = keyof KlarnaBilling;

export const KLARNA_BILLING_FIELDS: readonly KlarnaBillingField[] = [
  'givenName',
  'familyName',
  'streetAndNumber',
  'postalCode',
  'city',
  'country',
];

/** Backend limits (@Size on the request). */
export const KLARNA_FIELD_MAX: Record<KlarnaBillingField, number> = {
  givenName: 100,
  familyName: 100,
  streetAndNumber: 100,
  postalCode: 20,
  city: 100,
  country: 2,
};

/** Backend error code: Klarna is off, the country is not served, or the amount is above the country's limit. */
export const KLARNA_UNAVAILABLE_CODE = 8107;

export const EMPTY_KLARNA_BILLING: KlarnaBilling = {
  givenName: '',
  familyName: '',
  streetAndNumber: '',
  postalCode: '',
  city: '',
  country: '',
};

const COUNTRY_CODE = /^[A-Z]{2}$/;

const isMinor = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) > 0;

/** Countries from an API response; null when the shape is not usable (then Klarna is not offered). */
export const parseKlarnaCountries = (raw: unknown): KlarnaCountry[] | null => {
  if (!Array.isArray(raw)) return null;

  const countries = raw.flatMap(item => {
    const { code, maxAmountMinor } = (item ?? {}) as Partial<KlarnaCountry>;

    return typeof code === 'string' && COUNTRY_CODE.test(code) && isMinor(maxAmountMinor)
      ? [{ code, maxAmountMinor }]
      : [];
  });

  return countries.length ? countries : null;
};

/** The `klarna` block of the /pay config; null when absent, null or malformed. */
export const parseKlarnaPayConfig = (raw: unknown): KlarnaPayConfig | null => {
  if (!raw || typeof raw !== 'object') return null;

  const { countries, maxAmountMinor } = raw as { countries?: unknown; maxAmountMinor?: unknown };
  const parsed = parseKlarnaCountries(countries);

  return parsed && isMinor(maxAmountMinor) ? { countries: parsed, maxAmountMinor } : null;
};

/** Countries whose limit covers this amount (cents, surcharge included). */
export const klarnaCountriesFor = (config: KlarnaPayConfig | null | undefined, amountMinor: number): KlarnaCountry[] =>
  config ? config.countries.filter(c => c.maxAmountMinor >= amountMinor) : [];

/** Klarna can be offered for this amount (cents, surcharge included). */
export const isKlarnaOffered = (config: KlarnaPayConfig | null | undefined, amountMinor: number): boolean =>
  !!config &&
  amountMinor > 0 &&
  amountMinor <= config.maxAmountMinor &&
  klarnaCountriesFor(config, amountMinor).length > 0;

export const trimKlarnaBilling = (billing: KlarnaBilling): KlarnaBilling => ({
  givenName: billing.givenName.trim(),
  familyName: billing.familyName.trim(),
  streetAndNumber: billing.streetAndNumber.trim(),
  postalCode: billing.postalCode.trim(),
  city: billing.city.trim(),
  country: billing.country.trim().toUpperCase(),
});

export type KlarnaBillingError = 'required' | 'tooLong' | 'country';

/** Field errors of a billing address; `allowedCountries` = codes offered for this amount. */
export const klarnaBillingErrors = (
  billing: KlarnaBilling,
  allowedCountries: readonly string[]
): Partial<Record<KlarnaBillingField, KlarnaBillingError>> => {
  const trimmed = trimKlarnaBilling(billing);
  const errors: Partial<Record<KlarnaBillingField, KlarnaBillingError>> = {};

  KLARNA_BILLING_FIELDS.forEach(field => {
    const value = trimmed[field];

    if (!value) errors[field] = 'required';
    else if (value.length > KLARNA_FIELD_MAX[field]) errors[field] = 'tooLong';
  });

  if (!errors.country && !allowedCountries.includes(trimmed.country)) errors.country = 'country';

  return errors;
};

/** Server-side shape check of a billing block received from the browser (already trimmed by the caller). */
export const isValidKlarnaBilling = (value: unknown): value is KlarnaBilling => {
  if (!value || typeof value !== 'object') return false;

  const billing = value as Record<string, unknown>;

  return (
    KLARNA_BILLING_FIELDS.every(field => {
      const v = billing[field];

      return typeof v === 'string' && v.trim().length > 0 && v.trim().length <= KLARNA_FIELD_MAX[field];
    }) && COUNTRY_CODE.test(String(billing.country).trim().toUpperCase())
  );
};

/** Normalises an untrusted billing block; null when invalid. */
export const sanitizeKlarnaBilling = (value: unknown): KlarnaBilling | null => {
  if (!isValidKlarnaBilling(value)) return null;

  return trimKlarnaBilling(value);
};
