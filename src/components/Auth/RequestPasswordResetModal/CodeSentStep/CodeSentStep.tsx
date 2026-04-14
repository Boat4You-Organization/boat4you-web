import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import ResetPasswordVector from '@/components/SvgIcons/Vector/ResetPasswordVector';

const strong = (chunks: React.ReactNode) => (
  <Typography variant="body1" component="span" fontWeight={700}>
    {chunks}
  </Typography>
);

const CodeSentStep = ({ email }: { email: string }) => {
  const t = useTranslations('common');

  return (
    <Stack alignItems="center" gap={2}>
      <ResetPasswordVector />
      <Typography variant="body1" maxWidth={214}>
        {t.rich('aCodeHasBeenSentToYourEmail', {
          strong,
          email,
        })}
      </Typography>
    </Stack>
  );
};

export default CodeSentStep;
