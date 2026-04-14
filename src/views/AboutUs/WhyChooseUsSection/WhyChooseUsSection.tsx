import React from 'react';

import { Container, Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import WhyChooseUsItem from '@/components/WhyChooseUsItem';
import { aboutFeatures } from '@/config/about-features.config';
import colors from '@/styles/themes/colors';

import styles from './WhyChooseUsSection.module.scss';

const WhyChooseUsSection = () => {
  const t = useTranslations('about.whyChooseUs');

  return (
    <Container component="section" maxWidth="xl" disableGutters>
      <Stack maxWidth={1064} marginInline="auto" pt={20.5}>
        <Stack
          direction="column"
          alignContent="center"
          justifyContent="center"
          spacing={2}
          maxWidth={414}
          margin="auto"
        >
          <Typography
            component="h2"
            variant="h4"
            textAlign="center"
            fontWeight={800}
            fontStyle="italic"
            color={colors.blue500}
          >
            {t('title')}
          </Typography>
          <Typography variant="h2" component="h3" textAlign="center" fontWeight={500} color={colors.blue950}>
            {t('mainTitle')}
          </Typography>
          <Typography variant="body1" textAlign="center" color={colors.black500} pt={1}>
            {t('description')}
          </Typography>
        </Stack>
        <Grid container columnSpacing={{ xs: 2, md: 13 }} rowSpacing={{ xs: 8 }} className={styles.grid}>
          {aboutFeatures.map(({ icon: Icon, title, description }) => (
            <WhyChooseUsItem
              key={title}
              icon={Icon}
              title={t(`features.${title}`)}
              description={t(`features.${description}`)}
              translationKey={title}
              itemSize={4}
              component="h4"
            />
          ))}
        </Grid>
      </Stack>
    </Container>
  );
};

export default WhyChooseUsSection;
