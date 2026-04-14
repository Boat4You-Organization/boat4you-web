import { useLocale, useTranslations } from 'next-intl';

interface PluralizationOptions {
  singular: string;
  plural: string;
}

export const usePluralization = (count: number, options: PluralizationOptions): string => {
  const locale = useLocale();

  if (locale === 'hr') {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return options.plural;
    }

    if (lastDigit === 1) {
      return options.singular;
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return options.plural;
    }

    return options.plural;
  }

  return count === 1 ? options.singular : options.plural;
};

export const useDaysText = (numberOfDays: number): string => {
  const t = useTranslations('common');

  return usePluralization(numberOfDays, {
    singular: t('day'),
    plural: t('days'),
  });
};
