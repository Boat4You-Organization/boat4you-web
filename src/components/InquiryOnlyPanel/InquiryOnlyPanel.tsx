'use client';

import { Button, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import colors from '@/styles/themes/colors';
import { toggleBoatInquiryModalOpen } from '@/valtio/yacht/yacht.actions';

interface InquiryOnlyPanelProps {
  /** `sidebar` — the booking box beside the content; `inline` — the
   *  availability section, where the calendar would be. */
  variant?: 'sidebar' | 'inline';
}

/**
 * What an inquiry-only boat (isInquiryOnlyBoat) shows in place of the price,
 * the availability calendar and the Reserve button: "Price on request", why,
 * and the inquiry form — where the visitor picks any dates.
 */
const InquiryOnlyPanel = ({ variant = 'sidebar' }: InquiryOnlyPanelProps) => {
  const t = useTranslations('yacht');
  const tCommon = useTranslations('common');

  return (
    <Stack spacing={2} alignItems={variant === 'inline' ? { xs: 'stretch', sm: 'flex-start' } : 'stretch'}>
      <Typography component="p" variant={variant === 'sidebar' ? 'h2' : 'h3'} fontWeight={700} color={colors.green500}>
        {tCommon('priceOnRequest')}
      </Typography>
      <Typography variant="body1" color={colors.black500}>
        {t('inquiryOnlyText')}
      </Typography>
      <Button size="large" fullWidth={variant === 'sidebar'} onClick={() => toggleBoatInquiryModalOpen(true)}>
        {tCommon('sendInquiry')}
      </Button>
    </Stack>
  );
};

export default InquiryOnlyPanel;
