import { Container, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import colors from '@/styles/themes/colors';

import styles from './ContactExpectSection.module.scss';

interface ExpectStep {
  title: string;
  body: string;
}

/**
 * "What to expect when you contact us" — how an inquiry is handled, what
 * helps us answer faster and the office hours, in prose. The contact page
 * was a 260-word list of phone numbers (audit 29.9.2026, R35); copy lives
 * under contact.expect in every locale.
 */
const ContactExpectSection = () => {
  const t = useTranslations('contact');
  const steps = t.raw('expect.steps') as ExpectStep[];
  const include = t.raw('expect.include') as string[];

  return (
    <Container component="section" maxWidth="xl" disableGutters className={styles.container}>
      <div className={styles.inner}>
        <Typography component="h2" variant="h3" fontWeight={700} color={colors.blue950}>
          {t('expect.title')}
        </Typography>
        <Typography variant="body1" className={styles.intro}>
          {t('expect.intro')}
        </Typography>

        <Stack component="ol" className={styles.steps} spacing={2}>
          {steps.map(step => (
            <li key={step.title} className={styles.step}>
              <Typography component="h3" variant="body1" fontWeight={700} color={colors.blue950}>
                {step.title}
              </Typography>
              <Typography variant="body1" className={styles.stepBody}>
                {step.body}
              </Typography>
            </li>
          ))}
        </Stack>

        <Typography component="h3" variant="h4" fontWeight={700} color={colors.blue950} className={styles.includeTitle}>
          {t('expect.includeHeading')}
        </Typography>
        <ul className={styles.include}>
          {include.map(item => (
            <li key={item}>
              <Typography variant="body1" component="span">
                {item}
              </Typography>
            </li>
          ))}
        </ul>

        <Typography variant="body1" className={styles.hours}>
          {t('expect.outro')}
        </Typography>
        <Typography variant="body1" className={styles.hours}>
          {t('expect.hours')}
        </Typography>
      </div>
    </Container>
  );
};

export default ContactExpectSection;
