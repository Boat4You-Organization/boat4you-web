import { startTransition, useActionState, useCallback, useEffect, useState } from 'react';

import { Stack } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import { sendCustomOffer } from '@/actions/yacht.actions';
import CircularProgress from '@/components/CircularProgress';
import Form from '@/components/Forms/Form';
import ModalRoot from '@/components/ModalRoot';
import { AdminInquiryFormValues, YachtSearchParams } from '@/config/form-models.config';
import { ADMIN_INQUIRY_FORM } from '@/config/form-names.config';
import { YachtModelShortInfo } from '@/models/yacht.model';
import { fetchYachts } from '@/services/yacht.service';
import useQueryParams from '@/utils/hooks/useQueryParams';
import { showToast } from '@/valtio/global/global.actions';
import { useUserStore } from '@/valtio/user/user.store';
import { setSelectedYachtIds } from '@/valtio/yacht/yacht.actions';

import ContactInfoStep from './ContactInfoStep';
import YachtsStep from './YachtsStep';

interface AdminInquiryModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  selectedYachtIds: number[];
}

const defaultValues: AdminInquiryFormValues = {
  email: '',
  yachtIds: [],
  dateFrom: '',
  dateTo: '',
  did: [],
  message: '',
};

const AdminInquiryModal = ({ onOpen, onClose, isOpen, selectedYachtIds }: AdminInquiryModalProps) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedYachts, setSelectedYachts] = useState<YachtModelShortInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [state, action, isPending] = useActionState(sendCustomOffer, undefined);
  const { params } = useQueryParams();
  const did = params.did as string[];
  const locations = params.destinations as string[];
  const t = useTranslations('common');
  const locale = useLocale();
  const { user } = useUserStore();
  const isLastStep = activeStep === 1;

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleClose = useCallback(() => {
    onClose();
    handleReset();
  }, [onClose]);

  useEffect(() => {
    const fetchSelectedYachts = async () => {
      if (selectedYachtIds.length === 0) {
        setSelectedYachts([]);

        return;
      }

      setIsLoading(true);
      try {
        const searchParams: YachtSearchParams = {
          did,
          locations,
          yid: selectedYachtIds,
        };

        const response = await fetchYachts(searchParams, user?.currency, locale);

        setSelectedYachts(response.content || []);
      } catch (error) {
        setSelectedYachts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchSelectedYachts();
    }
  }, [isOpen, selectedYachtIds, did, locations, locale, user?.currency]);

  useEffect(() => {
    if (!state) {
      return;
    }

    if (state?.payload) {
      showToast({ status: 'success', text: t('offerSentSuccessfully') });
      handleClose();
      setSelectedYachts([]);
      setSelectedYachtIds([]);
    } else {
      showToast({ status: 'error', text: state?.message || t('offerSentFailed') });
    }
  }, [state?.payload, state?.message, state, onClose, t, handleClose]);

  const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const renderStepPanel = () => {
    switch (activeStep) {
      case 0:
        return <YachtsStep selectedYachts={selectedYachts} />;
      case 1:
        return <ContactInfoStep />;
      default:
        return null;
    }
  };

  const handleSubmit = (formValues: AdminInquiryFormValues) => {
    const updatedFormValues = {
      ...formValues,
      yachtIds: selectedYachtIds,
      dateFrom: params.startDate,
      dateTo: params.endDate,
      did: params.did as string[],
    };

    const formData = new FormData();

    Object.entries(updatedFormValues).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    startTransition(() => {
      action(formData);
    });
  };

  const noop = () => {};

  return (
    <ModalRoot
      open={isOpen}
      onOpen={onOpen}
      onClose={handleClose}
      title={t('sendOffer')}
      confirmBtnText={activeStep === 0 ? t('sendOffer') : isPending ? t('sending') : t('send')} // eslint-disable-line no-nested-ternary
      cancelBtnText={t('cancel')}
      onCancel={handleClose}
      arrowBack={isLastStep}
      onBack={handleBack}
      width={activeStep === 0 ? 670 : 453}
      ConfirmBtnProps={{
        onClick: isLastStep ? noop : handleNext,
        type: isLastStep ? 'submit' : 'button',
        form: ADMIN_INQUIRY_FORM,
        disabled: isLoading || isPending || selectedYachtIds.length === 0,
      }}
      CancelBtnProps={{
        disabled: isPending,
      }}
    >
      <Form defaultValues={defaultValues} onSubmit={handleSubmit} id={ADMIN_INQUIRY_FORM}>
        {isLoading ? (
          <Stack alignItems="center" justifyContent="center" height="100%">
            <CircularProgress />
          </Stack>
        ) : (
          renderStepPanel()
        )}
      </Form>
    </ModalRoot>
  );
};

export default AdminInquiryModal;
