import { Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import Bulp from '@/components/SvgIcons/Bulp';
import GoodToKnowItem from '@/views/Boat/BoatContentSection/GoodToKnowItem';

const GoodToKnowTab = () => {
  const t = useTranslations('common');
  const tYacht = useTranslations('yacht');

  return (
    <Stack component="section" direction="column" spacing={4}>
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
        <GoodToKnowItem title={t('paymentMethod')} value={tYacht('localCurrency')} />
        <GoodToKnowItem title={t('sailingLicenceRequired')} value={tYacht('standardSailingLicence')} />
        <GoodToKnowItem title={t('cancellationPolicy')} value={tYacht('cancellationPolicyDescription')} />
      </Grid>
    </Stack>
  );
};

export default GoodToKnowTab;
