'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { IconButton, InputAdornment, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';

import { logout, setInitialPassword } from '@/actions/auth.actions';
import PasswordRequirements from '@/components/Auth/PasswordRequirements';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import ModalRoot from '@/components/ModalRoot';
import { SET_PASSWORD_FORM } from '@/config/form-names.config';
import colors from '@/styles/themes/colors';
import useToggleState from '@/utils/hooks/useToggleState';
import { FormValidator, MIN_PASSWORD_LENGTH } from '@/utils/static/FormValidator';
import { showToast } from '@/valtio/global/global.actions';

interface SetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

const defaultValues: SetPasswordFormValues = {
  newPassword: '',
  confirmPassword: '',
};

// Inner fields share the Form context so the confirm field can match-validate
// against the live `newPassword` value (mirrors ForgotPasswordForm).
const SetPasswordFields = () => {
  const [passwordVisibility, togglePasswordVisibility] = useToggleState();
  const { watch } = useFormContext();
  const t = useTranslations('common');
  const validator = FormValidator.withTranslation(t);

  const visibilityAdornment = (
    <InputAdornment position="end">
      <IconButton aria-label={t('togglePasswordVisibility')} onClick={togglePasswordVisibility}>
        {passwordVisibility ? (
          <VisibilityOffOutlined sx={{ color: colors.black200 }} />
        ) : (
          <VisibilityOutlined sx={{ color: colors.black200 }} />
        )}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Stack gap={3}>
      <FormInput
        name="newPassword"
        formLabel={t('newPassword')}
        type={passwordVisibility ? 'text' : 'password'}
        placeholder={t('inputNewPassword')}
        validate={FormValidator.all(validator.isNotEmpty, validator.minLength(MIN_PASSWORD_LENGTH))}
        slotProps={{ input: { endAdornment: visibilityAdornment } }}
      />
      <PasswordRequirements name="newPassword" />
      <FormInput
        name="confirmPassword"
        formLabel={t('repeatPassword')}
        type={passwordVisibility ? 'text' : 'password'}
        placeholder={t('repeatNewPassword')}
        validate={value => {
          const password = watch('newPassword');

          return FormValidator.all(validator.isNotEmpty, validator.matchesPassword(password))(value);
        }}
        slotProps={{ input: { endAdornment: visibilityAdornment } }}
      />
    </Stack>
  );
};

const SetPasswordModal = ({ isOpen, onClose }: SetPasswordModalProps) => {
  const [submitting, setSubmitting] = useState(false);
  const t = useTranslations('common');
  // next-intl's strict key union doesn't surface these freshly-added common keys
  // at compile time (TS widens the large literal); they exist in every locale.
  const tt = t as unknown as (k: string) => string;

  const handleSubmit = async (values: SetPasswordFormValues) => {
    if (values.newPassword !== values.confirmPassword) {
      showToast({ status: 'error', text: t('passwordNotMatch') });

      return;
    }

    setSubmitting(true);

    const { success, message } = await setInitialPassword(values.newPassword);

    if (success) {
      showToast({ status: 'success', text: tt('setPasswordSuccess') });
      // Backend revokes ALL sessions on set-password — sign out so the user
      // re-authenticates with the password they just chose.
      await logout();
      onClose();
      window.location.href = '/';

      return;
    }

    showToast({ status: 'error', text: message || tt('setPasswordSuccess') });
    setSubmitting(false);
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  return (
    <ModalRoot
      open={isOpen}
      onClose={handleClose}
      title={tt('setPassword')}
      width={453}
      confirmBtnText={tt('setPassword')}
      hideCancelButton
      ConfirmBtnProps={{
        form: SET_PASSWORD_FORM,
        type: 'submit',
        disabled: submitting,
      }}
    >
      <Form defaultValues={defaultValues} onSubmit={handleSubmit} id={SET_PASSWORD_FORM} mode="onBlur">
        <SetPasswordFields />
      </Form>
    </ModalRoot>
  );
};

export default SetPasswordModal;
