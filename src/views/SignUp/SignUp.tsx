'use client';

import { useEffect, useState } from 'react';

import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { checkInviteCode, setPasswordForReservation, signUpUser } from '@/actions/user.actions';
import Form from '@/components/Forms/Form';
import LoadingSection from '@/components/LoadingSection';
import NewPasswordVector from '@/components/SvgIcons/Vector/NewPasswordVector';
import colors from '@/styles/themes/colors';
import { showToast } from '@/valtio/global/global.actions';

import styles from './SignUp.module.scss';
import SignUpForm from './SignUpForm';

interface SignUpProps {
  inviteCode?: string;
  reservationId?: number;
  email?: string;
}

interface SignUpFormValues {
  password: string;
  confirmPassword: string;
}

const defaultValues: SignUpFormValues = {
  password: '',
  confirmPassword: '',
};

const SignUp = ({ inviteCode, reservationId, email }: SignUpProps) => {
  const t = useTranslations('common');
  const [isCheckingInvite, setIsCheckingInvite] = useState(false);
  const [isInviteValid, setIsInviteValid] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useRouter();

  // Guest-booking mode: we set the password by reservation id + email. This
  // bypasses the invite-code flow for customers who just finished paying as
  // guests — the email-on-reservation is proof enough that they own the
  // booking (validated server-side).
  const isGuestMode = Boolean(reservationId && email);

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

  const handleGuestSubmit = async (formValues: SignUpFormValues) => {
    if (!reservationId || !email || isSubmitting) return;

    setIsSubmitting(true);
    const result = await setPasswordForReservation({
      reservationId,
      email,
      password: formValues.password,
    });
    setIsSubmitting(false);

    if (result.payload) {
      showToast({ status: 'success', text: t('signUpSuccessful') });
      // After password setup guests still need to log in — we don't auto-issue
      // a token here to keep the flow aligned with the normal login path and
      // avoid a second security-sensitive code path.
      navigate.replace('/');
      return;
    }

    // Known, benign failure: the booking's user is already a full account —
    // happens on repeat tests with the same email, or if the guest already
    // completed password setup in another tab. Point them at sign-in instead
    // of surfacing the raw backend message.
    if (result.message?.toLowerCase().includes('already registered')) {
      showToast({ status: 'info', text: t('accountAlreadyActiveSignIn') });
      navigate.replace('/');

      return;
    }

    showToast({ status: 'error', text: result.message || t('signUpFailed') });
  };

  const handleSubmit = isGuestMode ? handleGuestSubmit : handleInviteSubmit;

  const renderForm = () => (
    <Stack direction="column" spacing={3} className={styles.form}>
      <Typography variant="hero" fontWeight={800} fontStyle="italic" color="primary">
        {t('createYourPassword')}
      </Typography>
      <Typography variant="body1">{t('createPasswordDescription')}</Typography>
      {isGuestMode && email && (
        <Typography variant="body2" color={colors.black600}>
          {t('settingPasswordForEmail', { email })}
        </Typography>
      )}
      <Form defaultValues={defaultValues} onSubmit={handleSubmit}>
        <SignUpForm />
      </Form>
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
    </Stack>
  );

  useEffect(() => {
    // Guest-booking mode skips the invite-code check entirely — the server
    // validates ownership at submit time via email + reservation id.
    if (isGuestMode) {
      setIsInviteValid(true);

      return;
    }

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
  }, [inviteCode, isGuestMode]);

  if (isCheckingInvite) {
    return <LoadingSection />;
  }

  const showError = !isGuestMode && (!inviteCode || isInviteValid === false);

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Grid container spacing={5} className={styles.contentWrapper}>
        <Grid size={{ xs: 12, md: 6 }} className={styles.content}>
          {showError ? renderErrorState() : renderForm()}
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
