import { useWatch } from 'react-hook-form';

import { CheckCircleOutline, RadioButtonUnchecked } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import colors from '@/styles/themes/colors';
import { MIN_PASSWORD_LENGTH } from '@/utils/static/FormValidator';

interface PasswordRequirementsProps {
  /** react-hook-form field name to watch. Defaults to 'password'. */
  name?: string;
}

/**
 * Live password-rule hint shown under a password field. Mirrors the backend
 * PasswordPolicy minimum length so the user sees the requirement — and a tick
 * as soon as they satisfy it — instead of only finding out via a server 400 on
 * submit. The weak/common-password list stays server-side; we surface only the
 * length rule here. `aria-live` announces the state change to screen readers.
 */
const PasswordRequirements = ({ name = 'password' }: PasswordRequirementsProps) => {
  const t = useTranslations('common');
  // next-intl's strict key union doesn't surface this freshly-added common key at compile
  // time (TS widens the large common.json literal type), though it exists in every locale's
  // common.json. Call it through a loose signature — runtime-safe, key is always present.
  const tMin = t as unknown as (key: string, values?: Record<string, number>) => string;
  const value = (useWatch({ name }) as string | undefined) || '';
  const meetsLength = value.length >= MIN_PASSWORD_LENGTH;

  return (
    <Stack direction="row" alignItems="center" gap={0.75} sx={{ mt: -1.5 }} aria-live="polite">
      {meetsLength ? (
        <CheckCircleOutline sx={{ fontSize: 16, color: '#2e7d32' }} />
      ) : (
        <RadioButtonUnchecked sx={{ fontSize: 16, color: colors.black300 }} />
      )}
      <Typography variant="caption" color={meetsLength ? colors.black700 : colors.black500}>
        {tMin('validation.passwordMinLength', { count: MIN_PASSWORD_LENGTH })}
      </Typography>
    </Stack>
  );
};

export default PasswordRequirements;
