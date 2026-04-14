import { memo } from 'react';

import { Chip, Skeleton, Stack, Typography } from '@mui/material';
import cx from 'clsx';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';

import StatusChip from '@/components/StatusChip';
import colors from '@/styles/themes/colors';
import { PriceInfo } from '@/types/price-info.type';
import DateTime from '@/utils/static/DateTime';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { Period } from '@/utils/static/standardOffers.utils';

import styles from './PeriodChip.module.scss';

interface PeriodChipProps {
  period: Period;
  isLoading: boolean;
  isAvailable: boolean;
  isOption: boolean;
  isActive: boolean;
  totalPriceEur?: number;
  clientPriceInfo?: PriceInfo;
  onClick: () => void;
}

const PeriodChip = memo(
  ({
    period,
    isLoading,
    isAvailable,
    isOption,
    isActive,
    totalPriceEur,
    clientPriceInfo,
    onClick,
  }: PeriodChipProps) => {
    const t = useTranslations('yacht');
    const locale = useLocale();

    const formattedPrice = formatPriceWithCurrency({ clientPriceEur: totalPriceEur, clientPriceInfo, locale });

    const getStatusLabel = () => {
      if (isAvailable) return formattedPrice;

      if (isOption) return formattedPrice;

      return t('reserved');
    };

    const getStatusColor = (): 'success' | 'warning' | 'error' => {
      if (isAvailable || isOption) return 'success';

      return 'error';
    };

    return (
      <Chip
        component="div"
        variant="outlined"
        onClick={onClick}
        classes={{ root: styles.root }}
        className={cx(styles.container, {
          [styles.reserved]: !isAvailable && !isOption,
          [styles.active]: isActive,
        })}
        sx={{
          width: '100% !important',
          maxWidth: '100% !important',
        }}
        label={
          <Stack spacing={1} alignItems="center">
            <Typography variant="body2" color={colors.black500} textAlign="center">
              {`${DateTime.formatShortWithoutDay(dayjs(period.dateFrom))} - ${DateTime.formatShortWithoutDay(dayjs(period.dateTo))}`}
            </Typography>

            {isLoading ? (
              <Stack direction="row" alignItems="center" gap={1}>
                {isOption && <Skeleton variant="rounded" width={126} height={22} sx={{ borderRadius: 5 }} />}
                <Skeleton variant="rounded" width={86} height={29} sx={{ borderRadius: 5 }} />
              </Stack>
            ) : (
              <Stack direction="row" alignItems="center" gap={1}>
                {isOption && <StatusChip color="warning" sx={{ borderRadius: 5 }} label={t('preReserved')} />}
                <StatusChip color={getStatusColor()} sx={{ borderRadius: 5 }} label={getStatusLabel()} />
              </Stack>
            )}
          </Stack>
        }
      />
    );
  }
);

export default PeriodChip;
