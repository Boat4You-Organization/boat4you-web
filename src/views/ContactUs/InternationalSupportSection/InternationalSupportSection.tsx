import { Container, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { internationalSupportItems } from '@/config/contact.config';
import colors from '@/styles/themes/colors';

import styles from './InternationalSupportSection.module.scss';

const InternationalSupportSection = () => {
  const t = useTranslations('contact');

  return (
    <Container component="section" maxWidth="xl" disableGutters className={styles.container}>
      <Typography variant="body1" component="h2" fontWeight={700} textTransform="uppercase">
        {t('internationalSupport.title')}
      </Typography>
      <Stack direction={{ xs: 'column', lg: 'row' }} gap={10} mt={7}>
        {internationalSupportItems.map(({ titleKey, icon: Icon, link }) => (
          <Stack key={titleKey} direction="row" gap={2}>
            <Icon size={48} variant="secondary" />
            <Stack>
              <Typography variant="body1" component="h3">
                {t(titleKey)}
              </Typography>
              <Link href={link.href}>
                <Typography variant="h3" fontWeight={700} component="p" color={colors.blue500}>
                  {link.text}
                </Typography>
              </Link>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Container>
  );
};

export default InternationalSupportSection;
