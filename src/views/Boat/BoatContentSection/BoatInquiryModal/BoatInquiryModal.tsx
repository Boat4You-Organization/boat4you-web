'use client';

import { startTransition, useActionState, useEffect, useRef, useState } from 'react';

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

/** Contact block the customer has already typed elsewhere (booking form), so
 *  the inquiry does not ask a guest to retype everything. */
export interface InquiryContact {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
}

interface BoatInquiryModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  yacht: YachtModel;
  /** Optional pre-fill — /boat call sites pass nothing and behave as before. */
  initialContact?: InquiryContact | null;
  dateFrom?: string;
  dateTo?: string;
}

const BoatInquiryModal = ({
  isOpen,
  onOpen,
  onClose,
  yacht,
  initialContact,
  dateFrom,
  dateTo,
}: BoatInquiryModalProps) => {
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
    name: initialContact?.name || user?.name || '',
    surname: initialContact?.surname || user?.surname || '',
    email: initialContact?.email || user?.email || '',
    phone: initialContact?.phone ?? '',
    message: '',
  };

  // The booking flow knows the real period; on /boat it still comes from the
  // search query string.
  const from = dateFrom || params.startDate;
  const to = dateTo || params.endDate;

  const startDate = dayjs(from);
  const endDate = dayjs(to);

  // One inquiry per submit (27.9.2026: one visitor's inquiry reached the
  // owner six times in the same second). `pending` flips only after
  // react-hook-form's async validation, so a double tap, a second Enter or a
  // repeated submit event all got through before the button disabled. The
  // ref closes the gate synchronously on the first submit; it opens again
  // only when that inquiry failed (so it can be retried) or when the form is
  // opened again after a sent inquiry.
  const submitLock = useRef(false);
  const [isLocked, setIsLocked] = useState(false);
  const sent = useRef(false);
  const isOpenRef = useRef(isOpen);
  const handledState = useRef(state);

  useEffect(() => {
    isOpenRef.current = isOpen;

    if (isOpen && sent.current) {
      sent.current = false;
      submitLock.current = false;
      setIsLocked(false);
    }
  }, [isOpen]);

  // Each answer is handled once — the effect also re-runs when `onClose` or
  // `t` change, which used to repeat the toast.
  useEffect(() => {
    if (!state || handledState.current === state) {
      return;
    }

    handledState.current = state;

    if (state.payload) {
      sent.current = true;
      showToast({ status: 'success', text: t('inquirySentSuccessfully') });

      // onClose toggles — never re-open a form the visitor already closed.
      if (isOpenRef.current) onClose();
    } else {
      submitLock.current = false;
      setIsLocked(false);
      showToast({ status: 'error', text: state.message || t('inquirySentFailed') });
    }
  }, [state, onClose, t]);

  const handleSubmit = (formValues: BoatInquiryFormValues) => {
    if (submitLock.current) {
      return;
    }

    submitLock.current = true;
    setIsLocked(true);

    const updatedFormValues: BoatInquiryFormValues = {
      ...formValues,
      yachtId: yacht.id,
      dateFrom: from,
      dateTo: to,
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
        disabled: pending || isLocked,
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
