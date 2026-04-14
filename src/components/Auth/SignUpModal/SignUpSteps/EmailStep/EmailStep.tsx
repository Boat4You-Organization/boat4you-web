import { useTranslations } from 'next-intl';

import FormInput from '@/components/Forms/FormInput';

const EmailStep = () => {
  const t = useTranslations('common');

  return <FormInput name="email" formLabel={t('email')} placeholder={t('email')} />;
};

export default EmailStep;
