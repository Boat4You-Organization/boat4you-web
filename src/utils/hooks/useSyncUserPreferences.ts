import { usePathname, useSearchParams } from 'next/navigation';

import { useRouter } from '@/i18n/navigation';
import { Currency, UserModel } from '@/models/user.model';

interface SyncUserPreferencesParams {
  user: UserModel;
}

export const useSyncUserPreferences = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const syncPreferences = ({ user }: SyncUserPreferencesParams) => {
    const userLocale = user.language?.toLowerCase();
    const localeMatch = pathname.match(/^\/([a-z]{2})(?=\/|$)/);
    const currentLocale = localeMatch?.[1] || 'en';
    const shouldChangeLocale = userLocale && userLocale !== currentLocale;

    const currentParams = new URLSearchParams(searchParams.toString());
    const urlCurrency = currentParams.get('currency') as Currency | null;
    const userCurrency = user.currency;
    const shouldChangeCurrency = urlCurrency !== userCurrency;

    if (shouldChangeCurrency) {
      if (userCurrency === Currency.EUR) {
        currentParams.delete('currency');
      } else {
        currentParams.set('currency', userCurrency);
      }
    }

    if (shouldChangeLocale || shouldChangeCurrency) {
      const queryString = currentParams.toString();
      const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
      const newPath = queryString ? `${pathWithoutLocale}?${queryString}` : pathWithoutLocale;

      if (shouldChangeLocale) {
        router.replace(newPath, { locale: userLocale });
      } else {
        router.replace(newPath);
      }
    }
  };

  return { syncPreferences };
};
