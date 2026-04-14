'use client';

import React, { useEffect, useState } from 'react';

import { SelectChangeEvent, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { getCardSurchargePercentage } from '@/actions/settings.actions';
import ModalRoot from '@/components/ModalRoot';
import Select from '@/components/Select';
import Money from '@/components/SvgIcons/Payment/Money';
import {
  PAYMENT_METHOD_LABEL_MAP,
  PaymentInstallment,
  PaymentMethod,
  paymentMethods,
} from '@/config/paymentMethods.config';
import { PaymentPhase } from '@/models/reservation.model';
import { usePaymentSubmit } from '@/utils/hooks/usePaymentSubmit';
import BankTransfer from '@/views/Booking/BookingSteps/PaymentStep/BankTransfer';
import CreditCard from '@/views/Booking/BookingSteps/PaymentStep/CreditCard';

interface PayNowModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  reservationId: number;
  paymentPhases: PaymentPhase[];
  dateFrom: string;
}

const PayNowModal = ({ isOpen, onOpen, onClose, reservationId, paymentPhases, dateFrom }: PayNowModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
  const [selectedInstallment, setSelectedInstallment] = useState<PaymentInstallment>(PaymentInstallment.FULL_PAYMENT);
  const [surchargePercentage, setSurchargePercentage] = useState<number>(0);
  const t = useTranslations('common');

  const payFullAmount = selectedInstallment === PaymentInstallment.FULL_PAYMENT;

  // Fetch the card surcharge % once when the modal opens — admin-configurable
  // (usually ~5%) so we can't hardcode it. Falls back to 0 on failure.
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    getCardSurchargePercentage().then(pct => {
      if (!cancelled) setSurchargePercentage(pct);
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Pick which amount (full or first installment) the surcharge breakdown
  // should be based on — this mirrors backend `StripePaymentService.initiatePayment`.
  const baseAmountEur = (() => {
    if (payFullAmount) {
      return paymentPhases.reduce((sum, phase) => sum + phase.amount, 0);
    }

    const oldest = [...paymentPhases].sort((a, b) => (a.deadline > b.deadline ? 1 : -1))[0];

    return oldest?.amount;
  })();

  const { handleSubmit, isLoading } = usePaymentSubmit({
    paymentMethod,
    // Defensive: the page should have already handed a valid reservation, but
    // we still coerce-and-default so a stale/empty prop can't crash rendering.
    reservationId: reservationId != null ? String(reservationId) : '',
    payFullAmount,
  });

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

  const renderContent = () => {
    switch (paymentMethod) {
      case PaymentMethod.CREDIT_CARD:
        return (
          <CreditCard
            selectedInstallment={selectedInstallment}
            handleInstallmentChange={handleInstallmentChange}
            dateFrom={dateFrom}
            baseAmountEur={baseAmountEur}
            surchargePercentage={surchargePercentage}
          />
        );
      case PaymentMethod.BANK_TRANSFER:
        return <BankTransfer />;
      default:
        return null;
    }
  };

  return (
    <ModalRoot
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      onCancel={onClose}
      title={t('payNow')}
      confirmBtnText={t('payNow')}
      cancelBtnText={t('cancel')}
      width={670}
      ConfirmBtnProps={{ onClick: handleSubmit, disabled: isLoading }}
    >
      <Typography variant="h2" mb={3}>
        {t('payWith')}
      </Typography>
      <Select
        value={paymentMethod}
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
    </ModalRoot>
  );
};

export default PayNowModal;
