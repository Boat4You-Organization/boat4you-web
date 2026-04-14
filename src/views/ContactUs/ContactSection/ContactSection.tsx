import { Container, Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { contactItems } from '@/config/contact.config';
import colors from '@/styles/themes/colors';

import styles from './ContactSection.module.scss';

const ContactSection = () => {
  const t = useTranslations('contact');

  return (
    <Container component="section" maxWidth="xl" disableGutters className={styles.container}>
      <Grid container spacing={{ xs: 8, sm: 11 }} className={styles.grid} justifyContent="center">
        {contactItems.map(({ titleKey, icon: Icon, link }) => (
          <Grid key={titleKey} size={{ xs: 12, sm: 6 }} className={styles.item}>
            <Icon size={48} variant="secondary" />
            <Stack>
              <Typography variant="body1" component="h2">
                {t(titleKey)}
              </Typography>
              {typeof link === 'string' ? (
                <Typography variant="h3" fontWeight={700} component="p" color={colors.blue500}>
                  {t(link as 'contact.mondayToSunday')}
                </Typography>
              ) : (
                <Link href={link.href}>
                  <Typography variant="h3" fontWeight={700} component="p" color={colors.blue500}>
                    {link.text}
                  </Typography>
                </Link>
              )}
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ContactSection;
