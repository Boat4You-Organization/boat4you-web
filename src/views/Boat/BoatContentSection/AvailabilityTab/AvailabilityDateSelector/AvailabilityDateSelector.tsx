'use client';

import React, { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';

import DateRangePicker from '@/components/DateRangePicker';
import { BoatCalendarFormValues } from '@/config/form-models.config';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import useToggleState from '@/utils/hooks/useToggleState';
import { useYachtAvailability } from '@/utils/hooks/useYachtAvailability';
import DateTime from '@/utils/static/DateTime';
import { handleNextMonth, handlePrevMonth } from '@/valtio/yacht/yacht.actions';
import { useYachtStore } from '@/valtio/yacht/yacht.store';

import styles from './AvailabilityDateSelector.module.scss';

interface AvailabilityDateSelectorProps {
  yacht: YachtModel;
  onSubmit: (formValues: BoatCalendarFormValues) => void;
}

const AvailabilityDateSelector = ({ yacht, onSubmit }: AvailabilityDateSelectorProps) => {
  const { activeDate, selectedOffer } = useYachtStore();
  const t = useTranslations('common');
  const locale = useLocale();
  const [isModalOpen, toggleModal] = useToggleState();
  const { setValue, watch } = useFormContext<BoatCalendarFormValues>();

  const formStartDate = watch('startDate');
  const formEndDate = watch('endDate');

  const { yachtAvailability } = useYachtAvailability(yacht.slug, activeDate.year(), activeDate.month() + 1);

  const unavailableDates = useMemo(() => {
    if (!Array.isArray(yachtAvailability)) return [];

    const dates: string[] = [];

    yachtAvailability.forEach(item => {
      if (item.status === 'RESERVATION') {
        const start = dayjs(item.from);
        const end = dayjs(item.to);
        let current = start;

        while (current.isBefore(end)) {
          dates.push(DateTime.formatFull(current));
          current = current.add(1, 'day');
        }
      }
    });

    return dates;
  }, [yachtAvailability]);

  const validateDateRange = useCallback(
    (start: Dayjs, end: Dayjs): boolean => {
      const daysDiff = end.diff(start, 'day') + 1;

      if (daysDiff < 3 || daysDiff > 28) return false;

      let current = start.clone();
      const unavailableDatesSet = new Set(unavailableDates);

      while (current.isBefore(end)) {
        if (unavailableDatesSet.has(DateTime.formatFull(current))) return false;

        current = current.add(1, 'day');
      }

      return true;
    },
    [unavailableDates]
  );

  const handleConfirm = useCallback(
    (dates: [Dayjs | null, Dayjs | null]) => {
      const [start, end] = dates;

      if (start && end) {
        onSubmit({ startDate: start, endDate: end });
      }
    },
    [onSubmit]
  );

  const handleDateChange = useCallback(
    (dates: [Dayjs | null, Dayjs | null]) => {
      const [newStartDate, newEndDate] = dates;

      if (!newStartDate && !newEndDate) {
        setValue('startDate', null);
        setValue('endDate', null);

        return;
      }

      if (newStartDate && newEndDate && validateDateRange(newStartDate, newEndDate)) {
        setValue('startDate', newStartDate);
        setValue('endDate', newEndDate);
      } else if (newStartDate && !newEndDate) {
        setValue('startDate', newStartDate);
        setValue('endDate', null);
      }
    },
    [setValue, validateDateRange]
  );

  return (
    <>
      <Box px={3} py={2.5} className={styles.container}>
        <Stack className={styles.availabilityDate}>
          <Stack direction="column" spacing={{ xs: 0.5, lg: 0.75 }}>
            <Typography component="label" variant="body2" color={colors.blue300}>
              {t('startDate')}
            </Typography>
            <Typography component="p" variant="h4" textTransform="capitalize" color={colors.white}>
              {formStartDate ? DateTime.formatLong(formStartDate, locale) : '-'}
            </Typography>
            {(yacht.defaultCheckin || selectedOffer?.checkin) && (
              <Typography variant="body2" color={colors.blue300} sx={{ fontSize: 12 }}>
                {t('pickUpTime')}: {yacht.defaultCheckin || selectedOffer?.checkin}
              </Typography>
            )}
          </Stack>
          <Divider classes={{ root: styles.root }} className={styles.divider} />
          <Stack direction="column" spacing={0.75}>
            <Typography component="label" variant="body2" color={colors.blue300}>
              {t('endDate')}
            </Typography>
            <Typography component="p" variant="h4" textTransform="capitalize" color={colors.white}>
              {formEndDate ? DateTime.formatLong(formEndDate, locale) : '-'}
            </Typography>
            {(yacht.defaultCheckout || selectedOffer?.checkout) && (
              <Typography variant="body2" color={colors.blue300} sx={{ fontSize: 12 }}>
                {t('dropOffTime')}: {yacht.defaultCheckout || selectedOffer?.checkout}
              </Typography>
            )}
          </Stack>
        </Stack>
        <Button onClick={toggleModal} variant="containedInfo" size="medium" className={styles.button}>
          {t('changeDates')}
        </Button>
      </Box>
      <DateRangePicker
        isBoatCalendar
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        startDate={formStartDate}
        endDate={formEndDate}
        handleDateChange={handleDateChange}
        onConfirm={handleConfirm}
        monthsShown={1}
        unavailableDates={unavailableDates}
        externalCurrentMonth={activeDate}
        externalHandlePrevMonth={handlePrevMonth}
        externalHandleNextMonth={handleNextMonth}
      />
    </>
  );
};

export default AvailabilityDateSelector;
