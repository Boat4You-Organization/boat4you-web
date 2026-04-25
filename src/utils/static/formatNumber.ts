// Default locale matches `formatPriceWithCurrency` ('hr-HR' = "1.234,56") and
// the admin's `formatPrice` (which reads `i18n.language || 'hr'`). Without a
// default we'd fall back to the user's browser locale → admin and customer
// site disagree on thousands/decimal separators for the same number.
//
// Callers that already know the active NextJS locale (from `useLocale()`)
// should pass it explicitly so multi-language pages render the customer's
// preferred format instead of the HR default.
const DEFAULT_LOCALE = 'hr-HR';

export const formatNumber = (num: number, locale: string = DEFAULT_LOCALE) =>
  num.toLocaleString(locale);

export const formatPrice = (num: number, locale: string = DEFAULT_LOCALE): string =>
  num.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
