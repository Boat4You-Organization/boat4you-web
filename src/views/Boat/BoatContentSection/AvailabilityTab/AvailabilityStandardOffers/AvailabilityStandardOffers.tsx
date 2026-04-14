'use client';

import { useEffect, useRef, useState } from 'react';

import { Box, IconButton, Stack, Typography } from '@mui/material';
import cx from 'clsx';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

import ChevronLeft from '@/components/SvgIcons/ChevronLeft';
import ChevronRight from '@/components/SvgIcons/ChevronRight';
import { INITIAL_ITEMS_TO_FETCH, TOTAL_PERIODS } from '@/config/constants.config';
import { usePeriodSelection } from '@/utils/hooks/usePeriodSelection';
import useQueryParams from '@/utils/hooks/useQueryParams';
import { useStandardOffers } from '@/utils/hooks/useStandardOffers';
import { useSwiperNavigation } from '@/utils/hooks/useSwiperNavigation';
import { Period, generateSaturdayToSaturdayPeriods } from '@/utils/static/standardOffers.utils';

import styles from './AvailabilityStandardOffers.module.scss';
import PeriodChip from './PeriodChip/PeriodChip';

interface AvailabilityStandardOffersProps {
  yachtSlug: string;
}

const AvailabilityStandardOffers = ({ yachtSlug }: AvailabilityStandardOffersProps) => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const { params } = useQueryParams();
  const previousDates = useRef<{ startDate?: string; endDate?: string }>({});
  const hasScrolledToInitialDate = useRef(false);
  const t = useTranslations('yacht');
  const tCommon = useTranslations('common');

  const { isLoading, getPeriodStatus, fetchStandardOffers } = useStandardOffers({
    yachtSlug,
    periods,
  });

  const {
    swiperRef,
    isBeginning,
    isEnd,
    slidesPerGroup,
    isMobile,
    swiperConfig,
    handleSwiper,
    handleSlideChange,
    handlePrevClick,
    handleNextClick,
    slideTo,
  } = useSwiperNavigation({
    totalItems: periods.length,
    onSlideChange: startIndex => {
      if (isMobile) {
        fetchStandardOffers(startIndex, slidesPerGroup);
      }
    },
    onPrefetch: async (startIndex, count) => {
      await fetchStandardOffers(startIndex, count);
    },
  });

  const { handlePeriodSelect, isSelectedPeriod } = usePeriodSelection({
    periods,
  });

  useEffect(() => {
    const currentStartDate = params.startDate;
    const currentEndDate = params.endDate;

    if (periods.length === 0) return;

    const datesChanged =
      previousDates.current.startDate !== currentStartDate || previousDates.current.endDate !== currentEndDate;

    const isInitialLoadWithDates = !hasScrolledToInitialDate.current && currentStartDate && currentEndDate;

    if ((datesChanged || isInitialLoadWithDates) && currentStartDate && currentEndDate) {
      let matchingPeriodIndex = periods.findIndex(
        period => period.dateFrom === currentStartDate && period.dateTo === currentEndDate
      );

      if (matchingPeriodIndex === -1) {
        const selectedStartDate = dayjs(currentStartDate);

        const validPeriods = periods
          .map((period, index) => ({ period, index }))
          .filter(({ period }) => dayjs(period.dateFrom).isSameOrBefore(selectedStartDate, 'day'));

        if (validPeriods.length > 0) {
          const closestPeriod = validPeriods.reduce((closest, current) => {
            const closestDate = dayjs(closest.period.dateFrom);
            const currentDate = dayjs(current.period.dateFrom);

            return currentDate.isAfter(closestDate) ? current : closest;
          });

          matchingPeriodIndex = closestPeriod.index;
        } else {
          matchingPeriodIndex = 0;
        }
      }

      if (matchingPeriodIndex !== -1) {
        setTimeout(() => {
          if (swiperRef.current) {
            const targetSlide = Math.floor(matchingPeriodIndex / slidesPerGroup) * slidesPerGroup;

            slideTo(targetSlide);
            fetchStandardOffers(targetSlide, slidesPerGroup);
            hasScrolledToInitialDate.current = true;
          }
        }, 200);
      }
    }

    previousDates.current = {
      startDate: currentStartDate,
      endDate: currentEndDate,
    };
  }, [params.startDate, params.endDate, periods, slidesPerGroup, slideTo, fetchStandardOffers, swiperRef]);

  useEffect(() => {
    const initialDate = dayjs();
    const allPeriods = generateSaturdayToSaturdayPeriods(initialDate, TOTAL_PERIODS);

    setPeriods(allPeriods);
  }, []);

  useEffect(() => {
    if (periods.length > 0) {
      fetchStandardOffers(0, INITIAL_ITEMS_TO_FETCH);
    }
  }, [periods, fetchStandardOffers]);

  const handleChipClick = (period: Period) => {
    const periodStatus = getPeriodStatus(period);

    if (periodStatus.isAvailable || periodStatus.isOption) {
      handlePeriodSelect(period, periodStatus.offer);
    }
  };

  return (
    <Stack direction="column" spacing={3} padding={4} className={styles.container}>
      <Stack direction="row" justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
        <Typography variant="h4" component="h3">
          {t('tooShortOfStay')} 😀
        </Typography>
        <Box className={styles.arrowButtonsContainer}>
          <IconButton
            className={cx(styles.arrowButton, styles.arrowButtonLeft)}
            onClick={handlePrevClick}
            disabled={isBeginning || isLoading}
            aria-label={tCommon('previous')}
          >
            <ChevronLeft size={24} />
          </IconButton>

          <IconButton
            className={cx(styles.arrowButton, styles.arrowButtonRight)}
            onClick={handleNextClick}
            disabled={isEnd || isLoading}
            aria-label={tCommon('next')}
          >
            <ChevronRight size={24} />
          </IconButton>
        </Box>
      </Stack>

      {periods.length > 0 && (
        <Swiper
          onSwiper={handleSwiper}
          onSlideChange={handleSlideChange}
          slidesPerView="auto"
          spaceBetween={16}
          slidesPerGroup={slidesPerGroup}
          className={styles.swiper}
          {...swiperConfig}
        >
          {periods.map(period => {
            const periodStatus = getPeriodStatus(period);

            return (
              <SwiperSlide key={period.id} className={styles.slide}>
                <PeriodChip
                  period={period}
                  isLoading={isLoading}
                  isAvailable={periodStatus.isAvailable}
                  isOption={periodStatus.isOption}
                  isActive={isSelectedPeriod(period)}
                  totalPriceEur={periodStatus.offer?.totalPriceEur}
                  clientPriceInfo={periodStatus.offer?.clientPriceInfo}
                  onClick={() => handleChipClick(period)}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </Stack>
  );
};

export default AvailabilityStandardOffers;
