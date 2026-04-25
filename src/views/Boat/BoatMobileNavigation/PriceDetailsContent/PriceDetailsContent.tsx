import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Divider, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import { BoatCalendarFormValues } from '@/config/form-models.config';
import { CURRENCY_SYMBOL_MAP, Currency } from '@/models/user.model';
import { YachtServiceExtrasKey } from '@/models/yacht-service.model';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import DateTime from '@/utils/static/DateTime';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { useYachtStore } from '@/valtio/yacht/yacht.store';

interface PriceDetailsContentProps {
  yacht: YachtModel;
  isCalculatedPrice: boolean | null;
  isSelectedOfferUnavailable: boolean;
}

const PriceDetailsContent = ({ yacht, isCalculatedPrice, isSelectedOfferUnavailable }: PriceDetailsContentProps) => {
  const { calculatedPrice } = useYachtStore();
  const { watch } = useFormContext<BoatCalendarFormValues>();
  const t = useTranslations('yacht');
  const tCommon = useTranslations('common');
  const tServices = useTranslations('yacht.servicesList');
  const locale = useLocale();

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const {
    selectedExtrasInPrice,
    selectedExtrasAtBase,
    totalPriceEur,
    totalPriceInfo,
    clientPriceInfo,
    clientPricePerDayEur,
    clientPricePerDayInfo,
    dateFrom,
    dateTo,
  } = calculatedPrice ?? {};

  const numberOfDays = dateFrom && dateTo ? DateTime.daysBetween(DateTime.date(dateFrom), DateTime.date(dateTo)) : 0;

  const formattedClientPricePerDay = formatPriceWithCurrency({
    clientPriceEur: clientPricePerDayEur,
    clientPriceInfo: clientPricePerDayInfo,
    locale,
  });

  const formattedTotalPrice = formatPriceWithCurrency({
    clientPriceEur: totalPriceEur,
    clientPriceInfo,
    locale,
  });

  const formattedFullPrice = formatPriceWithCurrency({
    clientPriceEur: totalPriceEur,
    clientPriceInfo: totalPriceInfo,
    locale,
  });

  if (!isCalculatedPrice || isSelectedOfferUnavailable) {
    return <Typography variant="body1">{tCommon('noPricesDetailsAvailable')}</Typography>;
  }

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body1" fontWeight={700}>
          {t('totalDueNow')}
        </Typography>
        <Typography variant="body1" fontWeight={700} color={colors.blue500}>
          {formattedFullPrice}
        </Typography>
      </Stack>
      <Divider
        sx={{
          '&.MuiDivider-root': {
            marginBlock: 3,
            borderColor: colors.black200,
          },
        }}
      />
      <Stack direction="column" spacing={3}>
        {calculatedPrice && (
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">
              {formattedClientPricePerDay} x {numberOfDays} {numberOfDays <= 1 ? 'day' : 'days'}
            </Typography>
            <Typography variant="body1">
              {startDate && endDate ? `${formattedTotalPrice}` : `0 ${CURRENCY_SYMBOL_MAP[Currency.EUR]}`}
            </Typography>
          </Stack>
        )}
        {(selectedExtrasInPrice?.length ?? 0) > 0 && (
          <>
            <Typography variant="body1" fontWeight={700} color={colors.blue500}>
              {tCommon('paidNow')}
            </Typography>
            {selectedExtrasInPrice?.map(({ id, name, priceEur, priceInfo, labelCode }) => {
              const formattedPrice = formatPriceWithCurrency({
                clientPriceEur: priceEur,
                clientPriceInfo: priceInfo,
                locale,
              });

              return (
                <Stack key={`${name}-${id}`} direction="row" justifyContent="space-between">
                  <Typography display="flex" flexDirection="row" gap="4px" variant="body1">
                    {labelCode ? tServices(labelCode as YachtServiceExtrasKey) : name}
                  </Typography>
                  <Typography variant="body1">{formattedPrice}</Typography>
                </Stack>
              );
            })}
          </>
        )}
        {(() => {
          // V1_57 split — see PaymentTab.tsx for context
          const inAdvance = (selectedExtrasAtBase || []).filter(e => e.paymentType === 'ADVANCE_TO_OPERATOR');
          const onSite = (selectedExtrasAtBase || []).filter(e => e.paymentType !== 'ADVANCE_TO_OPERATOR');
          // Refundable security deposit is yacht-level (not a partner extra)
          // and always paid at the marina on handover — append it under the
          // "Paid at marina" group so the recap lines up with the extras tab.
          const showSecurityDeposit = yacht.securityDeposit > 0;
          const renderRow = ({ id, name, priceEur, priceInfo, labelCode }: typeof inAdvance[number]) => {
            const formattedPrice = formatPriceWithCurrency({
              clientPriceEur: priceEur,
              clientPriceInfo: priceInfo,
              locale,
            });
            return (
              <Stack key={`${name}-${id}`} direction="row" justifyContent="space-between" gap={4}>
                <Typography display="flex" flexDirection="row" variant="body1">
                  {labelCode ? tServices(labelCode as YachtServiceExtrasKey) : name}
                </Typography>
                <Typography variant="body1" whiteSpace="nowrap">
                  {formattedPrice}
                </Typography>
              </Stack>
            );
          };
          return (
            <>
              {inAdvance.length > 0 && (
                <>
                  <Typography variant="body1" fontWeight={700} color={colors.blue500}>
                    {tCommon('paidInAdvance')}
                  </Typography>
                  {inAdvance.map(renderRow)}
                </>
              )}
              {(onSite.length > 0 || showSecurityDeposit) && (
                <>
                  <Typography variant="body1" fontWeight={700} color={colors.blue500}>
                    {tCommon('paidAtMarina')}
                  </Typography>
                  {onSite.map(renderRow)}
                  {showSecurityDeposit && (
                    <Stack direction="row" justifyContent="space-between" gap={4}>
                      <Typography display="flex" flexDirection="row" variant="body1">
                        {tServices('refundable-security-deposit')}
                      </Typography>
                      <Typography variant="body1" whiteSpace="nowrap">
                        {formatPriceWithCurrency({ clientPriceEur: yacht.securityDeposit, locale })}
                      </Typography>
                    </Stack>
                  )}
                </>
              )}
            </>
          );
        })()}
      </Stack>
    </Stack>
  );
};

export default PriceDetailsContent;
