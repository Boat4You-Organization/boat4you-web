import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import FormInput from '@/components/Forms/FormInput';
import { FormValidator } from '@/utils/static/FormValidator';

const EmailStep = () => {
  const t = useTranslations('common');
  const validator = FormValidator.withTranslation(t);

  return (
    <Stack gap={3}>
      <Typography>{t('aCodeWillBeSentToYourEmailToResetPassword')}</Typography>
      <FormInput
        name="email"
        formLabel={t('email')}
        type="email"
        placeholder={t('email')}
        validate={FormValidator.all(validator.isNotEmpty, validator.isValidEmail)}
      />
    </Stack>
  );
};

export default EmailStep;
