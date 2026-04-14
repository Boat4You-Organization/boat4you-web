'use client';

import React, { useState } from 'react';

import { Box, Button, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';

import Form from '@/components/Forms/Form';
import ModalRoot from '@/components/ModalRoot';
import Calendar from '@/components/SvgIcons/Calendar';
import { BoatCalendarFormValues } from '@/config/form-models.config';
import { BOAT_CALENDAR_FORM } from '@/config/form-names.config';
import { Status } from '@/models/yacht-offer.model';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import useQueryParams from '@/utils/hooks/useQueryParams';
import { useReservation } from '@/utils/hooks/useReservation';
import useToggleState from '@/utils/hooks/useToggleState';
import DateTime from '@/utils/static/DateTime';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { toggleBoatInquiryModalOpen } from '@/valtio/yacht/yacht.actions';
import { useYachtStore } from '@/valtio/yacht/yacht.store';

import styles from './BoatMobileNavigation.module.scss';
import ChangeDatesContent from './ChangeDatesContent';
import PriceDetailsContent from './PriceDetailsContent';

interface BoatMobileNavigationProps {
  yacht: YachtModel;
}

const defaultValues: BoatCalendarFormValues = {
  startDate: null,
  endDate: null,
};

const BoatMobileNavigation = ({ yacht }: BoatMobileNavigationProps) => {
  const t = useTranslations('common');
  const tYacht = useTranslations('yacht');
  const { calculatedPrice, selectedOffer } = useYachtStore();
  const { params, setMultipleParams } = useQueryParams();
  const [isModalOpen, toggleModal] = useToggleState();
  const [modalVariant, setModalVariant] = useState<'price' | 'dates' | null>(null);

  const initialValues =
    params.startDate && params.endDate
      ? {
          startDate: dayjs(params.startDate),
          endDate: dayjs(params.endDate),
        }
      : defaultValues;

  const isSelectedOfferOption = selectedOffer?.status === Status.OPTION;
  const isSelectedOfferUnavailable = selectedOffer?.status === Status.UNAVAILABLE;
  const isCalculatedPrice = calculatedPrice && Object.keys(calculatedPrice).length > 0;

  const { handleReservation } = useReservation({ yacht });
  const locale = useLocale();

  const handleReservationClick = () => {
    if (isSelectedOfferOption) {
      toggleBoatInquiryModalOpen();

      return;
    }

    handleReservation();
  };

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
            isSelectedOfferUnavailable={isSelectedOfferUnavailable}
          />
        );
      case 'price':
        return (
          <PriceDetailsContent
            isCalculatedPrice={isCalculatedPrice}
            isSelectedOfferUnavailable={isSelectedOfferUnavailable}
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

  return (
    <Form defaultValues={initialValues} onSubmit={handleSubmit} id={BOAT_CALENDAR_FORM} resetDefaultValues>
      {({ watch }) => {
        const { startDate, endDate } = watch();

        return (
          <>
            <Box className={styles.container}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1">{t('totalPrice')}</Typography>
                {!isSelectedOfferUnavailable && !isCalculatedPrice ? (
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
              <Stack spacing={1.5}>
                <Button
                  size="large"
                  classes={{ root: styles.rootButton }}
                  className={`${styles.customButton} ${!(startDate && endDate) ? styles.placeholder : ''}`}
                  onClick={handleChangeDatesOpen}
                  fullWidth
                >
                  <Calendar size={24} fill={startDate && endDate ? colors.black300 : colors.black200} />
                  {startDate && endDate ? (
                    <>
                      {DateTime.formatShortWithoutDay(startDate)} - {DateTime.formatShortWithoutDay(endDate)}
                    </>
                  ) : (
                    <>
                      {DateTime.formatShortWithoutDay(DateTime.now())} -{' '}
                      {DateTime.formatShortWithoutDay(DateTime.addWeek(DateTime.now()))}
                    </>
                  )}
                </Button>
                <Button
                  size="large"
                  id={BOAT_CALENDAR_FORM}
                  fullWidth
                  onClick={handleReservationClick}
                  disabled={!isCalculatedPrice || isSelectedOfferUnavailable}
                >
                  {isSelectedOfferOption ? tYacht('inquireNow') : tYacht('reserve')}
                </Button>
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
