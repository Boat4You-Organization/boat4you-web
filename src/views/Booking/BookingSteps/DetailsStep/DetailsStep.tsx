import { startTransition, useActionState, useEffect } from 'react';

import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { createReservation } from '@/actions/reservation.actions';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import PhoneInput from '@/components/PhoneInput';
import ExternalLink from '@/components/SvgIcons/ExternalLink';
import VerifiedBadge from '@/components/SvgIcons/VerifiedBadge';
import { BookingFormValues } from '@/config/form-models.config';
import { UserModel } from '@/models/user.model';
import colors from '@/styles/themes/colors';
import { ReservationData } from '@/types/reservation.type';
import DateTime from '@/utils/static/DateTime';
import { FormValidator } from '@/utils/static/FormValidator';
import { generateGoogleMapsLink } from '@/utils/static/googleMapsUtils';
import { saveDataToSessionStorage } from '@/utils/static/sessionStorageUtils';
import { handleNextStep } from '@/valtio/booking/booking.actions';
import { showToast } from '@/valtio/global/global.actions';
import BookingModal from '@/views/Booking/BookingModal';

import styles from './DetailsStep.module.scss';

interface DetailsStepProps {
  reservationData: ReservationData;
  isAdmin: boolean;
  user: UserModel;
}

const defaultValues: BookingFormValues = {
  yachtId: 0,
  offerId: 0,
  name: '',
  surname: '',
  email: '',
  phoneNumber: '',
  specialRequest: '',
  selectedExtras: [],
};

const DetailsStep = ({ reservationData, isAdmin, user }: DetailsStepProps) => {
  const { dateFrom, dateTo, name, model, locationFrom } = reservationData;
  const [state, createReservationAction, createReservationPending] = useActionState(createReservation, undefined);
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const validator = FormValidator.withTranslation(t);

  const startDate = dayjs(dateFrom);
  const endDate = dayjs(dateTo);

  const googleMapsLink = generateGoogleMapsLink(locationFrom.name);

  const selectedExtrasKeys = reservationData
    ? [
        ...reservationData.selectedExtrasInPrice.map(item => item.key),
        ...reservationData.selectedExtrasAtBase.map(item => item.key),
      ]
    : [];

  useEffect(() => {
    if (state?.payload && !state?.message) {
      saveDataToSessionStorage('reservationId', state.payload.id);

      if (isAdmin) {
        router.push('/payment-pending');
      } else {
        handleNextStep();
        showToast({
          status: 'success',
          text: t('reservationCreated'),
        });
      }
    }

    if (state?.message) {
      let errorMessage = state.message;

      if (state.message.includes('phoneNumber') && state.message.includes('must match')) {
        errorMessage = t('validation.phoneNumberInvalidLength');
      }

      showToast({
        status: 'error',
        text: errorMessage || t('reservationCreationFailed'),
      });
    }
  }, [createReservationPending, t, state, isAdmin, router]);

  const initialValues: BookingFormValues = reservationData
    ? {
        yachtId: reservationData.yachtId,
        offerId: reservationData.offerId,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phoneNumber: '',
        specialRequest: '',
        selectedExtras: selectedExtrasKeys,
      }
    : defaultValues;

  const handleSubmit = async (data: BookingFormValues) => {
    const invalidData =
      data.name === '' ||
      data.surname === '' ||
      data.email === '' ||
      data.phoneNumber === '' ||
      !data.email.includes('@');

    if (invalidData) {
      showToast({
        status: 'error',
        text: t('pleaseFillAllFields'),
      });

      return;
    }

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'selectedExtras') {
        const extrasArray = Array.isArray(value) ? value : [];

        formData.append(key, JSON.stringify(extrasArray));
      } else {
        formData.append(key, String(value));
      }
    });

    startTransition(() => {
      createReservationAction(formData);
    });
  };

  const getButtonText = () => {
    if (createReservationPending) {
      return t('processing');
    }

    if (isAdmin) {
      return t('bookNow');
    }

    return t('next');
  };

  return (
    <>
      <BookingModal isOpen={createReservationPending} />
      <Box className={styles.container}>
        <Box className={styles.card}>
          <Stack gap={0.5}>
            <Typography variant="h3" component="p" fontWeight={700} color={colors.blue500}>
              {t('thisIsARareFind')}
            </Typography>
            <Typography variant="body1" color={colors.black500}>
              {name} {model} - {t('usuallyBooked')}.
            </Typography>
          </Stack>
          <VerifiedBadge size={52} variant="secondary" />
        </Box>
        <Stack gap={3} mt={4}>
          <Typography variant="h2">{t('yourTrip')}</Typography>
          <Stack gap={1}>
            <Typography variant="h4" component="h3">
              {t('dates')}
            </Typography>
            <Typography variant="body1" textTransform="capitalize">
              {DateTime.formatLong(startDate, locale)} - {DateTime.formatLong(endDate, locale)}
            </Typography>
          </Stack>
          <Stack gap={1}>
            <Typography variant="h4" component="h3">
              {t('pickUpLocation')}
            </Typography>
            <Link href={googleMapsLink} target="_blank" className={styles.link}>
              <Typography variant="body1">{locationFrom.name}</Typography>
              <ExternalLink variant="secondary" />
            </Link>
          </Stack>
        </Stack>
        <Divider
          sx={{
            '&.MuiDivider-root': {
              marginBlock: 4,
            },
          }}
        />
        <Form defaultValues={initialValues} onSubmit={handleSubmit}>
          <Stack gap={3}>
            <Typography variant="h2">{t('yourDetails')}</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" gap={{ xs: 3, sm: 2 }}>
              <FormInput
                name="name"
                formLabel={t('firstName')}
                placeholder={t('inputYourFirstName')}
                validate={validator.isNotEmpty}
              />
              <FormInput
                name="surname"
                formLabel={t('lastName')}
                placeholder={t('inputYourLastName')}
                validate={validator.isNotEmpty}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" gap={{ xs: 3, sm: 2 }}>
              <FormInput
                name="email"
                type="email"
                formLabel={t('emailAddress')}
                placeholder={t('inputYourEmailAddress')}
                validate={FormValidator.all(validator.isNotEmpty, validator.isValidEmail)}
              />
              <PhoneInput
                name="phoneNumber"
                formLabel={t('phoneNumber')}
                placeholder={t('inputPhoneNumber')}
                validate={FormValidator.all(validator.isNotEmpty, validator.isValidPhoneNumber)}
              />
            </Stack>
            <FormInput
              name="specialRequest"
              formLabel={t('specialRequest')}
              placeholder={t('inputSpecialRequest')}
              multiline
            />
            <Stack gap={2}>
              <Stack direction={{ xs: 'column-reverse', sm: 'row' }} justifyContent="flex-end" gap={2}>
                <Button
                  size="large"
                  disabled={createReservationPending}
                  sx={{ width: { xs: '100%', sm: 210 } }}
                  type="submit"
                >
                  {getButtonText()}
                </Button>
              </Stack>
              <Typography variant="body2" color={colors.black600} textAlign="end">
                {t('youWonTBeChargedYet')}
              </Typography>
            </Stack>
          </Stack>
        </Form>
      </Box>
    </>
  );
};

export default DetailsStep;
