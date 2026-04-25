import { Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import Money from '@/components/SvgIcons/Payment/Money';
import { SelectedExtra } from '@/models/reservation.model';
import { Currency } from '@/models/user.model';
import colors from '@/styles/themes/colors';
import { PriceInfo } from '@/types/price-info.type';
import { useDaysText } from '@/utils/hooks/usePluralization';
import { formatPrice } from '@/utils/static/formatNumber';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';

interface PaymentTabProps {
  selectedExtras: SelectedExtra[];
  totalPrice: number;
  totalPriceInfo: PriceInfo;
  clientPricePerDayEur: number;
  clientPricePerDayInfo: PriceInfo;
  numberOfDays: number;
  userCurrency: Currency;
}

const PaymentTab = ({
  selectedExtras,
  totalPrice,
  totalPriceInfo,
  clientPricePerDayEur,
  clientPricePerDayInfo,
  numberOfDays,
  userCurrency,
}: PaymentTabProps) => {
  const t = useTranslations('common');
  const daysText = useDaysText(numberOfDays);

  const isEur = userCurrency === Currency.EUR;
  const locale = useLocale();

  const computedPricePerDayEur = numberOfDays > 0 ? totalPrice / numberOfDays : clientPricePerDayEur;
  const computedPricePerDayInfo =
    numberOfDays > 0 ? { ...totalPriceInfo, amount: totalPriceInfo.amount / numberOfDays } : clientPricePerDayInfo;

  const formattedClientPricePerDay = formatPriceWithCurrency({
    clientPriceEur: computedPricePerDayEur,
    clientPriceInfo: computedPricePerDayInfo,
    locale,
  });

  // V1_57 split: items the partner expects bank-transferred to them BEFORE
  // embarkation (APA, Skipper, Hostess, Cook, equipment rental) vs cash/card
  // at the marina (fuel, transit log, mooring, tourist tax). Historically
  // both groups read as "Paid at marina" which mis-led customers about APA.
  // Fallback when paymentType is null: keep legacy "marina" bucket so
  // un-backfilled rows stay visible.
  const extrasInAdvance = selectedExtras.filter(extra => extra.payableInBase && extra.paymentType === 'ADVANCE_TO_OPERATOR');
  const extrasOnSite = selectedExtras.filter(extra => extra.payableInBase && extra.paymentType !== 'ADVANCE_TO_OPERATOR');
  const extrasPayNow = selectedExtras.filter(extra => !extra.payableInBase);

  return (
    <Stack component="section">
      <Stack direction="row" alignItems="center" gap={1}>
        <Money size={32} variant="secondary" />
        <Typography variant="h3" component="h2" fontWeight={700}>
          {t('reservationTabs.payment')}
        </Typography>
      </Stack>
      <Stack mt={3} bgcolor={colors.blue50} p={3} borderRadius={3}>
        <Typography variant="h3" fontWeight={700} color={colors.blue500}>
          {t('priceBreakdown')}
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="body1">{`${formattedClientPricePerDay} x ${numberOfDays} ${daysText}`}</Typography>
          <Typography variant="body1">
            {formatPriceWithCurrency({ clientPriceEur: totalPrice, clientPriceInfo: totalPriceInfo, locale })}
          </Typography>
        </Stack>
        <Stack gap={2} mt={2}>
          {extrasInAdvance.length > 0 && (
            <>
              <Typography variant="body1" fontWeight={700}>
                {t('paidInAdvance')}
              </Typography>
              {extrasInAdvance.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Stack key={`adv-${index}`} direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                  <Typography variant="body1">{item.name}</Typography>
                  <Typography variant="body1" whiteSpace="nowrap">
                    {formatPriceWithCurrency({
                      clientPriceEur: item.priceEur,
                      clientPriceInfo: item.priceInfo,
                      locale,
                    })}
                  </Typography>
                </Stack>
              ))}
            </>
          )}
          {extrasOnSite.length > 0 && (
            <>
              <Typography variant="body1" fontWeight={700}>
                {t('paidAtMarina')}
              </Typography>
              {extrasOnSite.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Stack key={`base-${index}`} direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                  <Typography variant="body1">{item.name}</Typography>
                  <Typography variant="body1" whiteSpace="nowrap">
                    {formatPriceWithCurrency({
                      clientPriceEur: item.priceEur,
                      clientPriceInfo: item.priceInfo,
                      locale,
                    })}
                  </Typography>
                </Stack>
              ))}
            </>
          )}
          {extrasPayNow.length > 0 && (
            <>
              <Typography variant="body1" fontWeight={700}>
                {t('paidNow')}
              </Typography>
              {extrasPayNow.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Stack key={`now-${index}`} direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                  <Typography variant="body1">{item.name}</Typography>
                  <Typography variant="body1" whiteSpace="nowrap">
                    {formatPriceWithCurrency({
                      clientPriceEur: item.priceEur,
                      clientPriceInfo: item.priceInfo,
                      locale,
                    })}
                  </Typography>
                </Stack>
              ))}
            </>
          )}
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={3} gap={2}>
          <Typography variant="h4">{t('total')}</Typography>
          <Typography variant="h4" color={colors.blue500} whiteSpace="nowrap">
            {formatPriceWithCurrency({ clientPriceEur: totalPrice, clientPriceInfo: totalPriceInfo, locale })}
            {!isEur && (
              <Typography variant="h4" component="span" ml={1.5}>
                ({formatPrice(totalPrice)} €)
              </Typography>
            )}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default PaymentTab;
