'use client';

import { Close } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

import Form from '@/components/Forms/Form';
import GeneralSearchBarMobile from '@/components/GeneralSearchBarRoot/GeneralSearchBarMobile';
import { SearchBarFormValues } from '@/config/form-models.config';
import { GENERAL_SEARCH_FORM } from '@/config/form-names.config';
import useQueryParams from '@/utils/hooks/useQueryParams';
import DateTime from '@/utils/static/DateTime';

const defaultValues: SearchBarFormValues = {
  destinations: [],
  startDate: null,
  endDate: null,
  boatTypes: [],
  did: [],
};

interface GeneralSearchBarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GeneralSearchBarModal = ({ isOpen, onClose }: GeneralSearchBarModalProps) => {
  const { params, createQueryParams } = useQueryParams();
  const navigate = useRouter();

  const initialValues = params
    ? {
        destinations: params.destinations,
        startDate: params.startDate ? dayjs(params.startDate) : null,
        endDate: params.endDate ? dayjs(params.endDate) : null,
        boatTypes: params.boatTypes,
        did: params.did,
      }
    : defaultValues;

  const handleSubmit = (formValues: SearchBarFormValues) => {
    const searchParams: Record<string, string | string[] | number | boolean> = {};

    if (formValues.destinations && formValues.destinations.length > 0) {
      searchParams.destinations = formValues.destinations;
    }

    if (formValues.did && formValues.did.length > 0) {
      searchParams.did = formValues.did;
    }

    if (formValues.boatTypes && formValues.boatTypes.length > 0) {
      searchParams.boatTypes = formValues.boatTypes;
    }

    if (formValues.startDate) {
      searchParams.startDate = DateTime.formatFull(formValues.startDate);
    }

    if (formValues.endDate) {
      searchParams.endDate = DateTime.formatFull(formValues.endDate);
    }

    const queryParams = createQueryParams(searchParams);
    const searchUrl = queryParams ? `/search?${queryParams}` : '/search';

    navigate.push(searchUrl);
    onClose();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        fullWidth
        sx={{
          zIndex: 1200,
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.10)',
            backdropFilter: 'blur(6px)',
          },
          '& .MuiDialog-container': {
            margin: '72.5px 0 0',
            alignItems: 'flex-start',
          },
          '& .MuiPaper-root ': {
            margin: '0 16px',
            width: '100%',
            maxWidth: '100%',
          },
        }}
      >
        <Form id={GENERAL_SEARCH_FORM} defaultValues={initialValues} onSubmit={handleSubmit}>
          <GeneralSearchBarMobile />
        </Form>
      </Dialog>
      <IconButton
        sx={{
          display: isOpen ? 'flex' : 'none',
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 1300,
          transition: 'display 300ms ease',
        }}
        onClick={onClose}
      >
        <Close />
      </IconButton>
    </>
  );
};

export default GeneralSearchBarModal;
