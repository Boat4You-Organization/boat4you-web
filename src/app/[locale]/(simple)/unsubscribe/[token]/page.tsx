'use client';

import { useEffect, useRef, useState } from 'react';

import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { useParams } from 'next/navigation';

import { unsubscribeFromEmails } from '@/actions/marketing.actions';
import colors from '@/styles/themes/colors';

type Status = 'loading' | 'done' | 'error';

// Client-side so the unsubscribe fires from real browsers only — email link
// scanners fetch the HTML but don't run JS, so they can't trigger an accidental
// opt-out (the classic GET-mutation footgun). One-click for actual recipients.
// English-only copy for now; localise in Phase 2 alongside the email bundles.
const UnsubscribePage = () => {
  const params = useParams();
  const [status, setStatus] = useState<Status>('loading');
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) {
      return;
    }

    ranRef.current = true;

    const raw = params?.token;
    const token = Array.isArray(raw) ? raw[0] : raw;

    if (!token) {
      setStatus('error');

      return;
    }

    unsubscribeFromEmails(token).then(res => setStatus(res.success ? 'done' : 'error'));
  }, [params]);

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box textAlign="center" py={6}>
        {status === 'loading' && (
          <>
            <CircularProgress />
            <Typography mt={3} color={colors.blue950}>
              Updating your email preferences…
            </Typography>
          </>
        )}

        {status === 'done' && (
          <>
            <Typography variant="h2" color={colors.blue950} fontWeight={700} gutterBottom>
              You&apos;re unsubscribed
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              You won&apos;t receive birthday or promotional emails from Boat4You anymore. Important messages about your
              bookings and account are still sent.
            </Typography>
          </>
        )}

        {status === 'error' && (
          <>
            <Typography variant="h2" color={colors.blue950} fontWeight={700} gutterBottom>
              Link not valid
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              This unsubscribe link is invalid or has expired. If you keep receiving unwanted emails, contact
              info@boat4you.com.
            </Typography>
          </>
        )}
      </Box>
    </Container>
  );
};

export default UnsubscribePage;
