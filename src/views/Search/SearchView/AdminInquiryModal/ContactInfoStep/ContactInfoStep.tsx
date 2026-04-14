import React from 'react';

import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import FormInput from '@/components/Forms/FormInput';
import { FormValidator } from '@/utils/static/FormValidator';

const ContactInfoStep = () => {
  const t = useTranslations('common');
  const validator = FormValidator.withTranslation(t);

  return (
    <Stack spacing={3}>
      <Typography variant="body1">{t('enterTheRecipientEmailToSendTheOffer')}</Typography>
      <FormInput
        name="email"
        placeholder={t('inputEmail')}
        formLabel={t('email')}
        validate={FormValidator.all(validator.isNotEmpty, validator.isValidEmail)}
      />
      <FormInput
        name="message"
        placeholder={t('inputMessage')}
        formLabel={t('message')}
        multiline
        validate={validator.isNotEmpty}
      />
    </Stack>
  );
};

export default ContactInfoStep;
