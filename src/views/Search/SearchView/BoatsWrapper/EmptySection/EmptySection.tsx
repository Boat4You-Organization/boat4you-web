import React from 'react';

import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import colors from '@/styles/themes/colors';

import styles from './EmptySection.module.scss';

const EmptySection = () => {
  const t = useTranslations('common');

  return (
    <Box className={styles.container}>
      <Stack className={styles.content}>
        <Typography variant="h2" component="h1" fontWeight={700}>
          {t('chooseYourDestination')}
        </Typography>
        <Typography variant="body2" color={colors.black600}>
          {t('chooseYourDestinationDescription')}
        </Typography>
      </Stack>
    </Box>
  );
};

export default EmptySection;
