import React from 'react';

import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import Currency from '@/components/SvgIcons/Currency';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';

interface PriceDetailsTabProps {
  yacht: YachtModel;
}

// Custom-yacht only — renders the season-specific pricing notes the admin
// types into the priceDescription field. Sits in its own tab between
// Amenities and Good to know so users can jump straight to it from the tab
// bar (Boataround pattern). Header mirrors AmenitiesTab/GoodToKnowTab —
// h2 + secondary-variant icon + label so the section stays visually
// consistent with its tab-bar neighbours.
const PriceDetailsTab = ({ yacht }: PriceDetailsTabProps) => {
  const t = useTranslations('yacht');
  const priceDescription = yacht.customDetails?.priceDescription;

  if (!priceDescription) return null;

  return (
    <Stack direction="column" spacing={3}>
      <Typography
        component="h2"
        variant="h3"
        fontWeight={700}
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap={1}
      >
        <Currency variant="secondary" size={32} />
        {t('priceDetails')}
      </Typography>
      <Typography variant="body1" color={colors.black500} whiteSpace="pre-line">
        {priceDescription}
      </Typography>
    </Stack>
  );
};

export default PriceDetailsTab;
