import React from 'react';
import { useFormContext } from 'react-hook-form';

import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import PasswordRequirements from '@/components/Auth/PasswordRequirements';
import FormInput from '@/components/Forms/FormInput';
import colors from '@/styles/themes/colors';
import useToggleState from '@/utils/hooks/useToggleState';
import { FormValidator, MIN_PASSWORD_LENGTH } from '@/utils/static/FormValidator';

const ForgotPasswordForm = () => {
  const [passwordVisibility, togglePasswordVisibility] = useToggleState();

  const {
    formState: { isSubmitting },
    watch,
  } = useFormContext();
  const t = useTranslations('common');
  const validator = FormValidator.withTranslation(t);

  return (
    <Stack direction="column" spacing={3}>
      <Typography variant="hero" fontWeight={800} fontStyle="italic" color={colors.blue500}>
        {t('resetYourPassword')}
      </Typography>
      <Typography variant="body1" pt={3} color={colors.black950}>
        {t('inputYourNewPassword')}
      </Typography>
      <FormInput
        name="password"
        formLabel={t('password')}
        type={passwordVisibility ? 'text' : 'password'}
        placeholder={t('password')}
        validate={FormValidator.all(validator.isNotEmpty, validator.minLength(MIN_PASSWORD_LENGTH))}
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
        name="confirmPassword"
        formLabel={t('repeatPassword')}
        type={passwordVisibility ? 'text' : 'password'}
        placeholder={t('repeatPassword')}
        validate={value => {
          const password = watch('password');

          return FormValidator.all(validator.isNotEmpty, validator.matchesPassword(password))(value);
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
      <Button type="submit" size="large" disabled={isSubmitting} fullWidth>
        {t('resetPassword')}
      </Button>
    </Stack>
  );
};

export default ForgotPasswordForm;
