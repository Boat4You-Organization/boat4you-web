import React, { useEffect, useState } from 'react';

import { Box, Button, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { getCardSurchargePercentage } from '@/actions/settings.actions';
import Select from '@/components/Select';
import Money from '@/components/SvgIcons/Payment/Money';
import {
  PAYMENT_METHOD_LABEL_MAP,
  PaymentInstallment,
  PaymentMethod,
  paymentMethods,
} from '@/config/paymentMethods.config';
import colors from '@/styles/themes/colors';
import { ReservationData } from '@/types/reservation.type';
import { handleNextStep, setPaymentMethod, setSelectedInstallment } from '@/valtio/booking/booking.actions';
import { useBookingStore } from '@/valtio/booking/booking.store';

import CreditCard from './CreditCard';

interface PaymentStepProps {
  reservationData: ReservationData;
}

const PaymentStep = ({ reservationData }: PaymentStepProps) => {
  const { paymentData } = useBookingStore();
  const [surchargePercentage, setSurchargePercentage] = useState<number>(0);
  const t = useTranslations('common');

  const { selectedPaymentMethod, selectedInstallment } = paymentData;

  // Fetch the card surcharge % once when the step mounts.
  useEffect(() => {
    let cancelled = false;

    getCardSurchargePercentage().then(pct => {
      if (!cancelled) setSurchargePercentage(pct);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Show the breakdown against the total reservation price. Backend splits
  // into installments with its own rule; for first-time booking preview we
  // surface the commitment users are signing up for.
  const baseAmountEur = reservationData.totalPriceEur;

  const paymentOptions = paymentMethods.map(method => ({
    id: method.title,
    label: t(PAYMENT_METHOD_LABEL_MAP[method.title]),
    icon: React.createElement(method.icon),
  }));

  const handlePaymentMethodChange = (event: SelectChangeEvent) => {
    setPaymentMethod(event.target.value as PaymentMethod);
  };

  const handleInstallmentChange = (event: SelectChangeEvent) => {
    setSelectedInstallment(event.target.value as PaymentInstallment);
  };

  const handleButtonClick = () => {
    handleNextStep();
  };

  const renderContent = () => {
    switch (selectedPaymentMethod) {
      case PaymentMethod.BANK_TRANSFER:
      case PaymentMethod.CREDIT_CARD:
        return (
          <CreditCard
            selectedInstallment={selectedInstallment}
            handleInstallmentChange={handleInstallmentChange}
            dateFrom={reservationData.dateFrom}
            baseAmountEur={baseAmountEur}
            // Only surcharge Credit Card payments — Bank Transfer is at base price.
            surchargePercentage={selectedPaymentMethod === PaymentMethod.CREDIT_CARD ? surchargePercentage : 0}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h2" mb={3}>
        {t('payWith')}
      </Typography>
      <Select
        value={selectedPaymentMethod}
        options={paymentOptions}
        onChange={handlePaymentMethodChange}
        placeholder={
          <Stack direction="row" alignItems="center" gap={1}>
            <Money />
            <Typography variant="body1" color="text.secondary">
              {t('choosePaymentMethod')}
            </Typography>
          </Stack>
        }
        label={t('paymentMethod')}
      />
      {renderContent()}
      <Stack mt={3} gap={2} alignItems="flex-end">
        <Button
          size="large"
          onClick={handleButtonClick}
          sx={{ width: 210 }}
          disabled={!selectedPaymentMethod || !selectedInstallment}
        >
          {t('reviewAndPay')}
        </Button>
        <Typography variant="body2" color={colors.black600}>
          {t('youWonTBeChargedYet')}
        </Typography>
      </Stack>
    </Box>
  );
};

export default PaymentStep;
