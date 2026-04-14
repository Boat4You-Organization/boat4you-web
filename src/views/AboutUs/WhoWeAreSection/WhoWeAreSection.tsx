import React from 'react';

import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import colors from '@/styles/themes/colors';

import styles from './WhoWeAreSection.module.scss';

const WhoWeAreSection = () => {
  const t = useTranslations('about.aboutUs');

  return (
    <Container component="section" maxWidth="xl" disableGutters>
      <Stack maxWidth="1064px" marginInline="auto" pt={23}>
        <Grid container spacing={{ xs: 6, md: 16 }}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Box className={styles.imageWrapper}>
              <Image
                src="/images/about/our-team.webp"
                alt="Who we are"
                fill
                sizes="(max-width: 1199px) 100vw, 620px"
                className={styles.image}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <Stack direction="column" spacing={2}>
              <Typography component="h2" variant="h4" fontWeight={800} fontStyle="italic" color={colors.blue500}>
                {t('title')}
              </Typography>
              <Typography variant="h2" component="h3" fontWeight={500} color={colors.blue950}>
                {t('mainTitle')}
              </Typography>
              <Typography variant="body1" color={colors.black500} pt={1}>
                {t('description')}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};

export default WhoWeAreSection;
