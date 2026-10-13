import React from 'react';

import { Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import ReadMorePanel from '@/components/ReadMorePanel';
import Bulp from '@/components/SvgIcons/Bulp';
import { YachtModel } from '@/models/yacht.model';
import { isGulet } from '@/utils/static/guletCrewed';
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

      {/* The same light panel as the description (owner 13.10.2026). */}
      <ReadMorePanel collapsible={false}>
        <Grid container spacing={4}>
          <GoodToKnowItem title={tCommon('pickUpTime')} value={yacht.defaultCheckin || '-'} />
          <GoodToKnowItem title={tCommon('dropOffTime')} value={yacht.defaultCheckout || '-'} />
          <GoodToKnowItem title={tCommon('paymentMethod')} value={t('localCurrency')} />
          {/* A gulet sails with its crew: no licence asked of the guests (guletCrewed.ts). */}
          {!isGulet(yacht) && (
            <GoodToKnowItem title={tCommon('sailingLicenceRequired')} value={t('standardSailingLicence')} />
          )}
          <GoodToKnowItem title={tCommon('cancellationPolicy')} value={t('cancellationPolicyDescription')} />
        </Grid>
      </ReadMorePanel>
    </Stack>
  );
};

export default GoodToKnowTab;
