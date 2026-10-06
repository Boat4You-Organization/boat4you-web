import { useCallback } from 'react';

import { Currency } from '@/models/user.model';
import { fetchSingleYachtPrice } from '@/services/yacht.service';
import { useUserStore } from '@/valtio/user/user.store';
import { setCalculatedPrice, setCalculatingPrice, setPriceSettled } from '@/valtio/yacht/yacht.actions';
import { useYachtStore } from '@/valtio/yacht/yacht.store';

import useQueryParams from './useQueryParams';

/**
 * Only the latest price request writes the store. A slow answer for the
 * previous week (or for dates that have since lost their offer) used to land
 * after the current one: its `finally` cleared "calculating" and marked the
 * OLD offer settled, so the page kept "Checking availability…" with Reserve
 * disabled for good, or hid a real "not available" (review 6.10.2026).
 */
let latestPriceRequest = 0;

/** Drops the answer of any price request still in flight (the dates have no offer any more). */
export const cancelPendingPriceCalculation = () => {
  latestPriceRequest += 1;
};

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

      latestPriceRequest += 1;

      const requestId = latestPriceRequest;
      const isLatest = () => requestId === latestPriceRequest;

      setCalculatingPrice(true);

      const finalCurrency = currency || currentCurrency;

      try {
        const result = await fetchSingleYachtPrice({
          yachtSlug,
          offerId,
          selectedExtrasKeys: selectedExtrasKeys.length > 0 ? selectedExtrasKeys : undefined,
          currency: finalCurrency,
        });

        if (!isLatest()) return null;

        setCalculatedPrice(result);

        return result;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error calculating price:', error);

        if (isLatest()) setCalculatedPrice(null);

        return null;
      } finally {
        // Known now for this boat + offer, priced or not: the page may say
        // "not available" from here on, never while it is still asking. A
        // superseded request leaves both to the one that replaced it.
        if (isLatest()) {
          setCalculatingPrice(false);
          setPriceSettled(yachtSlug, offerId);
        }
      }
    },
    [selectedOffer, currentCurrency]
  );

  return { calculatePrice };
};
