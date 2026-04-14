'use client';

import { useEffect, useState } from 'react';

import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { getCustomOfferRedirectUrl } from '@/actions/yacht.actions';
import LoadingSection from '@/components/LoadingSection';
import NewPasswordVector from '@/components/SvgIcons/Vector/NewPasswordVector';
import { showToast } from '@/valtio/global/global.actions';

import styles from './CustomOffer.module.scss';

interface CustomOfferProps {
  hash?: string;
}

const CustomOffer = ({ hash }: CustomOfferProps) => {
  const t = useTranslations('common');
  const [isCheckingHash, setIsCheckingHash] = useState(false);
  const [isHashValid, setIsHashValid] = useState<boolean | null>(null);
  const router = useRouter();

  const renderErrorState = () => (
    <Stack className={styles.form} direction="column" spacing={3}>
      <Typography variant="hero" fontWeight={800} fontStyle="italic" color="primary">
        {t('customOfferInvalid')}
      </Typography>
      <Typography variant="body1" pt={3}>
        {t('customOfferInvalidDescription')}
      </Typography>
    </Stack>
  );

  useEffect(() => {
    if (!hash) {
      setIsHashValid(false);

      return;
    }

    const validateAndRedirect = async () => {
      setIsCheckingHash(true);

      try {
        const result = await getCustomOfferRedirectUrl(hash);

        if (result.payload) {
          setIsHashValid(true);
          showToast({
            status: 'success',
            text: t('redirectingToCustomOffer'),
          });
          window.location.href = result.payload;
        } else {
          setIsHashValid(false);
          showToast({
            status: 'error',
            text: t('customOfferNotFound'),
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to validate custom offer:', error);
        setIsHashValid(false);
        showToast({
          status: 'error',
          text: t('customOfferNotFound'),
        });
      } finally {
        setIsCheckingHash(false);
      }
    };

    validateAndRedirect();
  }, [hash, router, t]);

  if (isCheckingHash) {
    return <LoadingSection />;
  }

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Grid container spacing={5} className={styles.contentWrapper}>
        <Grid size={{ xs: 12, md: 6 }} className={styles.content}>
          {!hash || isHashValid === false ? renderErrorState() : null}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} />
      </Grid>
      <Grid container spacing={5} className={styles.imageContainer}>
        <Grid size={{ xs: 12, md: 6 }} />
        <Grid size={{ xs: 12, md: 6 }}>
          <Box className={styles.vector}>
            <NewPasswordVector />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomOffer;
