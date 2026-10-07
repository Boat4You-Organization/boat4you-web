'use client';

/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';

import { Box, Button, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';

import CircularProgress from '@/components/CircularProgress';
import Form from '@/components/Forms/Form';
import ModalRoot from '@/components/ModalRoot';
import Calendar from '@/components/SvgIcons/Calendar';
import { BoatCalendarFormValues } from '@/config/form-models.config';
import { BOAT_CALENDAR_FORM } from '@/config/form-names.config';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { PriceInfo } from '@/types/price-info.type';
import useQueryParams from '@/utils/hooks/useQueryParams';
import { useReservation } from '@/utils/hooks/useReservation';
import useToggleState from '@/utils/hooks/useToggleState';
import DateTime from '@/utils/static/DateTime';
import { formatPriceWithCurrency, isPositivePrice } from '@/utils/static/formatPriceCurrency';
import { isInquiryOnlyBoat } from '@/utils/static/inquiryOnlyBoat';
import { resolveGate } from '@/utils/static/offerStatusGate';
import { toggleBoatInquiryModalOpen } from '@/valtio/yacht/yacht.actions';
import { priceSettledKey, useYachtStore } from '@/valtio/yacht/yacht.store';

import styles from './BoatMobileNavigation.module.scss';
import ChangeDatesContent from './ChangeDatesContent';
import PriceDetailsContent from './PriceDetailsContent';

interface BoatMobileNavigationProps {
  yacht: YachtModel;
  /**
   * The boat's cheapest bookable week (weeklyOffers.ts, decided on the
   * server): the "From … / week" line before any dates are chosen — the
   * same amount as the Product JSON-LD lowPrice and the FAQ. Null when no
   * week is bookable.
   */
  weeklyFromPrice?: { clientPriceEur: number; clientPriceInfo?: PriceInfo } | null;
}

const defaultValues: BoatCalendarFormValues = {
  startDate: null,
  endDate: null,
};

const BoatMobileNavigation = ({ yacht, weeklyFromPrice = null }: BoatMobileNavigationProps) => {
  const t = useTranslations('common');
  const tYacht = useTranslations('yacht');
  const { calculatedPrice, selectedOffer, isCalculatingPrice, priceSettledFor } = useYachtStore();
  const { params, setMultipleParams } = useQueryParams();
  const [isModalOpen, toggleModal] = useToggleState();
  const [modalVariant, setModalVariant] = useState<'price' | 'dates' | null>(null);
  // The bar used to cover ~20% of the first screen (Mario 20.7.2026) — slide it
  // in only once the visitor starts scrolling, Boataround-style.
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const onScroll = () => setRevealed(window.scrollY > 160);

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const initialValues =
    params.startDate && params.endDate
      ? {
          startDate: dayjs(params.startDate),
          endDate: dayjs(params.endDate),
        }
      : defaultValues;

  // Single honest gate decision, mirror of BoatCalendarForm (desktop). See
  // offerStatusGate.ts. `isSelectedOfferBlocked` reuses the existing
  // `isSelectedOfferUnavailable` child prop name but now carries the correct
  // RESERVATION/SERVICE hard-block meaning (no longer the lossy UNAVAILABLE).
  const gate = resolveGate(selectedOffer?.status, { custom: yacht.custom, inquireOnly: yacht.inquireOnly });
  const isSelectedOfferBlocked = gate === 'blocked';
  // The price of THIS boat + offer is known (mirror of BoatCalendarForm).
  const isPriceSettled = priceSettledFor === priceSettledKey(yacht.slug, selectedOffer?.id);
  // A calculation without a total above 0 is no price — never "0 €".
  const isCalculatedPrice =
    isPriceSettled &&
    !!calculatedPrice &&
    Object.keys(calculatedPrice).length > 0 &&
    isPositivePrice(calculatedPrice.totalPriceEur);
  const isInquireFlow = gate === 'inquiry';
  // No bookable future offer: "Price on request" and the inquiry (dates are
  // picked in its form) instead of dates, price and Reserve.
  const inquiryOnly = isInquiryOnlyBoat(yacht);

  const { handleReservation } = useReservation({ yacht });
  const locale = useLocale();

  const handleReservationClick = () => {
    if (isSelectedOfferBlocked) return; // defensive — the button is disabled anyway

    if (isInquireFlow) {
      toggleBoatInquiryModalOpen();

      return;
    }

    handleReservation();
  };

  // Dates the boat cannot be reserved on still deserve an answer: the inquiry
  // form, pre-filled with the chosen dates (it reads them from the URL).
  const handleInquireClick = () => toggleBoatInquiryModalOpen(true);

  const handlePriceDetailOpen = () => {
    toggleModal();
    setModalVariant('price');
  };

  const handleChangeDatesOpen = () => {
    toggleModal();
    setModalVariant('dates');
  };

  const handleModalClose = () => {
    toggleModal();
    setModalVariant(null);
  };

  const handleSubmit = (formValues: BoatCalendarFormValues) => {
    const updates: Partial<{
      startDate: string;
      endDate: string;
    }> = {};

    if (formValues.startDate) {
      updates.startDate = DateTime.formatFull(formValues.startDate);
    }

    if (formValues.endDate) {
      updates.endDate = DateTime.formatFull(formValues.endDate);
    }

    setMultipleParams(updates);
  };

  const renderModalContent = () => {
    switch (modalVariant) {
      case 'dates':
        return (
          <ChangeDatesContent
            yacht={yacht}
            isCalculatedPrice={isCalculatedPrice}
            isSelectedOfferUnavailable={isSelectedOfferBlocked}
          />
        );
      case 'price':
        return (
          <PriceDetailsContent
            yacht={yacht}
            isCalculatedPrice={isCalculatedPrice}
            isSelectedOfferUnavailable={isSelectedOfferBlocked}
          />
        );
      default:
        return '';
    }
  };

  const formattedFullPrice = formatPriceWithCurrency({
    clientPriceEur: calculatedPrice?.totalPriceEur,
    clientPriceInfo: calculatedPrice?.totalPriceInfo,
    locale,
  });

  // Before dates are chosen: "From <cheapest bookable week> / week", the
  // same in the server HTML and after hydration. It used to wait for the
  // browser to price the boat's FIRST offer — the server HTML said "Price on
  // request" (SEO audit 7.10.2026), and the amount was that first offer's,
  // which is neither always the cheapest week nor always a 7-night offer.
  // The price details behind a click still need that calculation.
  const weeklyFromLabel =
    weeklyFromPrice && isPositivePrice(weeklyFromPrice.clientPriceInfo?.amount ?? weeklyFromPrice.clientPriceEur)
      ? tYacht('fromPerWeek', {
          price: formatPriceWithCurrency({
            clientPriceEur: weeklyFromPrice.clientPriceEur,
            clientPriceInfo: weeklyFromPrice.clientPriceInfo,
            locale,
          }),
        })
      : null;

  if (inquiryOnly) {
    return (
      <Box className={revealed ? `${styles.container} ${styles.revealed}` : styles.container}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
          <Typography variant="body1">{t('totalPrice')}</Typography>
          <Typography variant="h4" component="p" color={colors.green500}>
            {t('priceOnRequest')}
          </Typography>
        </Stack>
        <Button size="large" fullWidth onClick={() => toggleBoatInquiryModalOpen(true)}>
          {t('sendInquiry')}
        </Button>
      </Box>
    );
  }

  return (
    <Form defaultValues={initialValues} onSubmit={handleSubmit} id={BOAT_CALENDAR_FORM} resetDefaultValues>
      {({ watch }) => {
        const { startDate, endDate } = watch();
        const hasDates = !!(startDate && endDate);
        // Chosen dates the boat cannot be reserved on: the desktop form says
        // so, the phone bar only greyed out "Reserve" (audit B48). Say it —
        // without a price above the notice (audit 29.9.2026, R25) — and offer
        // "Change dates" or an inquiry for those dates.
        // Not before the answer is in: the first render (server HTML) used to
        // say "Not available on these dates" for every dated boat
        // (re-audit 2.10.2026). A known price being recalculated stays shown.
        const isCheckingAvailability =
          hasDates &&
          !isInquireFlow &&
          !(isCalculatedPrice && !isSelectedOfferBlocked) &&
          (!isPriceSettled || isCalculatingPrice);
        const isUnavailableSelection =
          hasDates && !isInquireFlow && !isCheckingAvailability && (isSelectedOfferBlocked || !isCalculatedPrice);

        return (
          <>
            <Box className={revealed ? `${styles.container} ${styles.revealed}` : styles.container}>
              {/* No dates chosen yet: a "from" price for a week — never a
                  period the visitor did not pick (the bar used to print
                  "today – today + 7" beside it, audit 29.9.2026, R24). */}
              {!hasDates && !isInquireFlow ? (
                <Typography
                  variant="h4"
                  component="p"
                  color={colors.green500}
                  className={weeklyFromLabel && isCalculatedPrice ? styles.price : undefined}
                  onClick={weeklyFromLabel && isCalculatedPrice ? handlePriceDetailOpen : undefined}
                >
                  {weeklyFromLabel ?? t('priceOnRequest')}
                </Typography>
              ) : isCheckingAvailability ? (
                <Stack direction="row" alignItems="center" justifyContent="center" gap={1} role="status" sx={{ mb: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body1" color={colors.black600} textAlign="center">
                    {tYacht('checkingAvailability')}
                  </Typography>
                </Stack>
              ) : isUnavailableSelection ? (
                <Typography variant="body1" color={colors.red500} textAlign="center" role="status" sx={{ mb: 1 }}>
                  {tYacht('notAvailableShort')}
                </Typography>
              ) : (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body1">{t('totalPrice')}</Typography>
                  {isInquireFlow ? (
                    <Typography variant="h4" component="p" color={colors.green500}>
                      {tYacht('priceOnInquiry')}
                    </Typography>
                  ) : !isCalculatedPrice ? (
                    <Typography variant="h4" component="p">
                      -
                    </Typography>
                  ) : (
                    <Typography
                      variant="h4"
                      component="p"
                      color={colors.green500}
                      className={styles.price}
                      onClick={handlePriceDetailOpen}
                    >
                      {formattedFullPrice}
                    </Typography>
                  )}
                </Stack>
              )}
              <Stack spacing={1.5}>
                <Button
                  size="large"
                  classes={{ root: styles.rootButton }}
                  className={`${styles.customButton} ${!hasDates ? styles.placeholder : ''}`}
                  onClick={handleChangeDatesOpen}
                  fullWidth
                >
                  <Calendar size={24} fill={hasDates ? colors.black300 : colors.black200} />
                  {/* In the page's language: HR read "10 Oct 2026 - 17 Oct 2026". */}
                  {hasDates ? (
                    <>
                      {DateTime.formatShortWithoutDay(startDate, locale)} -{' '}
                      {DateTime.formatShortWithoutDay(endDate, locale)}
                    </>
                  ) : (
                    tYacht('chooseDates')
                  )}
                </Button>
                {isUnavailableSelection ? (
                  <Stack direction="row" spacing={1.5}>
                    <Button size="large" fullWidth variant="outlined" onClick={handleChangeDatesOpen}>
                      {t('changeDates')}
                    </Button>
                    <Button size="large" fullWidth onClick={handleInquireClick}>
                      {tYacht('inquireNow')}
                    </Button>
                  </Stack>
                ) : (
                  <Button
                    size="large"
                    id={BOAT_CALENDAR_FORM}
                    fullWidth
                    onClick={handleReservationClick}
                    disabled={!hasDates || isSelectedOfferBlocked || (!isInquireFlow && !isCalculatedPrice)}
                  >
                    {isInquireFlow ? tYacht('inquireNow') : tYacht('reserve')}
                  </Button>
                )}
              </Stack>
            </Box>
            <ModalRoot
              title={modalVariant === 'dates' ? t('changeDates') : t('priceDetails')}
              open={isModalOpen}
              onOpen={toggleModal}
              onClose={handleModalClose}
              onConfirm={toggleModal}
              hideCancelButton
              hideConfirmButton={modalVariant === 'price'}
            >
              {renderModalContent()}
            </ModalRoot>
          </>
        );
      }}
    </Form>
  );
};

export default BoatMobileNavigation;
