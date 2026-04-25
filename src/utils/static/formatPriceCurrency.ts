import { CURRENCY_SYMBOL_MAP, Currency } from '@/models/user.model';

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
