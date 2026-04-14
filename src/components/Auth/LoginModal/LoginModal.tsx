import { startTransition, useActionState, useEffect } from 'react';

import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';

import { login } from '@/actions/auth.actions';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import ModalRoot from '@/components/ModalRoot';
import { LoginFormValues } from '@/config/form-models.config';
import { LOGIN_FORM } from '@/config/form-names.config';
import { UserModel } from '@/models/user.model';
import colors from '@/styles/themes/colors';
import { useSyncUserPreferences } from '@/utils/hooks/useSyncUserPreferences';
import useToggleState from '@/utils/hooks/useToggleState';
import { FormValidator } from '@/utils/static/FormValidator';
import { toggleLoginModal, toggleRequestPasswordResetModal, toggleSignUpModal } from '@/valtio/auth/auth.actions';
import { showToast } from '@/valtio/global/global.actions';
import { setUser } from '@/valtio/user/user.actions';

interface LoginModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const defaultValues: LoginFormValues = {
  email: '',
  password: '',
};

const LoginModal = ({ isOpen, onOpen, onClose }: LoginModalProps) => {
  const [passwordVisibility, togglePasswordVisibility] = useToggleState();
  const [state, action, pending] = useActionState(login, undefined);
  const { syncPreferences } = useSyncUserPreferences();
  const t = useTranslations('common');
  const tToastMessages = useTranslations('toastMessages');
  const validator = FormValidator.withTranslation(t);

  useEffect(() => {
    if (state?.success && state.user) {
      toggleLoginModal();
      setUser(state.user as UserModel);
      syncPreferences({ user: state.user });
      showToast({ status: 'success', text: tToastMessages('login-success') });
    } else if (state?.message) {
      showToast({ status: 'error', text: state.message || tToastMessages('login-failed') });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, tToastMessages]);

  const handleOpenSignUpModal = () => {
    toggleSignUpModal();
    toggleLoginModal();
  };

  const handleOpenResetPasswordModal = () => {
    toggleRequestPasswordResetModal();
    toggleLoginModal();
  };

  const handleSubmit = async (formValues: LoginFormValues) => {
    const formData = new FormData();

    formData.append('email', formValues.email);
    formData.append('password', formValues.password);

    startTransition(() => {
      action(formData);
    });
  };

  const handleClose = () => {
    if (!pending) {
      onClose();
    }
  };

  return (
    <ModalRoot
      open={isOpen}
      onOpen={onOpen}
      onClose={handleClose}
      title={t('login')}
      width={453}
      confirmBtnText={pending ? t('loggingIn') : t('login')}
      hideCancelButton
      ConfirmBtnProps={{
        form: LOGIN_FORM,
        type: 'submit',
        disabled: pending,
      }}
    >
      <Form defaultValues={defaultValues} onSubmit={handleSubmit} id={LOGIN_FORM} mode="onBlur">
        <Stack gap={3}>
          <FormInput
            name="email"
            formLabel={t('email')}
            type="email"
            placeholder={t('email')}
            validate={FormValidator.all(validator.isNotEmpty, validator.isValidEmail)}
          />
          <FormInput
            name="password"
            formLabel={t('password')}
            formLabelAction={
              <Button variant="text" onClick={handleOpenResetPasswordModal}>
                {t('forgotPassword')}
              </Button>
            }
            type={passwordVisibility ? 'text' : 'password'}
            placeholder={t('password')}
            validate={validator.isNotEmpty}
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
        </Stack>
        <Stack mt={1.5} alignItems="flex-start" gap={3}>
          <Button variant="text" onClick={handleOpenSignUpModal}>
            {t('createAccount')}
          </Button>
        </Stack>
      </Form>
    </ModalRoot>
  );
};

export default LoginModal;
