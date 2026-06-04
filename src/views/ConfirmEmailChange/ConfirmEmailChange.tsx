'use client';

import { useState } from 'react';

import { Button, CircularProgress, Stack, Typography } from '@mui/material';

import { confirmEmailChange } from '@/actions/auth.actions';
import { useRouter } from '@/i18n/navigation';
import colors from '@/styles/themes/colors';

interface ConfirmEmailChangeProps {
  token?: string;
}

type Status = 'idle' | 'pending' | 'success' | 'error';

/**
 * Email-change confirmation page — reached from the link sent to the NEW address. The change is
 * applied only on an explicit button click (not auto on load) so email-security scanners that
 * pre-fetch links can't trigger it and the user gives clear consent. The backend revokes all
 * sessions on success, so the (now signed-out) user is sent back to sign in.
 */
const ConfirmEmailChange = ({ token }: ConfirmEmailChangeProps) => {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirm = async () => {
    if (!token) {
      setStatus('error');

      return;
    }

    setStatus('pending');

    const { success, message } = await confirmEmailChange(token);

    if (success) {
      setStatus('success');
      setTimeout(() => router.replace('/'), 4000);
    } else {
      setErrorMessage(message ?? '');
      setStatus('error');
    }
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      gap={3}
      sx={{ minHeight: '60vh', px: 3, py: 6, textAlign: 'center', maxWidth: 480, mx: 'auto' }}
    >
      {status === 'success' && (
        <>
          <Typography variant="h3" fontWeight={800} fontStyle="italic" color={colors.blue500}>
            Email changed
          </Typography>
          <Typography variant="body1" color={colors.black950}>
            Your email address has been updated. For your security you have been signed out — please sign in again with
            your new address.
          </Typography>
        </>
      )}

      {status === 'error' && (
        <>
          <Typography variant="h3" fontWeight={800} fontStyle="italic" color={colors.blue500}>
            Link invalid or expired
          </Typography>
          <Typography variant="body1" color={colors.black950}>
            {errorMessage ||
              'This confirmation link is invalid or has expired. Start the change again from your profile settings.'}
          </Typography>
          <Button variant="contained" size="large" onClick={() => router.replace('/my-profile')}>
            Go to profile
          </Button>
        </>
      )}

      {(status === 'idle' || status === 'pending') && (
        <>
          <Typography variant="h3" fontWeight={800} fontStyle="italic" color={colors.blue500}>
            Confirm your new email
          </Typography>
          <Typography variant="body1" color={colors.black950}>
            Click below to confirm the change to your Boat4You email address.
          </Typography>
          <Button
            variant="contained"
            size="large"
            disabled={status === 'pending' || !token}
            onClick={handleConfirm}
            startIcon={status === 'pending' ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            {status === 'pending' ? 'Confirming…' : 'Confirm new email'}
          </Button>
        </>
      )}
    </Stack>
  );
};

export default ConfirmEmailChange;
