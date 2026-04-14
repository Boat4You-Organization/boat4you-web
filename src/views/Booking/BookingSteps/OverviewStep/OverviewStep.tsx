import { useEffect, useState } from 'react';

import { Box, Button, Divider } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import { calculatePaymentPhases } from '@/actions/reservation.actions';
import SecurePayement from '@/components/SvgIcons/WhyChooseUs/SecurePayment';
import { PaymentInstallment } from '@/config/paymentMethods.config';
import { PaymentPhase } from '@/models/reservation.model';
import { SelectedExtras } from '@/models/yacht-offer.model';
import { ReservationData } from '@/types/reservation.type';
import { usePaymentSubmit } from '@/utils/hooks/usePaymentSubmit';
import { getDataFromSessionStorage } from '@/utils/static/sessionStorageUtils';
import { useBookingStore } from '@/valtio/booking/booking.store';
import PaymentPoliciesCard from '@/views/Booking/PaymentPoliciesCard';
import PriceBreakdownCard from '@/views/Booking/PriceBreakdownCard';

interface OverviewStepProps {
  isLastStep: boolean;
  reservationData: ReservationData;
  selectedExtrasInPrice: SelectedExtras[];
  selectedExtrasAtBase: SelectedExtras[];
  dateFrom: string;
}

const OverviewStep = ({
  isLastStep,
  reservationData,
  selectedExtrasInPrice,
  selectedExtrasAtBase,
  dateFrom,
}: OverviewStepProps) => {
  const reservationId = getDataFromSessionStorage<number>('reservationId');
  const { paymentData } = useBookingStore();
  const { selectedInstallment, selectedPaymentMethod } = paymentData;
  const t = useTranslations('common');
  const locale = useLocale();
  const [paymentPhases, setPaymentPhases] = useState<PaymentPhase[]>([]);
  const [isLoadingPhases, setIsLoadingPhases] = useState(false);

  const payFullAmount = selectedInstallment === PaymentInstallment.FULL_PAYMENT;

  const { handleSubmit, isLoading } = usePaymentSubmit({
    paymentMethod: selectedPaymentMethod,
    reservationId: reservationId?.toString() || '',
    payFullAmount,
  });

  useEffect(() => {
    const fetchPaymentPhases = async () => {
      if (selectedInstallment === PaymentInstallment.INSTALLMENTS) {
        setIsLoadingPhases(true);

        const currentDate = new Date().toISOString().split('T')[0];
        const { payload } = await calculatePaymentPhases(currentDate, dateFrom, reservationData.totalPriceEur, locale);

        setPaymentPhases(payload);
        setIsLoadingPhases(false);
      } else {
        setPaymentPhases([]);
      }
    };

    fetchPaymentPhases();
  }, [selectedInstallment, dateFrom, reservationData.totalPriceEur, locale]);

  return (
    <Box>
      <PaymentPoliciesCard
        selectedExtrasInPrice={selectedExtrasInPrice}
        selectedExtrasAtBase={selectedExtrasAtBase}
        compact
        isLastStep={isLastStep}
        dateFrom={dateFrom}
      />
      <Divider
        sx={{
          '&.MuiDivider-root': {
            marginBlock: 3,
          },
        }}
      />
      <PriceBreakdownCard
        reservationData={reservationData}
        showCard
        isLastStep={isLastStep}
        paymentPhases={paymentPhases}
        isLoadingPhases={isLoadingPhases}
        selectedPaymentMethod={selectedPaymentMethod}
        reservationId={reservationId ?? undefined}
      />
      <Button
        size="large"
        onClick={handleSubmit}
        disabled={isLoading}
        sx={{ mt: 3 }}
        fullWidth
        startIcon={<SecurePayement size={24} />}
      >
        {isLoading ? t('processing') : t('bookNow')}
      </Button>
    </Box>
  );
};

export default OverviewStep;
