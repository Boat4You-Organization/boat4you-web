import React from 'react';

import { Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import Bulp from '@/components/SvgIcons/Bulp';
import { YachtModel } from '@/models/yacht.model';
import GoodToKnowItem from '@/views/Boat/BoatContentSection/GoodToKnowItem';

interface GoodToKnowTabProps {
  yacht: YachtModel;
}

const GoodToKnowTab = ({ yacht }: GoodToKnowTabProps) => {
  const t = useTranslations('yacht');
  const tCommon = useTranslations('common');

  return (
    <Stack direction="column" spacing={4}>
      <Typography
        component="h2"
        variant="h3"
        fontWeight={700}
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap={1}
      >
        <Bulp variant="secondary" size={32} />
        {t('goodToKnow')}
      </Typography>

      <Grid container spacing={4}>
        <GoodToKnowItem title={tCommon('pickUpTime')} value={yacht.defaultCheckin || '-'} />
        <GoodToKnowItem title={tCommon('dropOffTime')} value={yacht.defaultCheckout || '-'} />
        <GoodToKnowItem title={tCommon('paymentMethod')} value={t('localCurrency')} />
        <GoodToKnowItem title={tCommon('sailingLicenceRequired')} value={t('standardSailingLicence')} />
        <GoodToKnowItem title={tCommon('cancellationPolicy')} value={t('cancellationPolicyDescription')} />
      </Grid>
    </Stack>
  );
};

export default GoodToKnowTab;
