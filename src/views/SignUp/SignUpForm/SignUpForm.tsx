'use client';

import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';

import FormInput from '@/components/Forms/FormInput';
import colors from '@/styles/themes/colors';
import useToggleState from '@/utils/hooks/useToggleState';
import { FormValidator } from '@/utils/static/FormValidator';

export interface SignUpFormValues {
  password: string;
  confirmPassword: string;
}

const SignUpForm = () => {
  const [passwordVisibility, togglePasswordVisibility] = useToggleState();
  const [confirmPasswordVisibility, toggleConfirmPasswordVisibility] = useToggleState();
  const t = useTranslations('common');

  return (
    <Stack gap={3}>
      <FormInput
        name="password"
        formLabel={t('password')}
        placeholder={t('password')}
        type={passwordVisibility ? 'text' : 'password'}
        validate={FormValidator.withTranslation(t).isNotEmpty}
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
      <FormInput
        name="confirmPassword"
        formLabel={t('repeatPassword')}
        placeholder={t('repeatPassword')}
        type={confirmPasswordVisibility ? 'text' : 'password'}
        validate={(value, formValues) => {
          const validator = FormValidator.withTranslation(t);
          const typedFormValues = formValues as SignUpFormValues | undefined;

          return FormValidator.all(
            validator.isNotEmpty,
            validator.matchesPassword(typedFormValues?.password || '')
          )(value);
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
      <Button type="submit" variant="contained" size="large" sx={{ marginTop: 3 }}>
        {t('continue')}
      </Button>
    </Stack>
  );
};

export default SignUpForm;
