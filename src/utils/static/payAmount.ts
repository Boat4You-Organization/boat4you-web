/**
 * Amount entry on the secret /pay page (card payments for contracts made
 * outside the booking flow). Integer arithmetic only: the typed text is split
 * at its one decimal separator and read as whole euros + cents, never through
 * parseFloat, so 1109.10 is 110910 cents and not 110909.99999.
 *
 * Accepted: 1–7 digits, optionally one "." or "," followed by 1–2 digits
 * ("50", "50.5", "50,50", "1109.00"). One separator followed by exactly three
 * digits ("50.000", "1,109") reads as a thousands separator in one language
 * and as a typo in another, so it is rejected as ambiguous. Thousands
 * separators are never accepted ("1.109,00", "1 109").
 *
 *   yarn test:pay
 */
const AMOUNT_PATTERN = /^(\d{1,7})(?:[.,](\d{1,2}))?$/;
const AMBIGUOUS_PATTERN = /^\d{1,7}[.,]\d{3}$/;

/** Cents for a valid amount text, otherwise null. */
export const parseAmountToMinor = (input: string): number | null => {
  const match = AMOUNT_PATTERN.exec(input.trim());

  if (!match) return null;

  return Number(match[1]) * 100 + Number((match[2] ?? '').padEnd(2, '0'));
};

/** "50.000" / "50,000": thousands separator or three decimals — cannot tell. */
export const isAmountAmbiguous = (input: string): boolean => AMBIGUOUS_PATTERN.test(input.trim());

/** Cents back to the form's own text ("1109.00"), e.g. to prefill a retry. */
export const minorToAmountInput = (minor: number): string => {
  const cents = minor % 100;

  return `${(minor - cents) / 100}.${String(cents).padStart(2, '0')}`;
};

/**
 * "EUR 1,109.00" (en) / "1.109,00 EUR" (de) for a whole number of cents. Only
 * the whole euros go through Intl; the cents replace its fraction digits.
 */
export const formatEur = (minor: number, locale: string): string => {
  if (!Number.isSafeInteger(minor)) throw new RangeError(`formatEur: ${minor} is not a whole number of cents`);

  const abs = Math.abs(minor);
  const cents = abs % 100;
  const euros = (abs - cents) / 100;

  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', currencyDisplay: 'code' })
    .formatToParts(minor < 0 ? -euros : euros)
    .map(part => (part.type === 'fraction' ? String(cents).padStart(2, '0') : part.value))
    .join('');
};
