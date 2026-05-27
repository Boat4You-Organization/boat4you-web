'use client';

/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect, useState } from 'react';

import EventIcon from '@mui/icons-material/EventOutlined';
import HistoryIcon from '@mui/icons-material/HistoryOutlined';
import SailingIcon from '@mui/icons-material/Sailing';
import { Box, Paper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { getMyAccountInfo } from '@/actions/auth.actions';
import { UserModel } from '@/models/user.model';
import colors from '@/styles/themes/colors';

interface AccountInfoSectionProps {
  user: UserModel;
}

interface AccountInfo {
  memberSince: string;
  lastLoginAt: string | null;
  totalBookings: number;
  // Backend still ships `emailVerified` for completeness but the UI no
  // longer renders it — login rejects any user that isn't REGISTERED, so
  // a logged-in customer is always verified by definition (Mario, 1.5.).
  emailVerified: boolean;
}

const formatDate = (iso: string | null | undefined) => (iso ? dayjs(iso).format('D MMM YYYY') : '—');
const formatDateTime = (iso: string | null | undefined) => (iso ? dayjs(iso).format('D MMM YYYY · HH:mm') : '—');

// Reads-only stat strip (Member since / Last login / Total bookings). Birthday
// editing lives in the Personal Information form so all editable PII stays in
// one place. Email-verification UI is deliberately absent — login rejects
// non-REGISTERED users, so reaching this page implies verification.
const AccountInfoSection = ({ user: _user }: AccountInfoSectionProps) => {
  const [info, setInfo] = useState<AccountInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoadingInfo(true);
    getMyAccountInfo().then(data => {
      if (cancelled) return;

      setInfo(data);
      setLoadingInfo(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Typography variant="h3" component="h2" fontWeight={700} sx={{ mb: 2 }}>
        Account
      </Typography>

      {/* No "email verification" badge here on purpose — login rejects any
          user that isn't REGISTERED (UserAuthService.kt:70 throws
          BAD_CREDENTIALS), so anyone who reaches /my-profile is verified
          by definition. Showing a "Pending" chip would be dead UI. */}
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={2.5} flexWrap="wrap" sx={{ mb: 3 }}>
        <StatChip
          icon={<EventIcon fontSize="small" />}
          label="Member since"
          value={loadingInfo ? '…' : formatDate(info?.memberSince)}
        />
        <StatChip
          icon={<HistoryIcon fontSize="small" />}
          label="Last login"
          value={loadingInfo ? '…' : formatDateTime(info?.lastLoginAt)}
        />
        <StatChip
          icon={<SailingIcon fontSize="small" />}
          label="Total bookings"
          value={loadingInfo ? '…' : String(info?.totalBookings ?? 0)}
        />
      </Stack>
      {/* Birthday lives in the Personal Information form below — not here.
          Mario decision 1.5.2026: keep editable PII in one place. */}
    </Paper>
  );
};

const StatChip = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <Stack direction="row" gap={1} alignItems="center" sx={{ minWidth: 0 }}>
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: colors.black50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Stack sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.3 }}>
        {value}
      </Typography>
    </Stack>
  </Stack>
);

export default AccountInfoSection;
