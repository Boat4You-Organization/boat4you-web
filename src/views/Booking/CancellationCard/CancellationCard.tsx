import { useMemo } from 'react';

import { Box, Typography } from '@mui/material';
import cx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';

import VerticalTimeline from '@/components/VerticalTimeline';
import { generateCancellationTimeline } from '@/utils/static/cancellationUtils';

import styles from './CancellationCard.module.scss';

interface CancellationCardProps {
  compact?: boolean;
  isLastStep?: boolean;
  dateFrom: string;
}

const CancellationCard = ({ compact, isLastStep, dateFrom }: CancellationCardProps) => {
  const t = useTranslations('common');
  const locale = useLocale();

  const cancellationTimeline = useMemo(() => generateCancellationTimeline(dateFrom, t, locale), [dateFrom, t, locale]);

  return (
    <Box className={cx(styles.container, { [styles.compact]: compact, [styles.lastStep]: isLastStep })}>
      <Typography variant="h3" component="h2" fontWeight={700} mb={3}>
        {t('howMuchWillItCostToCancel')}
      </Typography>
      <VerticalTimeline items={cancellationTimeline} />
    </Box>
  );
};

export default CancellationCard;
