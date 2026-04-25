import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import cx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';

import CircularProgress from '@/components/CircularProgress';
import TimelineCircleActive from '@/components/SvgIcons/TimelineCircleActive';
import TimelineCircleDefault from '@/components/SvgIcons/TimelineCircleDefault';
import { bankDetails } from '@/config/bank-details.config';
import { PaymentMethod } from '@/config/paymentMethods.config';
import { PaymentPhase } from '@/models/reservation.model';
import colors from '@/styles/themes/colors';
import { ReservationData } from '@/types/reservation.type';
import DateTime from '@/utils/static/DateTime';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { calculatePaymentPhases } from '@/utils/static/paymentPhases';

import styles from './PriceBreakdownCard.module.scss';

interface PriceBreakdownCardProps {
  reservationData: ReservationData;
  showCard?: boolean;
  isLastStep?: boolean;
  paymentPhases?: PaymentPhase[];
  isLoadingPhases?: boolean;
  selectedPaymentMethod?: PaymentMethod;
  reservationId?: number;
}

const PriceBreakdownCard = ({
  reservationData,
  showCard,
  isLastStep,
  paymentPhases = [],
  isLoadingPhases = false,
  selectedPaymentMethod,
  reservationId,
}: PriceBreakdownCardProps) => {
  const {
    pricePerDayEur,
    pricePerDayInfo,
    totalPriceEur,
    totalPriceInfo,
    dateFrom,
    dateTo,
  } = reservationData;
  const numberOfDays = DateTime.daysBetween(DateTime.date(dateFrom), DateTime.date(dateTo));
  const t = useTranslations();
  const locale = useLocale();

  const computedPricePerDayEur = numberOfDays > 0 ? totalPriceEur / numberOfDays : pricePerDayEur;
  const computedPricePerDayInfo =
    totalPriceInfo && numberOfDays > 0
      ? { ...totalPriceInfo, amount: totalPriceInfo.amount / numberOfDays }
      : pricePerDayInfo;

  const formattedPricePerDay = formatPriceWithCurrency({
    clientPriceEur: computedPricePerDayEur,
    clientPriceInfo: computedPricePerDayInfo ?? undefined,
    locale,
  });

  const formattedFullPrice = formatPriceWithCurrency({
    clientPriceEur: totalPriceEur,
    clientPriceInfo: totalPriceInfo ?? undefined,
    locale,
  });

  return (
    <Box className={cx(styles.container, { [styles.compact]: showCard, [styles.lastStep]: isLastStep })}>
      {/* Yacht identity card removed here — the BookingHero at the top of the
          page already shows the yacht image, model, location and charter type
          chip. Keeping it also here duplicated the same info in two places. */}
      {selectedPaymentMethod === PaymentMethod.BANK_TRANSFER && (
        <>
          <Box>
            <Typography variant="h3" component="h2" fontWeight={700} mb={3}>
              {t('common.paymentInformation')}
            </Typography>
            <Grid container spacing={2}>
              {bankDetails.map(({ title, value }) => (
                <Grid key={title} size={{ xs: 12, md: 6 }}>
                  <Typography variant="h4" component="p" color={colors.black950}>
                    {title}
                  </Typography>
                  <Typography variant="body1" mb={1}>
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            <Stack
              direction="row"
              alignItems="center"
              gap={1}
              mt={2}
              p={2}
              sx={{ backgroundColor: colors.mandalay50, borderRadius: 1.5 }}
            >
              <Typography variant="h4" component="p" fontWeight={700} color={colors.mandalay900}>
                {t('common.important')}:
              </Typography>
              <Typography variant="body2" color={colors.mandalay800}>
                {t('common.pleaseUseYourBooking')}{' '}
                <Typography component="span" variant="body1" fontWeight={800} color={colors.mandalay900}>
                  {reservationId?.toString() || ''}
                </Typography>{' '}
                {t('common.asPaymentReference')}
              </Typography>
            </Stack>
          </Box>
          <Divider
            sx={{
              '&.MuiDivider-root': {
                marginBlock: 3,
              },
            }}
          />
        </>
      )}
      {paymentPhases.length > 0 && (
        <>
          <Stack gap={2}>
            <Typography variant="h3" component="h3" fontWeight={700}>
              {t('common.paymentSchedule')}
            </Typography>
            {isLoadingPhases ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <Stack gap={2}>
                {paymentPhases.map((phase, index) => {
                  const phaseAmount = totalPriceInfo
                    ? (phase.amount / totalPriceEur) * totalPriceInfo.amount
                    : phase.amount;

                  const formattedAmount = formatPriceWithCurrency({
                    clientPriceEur: phase.amount,
                    clientPriceInfo: totalPriceInfo
                      ? { amount: phaseAmount, currency: totalPriceInfo.currency }
                      : undefined,
                    locale,
                  });

                  const formattedDeadline = DateTime.formatLong(DateTime.date(phase.deadline), locale);
                  const isFirst = index === 0;
                  const isLast = index === paymentPhases.length - 1;
                  // eslint-disable-next-line no-nested-ternary
                  const paymentLabel = isFirst
                    ? t('common.firstPayment')
                    : isLast
                      ? t('common.finalPayment')
                      : `${t('common.installment')} ${index + 1}`;

                  return (
                    <Stack
                      key={phase.id ?? index}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ py: 1 }}
                    >
                      <Stack>
                        <Typography variant="body1" fontWeight={600}>
                          {paymentLabel}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('common.dueBy')}: {formattedDeadline}
                        </Typography>
                      </Stack>
                      <Typography variant="body1" fontWeight={600}>
                        {formattedAmount}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            )}
          </Stack>
          <Divider
            sx={{
              '&.MuiDivider-root': {
                marginBlock: 3,
              },
            }}
          />
        </>
      )}
      <Stack gap={2}>
        <Typography variant="h3" component="h2" fontWeight={700} whiteSpace="wrap" className={styles.title}>
          {t('common.priceBreakdown')}
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body1">
            {' '}
            {formattedPricePerDay} x {numberOfDays} {numberOfDays <= 1 ? 'day' : 'days'}
          </Typography>
          <Typography variant="body1">{formattedFullPrice}</Typography>
        </Stack>
      </Stack>
      <Divider
        sx={{
          '&.MuiDivider-root': {
            marginBlock: 3,
          },
        }}
      />
      <Stack gap={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h2" component="p">
            {t('common.total')}
          </Typography>
          <Typography variant="h2" component="p">
            {formattedFullPrice}
          </Typography>
        </Stack>
      </Stack>

      {/* Payment schedule — timeline with dots + connector (same as cancellation),
          but each step shows the amount BOLD on top and the ordinal
          instalment label + due date in GREEN below. Matches the Boataround
          "5,031 € / 1st payment by 19 April 2026" pattern. */}
      {paymentPhases.length === 0 && dateFrom && totalPriceEur > 0 && (
        <>
          <Divider sx={{ '&.MuiDivider-root': { marginBlock: 3 } }} />
          <Typography variant="h3" component="h3" fontWeight={700} mb={3}>
            {t('common.paymentSchedule')}
          </Typography>
          <Stack>
            {calculatePaymentPhases(dateFrom, totalPriceEur).map((phase, index, arr) => {
              const isLast = index === arr.length - 1;
              const isActive = index === 0;
              // Unicode superscripts (ˢᵀ ᴺᴰ ᴿᴰ) — matches the "1st / 2nd / 3rd"
              // pattern without extra <sup> markup.
              const ordinals = ['1ˢᵀ', '2ᴺᴰ', '3ᴿᴰ'];
              const ordinal = ordinals[index] ?? `${index + 1}`;
              const amount = formatPriceWithCurrency({
                clientPriceEur: phase.amount,
                clientPriceInfo: totalPriceInfo
                  ? { amount: (phase.amount / totalPriceEur) * totalPriceInfo.amount, currency: totalPriceInfo.currency }
                  : undefined,
                locale,
              });
              const dateStr = DateTime.formatLongWithoutDay(phase.deadline, locale);

              return (
                <Stack
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  direction="row"
                  alignItems="flex-start"
                  sx={{ minHeight: isLast ? 'auto' : 64 }}
                >
                  <Stack alignItems="center" sx={{ mr: 2 }}>
                    {isActive ? <TimelineCircleActive /> : <TimelineCircleDefault />}
                    {!isLast && (
                      <Box
                        sx={{
                          width: 3,
                          flex: 1,
                          minHeight: 32,
                          background: `repeating-linear-gradient(to bottom, ${colors.black200} 0 6px, transparent 6px 12px)`,
                          my: 0.5,
                        }}
                      />
                    )}
                  </Stack>
                  <Stack sx={{ pb: isLast ? 0 : 2 }}>
                    <Typography variant="body1" fontWeight={700} color={colors.black950}>
                      {amount}
                    </Typography>
                    <Typography variant="body2" color="success.main" fontWeight={600}>
                      {ordinal} {t('common.installment')} {t('common.by')} {dateStr}
                    </Typography>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default PriceBreakdownCard;
