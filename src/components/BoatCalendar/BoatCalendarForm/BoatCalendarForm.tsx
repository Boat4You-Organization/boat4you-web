'use client';

import React, { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { Box, Button, Divider, InputAdornment, Stack, Tooltip, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';

import CircularProgress from '@/components/CircularProgress';
import DateRangePicker from '@/components/DateRangePicker';
import FlagIcon from '@/components/FlagIcon';
import FormDateInput from '@/components/Forms/FormDateInput';
import Calendar from '@/components/SvgIcons/Calendar';
import { BoatCalendarFormValues } from '@/config/form-models.config';
import { ReservationStatus } from '@/models/reservation.model';
import { CURRENCY_SYMBOL_MAP, Currency } from '@/models/user.model';
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
import { resolveGate } from '@/utils/static/offerStatusGate';
import { toTitleCase } from '@/utils/static/toTitleCase';
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

  // Single honest gate decision (FREE → reserve, OPTION → inquiry,
  // RESERVATION/SERVICE → hard-blocked). See offerStatusGate.ts.
  const gate = resolveGate(selectedOffer?.status, { custom: yacht.custom, inquireOnly });
  const isSelectedOfferBlocked = gate === 'blocked';
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
    if (gate === 'blocked') return; // defensive — the button is disabled anyway

    if (gate === 'inquiry') {
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
            {hasValidDateSelection && isCalculatedPrice && !isSelectedOfferBlocked ? (
              <Typography component="p" variant="h3" fontWeight={700} color={colors.blue500}>
                Ready to sail?
              </Typography>
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
            <Tooltip
              placement="top"
              arrow
              title={
                <Box sx={{ p: 0.5 }}>
                  <Typography variant="body1" fontWeight={700} color={colors.white}>
                    {yacht.model} | {toTitleCase(yacht.name)}
                  </Typography>
                  {yacht.location && (
                    <Stack direction="row" alignItems="center" gap={0.75} mt={0.5}>
                      <FlagIcon countryCode={yacht.location.countryCode} />
                      <Typography variant="body2" color={colors.white}>
                        {yacht.location.name}
                      </Typography>
                    </Stack>
                  )}
                  <Stack mt={1.5} gap={0.5}>
                    <Stack direction="row" justifyContent="space-between" gap={3}>
                      <Typography variant="body2" color={colors.black300}>
                        Total length of rental
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color={colors.white}>
                        {computedNumberOfDays} {daysText}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" gap={3}>
                      <Typography variant="body2" color={colors.black300}>
                        Yacht pick-up
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color={colors.white}>
                        {startDate ? dayjs(startDate).format('D MMMM YYYY') : '-'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" gap={3}>
                      <Typography variant="body2" color={colors.black300}>
                        Yacht drop-off
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color={colors.white}>
                        {endDate ? dayjs(endDate).format('D MMMM YYYY') : '-'}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography variant="body2" fontWeight={700} color={colors.blue400} mt={1.5}>
                    Only takes 3 minutes to book it
                  </Typography>
                </Box>
              }
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: colors.black950,
                    color: colors.white,
                    maxWidth: 'none',
                    width: 320,
                    p: 2,
                    borderRadius: 1.5,
                    '& .MuiTooltip-arrow': {
                      color: colors.black950,
                    },
                  },
                },
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Button
                  size="large"
                  fullWidth
                  onClick={handleReserveClick}
                  disabled={variant === 'inner' ? !isCalculatedPrice || isSelectedOfferBlocked : false}
                >
                  {variant === 'inner' && gate === 'reserve' ? t('reserve') : t('inquireNow')}
                </Button>
              </Box>
            </Tooltip>
          ) : (
            <Button size="large" fullWidth onClick={toggleModal}>
              {t('chooseDates')}
            </Button>
          )}
        </Stack>

        {hasValidDateSelection && variant === 'inner' && isCalculatedPrice && !isSelectedOfferBlocked && (
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

                    // Two-row layout: long descriptions wrap freely on the
                    // first row, the price (with €) stays on its own line
                    // right-aligned. Mario flagged that flex space-between
                    // was squeezing the price into a narrow slot wide enough
                    // for "560" but not for "560 €", so the symbol broke
                    // onto a second visual line.
                    return (
                      <Stack
                        key={`${name}-${id}`}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        gap={2}
                      >
                        <Typography variant="body1" sx={{ flex: 1, minWidth: 0 }}>
                          {labelCode ? tServices(labelCode as YachtServiceExtrasKey) : name}
                        </Typography>
                        <Typography variant="body1" whiteSpace="nowrap" sx={{ flexShrink: 0 }}>
                          {formattedPrice}
                        </Typography>
                      </Stack>
                    );
                  })}
                </>
              )}
              {(() => {
                // V1_57 split — see PaymentTab.tsx for context
                // Mario 12.7.2026: crew (skipper/hostess) and APA are settled at
                // the base on handover, not wired "in advance" — group everything
                // payable outside our online total under "Paid at marina". No
                // separate "paid in advance" section.
                const inAdvance = (selectedExtrasAtBase || []).filter(() => false);
                const onSite = selectedExtrasAtBase || [];
                // Refundable security deposit is a yacht-level field, not a
                // partner-sent extra — always shown under "Paid at marina"
                // in the recap since it's held at pick-up (and refunded on
                // return). Renders the primary amount; insured deposit (if
                // any) is a separate optional extra handled elsewhere.
                const showSecurityDeposit = yacht.securityDeposit > 0;
                const renderRow = ({ id, name, priceEur, priceInfo, labelCode }: (typeof inAdvance)[number]) => {
                  const formattedPrice = formatPriceWithCurrency({
                    clientPriceEur: priceEur,
                    clientPriceInfo: priceInfo,
                  });

                  return (
                    <Stack
                      key={`${name}-${id}`}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      gap={2}
                    >
                      <Typography variant="body1" sx={{ flex: 1, minWidth: 0 }}>
                        {labelCode ? tServices(labelCode as YachtServiceExtrasKey) : name}
                      </Typography>
                      <Typography variant="body1" whiteSpace="nowrap" sx={{ flexShrink: 0 }}>
                        {formattedPrice}
                      </Typography>
                    </Stack>
                  );
                };

                return (
                  <>
                    {inAdvance.length > 0 && (
                      <>
                        <Typography variant="body1" fontWeight={700} color={colors.blue500}>
                          {tCommon('paidInAdvance')}
                        </Typography>
                        {inAdvance.map(renderRow)}
                      </>
                    )}
                    {(onSite.length > 0 || showSecurityDeposit) && (
                      <>
                        <Typography variant="body1" fontWeight={700} color={colors.blue500}>
                          {tCommon('paidAtMarina')}
                        </Typography>
                        {onSite.map(renderRow)}
                        {showSecurityDeposit && (
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                            <Typography variant="body1" sx={{ flex: 1, minWidth: 0 }}>
                              {tServices('refundable-security-deposit')}
                            </Typography>
                            <Typography variant="body1" whiteSpace="nowrap" sx={{ flexShrink: 0 }}>
                              {formatPriceWithCurrency({ clientPriceEur: yacht.securityDeposit })}
                            </Typography>
                          </Stack>
                        )}
                      </>
                    )}
                  </>
                );
              })()}
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
