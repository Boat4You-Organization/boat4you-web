'use client';

import React, { startTransition, useActionState, useCallback, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { InputAdornment, Stack, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';

import { getSingleYachtAvailability } from '@/actions/yacht.actions';
import DateRangePicker from '@/components/DateRangePicker';
import FormDateInput from '@/components/Forms/FormDateInput';
import Calendar from '@/components/SvgIcons/Calendar';
import { BoatCalendarFormValues } from '@/config/form-models.config';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import useQueryParams from '@/utils/hooks/useQueryParams';
import useToggleState from '@/utils/hooks/useToggleState';
import DateTime from '@/utils/static/DateTime';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { handleNextMonth, handlePrevMonth } from '@/valtio/yacht/yacht.actions';
import { useYachtStore } from '@/valtio/yacht/yacht.store';

interface ChangeDatesContentProps {
  yacht: YachtModel;
  isCalculatedPrice: boolean | null;
  isSelectedOfferUnavailable: boolean;
}

const ChangeDatesContent = ({ yacht, isCalculatedPrice, isSelectedOfferUnavailable }: ChangeDatesContentProps) => {
  const { activeDate, selectedOffer, calculatedPrice } = useYachtStore();
  const { setMultipleParams } = useQueryParams();
  const [isModalOpen, toggleModal] = useToggleState();
  const { setValue, watch } = useFormContext<BoatCalendarFormValues>();
  const t = useTranslations('yacht');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // Headline shows the charter price for the WHOLE selected period, not a
  // per-day rate — mirrors the search listing card and availability card
  // (both use clientPriceEur + `priceForXDays`). A per-day number reads
  // misleadingly cheap (494/day vs ~3458 for the week). Mario 5.7.2026.
  const selectedDays = startDate && endDate ? endDate.diff(startDate, 'day') : 7;
  const numberOfDays =
    calculatedPrice?.numberOfDays && calculatedPrice.numberOfDays > 0 ? calculatedPrice.numberOfDays : selectedDays;

  const formattedClientPriceTotal = formatPriceWithCurrency({
    clientPriceEur: calculatedPrice?.clientPriceEur,
    clientPriceInfo: calculatedPrice?.clientPriceInfo,
    locale,
  });

  const [availabilityState, availabilityAction] = useActionState(getSingleYachtAvailability, []);

  const unavailableDates = useMemo(() => {
    if (!Array.isArray(availabilityState)) return [];

    const dates: string[] = [];

    availabilityState.forEach(item => {
      if (item.status === 'RESERVATION') {
        const start = dayjs(item.from);
        const end = dayjs(item.to);
        let current = start;

        while (current.isBefore(end)) {
          dates.push(current.format('YYYY-MM-DD'));
          current = current.add(1, 'day');
        }
      }
    });

    return dates;
  }, [availabilityState]);

  const validateDateRange = useCallback(
    (start: Dayjs, end: Dayjs): boolean => {
      const daysDiff = end.diff(start, 'day') + 1;

      if (daysDiff < 3 || daysDiff > 28) return false;

      let current = start.clone();
      const unavailableDatesSet = new Set(unavailableDates);

      while (current.isBefore(end)) {
        if (unavailableDatesSet.has(current.format('YYYY-MM-DD'))) return false;

        current = current.add(1, 'day');
      }

      return true;
    },
    [unavailableDates]
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

  const handleConfirm = useCallback(
    (dates: [Dayjs | null, Dayjs | null]) => {
      const [start, end] = dates;

      setValue('startDate', start);
      setValue('endDate', end);

      if (start && end) {
        setMultipleParams({
          startDate: DateTime.formatFull(start),
          endDate: DateTime.formatFull(end),
        });
      } else {
        setMultipleParams({ startDate: '', endDate: '' });
      }
    },
    [setMultipleParams, setValue]
  );

  useEffect(() => {
    startTransition(() => {
      availabilityAction({
        yachtSlug: yacht.slug,
        month: activeDate.month() + 1,
        year: activeDate.year(),
      });
    });
  }, [yacht.slug, activeDate, availabilityAction]);

  const hasValidDateSelection = startDate && endDate && selectedOffer;

  return (
    <>
      <Stack>
        {hasValidDateSelection && isCalculatedPrice && !isSelectedOfferUnavailable ? (
          <Stack direction="row" spacing={1} alignItems="end">
            <Typography component="p" variant="h2" color={colors.green500}>
              {t('upTo')} {formattedClientPriceTotal}
            </Typography>
            <Typography variant="body1" color={colors.black600}>
              {tCommon('priceForXDays', { days: String(numberOfDays) })}
            </Typography>
          </Stack>
        ) : (
          <Stack p={2} borderRadius={2.5} sx={{ backgroundColor: colors.red50 }}>
            <Typography variant="body1" color={colors.red500} textAlign="center">
              {!hasValidDateSelection ? t('noDateSelected') : t('notAvailable')}
            </Typography>
          </Stack>
        )}
        <Stack pt={3} spacing={2}>
          <FormDateInput
            name="startDate"
            formLabel="Start date"
            type="text"
            placeholder="Pick Date"
            onClick={toggleModal}
            slotProps={{
              input: {
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Calendar size={24} fill={colors.black300} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormDateInput
            name="endDate"
            formLabel="End date"
            type="text"
            placeholder="Pick Date"
            onClick={toggleModal}
            slotProps={{
              input: {
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Calendar size={24} fill={colors.black300} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
      </Stack>
      <DateRangePicker
        isBoatCalendar
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        startDate={startDate}
        endDate={endDate}
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

export default ChangeDatesContent;
