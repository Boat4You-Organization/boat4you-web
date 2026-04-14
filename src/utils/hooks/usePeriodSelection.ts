import { useCallback, useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { YachtOfferModel } from '@/models/yacht-offer.model';
import DateTime from '@/utils/static/DateTime';
import { Period } from '@/utils/static/standardOffers.utils';

import useQueryParams from './useQueryParams';

interface UsePeriodSelectionProps {
  periods: Period[];
  onPeriodMatch?: (startDate: string, endDate: string) => void;
}

export const usePeriodSelection = ({ periods, onPeriodMatch }: UsePeriodSelectionProps) => {
  const { params, setMultipleParams } = useQueryParams();
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);

  useEffect(() => {
    if (params.startDate && params.endDate && periods.length > 0) {
      const matchingPeriod = periods.find(
        period => period.dateFrom === params.startDate && period.dateTo === params.endDate
      );

      if (matchingPeriod) {
        setSelectedPeriod(matchingPeriod);
        onPeriodMatch?.(params.startDate, params.endDate);
      } else {
        setSelectedPeriod(null);
      }
    } else if (!params.startDate || !params.endDate) {
      setSelectedPeriod(null);
    }
  }, [params.startDate, params.endDate, periods, onPeriodMatch]);

  const handlePeriodSelect = useCallback(
    (period: Period, offer: YachtOfferModel | undefined) => {
      if (offer) {
        setSelectedPeriod(period);

        setMultipleParams({
          startDate: DateTime.formatFull(dayjs(offer.dateFrom)),
          endDate: DateTime.formatFull(dayjs(offer.dateTo)),
        });
      }
    },
    [setMultipleParams]
  );

  const isSelectedPeriod = useCallback((period: Period) => selectedPeriod?.id === period.id, [selectedPeriod]);

  return {
    selectedPeriod,
    handlePeriodSelect,
    isSelectedPeriod,
  };
};
