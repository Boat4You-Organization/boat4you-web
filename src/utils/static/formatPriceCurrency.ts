import { CURRENCY_SYMBOL_MAP, Currency } from '@/models/user.model';
import { ExtraPaymentType } from '@/models/yacht-service.model';

interface PriceInfo {
  amount: number;
  currency: string;
}

interface FormatPriceWithCurrencyOptions {
  clientPriceEur?: number;
  clientPriceInfo?: PriceInfo;
  locale?: string;
}

export const formatPriceWithCurrency = ({
  clientPriceEur,
  clientPriceInfo,
  locale = 'hr-HR',
}: FormatPriceWithCurrencyOptions): string => {
  const formatAmount = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    const formatted = formatter.format(amount);
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
 */
export const isPositivePrice = (amount?: number | null): boolean =>
  amount != null && Number.isFinite(Number(amount)) && Math.round(Number(amount)) > 0;

/**
 * `common` key for an extra without a price above 0. The backend marks such
 * an extra INCLUDED (free with the charter, e.g. unlimited Wi-Fi) and it reads
 * "Included"; an unpriced extra without that mark reads "Price on request".
 * Never "0 €" (27.9.2026).
 */
export const unpricedExtraLabelKey = (paymentType?: string | null): 'paidIncluded' | 'priceOnRequest' =>
  paymentType === ExtraPaymentType.INCLUDED ? 'paidIncluded' : 'priceOnRequest';
