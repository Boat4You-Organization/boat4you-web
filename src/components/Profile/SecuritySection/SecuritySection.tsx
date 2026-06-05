'use client';

/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect, useState } from 'react';

import DevicesIcon from '@mui/icons-material/DevicesOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import { Box, Button, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { getMyAccountInfo } from '@/actions/auth.actions';

import DeviceList from './DeviceList';
import SetPasswordModal from './SetPasswordModal';

interface SecurityInfo {
  provider: string | null;
  passwordSet: boolean;
}

const SecuritySection = () => {
  const [info, setInfo] = useState<SecurityInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [setPasswordOpen, setSetPasswordOpen] = useState(false);
  const t = useTranslations('common');
  // next-intl's strict key union doesn't surface these freshly-added common keys
  // at compile time (TS widens the large literal); they exist in every locale.
  const tt = t as unknown as (k: string) => string;

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    getMyAccountInfo().then(data => {
      if (cancelled) return;

      if (data) {
        setInfo({ provider: data.provider, passwordSet: data.passwordSet });
      }

      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const renderConnectedAccounts = () => {
    if (info?.provider === 'GOOGLE') {
      return <Chip icon={<GoogleIcon />} label={tt('googleConnected')} variant="outlined" />;
    }

    return (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    );
  };

  const renderPassword = () => {
    if (info?.passwordSet === false) {
      return (
        <Stack gap={1} alignItems="flex-start">
          <Button variant="outlined" size="small" onClick={() => setSetPasswordOpen(true)}>
            {tt('setPassword')}
          </Button>
          <Typography variant="caption" color="text.secondary">
            {tt('setPasswordHint')}
          </Typography>
        </Stack>
      );
    }

    return (
      <Typography variant="body2" color="text.secondary">
        {tt('passwordIsSet')}
      </Typography>
    );
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Typography variant="h3" component="h2" fontWeight={700} sx={{ mb: 2 }}>
        {tt('signInAndSecurity')}
      </Typography>

      <Stack gap={3}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {tt('connectedAccounts')}
          </Typography>
          {!loading && renderConnectedAccounts()}
        </Box>

        <Divider />

        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {t('password')}
          </Typography>
          {!loading && renderPassword()}
        </Box>

        <Divider />

        <Box>
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
            <DevicesIcon fontSize="small" />
            <Typography variant="caption" color="text.secondary">
              {tt('activeSessions')}
            </Typography>
          </Stack>
          <DeviceList />
        </Box>
      </Stack>

      <SetPasswordModal isOpen={setPasswordOpen} onClose={() => setSetPasswordOpen(false)} />
    </Paper>
  );
};

export default SecuritySection;
