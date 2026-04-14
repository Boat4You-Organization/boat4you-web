import { Box, Divider, Stack, Typography } from '@mui/material';
import cx from 'clsx';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';

import { SelectedExtras } from '@/models/yacht-offer.model';
import { YachtServiceExtrasKey } from '@/models/yacht-service.model';
import DateTime from '@/utils/static/DateTime';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';

import styles from './PaymentPoliciesCard.module.scss';

interface PaymentPoliciesCardProps {
  selectedExtrasInPrice: SelectedExtras[];
  selectedExtrasAtBase: SelectedExtras[];
  dateFrom: string;
  compact?: boolean;
  isLastStep?: boolean;
}

const PaymentPoliciesCard = ({
  selectedExtrasInPrice,
  selectedExtrasAtBase,
  dateFrom,
  compact = false,
  isLastStep,
}: PaymentPoliciesCardProps) => {
  const t = useTranslations('common');
  const tServices = useTranslations('yacht.servicesList');
  const locale = useLocale();

  const today = dayjs();
  const reservationStartDate = dayjs(dateFrom);
  const daysUntilReservation = DateTime.daysBetween(today, reservationStartDate);
  const showFreeCancellation = daysUntilReservation >= 45;
  const fiveDaysFromToday = today.add(5, 'day');

  return (
    <Box className={cx(styles.container, { [styles.compact]: compact, [styles.lastStep]: isLastStep })}>
      <Stack gap={2}>
        <Typography variant="h3" component="h2" fontWeight={700}>
          {t('paymentPolicies')}
        </Typography>
        <Typography variant="body1">{t('100PercentBookingPrepayment')}</Typography>
        {showFreeCancellation && (
          <Typography variant="body1" fontWeight={700} color="success">
            {t('cancelAndRescheduleForFreeBefore', { date: DateTime.formatLongWithoutDay(fiveDaysFromToday, locale) })}
          </Typography>
        )}
        <Typography variant="body1">{t('bestPriceOnTheMarket')}</Typography>
      </Stack>
      <Divider
        sx={{
          '&.MuiDivider-root': {
            marginBlock: 3,
          },
        }}
      />
      <Stack gap={3}>
        <Typography variant="h3" component="p" fontWeight={700}>
          {t('extras')}
        </Typography>
        <Stack gap={1}>
          <Typography variant="body1" fontWeight={700}>
            {t('paidNow')}
          </Typography>
          {selectedExtrasInPrice?.map(({ id, name, priceEur, priceInfo, labelCode }) => {
            const formattedPrice = formatPriceWithCurrency({
              clientPriceEur: priceEur,
              clientPriceInfo: priceInfo,
              locale,
            });

            return (
              <Stack key={id} direction="row" justifyContent="space-between" alignItems="center">
                {labelCode ? tServices(labelCode as YachtServiceExtrasKey) : name}
                <Typography variant="body1">{formattedPrice}</Typography>
              </Stack>
            );
          })}
        </Stack>
        <Stack gap={1}>
          <Typography variant="body1" fontWeight={700}>
            {t('paidAtMarina')}
          </Typography>
          {selectedExtrasAtBase?.map(({ id, name, priceEur, priceInfo, labelCode }) => {
            const formattedPrice = formatPriceWithCurrency({
              clientPriceEur: priceEur,
              clientPriceInfo: priceInfo,
              locale,
            });

            return (
              <Stack key={id} direction="row" justifyContent="space-between" alignItems="center">
                {labelCode ? tServices(labelCode as YachtServiceExtrasKey) : name}
                <Typography variant="body1">{formattedPrice}</Typography>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
};

export default PaymentPoliciesCard;
