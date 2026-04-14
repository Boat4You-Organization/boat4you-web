import { useCallback, useState } from 'react';

import { Currency } from '@/models/user.model';
import { Status, YachtOfferModel } from '@/models/yacht-offer.model';
import { fetchSingleYachtStandardOffers } from '@/services/yacht.service';
import { Period } from '@/utils/static/standardOffers.utils';
import { useUserStore } from '@/valtio/user/user.store';

import useQueryParams from './useQueryParams';

interface UseStandardOffersProps {
  yachtSlug: string;
  periods: Period[];
}

interface PeriodStatus {
  isAvailable: boolean;
  isOption: boolean;
  offer: YachtOfferModel | undefined;
}

export const useStandardOffers = ({ yachtSlug, periods }: UseStandardOffersProps) => {
  const [standardOffers, setStandardOffers] = useState<YachtOfferModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedRanges, setLoadedRanges] = useState<Set<string>>(new Set());
  const { user } = useUserStore();
  const { params } = useQueryParams();

  const currency = user?.currency || (params.currency as Currency) || Currency.EUR;

  const getPeriodStatus = useCallback(
    (period: Period): PeriodStatus => {
      const matchingOffer = standardOffers.find(
        offer => offer.dateFrom === period.dateFrom && offer.dateTo === period.dateTo
      );

      return {
        isAvailable: matchingOffer?.status === Status.FREE,
        isOption: matchingOffer?.status === Status.OPTION,
        offer: matchingOffer,
      };
    },
    [standardOffers]
  );

  const fetchStandardOffers = useCallback(
    async (startIndex: number, count: number) => {
      if (periods.length === 0) return;

      const endIndex = Math.min(startIndex + count, periods.length);
      const periodsToFetch = periods.slice(startIndex, endIndex);

      if (periodsToFetch.length === 0) return;

      const firstPeriod = periodsToFetch[0];
      const lastPeriod = periodsToFetch[periodsToFetch.length - 1];
      const rangeKey = `${firstPeriod.dateFrom}-${lastPeriod.dateTo}`;

      if (loadedRanges.has(rangeKey)) {
        return;
      }

      setIsLoading(true);

      try {
        const data = await fetchSingleYachtStandardOffers({
          yachtSlug,
          dateFrom: firstPeriod.dateFrom,
          dateTo: lastPeriod.dateTo,
          currency,
        });

        setStandardOffers(prevOffers => {
          const existingOfferKeys = new Set(prevOffers.map(offer => `${offer.dateFrom}-${offer.dateTo}`));
          const newOffers = data.filter(offer => !existingOfferKeys.has(`${offer.dateFrom}-${offer.dateTo}`));

          return [...prevOffers, ...newOffers];
        });

        setLoadedRanges(prev => new Set(prev).add(rangeKey));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch standard offers:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [yachtSlug, periods, loadedRanges, currency]
  );

  return {
    standardOffers,
    isLoading,
    getPeriodStatus,
    fetchStandardOffers,
  };
};
