'use client';

import { startTransition, useActionState, useEffect } from 'react';

import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { resendVerificationCode, verifyEmail } from '@/actions/auth.actions';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import ModalRoot from '@/components/ModalRoot';
import { ConfirmAccountFormValues } from '@/config/form-models.config';
import colors from '@/styles/themes/colors';
import { useAuthStore } from '@/valtio/auth/auth.store';

import VerificationCodeInput from './VerificationCodeInput/VerificationCodeInput';

interface ConfirmAccountModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const initialValues: ConfirmAccountFormValues = {
  userId: 0,
  verificationCode: '',
};

const ConfirmAccountModal = ({ isOpen, onOpen, onClose }: ConfirmAccountModalProps) => {
  const { userId, userEmail } = useAuthStore();
  const [state, action, verifyEmailPending] = useActionState(verifyEmail, undefined);
  const [resendState, resendAction, resendVerificationCodePending] = useActionState(resendVerificationCode, undefined);
  const t = useTranslations('common');

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!userId) {
    return null;
  }

  const handleVerificationComplete = (verificationCode: string) => {
    const formData = new FormData();

    formData.append('userId', userId.toString());
    formData.append('verificationCode', verificationCode);

    startTransition(() => {
      action(formData);
    });
  };

  const handleResendVerificationCode = () => {
    const formData = new FormData();

    formData.append('userId', userId.toString());

    startTransition(() => {
      resendAction(formData);
    });
  };

  const noop = () => {};

  const hasError = state && !state.success && state.message;
  const hasResendError = resendState && !resendState.payload && resendState.message;
  const hasResendSuccess = resendState && resendState.payload;

  return (
    <ModalRoot
      open={isOpen}
      onOpen={onOpen}
      onClose={state?.success ? onClose : noop}
      title={t('confirmAccount')}
      hideConfirmButton
      hideCancelButton
      hideCloseButton
    >
      <Typography variant="h3" fontWeight={700}>
        {t('enterVerificationCode')}
      </Typography>
      <Typography variant="body1" mt={2}>
        {t('enterVerificationCodeDescription', { email: userEmail || '' })}
      </Typography>
      <Form defaultValues={initialValues} onSubmit={noop} style={{ display: 'flex', justifyContent: 'center' }}>
        <FormInput
          name="verificationCode"
          renderInput={({ field, error }) => (
            <VerificationCodeInput
              value={field.value}
              onChange={field.onChange}
              error={hasError ? state.message : error}
              onComplete={handleVerificationComplete}
            />
          )}
        />
      </Form>
      {(verifyEmailPending || resendVerificationCodePending) && (
        <Stack alignItems="center" justifyContent="center" mt={3}>
          <CircularProgress />
        </Stack>
      )}
      {hasError && (
        <Typography variant="body2" color="error" mt={2} textAlign="center">
          {state.message}
        </Typography>
      )}
      {hasResendError && (
        <Stack bgcolor={colors.red50} p={2} borderRadius={1.5} mt={3}>
          <Typography variant="body2" color={colors.red500} textAlign="center">
            {t('verificationCodeResentFailed')}
          </Typography>
        </Stack>
      )}
      {hasResendSuccess && (
        <Stack bgcolor={colors.green50} p={2} borderRadius={1.5} mt={3}>
          <Typography variant="body2" color={colors.green500} textAlign="center">
            {t('verificationCodeResent')}
          </Typography>
        </Stack>
      )}
      <Stack direction="row" alignItems="center" gap={0.5} mt={6}>
        <Typography variant="body1">{t('didNotGetEmail')}</Typography>
        <Button variant="text" onClick={handleResendVerificationCode}>
          <Typography variant="body1" fontWeight={700} color={colors.blue950} sx={{ textDecoration: 'underline' }}>
            {t('tryAgain')}
          </Typography>
        </Button>
      </Stack>
    </ModalRoot>
  );
};

export default ConfirmAccountModal;
