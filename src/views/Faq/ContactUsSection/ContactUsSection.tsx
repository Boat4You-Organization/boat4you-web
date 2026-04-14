import { Button, Container, Grid, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import FaqVector from '@/components/SvgIcons/Vector/FaqVector';
import colors from '@/styles/themes/colors';

import styles from './ContactUsSection.module.scss';

const ContactUsSection = () => {
  const t = useTranslations('common');

  return (
    <Container component="section" maxWidth="xl" disableGutters className={styles.container}>
      <Grid container direction={{ xs: 'column-reverse', md: 'row' }} className={styles.card}>
        <Grid size={{ xs: 12, md: 7 }} className={styles.content}>
          <Typography variant="hero" component="h2" fontWeight={800} fontStyle="italic" color={colors.blue500}>
            {t('didntFindAnswer')}
          </Typography>
          <Typography variant="body2" color={colors.black500} mt={2} className={styles.description}>
            {t('didntFindAnswerDescription')}
          </Typography>
          <Link href="/contact-us">
            <Button size="large" sx={{ mt: 2 }}>
              {t('contactUs')}
            </Button>
          </Link>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }} className={styles.vector}>
          <FaqVector width="100%" />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactUsSection;
