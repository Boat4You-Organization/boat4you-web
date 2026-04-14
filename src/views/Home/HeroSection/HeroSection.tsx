import { Container, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import GeneralSearchBarRoot from '@/components/GeneralSearchBarRoot';

import styles from './HeroSection.module.scss';

const HeroSection = () => {
  const t = useTranslations('home');

  return (
    <>
      <Container component="section" className={styles.container}>
        <Stack alignItems="center" gap={2}>
          <Typography variant="hero" component="h1">
            {t('hero.title')}{' '}
            <Typography variant="hero" component="span" fontWeight={800} fontStyle="italic">
              {t('hero.ctaTitle')}
            </Typography>
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {t('hero.description')}
          </Typography>
        </Stack>
      </Container>
      <GeneralSearchBarRoot />
    </>
  );
};

export default HeroSection;
