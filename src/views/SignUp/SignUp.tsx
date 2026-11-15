'use client';

import { useEffect, useState } from 'react';

import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { checkInviteCode, signUpUser } from '@/actions/user.actions';
import Form from '@/components/Forms/Form';
import LoadingSection from '@/components/LoadingSection';
import NewPasswordVector from '@/components/SvgIcons/Vector/NewPasswordVector';
import { showToast } from '@/valtio/global/global.actions';

import styles from './SignUp.module.scss';
import SignUpForm from './SignUpForm';

interface SignUpProps {
  inviteCode?: string;
  /** A guest straight from a booking (?booking=1, no invite code yet): told to open the link e-mailed to them. */
  fromBooking?: boolean;
}

interface SignUpFormValues {
  password: string;
  confirmPassword: string;
}

const defaultValues: SignUpFormValues = {
  password: '',
  confirmPassword: '',
};

const SignUp = ({ inviteCode, fromBooking }: SignUpProps) => {
  const t = useTranslations('common');
  const [isCheckingInvite, setIsCheckingInvite] = useState(false);
  const [isInviteValid, setIsInviteValid] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useRouter();

  // A guest straight from a booking, without an invite code (15.11.2026, guest account takeover fix): the password
  // is set ONLY through the invite link e-mailed to them, which proves they own the address. Until then the account
  // stays closed. The old reservation id + e-mail route let anyone who knew both claim someone else's account.
  // No address in the URL: it would leak into logs and analytics, and anyone could craft a page "we emailed X".
  const isGuestWithoutLink = !inviteCode && Boolean(fromBooking);

  const handleInviteSubmit = async (formValues: SignUpFormValues) => {
    if (!inviteCode || isSubmitting) return;

    setIsSubmitting(true);

    const result = await signUpUser(inviteCode, { password: formValues.password });

    setIsSubmitting(false);

    if (result.payload) {
      showToast({ status: 'success', text: t('signUpSuccessful') });
      navigate.replace('/');
    } else {
      showToast({ status: 'error', text: result.message || t('signUpFailed') });
    }
  };

  const renderForm = () => (
    <Stack direction="column" spacing={3} className={styles.form}>
      <Typography variant="hero" fontWeight={800} fontStyle="italic" color="primary">
        {t('createYourPassword')}
      </Typography>
      <Typography variant="body1">{t('createPasswordDescription')}</Typography>
      <Form defaultValues={defaultValues} onSubmit={handleInviteSubmit}>
        <SignUpForm />
      </Form>
    </Stack>
  );

  const renderCheckEmail = () => (
    <Stack className={styles.form} direction="column" spacing={3}>
      <Typography variant="hero" fontWeight={800} fontStyle="italic" color="primary">
        {t('guestPasswordLinkSentTitle')}
      </Typography>
      <Typography variant="body1" pt={3}>
        {t('guestPasswordLinkSentNoEmail')}
      </Typography>
      <Typography variant="body1">{t('passwordLinkExpiredUseReset')}</Typography>
    </Stack>
  );

  const renderErrorState = () => (
    <Stack className={styles.form} direction="column" spacing={3}>
      <Typography variant="hero" fontWeight={800} fontStyle="italic" color="primary">
        {t('inviteCodeInvalid')}
      </Typography>
      <Typography variant="body1" pt={3}>
        {t('inviteCodeInvalidDescription')}
      </Typography>
      <Typography variant="body1">{t('passwordLinkExpiredUseReset')}</Typography>
    </Stack>
  );

  useEffect(() => {
    if (!inviteCode) {
      setIsInviteValid(false);

      return;
    }

    const validateInviteCode = async () => {
      setIsCheckingInvite(true);

      const result = await checkInviteCode(inviteCode);

      setIsInviteValid(result.payload);
      setIsCheckingInvite(false);
    };

    validateInviteCode();
  }, [inviteCode]);

  if (isCheckingInvite) {
    return <LoadingSection />;
  }

  const showError = !inviteCode || isInviteValid === false;

  const renderContent = () => {
    if (isGuestWithoutLink) return renderCheckEmail();

    return showError ? renderErrorState() : renderForm();
  };

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Grid container spacing={5} className={styles.contentWrapper}>
        <Grid size={{ xs: 12, md: 6 }} className={styles.content}>
          {renderContent()}
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

export default SignUp;
