import { startTransition, useActionState, useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { requestPasswordReset } from '@/actions/auth.actions';
import Form from '@/components/Forms/Form';
import ModalRoot from '@/components/ModalRoot';
import { RequestPasswordResetFormValues } from '@/config/form-models.config';
import { REQUEST_PASSWORD_RESET_FORM } from '@/config/form-names.config';
import { toggleLoginModal, toggleRequestPasswordResetModal } from '@/valtio/auth/auth.actions';
import { showToast } from '@/valtio/global/global.actions';

import CodeSentStep from './CodeSentStep';
import EmailStep from './EmailStep';

interface RequestPasswordResetModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const defaultValues: RequestPasswordResetFormValues = {
  email: '',
};

const RequestPasswordResetModal = ({ isOpen, onOpen, onClose }: RequestPasswordResetModalProps) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);

  const [submittedEmail, setSubmittedEmail] = useState<string>('');
  const t = useTranslations('common');
  const tToastMessages = useTranslations('toastMessages');

  const handleBack = () => {
    toggleRequestPasswordResetModal();
    toggleLoginModal();
  };

  const handleClose = () => {
    onClose();
    setActiveStep(0);
    setSubmittedEmail('');
  };

  const handleSubmit = async (formValues: RequestPasswordResetFormValues) => {
    const formData = new FormData();

    formData.append('email', formValues.email);
    setSubmittedEmail(formValues.email);

    startTransition(() => {
      action(formData);
    });

    handleClose();
  };

  const renderStepPanel = () => {
    switch (activeStep) {
      case 0:
        return <EmailStep />;
      case 1:
        return <CodeSentStep email={submittedEmail} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (state) {
      if (!state.success) {
        showToast({ status: 'error', text: state.message || tToastMessages('request-password-failed') });

        return;
      }

      showToast({ status: 'success', text: tToastMessages('request-password-success') });
    }
  }, [state, tToastMessages]);

  return (
    <ModalRoot
      open={isOpen}
      onOpen={onOpen}
      onClose={handleClose}
      title={t('resetPassword')}
      width={453}
      confirmBtnText={t('sendReactivationCode')}
      hideCancelButton
      arrowBack={activeStep === 0}
      onBack={handleBack}
      hideConfirmButton={activeStep > 0}
      ConfirmBtnProps={{
        form: REQUEST_PASSWORD_RESET_FORM,
        type: 'submit',
        disabled: pending,
      }}
    >
      <Form defaultValues={defaultValues} onSubmit={handleSubmit} id={REQUEST_PASSWORD_RESET_FORM} mode="onBlur">
        {renderStepPanel()}
      </Form>
    </ModalRoot>
  );
};

export default RequestPasswordResetModal;
