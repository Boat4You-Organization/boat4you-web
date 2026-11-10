'use client';

import { Box, Collapse, Divider, Radio, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import KlarnaBillingForm from '@/components/Payment/KlarnaBillingForm';
import { KlarnaBilling, KlarnaCountry } from '@/models/klarna.model';
import colors from '@/styles/themes/colors';

interface KlarnaPaymentOptionProps {
  selected: boolean;
  onSelect: () => void;
  /** The instalment before the Klarna surcharge (EUR). */
  amount: number;
  surchargePercent: number;
  /** Whole-euro surcharge (EUR). */
  fee: number;
  /** Amount charged with Klarna (EUR). */
  total: number;
  fmt: (eur: number) => string;
  billing: KlarnaBilling;
  onBillingChange: (next: KlarnaBilling) => void;
  /** Countries whose Klarna limit covers `total`. */
  countries: readonly KlarnaCountry[];
}

/**
 * Third option of the booking payment step and of the /my-bookings "Pay now" modal, laid out like the card option
 * (radio card with amount, surcharge and total). Picking it opens the billing address Klarna needs. The plain text
 * wordmark "Klarna" — no third-party logo asset.
 */
const KlarnaPaymentOption = ({
  selected,
  onSelect,
  amount,
  surchargePercent,
  fee,
  total,
  fmt,
  billing,
  onBillingChange,
  countries,
}: KlarnaPaymentOptionProps) => {
  const t = useTranslations('common');

  return (
    <Box
      sx={{
        border: selected ? `2px solid ${colors.blue500}` : `1px solid ${colors.black200}`,
        borderRadius: 1.5,
        transition: 'border-color 0.15s',
        overflow: 'hidden',
      }}
    >
      <Box onClick={onSelect} sx={{ p: 2, cursor: 'pointer' }}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Radio
            checked={selected}
            onChange={onSelect}
            sx={{ p: 0 }}
            slotProps={{ input: { 'aria-label': t('klarna.name') } }}
          />
          <Typography variant="body1" fontWeight={700}>
            {t('klarna.name')}
          </Typography>
        </Stack>
        <Stack gap={0.25} ml={5} mt={0.75}>
          <Typography variant="body2" color={colors.black600} mb={0.5}>
            {t('klarna.description')}
          </Typography>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color={colors.black600}>
              {t('amount')}
            </Typography>
            <Typography variant="body2" color={colors.black700}>
              {fmt(amount)}
            </Typography>
          </Stack>
          {surchargePercent > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color={colors.black600}>
                {t('klarna.fee', { percent: surchargePercent.toFixed(0) })}
              </Typography>
              <Typography variant="body2" color={colors.black700}>
                +{fmt(fee)}
              </Typography>
            </Stack>
          )}
          <Divider sx={{ my: 0.5 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" fontWeight={700}>
              {t('totalToPay')}
            </Typography>
            <Typography variant="body2" fontWeight={700} color={colors.blue500}>
              {fmt(total)}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Collapse in={selected} unmountOnExit>
        <Divider />
        <Box sx={{ px: { xs: 2, sm: 2.5 }, py: 2 }}>
          <KlarnaBillingForm
            value={billing}
            onChange={onBillingChange}
            countries={countries}
            note={countryList => t('klarna.countriesNote', { countries: countryList })}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default KlarnaPaymentOption;
