import { useMemo } from 'react';

import { Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import HorizontalTimeline from '@/components/HorizontalTimeline/HorizontalTimeline';
import Cancellation from '@/components/SvgIcons/Cancellation';
import VerticalTimeline from '@/components/VerticalTimeline';
import useBreakpoint from '@/utils/hooks/useBreakpoint';
import { generateCancellationTimeline } from '@/utils/static/cancellationUtils';

interface CancellationTabProps {
  dateFrom: string;
  /** Booking moment (ISO): the 72-hour free window counts from it, not from today. */
  bookedAt?: string | null;
}

const CancellationTab = ({ dateFrom, bookedAt = null }: CancellationTabProps) => {
  const t = useTranslations('common');
  const locale = useLocale();
  const { isBelowLg } = useBreakpoint();

  const cancellationTimeline = useMemo(
    () => generateCancellationTimeline(dateFrom, t, locale, null, bookedAt),
    [dateFrom, t, locale, bookedAt]
  );

  return (
    <Stack component="section" gap={3}>
      <Stack direction="row" alignItems="center" gap={1}>
        <Cancellation size={32} variant="secondary" />
        <Typography variant="h3" component="h2" fontWeight={700}>
          {t('cancellationPolicy')}
        </Typography>
      </Stack>

      {isBelowLg ? (
        <VerticalTimeline items={cancellationTimeline} />
      ) : (
        <HorizontalTimeline items={cancellationTimeline} />
      )}
    </Stack>
  );
};

export default CancellationTab;
