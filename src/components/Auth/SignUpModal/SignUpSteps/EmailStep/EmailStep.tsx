import { useTranslations } from 'next-intl';

import FormInput from '@/components/Forms/FormInput';
import { FormValidator } from '@/utils/static/FormValidator';

const EmailStep = () => {
  const t = useTranslations('common');
  const validator = FormValidator.withTranslation(t);

  return (
    <FormInput
      name="email"
      formLabel={t('email')}
      placeholder={t('email')}
      validate={FormValidator.all(validator.isNotEmpty, validator.isValidEmail)}
    />
  );
};

export default EmailStep;
