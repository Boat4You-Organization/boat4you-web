'use client';

import React, { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { Box, Button, Divider, InputAdornment, Stack, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';

import CircularProgress from '@/components/CircularProgress';
import DateRangePicker from '@/components/DateRangePicker';
import FormDateInput from '@/components/Forms/FormDateInput';
import Calendar from '@/components/SvgIcons/Calendar';
import { BoatCalendarFormValues } from '@/config/form-models.config';
import { ReservationStatus } from '@/models/reservation.model';
import { CURRENCY_SYMBOL_MAP, Currency } from '@/models/user.model';
import { Status } from '@/models/yacht-offer.model';
import { YachtServiceExtrasKey } from '@/models/yacht-service.model';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { useDaysText } from '@/utils/hooks/usePluralization';
import useQueryParams from '@/utils/hooks/useQueryParams';
import { useReservation } from '@/utils/hooks/useReservation';
import useToggleState from '@/utils/hooks/useToggleState';
import { useYachtAvailability } from '@/utils/hooks/useYachtAvailability';
import DateTime from '@/utils/static/DateTime';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { handleNextMonth, handlePrevMonth, toggleBoatInquiryModalOpen } from '@/valtio/yacht/yacht.actions';
import { useYachtStore } from '@/valtio/yacht/yacht.store';

interface BoatCalendarFormProps {
  yacht: YachtModel;
  variant?: 'inner' | 'crewed';
}

const BoatCalendarForm = ({ yacht, variant }: BoatCalendarFormProps) => {
  const locale = useLocale();
  const { activeDate, calculatedPrice, isCalculatingPrice, selectedOffer } = useYachtStore();
  const { setMultipleParams } = useQueryParams();
  const t = useTranslations('yacht');
  const tCommon = useTranslations('common');
  const tServices = useTranslations('yacht.servicesList');
  const { slug, inquireOnly } = yacht;
  const {
    selectedExtrasInPrice,
    selectedExtrasAtBase,
    totalPriceEur,
    totalPriceInfo,
    clientPriceInfo,
    clientPricePerDayEur,
    clientPricePerDayInfo,
  } = calculatedPrice ?? {};

  const { handleReservation } = useReservation({ yacht });
  const [isModalOpen, toggleModal] = useToggleState();
  const { setValue, watch } = useFormContext<BoatCalendarFormValues>();
  const computedNumberOfDays = calculatedPrice
    ? DateTime.daysBetween(DateTime.date(calculatedPrice.dateFrom), DateTime.date(calculatedPrice.dateTo))
    : 0;
  const daysText = useDaysText(computedNumberOfDays);

  const isSelectedOfferOption = selectedOffer?.status === Status.OPTION;
  const isSelectedOfferUnavailable = selectedOffer?.status === Status.UNAVAILABLE;
  const isCalculatedPrice = calculatedPrice && Object.keys(calculatedPrice).length > 0;

  const formattedClientPricePerDay = formatPriceWithCurrency({
    clientPriceEur: clientPricePerDayEur,
    clientPriceInfo: clientPricePerDayInfo,
    locale,
  });

  const formattedTotalPrice = formatPriceWithCurrency({
    clientPriceEur: totalPriceEur,
    clientPriceInfo,
    locale,
  });

  const formattedFullPrice = formatPriceWithCurrency({
    clientPriceEur: totalPriceEur,
    clientPriceInfo: totalPriceInfo,
    locale,
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const { yachtAvailability, loading: isLoadingAvailability } = useYachtAvailability(
    slug,
    activeDate.year(),
    activeDate.month() + 1
  );

  const unavailableDates = useMemo(() => {
    if (!Array.isArray(yachtAvailability)) return [];

    const dates: string[] = [];

    yachtAvailability.forEach(item => {
      if (item.status === ReservationStatus.RESERVATION || item.status === ReservationStatus.SERVICE) {
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

      if (start && end) {
        const updates = {
          startDate: DateTime.formatFull(start),
          endDate: DateTime.formatFull(end),
        };

        setMultipleParams(updates);
      }
    },
    [setMultipleParams]
  );

  const handleReserveClick = () => {
    if (isSelectedOfferOption || yacht.custom || inquireOnly) {
      toggleBoatInquiryModalOpen();

      return;
    }

    handleReservation();
  };

  const hasValidDateSelection = startDate && endDate;

  return (
    <>
      <Stack>
        {variant === 'crewed' ? (
          <Stack direction="row" spacing={1} alignItems="end">
            <Typography component="p" variant="h2" color={colors.green500}>
              {t('priceOnInquiry')}
            </Typography>
          </Stack>
        ) : (
          <Stack>
            {hasValidDateSelection && isCalculatedPrice && !isSelectedOfferUnavailable ? (
              <Stack direction="row" spacing={1} alignItems="end">
                <Typography component="p" variant="h2" color={colors.green500}>
                  {t('upTo')} {formattedClientPricePerDay}
                </Typography>
                <Typography variant="body1" color={colors.black600}>
                  {t('perDay')}
                </Typography>
              </Stack>
            ) : (
              <Stack p={2} borderRadius={2.5} sx={{ backgroundColor: colors.red50 }}>
                <Typography variant="body1" color={colors.red500} textAlign="center">
                  {!hasValidDateSelection ? t('noDateSelected') : t('notAvailable')}
                </Typography>
              </Stack>
            )}
          </Stack>
        )}

        <Stack pt={3} spacing={2}>
          <FormDateInput
            name="startDate"
            formLabel={t('startDate')}
            type="text"
            placeholder={t('pickDate')}
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
            formLabel={t('endDate')}
            type="text"
            placeholder={t('pickDate')}
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
          {variant === 'crewed' && (
            <Typography variant="body1" color={colors.black500}>
              {t('crewedDescription')}
            </Typography>
          )}
          {hasValidDateSelection ? (
            <Button
              size="large"
              fullWidth
              onClick={handleReserveClick}
              disabled={
                variant === 'inner'
                  ? !isCalculatedPrice ||
                    (isSelectedOfferUnavailable && !isSelectedOfferOption && !yacht.custom && !inquireOnly)
                  : false
              }
            >
              {variant === 'inner' && !isSelectedOfferOption && !inquireOnly ? t('reserve') : t('inquireNow')}
            </Button>
          ) : (
            <Button size="large" fullWidth onClick={toggleModal}>
              {t('chooseDates')}
            </Button>
          )}
        </Stack>

        {hasValidDateSelection && variant === 'inner' && isCalculatedPrice && !isSelectedOfferUnavailable && (
          <Box>
            <Typography variant="body2" color={colors.black600} pt={3} textAlign="center">
              {t('wontChargedYet')}
            </Typography>
            {isCalculatedPrice && (
              <>
                <Stack direction="row" justifyContent="space-between" pt={4} gap={1} alignItems="flex-start">
                  <Typography variant="body1" fontWeight={700}>
                    {t('totalDueNow')}
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    color={colors.blue500}
                    display="flex"
                    alignItems="center"
                    whiteSpace="nowrap"
                  >
                    {isCalculatingPrice ? <CircularProgress size={20} /> : formattedFullPrice}
                  </Typography>
                </Stack>

                <Divider
                  sx={{
                    '&.MuiDivider-root': {
                      marginBlock: 3,
                      borderColor: colors.black200,
                    },
                  }}
                />
              </>
            )}
            <Stack direction="column" pt={0} spacing={3}>
              {calculatedPrice && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body1">
                    {formattedClientPricePerDay} x {computedNumberOfDays} {daysText}
                  </Typography>
                  <Typography variant="body1">
                    {startDate && endDate ? `${formattedTotalPrice}` : `0 ${CURRENCY_SYMBOL_MAP[Currency.EUR]}`}
                  </Typography>
                </Stack>
              )}
              {(selectedExtrasInPrice?.length ?? 0) > 0 && (
                <>
                  <Typography variant="body1" fontWeight={700} color={colors.blue500}>
                    {tCommon('paidNow')}
                  </Typography>
                  {selectedExtrasInPrice?.map(({ id, name, priceEur, priceInfo, labelCode }) => {
                    const formattedPrice = formatPriceWithCurrency({
                      clientPriceEur: priceEur,
                      clientPriceInfo: priceInfo,
                    });

                    return (
                      <Stack key={`${name}-${id}`} direction="row" justifyContent="space-between">
                        <Typography display="flex" flexDirection="row" gap="4px" variant="body1">
                          {labelCode ? tServices(labelCode as YachtServiceExtrasKey) : name}
                        </Typography>
                        <Typography variant="body1" whiteSpace="nowrap">
                          {formattedPrice}
                        </Typography>
                      </Stack>
                    );
                  })}
                </>
              )}
              {(selectedExtrasAtBase?.length ?? 0) > 0 && (
                <>
                  <Typography variant="body1" fontWeight={700} color={colors.blue500}>
                    {tCommon('paidAtMarina')}
                  </Typography>
                  {selectedExtrasAtBase?.map(({ id, name, priceEur, priceInfo, labelCode }) => {
                    const formattedPrice = formatPriceWithCurrency({
                      clientPriceEur: priceEur,
                      clientPriceInfo: priceInfo,
                    });

                    return (
                      <Stack key={`${name}-${id}`} direction="row" justifyContent="space-between" gap={4}>
                        <Typography display="flex" flexDirection="row" variant="body1">
                          {labelCode ? tServices(labelCode as YachtServiceExtrasKey) : name}
                        </Typography>
                        <Typography variant="body1" whiteSpace="nowrap">
                          {formattedPrice}
                        </Typography>
                      </Stack>
                    );
                  })}
                </>
              )}
            </Stack>
          </Box>
        )}
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
        isLoadingAvailability={isLoadingAvailability}
      />
    </>
  );
};

export default BoatCalendarForm;
