import { useCallback } from 'react';

import { Currency } from '@/models/user.model';
import { fetchSingleYachtPrice } from '@/services/yacht.service';
import { useUserStore } from '@/valtio/user/user.store';
import { setCalculatedPrice, setCalculatingPrice } from '@/valtio/yacht/yacht.actions';
import { useYachtStore } from '@/valtio/yacht/yacht.store';

import useQueryParams from './useQueryParams';

export const useYachtPriceCalculation = () => {
  const { selectedOffer } = useYachtStore();
  const { user } = useUserStore();
  const { params } = useQueryParams();

  const urlCurrency = params.currency as Currency;
  const currentCurrency = user?.currency || urlCurrency || Currency.EUR;

  const calculatePrice = useCallback(
    async (yachtSlug: string, selectedExtrasKeys: string[], currency?: string) => {
      if (!selectedOffer) {
        return null;
      }

      const offerId = selectedOffer.id;

      setCalculatingPrice(true);

      const finalCurrency = currency || currentCurrency;

      try {
        const result = await fetchSingleYachtPrice({
          yachtSlug,
          offerId,
          selectedExtrasKeys: selectedExtrasKeys.length > 0 ? selectedExtrasKeys : undefined,
          currency: finalCurrency,
        });

        setCalculatedPrice(result);

        return result;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error calculating price:', error);
        setCalculatedPrice(null);

        return null;
      } finally {
        setCalculatingPrice(false);
      }
    },
    [selectedOffer, currentCurrency]
  );

  return { calculatePrice };
};
