import { Box, Divider, Grid, Icon, Stack, Tooltip, Typography } from '@mui/material';
import cx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';

import CircularProgress from '@/components/CircularProgress';
import StatusChip from '@/components/StatusChip';
import Information from '@/components/SvgIcons/Information';
import YachtCard from '@/components/YachtCard';
import { bankDetails } from '@/config/bank-details.config';
import { PaymentMethod } from '@/config/paymentMethods.config';
import { PaymentPhase } from '@/models/reservation.model';
import { CHARTER_DESCRIPTION_LABEL_MAP, CHARTER_TYPE_LABEL_MAP } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { ReservationData } from '@/types/reservation.type';
import DateTime from '@/utils/static/DateTime';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';

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
    name,
    model,
    locationFrom,
    mainImage,
    pricePerDayEur,
    pricePerDayInfo,
    totalPriceEur,
    totalPriceInfo,
    charterType,
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
      {!showCard && (
        <YachtCard
          mainImageId={mainImage.id}
          model={model}
          name={name}
          locationCountryCode={locationFrom.countryCode}
          locationName={locationFrom.name}
        >
          <Stack mt={1} gap={1}>
            {charterType.map((type, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Stack direction="row" alignItems="center" key={index} gap={0.5}>
                <StatusChip label={t(CHARTER_TYPE_LABEL_MAP[type])} color="success" />
                <Tooltip
                  title={t(CHARTER_DESCRIPTION_LABEL_MAP[type])}
                  placement="right-end"
                  slotProps={{
                    transition: { timeout: 0 },
                  }}
                >
                  <Icon className={styles.icon}>
                    <Information size={20} />
                  </Icon>
                </Tooltip>
              </Stack>
            ))}
          </Stack>
        </YachtCard>
      )}
      {!showCard && (
        <Divider
          sx={{
            '&.MuiDivider-root': {
              marginBlock: 3,
            },
          }}
        />
      )}
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
    </Box>
  );
};

export default PriceBreakdownCard;
