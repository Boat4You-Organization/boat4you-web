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
}

interface SignUpFormValues {
  password: string;
  confirmPassword: string;
}

const defaultValues: SignUpFormValues = {
  password: '',
  confirmPassword: '',
};

const SignUp = ({ inviteCode }: SignUpProps) => {
  const t = useTranslations('common');
  const [isCheckingInvite, setIsCheckingInvite] = useState(false);
  const [isInviteValid, setIsInviteValid] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useRouter();

  const handleSubmit = async (formValues: SignUpFormValues) => {
    if (!inviteCode || isSubmitting) return;

    setIsSubmitting(true);

    const result = await signUpUser(inviteCode, { password: formValues.password });

    if (result.payload) {
      showToast({
        status: 'success',
        text: t('signUpSuccessful'),
      });
      navigate.replace('/');
    } else {
      showToast({
        status: 'error',
        text: result.message || t('signUpFailed'),
      });
    }

    setIsSubmitting(false);
  };

  const renderForm = () => (
    <Stack direction="column" spacing={3} className={styles.form}>
      <Typography variant="hero" fontWeight={800} fontStyle="italic" color="primary">
        {t('createYourPassword')}
      </Typography>
      <Typography variant="body1">{t('createPasswordDescription')}</Typography>
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
    if (!inviteCode) {
      setIsInviteValid(false);

      return;
    }

    const validateInviteCode = async () => {
      setIsCheckingInvite(true);
      // eslint-disable-next-line @typescript-eslint/padding-line-between-statements
      const result = await checkInviteCode(inviteCode);

      setIsInviteValid(result.payload);
      setIsCheckingInvite(false);
    };

    validateInviteCode();
  }, [inviteCode]);

  if (isCheckingInvite) {
    return <LoadingSection />;
  }

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Grid container spacing={5} className={styles.contentWrapper}>
        <Grid size={{ xs: 12, md: 6 }} className={styles.content}>
          {!inviteCode || isInviteValid === false ? renderErrorState() : renderForm()}
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
