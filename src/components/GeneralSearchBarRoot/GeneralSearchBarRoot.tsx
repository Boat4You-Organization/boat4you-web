'use client';

import { Box, Container, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';

import Form from '@/components/Forms/Form';
import { SearchBarFormValues } from '@/config/form-models.config';
import { GENERAL_SEARCH_FORM } from '@/config/form-names.config';
import { Currency } from '@/models/user.model';
import useQueryParams from '@/utils/hooks/useQueryParams';
import DateTime from '@/utils/static/DateTime';

import GeneralSearchBarDesktop from './GeneralSearchBarDesktop';
import GeneralSearchBarMobile from './GeneralSearchBarMobile';
import styles from './GeneralSearchBarRoot.module.scss';

const defaultValues: SearchBarFormValues = {
  destinations: [],
  startDate: null,
  endDate: null,
  boatTypes: [],
  did: [],
};

const GeneralSearchBarRoot = () => {
  const { params, createQueryParams } = useQueryParams();
  const navigate = useRouter();

  const currentCurrency = params.currency as Currency;

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

    if (currentCurrency && currentCurrency !== Currency.EUR) {
      searchParams.currency = currentCurrency;
    }

    const queryParams = createQueryParams(searchParams);
    const searchUrl = queryParams ? `/search?${queryParams}` : '/search';

    navigate.push(searchUrl);
  };

  return (
    <Container
      maxWidth="xl"
      disableGutters
      classes={{ root: styles.rootContainer }}
      className={styles.containerWrapper}
    >
      <Paper classes={{ root: styles.root }} className={styles.container} elevation={0}>
        <Form id={GENERAL_SEARCH_FORM} defaultValues={defaultValues} onSubmit={handleSubmit}>
          <Box className={styles.searchDesktopWrapper}>
            <GeneralSearchBarDesktop />
          </Box>
          <Box className={styles.searchMobileWrapper}>
            <GeneralSearchBarMobile />
          </Box>
        </Form>
      </Paper>
    </Container>
  );
};

export default GeneralSearchBarRoot;
