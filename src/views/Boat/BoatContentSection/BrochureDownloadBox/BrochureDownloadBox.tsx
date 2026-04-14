'use client';

import React from 'react';

import { Button, Grid, Stack, Theme, Typography, useMediaQuery } from '@mui/material';
import { useTranslations } from 'next-intl';

import Download from '@/components/SvgIcons/Download';
import BrochureVector from '@/components/SvgIcons/Vector/BrochureVector';
import colors from '@/styles/themes/colors';

import styles from './BrochureDownloadBox.module.scss';

interface BrochureDownloadBoxProps {
  yachtName: string;
  onDownload: () => void;
}

const BrochureDownloadBox = ({ yachtName, onDownload }: BrochureDownloadBoxProps) => {
  const t = useTranslations('yacht.brochure');
  const customBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down(1024));

  return (
    <Grid container className={styles.container}>
      <Grid size={{ xs: 12, lg: 4 }} className={styles.vector}>
        <BrochureVector
          width="100%"
          props={{
            style: {
              maxWidth: '273px',
              maxHeight: '250px',
              width: '100%',
              height: 'auto',
              margin: 'auto',
            },
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 8 }}>
        <Stack direction="column" spacing={3} className={styles.content}>
          <Typography component="h2" variant="h1" fontWeight={800} color={colors.blue500}>
            {t('title', { name: yachtName })}
          </Typography>
          <Typography variant="body2" color={colors.black350}>
            {t('description')}
          </Typography>
          <Button size="large" startIcon={<Download size={24} />} fullWidth={customBreakpoint} onClick={onDownload}>
            {t('button')}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default BrochureDownloadBox;
