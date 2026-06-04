import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import PasswordRequirements from '@/components/Auth/PasswordRequirements';
import FormInput from '@/components/Forms/FormInput';
import colors from '@/styles/themes/colors';
import useToggleState from '@/utils/hooks/useToggleState';
import { FormValidator, MIN_PASSWORD_LENGTH } from '@/utils/static/FormValidator';

import styles from './UserDataStep.module.scss';

const TermsOfServiceLink = (chunks: React.ReactNode): React.ReactNode => (
  <Link href="/terms-and-conditions" className={styles.link}>
    {chunks}
  </Link>
);

const PaymentsTermsOfServiceLink = (chunks: React.ReactNode): React.ReactNode => (
  <Link href="/terms-and-conditions" className={styles.link}>
    {chunks}
  </Link>
);

const PrivacyPolicyLink = (chunks: React.ReactNode): React.ReactNode => (
  <Link href="/privacy-policy" className={styles.link}>
    {chunks}
  </Link>
);

const UserDataStep = () => {
  const [passwordVisibility, togglePasswordVisibility] = useToggleState();
  const [confirmPasswordVisibility, toggleConfirmPasswordVisibility] = useToggleState();
  const t = useTranslations('common');

  return (
    <Stack gap={3}>
      <FormInput
        name="name"
        formLabel={t('name')}
        placeholder={t('name')}
        validate={FormValidator.withTranslation(t).isNotEmpty}
      />
      <FormInput
        name="surname"
        formLabel={t('surname')}
        placeholder={t('surname')}
        validate={FormValidator.withTranslation(t).isNotEmpty}
      />
      <FormInput
        name="password"
        formLabel={t('password')}
        placeholder={t('password')}
        type={passwordVisibility ? 'text' : 'password'}
        validate={value => {
          const validator = FormValidator.withTranslation(t);

          return FormValidator.all(validator.isNotEmpty, validator.minLength(MIN_PASSWORD_LENGTH))(value);
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label={t('togglePasswordVisibility')} onClick={togglePasswordVisibility}>
                  {passwordVisibility ? (
                    <VisibilityOffOutlined sx={{ color: colors.black200 }} />
                  ) : (
                    <VisibilityOutlined sx={{ color: colors.black200 }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <PasswordRequirements />
      <FormInput
        name="repeatPassword"
        formLabel={t('repeatPassword')}
        placeholder={t('repeatPassword')}
        type={confirmPasswordVisibility ? 'text' : 'password'}
        validate={(value, formValues) => {
          const validator = FormValidator.withTranslation(t);
          const typed = formValues as { password?: string } | undefined;

          return FormValidator.all(validator.isNotEmpty, validator.matchesPassword(typed?.password || ''))(value);
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label={t('togglePasswordVisibility')} onClick={toggleConfirmPasswordVisibility}>
                  {confirmPasswordVisibility ? (
                    <VisibilityOffOutlined sx={{ color: colors.black200 }} />
                  ) : (
                    <VisibilityOutlined sx={{ color: colors.black200 }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Typography variant="body2">
        {t.rich('signUpAgreement', {
          termsOfService: TermsOfServiceLink,
          paymentsTermsOfService: PaymentsTermsOfServiceLink,
          privacyPolicy: PrivacyPolicyLink,
        })}
      </Typography>
    </Stack>
  );
};

export default UserDataStep;
