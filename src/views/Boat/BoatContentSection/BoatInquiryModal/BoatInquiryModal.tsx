'use client';

import { startTransition, useActionState, useEffect } from 'react';

import { Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';

import { sendYachtInquiry } from '@/actions/yacht.actions';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import ModalRoot from '@/components/ModalRoot';
import PhoneInput from '@/components/PhoneInput';
import YachtCard from '@/components/YachtCard';
import { BoatInquiryFormValues } from '@/config/form-models.config';
import { BOAT_INQUIRY_FORM } from '@/config/form-names.config';
import { YachtModel } from '@/models/yacht.model';
import useQueryParams from '@/utils/hooks/useQueryParams';
import DateTime from '@/utils/static/DateTime';
import { FormValidator } from '@/utils/static/FormValidator';
import { showToast } from '@/valtio/global/global.actions';
import { useUserStore } from '@/valtio/user/user.store';

interface BoatInquiryModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  yacht: YachtModel;
}

const BoatInquiryModal = ({ isOpen, onOpen, onClose, yacht }: BoatInquiryModalProps) => {
  const { params } = useQueryParams();
  const [state, action, pending] = useActionState(sendYachtInquiry, undefined);
  const t = useTranslations('common');
  const locale = useLocale();
  const validator = FormValidator.withTranslation(t);
  const { user } = useUserStore();

  const initialValues: BoatInquiryFormValues = {
    yachtId: 0,
    dateFrom: '',
    dateTo: '',
    name: user?.name ?? '',
    surname: user?.surname ?? '',
    email: user?.email ?? '',
    phone: '',
    message: '',
  };

  const startDate = dayjs(params.startDate);
  const endDate = dayjs(params.endDate);

  useEffect(() => {
    if (!state) {
      return;
    }

    if (state?.payload) {
      showToast({ status: 'success', text: t('inquirySentSuccessfully') });
      onClose();
    } else {
      showToast({ status: 'error', text: state?.message || t('inquirySentFailed') });
    }
  }, [state?.payload, state?.message, state, onClose, t]);

  const handleSubmit = (formValues: BoatInquiryFormValues) => {
    const updatedFormValues: BoatInquiryFormValues = {
      ...formValues,
      yachtId: yacht.id,
      dateFrom: params.startDate,
      dateTo: params.endDate,
    };

    const formData = new FormData();

    Object.entries(updatedFormValues).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    startTransition(() => {
      action(formData);
    });
  };

  const renderDates = () => (
    <Stack mt={1}>
      <Typography variant="h4" component="p">
        {t('dates')}
      </Typography>
      <Typography variant="body1" textTransform="capitalize">
        {startDate && endDate && startDate.isValid() && endDate.isValid()
          ? `${DateTime.formatLong(startDate, locale)} - ${DateTime.formatLong(endDate, locale)}`
          : '-'}
      </Typography>
    </Stack>
  );

  return (
    <ModalRoot
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      onCancel={onClose}
      title={t('sendInquiry')}
      confirmBtnText={t('sendInquiry')}
      cancelBtnText={t('cancel')}
      width={670}
      ConfirmBtnProps={{
        form: BOAT_INQUIRY_FORM,
        type: 'submit',
        disabled: pending,
      }}
      CancelBtnProps={{
        disabled: pending,
      }}
    >
      <YachtCard
        mainImageId={yacht.yachtImages.filter(image => image.mainImage)[0]?.id ?? yacht.yachtImages[0]?.id}
        model={yacht.model}
        name={yacht.name}
        locationCountryCode={yacht.location?.countryCode ?? ''}
        locationName={yacht.location?.name ?? ''}
      >
        <Stack display={{ xs: 'none', md: 'flex' }}>{renderDates()}</Stack>
      </YachtCard>
      <Stack display={{ xs: 'flex', md: 'none' }} mt={2}>
        {renderDates()}
      </Stack>
      <Divider
        sx={{
          '&.MuiDivider-root': {
            marginBlock: 3,
          },
        }}
      />
      <Form defaultValues={initialValues} onSubmit={handleSubmit} id={BOAT_INQUIRY_FORM} mode="onBlur">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 3, md: 2 }}>
          <FormInput
            name="name"
            placeholder={t('inputYourFirstName')}
            formLabel={t('firstName')}
            validate={validator.isNotEmpty}
          />
          <FormInput
            name="surname"
            placeholder={t('inputYourLastName')}
            formLabel={t('lastName')}
            validate={validator.isNotEmpty}
          />
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 3, md: 2 }} mt={3}>
          <FormInput
            name="email"
            type="email"
            placeholder={t('inputYourEmailAddress')}
            formLabel={t('email')}
            validate={FormValidator.all(validator.isNotEmpty, validator.isValidEmail)}
          />
          <PhoneInput
            name="phone"
            formLabel={t('inputPhoneNumber')}
            placeholder="(123) 456-7890"
            validate={FormValidator.all(validator.isNotEmpty, FormValidator.isValidPhoneNumber)}
          />
        </Stack>
        <Stack mt={3}>
          <FormInput
            name="message"
            placeholder={t('inputMessage')}
            formLabel={t('message')}
            multiline
            validate={validator.isNotEmpty}
          />
        </Stack>
      </Form>
    </ModalRoot>
  );
};

export default BoatInquiryModal;
