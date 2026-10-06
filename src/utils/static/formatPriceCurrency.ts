import { CURRENCY_SYMBOL_MAP, Currency } from '@/models/user.model';
import { ExtraPaymentType } from '@/models/yacht-service.model';

interface PriceInfo {
  amount: number;
  currency: string;
}

/**
 * `'auto'` = two decimals only when the price has cents, for extras and fees
 * (a tourist tax of 1.33 € per person per night, 9.31 € for the week). Every
 * other price stays whole (boat totals, instalments, deposits).
 *
 * The cents are judged on the partner's own EUR price when there is one, so a
 * whole 300 € extra converted to 336.12 $ still reads "336 $" (no sudden cents
 * in a converted currency) while 1.33 € reads "1.49 $" (6.10.2026).
 */
export type PriceCents = 'auto';

interface FormatPriceWithCurrencyOptions {
  clientPriceEur?: number;
  clientPriceInfo?: PriceInfo;
  locale?: string;
  cents?: PriceCents;
}

/** Amount in whole cents, the rounding every `cents: 'auto'` decision uses. */
const toCents = (amount: number): number => Math.round(Number(amount) * 100);

const hasCents = (amount?: number | null): boolean =>
  amount != null && Number.isFinite(Number(amount)) && toCents(amount) % 100 !== 0;

export const formatPriceWithCurrency = ({
  clientPriceEur,
  clientPriceInfo,
  locale = 'hr-HR',
  cents,
}: FormatPriceWithCurrencyOptions): string => {
  const showCents = cents === 'auto' && hasCents(clientPriceEur ?? clientPriceInfo?.amount);

  const formatAmount = (amount: number, currency: string) => {
    const digits = showCents ? 2 : 0;
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
    // Rounded to cents first, so the decision above and the digits printed
    // can never disagree (no "1,00 €" for 0.995).
    const formatted = formatter.format(showCents ? toCents(amount) / 100 : amount);
    const symbol = CURRENCY_SYMBOL_MAP[currency as Currency] || currency;

    return `${formatted} ${symbol}`;
  };

  if (clientPriceInfo?.amount !== undefined && clientPriceInfo?.currency) {
    return formatAmount(clientPriceInfo.amount, clientPriceInfo.currency);
  }

  if (clientPriceEur !== undefined) {
    return formatAmount(clientPriceEur, Currency.EUR);
  }

  return formatAmount(0, Currency.EUR);
};

/**
 * Whether an amount is a price we may show: finite and more than 0 once
 * rounded. A boat price of 0 € (a missing partner price, a gap week, a
 * calculation without a total) reads as "free" — the widgets say "Price on
 * request" instead (27.9.2026).
 *
 * With `{ cents: 'auto' }` (extras and fees, shown with their cents) the
 * amount is rounded to cents instead, so a 0.30 € fee is a price, not "Price
 * on request" (6.10.2026).
 */
export const isPositivePrice = (amount?: number | null, options?: { cents?: PriceCents }): boolean =>
  amount != null &&
  Number.isFinite(Number(amount)) &&
  (options?.cents === 'auto' ? toCents(Number(amount)) > 0 : Math.round(Number(amount)) > 0);

/**
 * `common` key for an extra without a price above 0. The backend marks such
 * an extra INCLUDED (free with the charter, e.g. unlimited Wi-Fi) and it reads
 * "Included"; an unpriced extra without that mark reads "Price on request".
 * Never "0 €" (27.9.2026).
 */
export const unpricedExtraLabelKey = (paymentType?: string | null): 'paidIncluded' | 'priceOnRequest' =>
  paymentType === ExtraPaymentType.INCLUDED ? 'paidIncluded' : 'priceOnRequest';
