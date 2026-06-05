'use client';

import { useCallback, useEffect, useState } from 'react';

import ComputerIcon from '@mui/icons-material/ComputerOutlined';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslations } from 'next-intl';

import { SessionInfo, getSessions, revokeOtherSessions, revokeSession } from '@/actions/auth.actions';
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
    return <CircularProgress size={16} sx={{ my: 1 }} />;
  }

  return (
    <Stack gap={0.25}>
      {sessions.map(session => (
        <Stack key={session.sessionGroup} direction="row" alignItems="center" gap={1.25} sx={{ py: 0.75 }}>
          <ComputerIcon sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }} />
          <Stack sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 500, lineHeight: 1.35 }}>
              {parseUserAgent(session.userAgent)}
              {session.current && (
                <Typography component="span" variant="caption" color="primary" sx={{ ml: 0.75, fontWeight: 600 }}>
                  · {tt('thisDevice')}
                </Typography>
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ lineHeight: 1.35 }}>
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
              sx={{ flexShrink: 0, minWidth: 'auto', px: 1, fontSize: 12 }}
            >
              {tt('signOut')}
            </Button>
          )}
        </Stack>
      ))}

      {hasOtherSessions && (
        <Button
          variant="text"
          size="small"
          color="error"
          disabled={revoking}
          onClick={handleRevokeOthers}
          sx={{ alignSelf: 'flex-start', mt: 0.5, minWidth: 'auto', px: 1, fontSize: 12 }}
        >
          {tt('signOutOtherDevices')}
        </Button>
      )}
    </Stack>
  );
};

export default DeviceList;
