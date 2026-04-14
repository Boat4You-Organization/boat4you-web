'use client';

import { startTransition, useActionState, useEffect } from 'react';

import { Button, Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { cancelReservation } from '@/actions/reservation.actions';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import { CancelBookingFormValues } from '@/config/form-models.config';
import useBreakpoint from '@/utils/hooks/useBreakpoint';
import { showToast } from '@/valtio/global/global.actions';

import styles from './CancelBooking.module.scss';

interface CancelBookingProps {
  reservationId: string;
}

const initialValues: CancelBookingFormValues = {
  specialRequest: '',
};

const CancelBooking = ({ reservationId }: CancelBookingProps) => {
  const [state, action, pending] = useActionState(cancelReservation, undefined);
  const router = useRouter();
  const { isMobile } = useBreakpoint();
  const tCommon = useTranslations('common');
  const tToast = useTranslations('toastMessages');

  useEffect(() => {
    if (!state) {
      return;
    }

    if (state?.payload) {
      showToast({ status: 'success', text: tToast('requestCancelBookingSuccess') });

      router.push('/my-bookings');
    } else {
      showToast({ status: 'error', text: state?.message || tToast('requestCancelBookingFailed') });
    }
  }, [state, tToast, router]);

  const handleSubmit = async (formValues: CancelBookingFormValues) => {
    const formData = new FormData();

    formData.append('specialRequest', formValues.specialRequest);

    startTransition(() => {
      action({ formData, reservationId });
    });
  };

  return (
    <Container component="section" maxWidth="md" disableGutters className={styles.container}>
      <Typography variant="h1" fontWeight={700}>
        {tCommon('cancelBookingPage.confirmCancellation')}
      </Typography>
      <Typography variant="body1">{tCommon('cancelBookingPage.beforeWeCancelYourBooking')}</Typography>
      <Form defaultValues={initialValues} onSubmit={handleSubmit} className={styles.form}>
        <FormInput
          name="specialRequest"
          formLabel={tCommon('cancelBookingPage.specialRequest')}
          placeholder={tCommon('cancelBookingPage.specialRequestPlaceholder')}
          multiline
          rows={isMobile ? 2.5 : 1}
        />
        <Button size="large" type="submit" className={styles.button} disabled={pending}>
          {pending ? tCommon('cancelBookingPage.cancelling') : tCommon('cancelBookingPage.cancelBooking')}
        </Button>
      </Form>
    </Container>
  );
};

export default CancelBooking;
