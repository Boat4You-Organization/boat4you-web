import { Box, Stack, Typography } from '@mui/material';
import cx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';

import { SelectedExtras } from '@/models/yacht-offer.model';
import { YachtServiceExtrasKey } from '@/models/yacht-service.model';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';

import styles from './PaymentPoliciesCard.module.scss';

interface PaymentPoliciesCardProps {
  selectedExtrasInPrice: SelectedExtras[];
  selectedExtrasAtBase: SelectedExtras[];
  /** Kept for signature compatibility with callers (e.g. OverviewStep), no
   *  longer used now that cancellation/policy copy lives elsewhere. */
  dateFrom: string;
  /** Refundable security deposit (from yacht / reservation). Always paid
   *  at the marina on handover — appended to the "Paid at marina" group
   *  when > 0 so the booking recap mirrors the yacht page extras tab. */
  securityDeposit?: number | null;
  compact?: boolean;
  isLastStep?: boolean;
}

// Keep the arg destructured so existing call sites don't need to change; the
// `dateFrom` prop is intentionally unused here now.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PaymentPoliciesCard = ({
  selectedExtrasInPrice,
  selectedExtrasAtBase,
  dateFrom: _dateFrom,
  securityDeposit,
  compact = false,
  isLastStep,
}: PaymentPoliciesCardProps) => {
  const t = useTranslations('common');
  const tServices = useTranslations('yacht.servicesList');
  const locale = useLocale();

  const hasPaidNow = (selectedExtrasInPrice?.length ?? 0) > 0;
  const showSecurityDeposit = (securityDeposit ?? 0) > 0;

  return (
    <Box className={cx(styles.container, { [styles.compact]: compact, [styles.lastStep]: isLastStep })}>
      {/* Generic payment-policies copy removed:
          - "100% booking prepayment" was WRONG after the phased payment rules
            (now users pay in 2 or 3 instalments).
          - "Cancel and reschedule for free" duplicated the CancellationCard.
          - "Best price on the market" duplicated the BookingHero banner.
          We keep only the Extras breakdown (Paid now / Paid in advance /
          Paid at marina). Sections collapse when empty. */}
      <Stack gap={3}>
        <Typography variant="h3" component="p" fontWeight={700}>
          {t('extras')}
        </Typography>
        {hasPaidNow && (
          <Stack gap={1}>
            <Typography variant="body1" fontWeight={700}>
              {t('paidNow')}
            </Typography>
            {selectedExtrasInPrice.map(({ id, name, priceEur, priceInfo, labelCode }) => {
              const formattedPrice = formatPriceWithCurrency({
                clientPriceEur: priceEur,
                clientPriceInfo: priceInfo,
                locale,
              });

              // Two-column layout — description wraps freely on the left,
              // price stays right-aligned on the first row, never wraps.
              // `flex: 1, minWidth: 0` lets the description take all
              // remaining width and wrap inside that column; `flexShrink: 0
              // + whiteSpace: nowrap` keeps "560 €" intact in its own slot.
              return (
                <Stack key={id} direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                  <Typography variant="body1" sx={{ flex: 1, minWidth: 0 }}>
                    {labelCode ? tServices(labelCode as YachtServiceExtrasKey) : name}
                  </Typography>
                  <Typography variant="body1" whiteSpace="nowrap" sx={{ flexShrink: 0 }}>
                    {formattedPrice}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        )}
        {(() => {
          // V1_57 split — same logic as PaymentTab.tsx. Items the partner
          // bank-collects in advance (Skipper/Hostess/APA) vs cash at the
          // marina (fuel/transit log/mooring/tourist tax). Security deposit
          // joins "Paid at marina" — see prop description.
          // Mario 12.7.2026: crew + APA settle at the base on handover — group
          // everything payable outside our online total under "Paid at marina".
          const inAdvance = (selectedExtrasAtBase || []).filter(() => false);
          const onSite = selectedExtrasAtBase || [];
          const renderRow = ({ id, name, priceEur, priceInfo, labelCode }: (typeof inAdvance)[number]) => {
            const formattedPrice = formatPriceWithCurrency({
              clientPriceEur: priceEur,
              clientPriceInfo: priceInfo,
              locale,
            });

            return (
              <Stack key={id} direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                <Typography variant="body1" sx={{ flex: 1, minWidth: 0 }}>
                  {labelCode ? tServices(labelCode as YachtServiceExtrasKey) : name}
                </Typography>
                <Typography variant="body1" whiteSpace="nowrap" sx={{ flexShrink: 0 }}>
                  {formattedPrice}
                </Typography>
              </Stack>
            );
          };

          return (
            <>
              {inAdvance.length > 0 && (
                <Stack gap={1}>
                  <Typography variant="body1" fontWeight={700}>
                    {t('paidInAdvance')}
                  </Typography>
                  {inAdvance.map(renderRow)}
                </Stack>
              )}
              {(onSite.length > 0 || showSecurityDeposit) && (
                <Stack gap={1}>
                  <Typography variant="body1" fontWeight={700}>
                    {t('paidAtMarina')}
                  </Typography>
                  {onSite.map(renderRow)}
                  {showSecurityDeposit && (
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                      <Typography variant="body1" sx={{ flex: 1, minWidth: 0 }}>
                        {tServices('refundable-security-deposit')}
                      </Typography>
                      <Typography variant="body1" whiteSpace="nowrap" sx={{ flexShrink: 0 }}>
                        {formatPriceWithCurrency({ clientPriceEur: securityDeposit as number, locale })}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              )}
            </>
          );
        })()}
      </Stack>
    </Box>
  );
};

export default PaymentPoliciesCard;
