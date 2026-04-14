import { Box, Divider, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import Select from '@/components/Select';
import {
  PAYMENT_INSTALLMENT_LABEL_MAP,
  PaymentInstallment,
  paymentInstallmentsList,
} from '@/config/paymentMethods.config';
import colors from '@/styles/themes/colors';
import DateTime from '@/utils/static/DateTime';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';

interface CreditCardProps {
  selectedInstallment: string;
  handleInstallmentChange: (event: SelectChangeEvent) => void;
  dateFrom: string;
  /**
   * Optional: the base amount (in EUR) the user is about to pay. When provided
   * together with `surchargePercentage > 0`, a small breakdown is rendered
   * (Base + Surcharge = Total) so the user sees the real charged amount
   * before getting redirected to the payment provider.
   */
  baseAmountEur?: number;
  /** Percentage as a number, e.g. 5 for 5%. Default 0 → no surcharge shown. */
  surchargePercentage?: number;
}

const CreditCard = ({
  selectedInstallment,
  handleInstallmentChange,
  dateFrom,
  baseAmountEur,
  surchargePercentage = 0,
}: CreditCardProps) => {
  const t = useTranslations('common');
  const locale = useLocale();

  const isInstallmentAllowed = DateTime.isInstallmentPaymentAllowed(dateFrom);
  const availableInstallments = isInstallmentAllowed
    ? paymentInstallmentsList
    : paymentInstallmentsList.filter(item => item.id !== PaymentInstallment.INSTALLMENTS);

  const showSurcharge = typeof baseAmountEur === 'number' && baseAmountEur > 0 && surchargePercentage > 0;
  const surchargeAmountEur = showSurcharge ? (baseAmountEur! * surchargePercentage) / 100 : 0;
  const totalAmountEur = showSurcharge ? baseAmountEur! + surchargeAmountEur : baseAmountEur;

  return (
    <>
      <Divider
        sx={{
          '&.MuiDivider-root': {
            marginBlock: 4,
          },
        }}
      />
      <Typography variant="h2" component="h2" mb={3}>
        {t('paymentDetails')}
      </Typography>
      <Select
        value={selectedInstallment}
        options={availableInstallments.map(item => ({
          id: item.id,
          label: t(PAYMENT_INSTALLMENT_LABEL_MAP[item.id]),
        }))}
        onChange={handleInstallmentChange}
        label={t('paymentOption')}
        placeholder={t('selectPaymentType')}
      />
      {showSurcharge && (
        <Box
          mt={3}
          p={2}
          sx={{
            borderRadius: 2,
            backgroundColor: colors.blue50,
            border: `1px solid ${colors.blue100}`,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="baseline">
            <Typography variant="body2" color={colors.black600}>
              {t('baseAmount')}
            </Typography>
            <Typography variant="body2">
              {formatPriceWithCurrency({ clientPriceEur: baseAmountEur!, locale })}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" mt={0.5}>
            <Typography variant="body2" color={colors.black600}>
              {t('cardSurcharge', { percentage: String(surchargePercentage) })}
            </Typography>
            <Typography variant="body2">
              +{formatPriceWithCurrency({ clientPriceEur: surchargeAmountEur, locale })}
            </Typography>
          </Stack>
          <Divider sx={{ my: 1, borderColor: colors.blue200 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="baseline">
            <Typography variant="body1" fontWeight={700}>
              {t('totalToPay')}
            </Typography>
            <Typography variant="body1" fontWeight={700} color={colors.blue500}>
              {formatPriceWithCurrency({ clientPriceEur: totalAmountEur!, locale })}
            </Typography>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default CreditCard;
