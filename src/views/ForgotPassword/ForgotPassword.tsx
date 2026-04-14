'use client';

import { startTransition, useActionState, useEffect } from 'react';

import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { checkPasswordResetCode, resetPassword } from '@/actions/auth.actions';
import Form from '@/components/Forms/Form';
import LoadingSection from '@/components/LoadingSection';
import NewPasswordVector from '@/components/SvgIcons/Vector/NewPasswordVector';
import { ResetPasswordFormValues } from '@/config/form-models.config';
import { LOGIN_FORM } from '@/config/form-names.config';
import colors from '@/styles/themes/colors';
import { showToast } from '@/valtio/global/global.actions';

import styles from './ForgotPassword.module.scss';
import ForgotPasswordForm from './ForgotPasswordForm';

interface ForgotPasswordProps {
  resetCode?: string;
}

const defaultValues: ResetPasswordFormValues = {
  password: '',
  confirmPassword: '',
};

const ForgotPassword = ({ resetCode }: ForgotPasswordProps) => {
  const t = useTranslations('common');
  const [stateCheckPassword, actionCheckPassword, pendingCheckPassword] = useActionState(
    checkPasswordResetCode,
    undefined
  );
  const [stateResetPassword, actionResetPassword] = useActionState(resetPassword, undefined);
  const navigate = useRouter();

  const isCheckingPassword = pendingCheckPassword || (resetCode && !stateCheckPassword);

  const handleSubmit = async (formValues: ResetPasswordFormValues) => {
    if (!resetCode) return;

    const formData = new FormData();

    formData.append('password', formValues.password);
    formData.append('confirmPassword', formValues.confirmPassword);

    startTransition(() => {
      actionResetPassword({ passwordResetCode: resetCode, formData });
    });
  };

  const renderForm = () => (
    <Form defaultValues={defaultValues} className={styles.form} onSubmit={handleSubmit} id={LOGIN_FORM}>
      <ForgotPasswordForm />
    </Form>
  );

  const renderErrorState = () => (
    <Stack className={styles.form} direction="column" spacing={3}>
      <Typography variant="hero" fontWeight={800} fontStyle="italic" color={colors.blue500}>
        {t('passwordResetCodeFailed')}
      </Typography>
      <Typography variant="body1" pt={3} color={colors.black950}>
        {t('passwordResetCodeFailedDescription')}
      </Typography>
    </Stack>
  );

  useEffect(() => {
    if (!resetCode) return;

    startTransition(() => {
      actionCheckPassword(resetCode);
    });
  }, [resetCode, actionCheckPassword]);

  useEffect(() => {
    if (stateResetPassword) {
      if (stateResetPassword.success) {
        showToast({
          status: 'success',
          text: t('resetPasswordSuccessful'),
        });
        navigate.replace('/');
      } else {
        showToast({
          status: 'error',
          text: stateResetPassword.message || t('resetPasswordFailed'),
        });
      }
    }
  }, [stateResetPassword, t, navigate]);

  if (isCheckingPassword) return <LoadingSection />;

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Grid container spacing={5} className={styles.contentWrapper}>
        <Grid size={{ xs: 12, md: 6 }} className={styles.content}>
          {stateCheckPassword && !stateCheckPassword.payload ? renderErrorState() : renderForm()}
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

export default ForgotPassword;
