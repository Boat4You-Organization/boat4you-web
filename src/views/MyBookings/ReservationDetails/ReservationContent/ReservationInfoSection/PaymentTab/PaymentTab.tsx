/* eslint-disable react/no-array-index-key */
import { Box, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import Extras from '@/components/SvgIcons/Extras';
import Money from '@/components/SvgIcons/Payment/Money';
import { SelectedExtra } from '@/models/reservation.model';
import { Currency } from '@/models/user.model';
import { UNIT_LABEL_MAP, Unit, YachtServiceModel } from '@/models/yacht-service.model';
import colors from '@/styles/themes/colors';
import { PriceInfo } from '@/types/price-info.type';
import { useDaysText } from '@/utils/hooks/usePluralization';
import DateTime from '@/utils/static/DateTime';
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
  services?: YachtServiceModel[];
  obligatoryExtrasKeys?: string[];
  securityDeposit?: number;
  insuredSecurityDeposit?: number;
  depositCurrency?: string;
  dateFrom: string;
}

const PaymentTab = ({
  selectedExtras,
  totalPrice,
  totalPriceInfo,
  clientPricePerDayEur,
  clientPricePerDayInfo,
  numberOfDays,
  userCurrency,
  services,
  obligatoryExtrasKeys,
  securityDeposit,
  insuredSecurityDeposit,
  depositCurrency,
  dateFrom,
}: PaymentTabProps) => {
  const t = useTranslations('common');
  const tYacht = useTranslations('yacht');
  const tServices = useTranslations('yacht.servicesList');
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
  // Mario 12.7.2026: crew (skipper/hostess) and APA are settled at the base
  // on handover — no separate "paid in advance" section. Everything payable
  // outside our online total (payableInBase) shows under "Paid at marina".
  const extrasInAdvance = selectedExtras.filter(() => false);
  const extrasOnSite = selectedExtras.filter(extra => extra.payableInBase);
  const extrasPayNow = selectedExtras.filter(extra => !extra.payableInBase);

  // Mirror boat-detail page ExtrasTab: split yacht catalogue services into
  // obligatory + optional and render read-only cards below the Payment box.
  // Same source as the public boat page so my-bookings shows identical info.
  const obligatoryKeys = obligatoryExtrasKeys ?? [];
  const allServices = services ?? [];
  const obligatoryServices = allServices.filter(s => s.obligatory || obligatoryKeys.includes(s.key));
  const optionalServices = allServices.filter(s => !s.obligatory && !obligatoryKeys.includes(s.key));
  const hasDeposit = typeof securityDeposit === 'number' && securityDeposit > 0;
  const hasInsurance = typeof insuredSecurityDeposit === 'number' && insuredSecurityDeposit > 0;
  const showExtras = obligatoryServices.length > 0 || optionalServices.length > 0 || hasDeposit || hasInsurance;
  const depositCurrencySymbol = depositCurrency === 'EUR' ? '€' : (depositCurrency ?? '€');

  // Deadline = 14 days before charter start. Above this date the agency
  // typically cannot add new optional extras (catering, water toys, skipper)
  // because supply chain is locked. Mario rule (3.5.2026): customer mora
  // znati pravu deadline za dodatne usluge, ne pretpostavljati.
  const additionalServicesDeadlineDate = DateTime.date(dateFrom).subtract(14, 'day');
  const additionalServicesDeadline = DateTime.formatLongWithoutDay(additionalServicesDeadlineDate, locale);
  // Hide "until {date}" suffix once the deadline is in the past — the
  // optional-extras list still renders so the customer can see what was
  // available, but a stale past date in user-facing copy looks broken.
  const isAdditionalServicesDeadlinePast = additionalServicesDeadlineDate.isBefore(DateTime.now(), 'day');

  const renderServiceRow = (extra: YachtServiceModel) => (
    <Box
      key={extra.id ?? extra.key}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: { xs: 1.25, sm: 1.5 },
        px: 2,
        py: 1.5,
        borderRadius: 1.5,
        backgroundColor: 'transparent',
        borderBottom: `1px solid ${colors.black200}`,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          component="h3"
          variant="body1"
          fontWeight={700}
          color={colors.black950}
          sx={{ wordBreak: 'break-word' }}
        >
          {extra.name}
        </Typography>
        {extra.description && (
          <Typography variant="body2" color={colors.black500} sx={{ fontSize: 12, mt: 0.25, whiteSpace: 'pre-line' }}>
            {extra.description}
          </Typography>
        )}
      </Box>
      <Stack
        direction="column"
        alignItems="flex-end"
        sx={{ flexShrink: 0, textAlign: 'right', minWidth: { xs: 64, sm: 80 } }}
      >
        <Typography
          color={colors.black950}
          component="p"
          variant="body1"
          fontWeight={700}
          sx={{ whiteSpace: 'nowrap' }}
        >
          {formatPriceWithCurrency({
            clientPriceEur: extra.priceEur,
            clientPriceInfo: extra.priceInfo,
            locale,
          })}
        </Typography>
        <Typography variant="body2" color={colors.black500} sx={{ fontSize: 12, mt: 0.25 }}>
          {t(UNIT_LABEL_MAP[extra.unit ?? Unit.UNKNOWN])}
        </Typography>
      </Stack>
    </Box>
  );

  const renderVirtualRow = (key: string, label: string, sublabel: string, priceLabel: string, periodLabel: string) => (
    <Box
      key={key}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: { xs: 1.25, sm: 1.5 },
        px: 2,
        py: 1.5,
        borderRadius: 1.5,
        backgroundColor: 'transparent',
        borderBottom: `1px solid ${colors.black200}`,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography component="h3" variant="body1" fontWeight={700} color={colors.black950}>
          {label}
        </Typography>
        <Typography variant="body2" color={colors.black500} sx={{ fontSize: 12, mt: 0.25 }}>
          {sublabel}
        </Typography>
      </Box>
      <Stack
        direction="column"
        alignItems="flex-end"
        sx={{ flexShrink: 0, textAlign: 'right', minWidth: { xs: 64, sm: 80 } }}
      >
        <Typography
          color={colors.black950}
          component="p"
          variant="body1"
          fontWeight={700}
          sx={{ whiteSpace: 'nowrap' }}
        >
          {priceLabel}
        </Typography>
        <Typography variant="body2" color={colors.black500} sx={{ fontSize: 12, mt: 0.25 }}>
          {periodLabel}
        </Typography>
      </Stack>
    </Box>
  );

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
                <Stack
                  key={`adv-${index}`}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  gap={2}
                >
                  <Typography variant="body1" sx={{ flex: 1, minWidth: 0 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body1" whiteSpace="nowrap" sx={{ flexShrink: 0 }}>
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
                <Stack
                  key={`base-${index}`}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  gap={2}
                >
                  <Typography variant="body1" sx={{ flex: 1, minWidth: 0 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body1" whiteSpace="nowrap" sx={{ flexShrink: 0 }}>
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
                <Stack
                  key={`now-${index}`}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  gap={2}
                >
                  <Typography variant="body1" sx={{ flex: 1, minWidth: 0 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body1" whiteSpace="nowrap" sx={{ flexShrink: 0 }}>
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
      {showExtras && (
        <Stack mt={5} component="section">
          <Stack direction="row" alignItems="center" gap={1}>
            <Extras size={32} variant="secondary" />
            <Typography component="h2" variant="h3" fontWeight={700}>
              {tYacht('extrasTitle')}
            </Typography>
          </Stack>
          <Stack spacing={0} pt={3}>
            {(obligatoryServices.length > 0 || hasDeposit || hasInsurance) && (
              <Typography
                variant="body2"
                fontWeight={700}
                color={colors.black700}
                sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 12, mb: 1 }}
              >
                {tYacht('selectedServices')}
              </Typography>
            )}
            {(obligatoryServices.length > 0 || hasDeposit || hasInsurance) && (
              <Box
                sx={{
                  backgroundColor: colors.yellow50,
                  borderRadius: 1.5,
                  border: `1px solid ${colors.yellow500}1a`,
                  px: 0.5,
                  py: 0.25,
                  '& > *:last-child': { borderBottom: 'none' },
                }}
              >
                {obligatoryServices.map(renderServiceRow)}
                {hasDeposit &&
                  renderVirtualRow(
                    'security-deposit',
                    tServices('refundable-security-deposit'),
                    t('refundableSecurityDepositDescription'),
                    `${(securityDeposit as number).toLocaleString(locale)} ${depositCurrencySymbol}`,
                    t('extrasUnits.perBooking')
                  )}
                {hasInsurance &&
                  renderVirtualRow(
                    'deposit-insurance',
                    tServices('deposit-insurance'),
                    '',
                    `${(insuredSecurityDeposit as number).toLocaleString(locale)} ${depositCurrencySymbol}`,
                    t('extrasUnits.perBooking')
                  )}
              </Box>
            )}
            {optionalServices.length > 0 && (
              <Typography variant="body2" color={colors.black700} sx={{ fontSize: 12, mt: 3, mb: 1, lineHeight: 1.5 }}>
                <Box component="span" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
                  {tYacht('optionalServices')}
                </Box>
                {!isAdditionalServicesDeadlinePast && (
                  <Box component="span" sx={{ textTransform: 'none', fontWeight: 400, color: colors.black500 }}>
                    {' / '}
                    {t('contactUsForAdditionalServices', { date: additionalServicesDeadline })}
                  </Box>
                )}
              </Typography>
            )}
            {optionalServices.map(renderServiceRow)}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default PaymentTab;
