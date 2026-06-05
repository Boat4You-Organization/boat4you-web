'use client';

import { useCallback, useEffect, useState } from 'react';

import ComputerIcon from '@mui/icons-material/ComputerOutlined';
import { Box, Button, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslations } from 'next-intl';

import { SessionInfo, getSessions, revokeOtherSessions, revokeSession } from '@/actions/auth.actions';
import colors from '@/styles/themes/colors';
import { parseUserAgent } from '@/utils/static/parseUserAgent';

// Idempotent — needed for the "Last active {relative}" copy via .fromNow().
dayjs.extend(relativeTime);

const DeviceList = () => {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(false);
  const t = useTranslations('common');
  // next-intl's strict key union doesn't surface these freshly-added common keys
  // at compile time (TS widens the large literal); they exist in every locale.
  const tt = t as unknown as (k: string) => string;

  const reload = useCallback(async () => {
    setLoading(true);

    const data = await getSessions();

    setSessions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleRevoke = async (sessionGroup: string) => {
    setRevoking(true);
    await revokeSession(sessionGroup);
    await reload();
    setRevoking(false);
  };

  const handleRevokeOthers = async () => {
    setRevoking(true);
    await revokeOtherSessions();
    await reload();
    setRevoking(false);
  };

  const hasOtherSessions = sessions.some(s => !s.current);

  if (loading) {
    return (
      <Stack direction="row" alignItems="center" gap={1} sx={{ py: 2 }}>
        <CircularProgress size={18} />
        <Typography variant="body2" color="text.secondary">
          …
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack gap={1.5}>
      {sessions.map(session => (
        <Stack
          key={session.sessionGroup}
          direction="row"
          alignItems="center"
          gap={1.5}
          sx={{ py: 1, borderBottom: `1px solid ${colors.black50}` }}
        >
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
            <ComputerIcon fontSize="small" />
          </Box>
          <Stack sx={{ minWidth: 0, flexGrow: 1 }}>
            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
              <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.3 }}>
                {parseUserAgent(session.userAgent)}
              </Typography>
              {session.current && <Chip label={tt('thisDevice')} size="small" color="primary" variant="outlined" />}
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
              {session.ipAddress || '—'}
              {session.lastUsedAt ? ` · ${tt('lastActive')} ${dayjs(session.lastUsedAt).fromNow()}` : ''}
            </Typography>
          </Stack>
          {!session.current && (
            <Button
              variant="text"
              size="small"
              color="error"
              disabled={revoking}
              onClick={() => handleRevoke(session.sessionGroup)}
              sx={{ flexShrink: 0 }}
            >
              {tt('signOut')}
            </Button>
          )}
        </Stack>
      ))}

      {hasOtherSessions && (
        <Box>
          <Button variant="outlined" size="small" color="error" disabled={revoking} onClick={handleRevokeOthers}>
            {tt('signOutOtherDevices')}
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export default DeviceList;
