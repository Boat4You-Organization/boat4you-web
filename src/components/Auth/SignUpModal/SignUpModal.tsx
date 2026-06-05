'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';

import { Divider, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';

import { register } from '@/actions/auth.actions';
import GoogleSignInButton from '@/components/Auth/GoogleSignInButton';
import Form from '@/components/Forms/Form';
import ModalRoot from '@/components/ModalRoot';
import { SignUpFormValues } from '@/config/form-models.config';
import { SIGNUP_FORM } from '@/config/form-names.config';
import { UserModel } from '@/models/user.model';
import { useSyncUserPreferences } from '@/utils/hooks/useSyncUserPreferences';
import { setUserEmail, toggleConfirmAccountModal } from '@/valtio/auth/auth.actions';
import { showToast } from '@/valtio/global/global.actions';
import { setUser } from '@/valtio/user/user.actions';

import EmailStep from './SignUpSteps/EmailStep';
import UserDataStep from './SignUpSteps/UserDataStep';

interface SignUpModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const defaultValues: SignUpFormValues = {
  email: '',
  name: '',
  surname: '',
  password: '',
  repeatPassword: '',
};

const SignUpModal = ({ isOpen, onOpen, onClose }: SignUpModalProps) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [state, action, pending] = useActionState(register, undefined);
  const t = useTranslations('common');
  const tToastMessages = useTranslations('toastMessages');
  const { syncPreferences } = useSyncUserPreferences();
  const googleEnabled = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  // next-intl strict key union doesn't surface freshly-added common.json keys — cast for the divider label.
  const orContinueWithEmailLabel = (t as unknown as (key: string) => string)('orContinueWithEmail');

  const isLastStep = activeStep === 1;

  useEffect(() => {
    if (state?.payload) {
      setUserEmail(state.payload.email);
      toggleConfirmAccountModal();
      onClose();
    } else if (state?.message) {
      showToast({ status: 'error', text: state.message });
    }
  }, [state, onClose]);

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleClose = () => {
    onClose();
    handleReset();
  };

  const handleGoogleSuccess = (user: UserModel) => {
    setUser(user);
    syncPreferences({ user });
    showToast({ status: 'success', text: tToastMessages('login-success') });
    handleClose();
  };

  const handleGoogleError = (message: string) => {
    showToast({ status: 'error', text: message || tToastMessages('login-failed') });
  };

  const handleSubmit = async (formValues: SignUpFormValues) => {
    // Email step: a valid submit — Continue button OR Enter in the email field — just advances
    // to the user-data step. Without this guard, pressing Enter fired the form's native submit
    // straight into register() with an empty password, surfacing the backend "Password does not
    // meet the strength requirements" error on the email step.
    if (!isLastStep) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);

      return;
    }

    const formData = new FormData();

    formData.append('name', formValues.name);
    formData.append('surname', formValues.surname);
    formData.append('email', formValues.email);
    formData.append('password', formValues.password);

    if (formValues.password !== formValues.repeatPassword) {
      showToast({
        status: 'error',
        text: t('passwordsDoNotMatch'),
      });

      return;
    }

    startTransition(() => {
      action(formData);
    });
  };

  const renderStepPanel = () => {
    switch (activeStep) {
      case 0:
        return <EmailStep />;
      case 1:
        return <UserDataStep />;
      default:
        return null;
    }
  };

  return (
    <ModalRoot
      open={isOpen}
      onOpen={onOpen}
      onClose={handleClose}
      title={t('signUp')}
      width={453}
      confirmBtnText={isLastStep ? t('agreeAndContinue') : t('continue')}
      hideCancelButton
      arrowBack={isLastStep}
      onBack={handleBack}
      ConfirmBtnProps={{
        type: 'submit',
        form: SIGNUP_FORM,
        disabled: pending,
      }}
    >
      {googleEnabled && activeStep === 0 && (
        <Stack gap={2.5} mb={2.5}>
          <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          <Divider sx={{ fontSize: 13, color: 'text.secondary' }}>{orContinueWithEmailLabel}</Divider>
        </Stack>
      )}
      <Form defaultValues={defaultValues} onSubmit={handleSubmit} id={SIGNUP_FORM}>
        {renderStepPanel()}
      </Form>
    </ModalRoot>
  );
};

export default SignUpModal;
