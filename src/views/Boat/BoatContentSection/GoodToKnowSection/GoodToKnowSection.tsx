import { Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import BoatLocationModal from '@/components/BoatLocationModal';
import ReadMorePanel from '@/components/ReadMorePanel';
import Bulp from '@/components/SvgIcons/Bulp';
import { YachtModel } from '@/models/yacht.model';
import useToggleState from '@/utils/hooks/useToggleState';
import { displayBaseName } from '@/utils/static/croatianPlaceNames';
import { isGulet } from '@/utils/static/guletCrewed';
import { useYachtStore } from '@/valtio/yacht/yacht.store';
import GoodToKnowItem from '@/views/Boat/BoatContentSection/GoodToKnowItem';

interface GoodToKnowSectionProps {
  yacht: YachtModel;
}

/**
 * "Good to know" of a partner boat: pick-up and drop-off times, payment, licence, cancellation, pick-up place. It was
 * the lower half of the Availability tab; on its own since 19.11.2026 so the page can place it under Extras (Mario).
 * A custom boat has its own Good to know tab (GoodToKnowTab).
 */
const GoodToKnowSection = ({ yacht }: GoodToKnowSectionProps) => {
  const { selectedOffer } = useYachtStore();
  const t = useTranslations('yacht');
  const tCommon = useTranslations('common');
  const [isMapOpen, toggleMap] = useToggleState();

  return (
    <Stack direction="column" spacing={{ xs: 2, md: 4 }}>
      <Typography
        component="h2"
        variant="h3"
        fontWeight={600}
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
        {/* Phone: the items closer together (Mario 19.11.2026). */}
        <Grid container spacing={{ xs: 2, md: 4 }}>
          <GoodToKnowItem title={tCommon('pickUpTime')} value={yacht.defaultCheckin || selectedOffer?.checkin || '-'} />
          <GoodToKnowItem
            title={tCommon('dropOffTime')}
            value={yacht.defaultCheckout || selectedOffer?.checkout || '-'}
          />
          <GoodToKnowItem title={tCommon('paymentMethod')} value={t('localCurrency')} />
          {/* A gulet sails with its crew: no licence asked of the guests (guletCrewed.ts). */}
          {!isGulet(yacht) && (
            <GoodToKnowItem title={tCommon('sailingLicenceRequired')} value={t('standardSailingLicence')} />
          )}
          <GoodToKnowItem title={tCommon('cancellationPolicy')} value={t('cancellationPolicyDescription')} />
          <GoodToKnowItem
            title={tCommon('pickUpLocation')}
            value={displayBaseName(yacht.location?.name)}
            onClick={yacht.location?.name ? toggleMap : undefined}
          />
          {yacht.location?.name && (
            <BoatLocationModal
              open={isMapOpen}
              onClose={toggleMap}
              locationName={yacht.location.name}
              lat={yacht.location.lat}
              lon={yacht.location.lon}
            />
          )}
        </Grid>
      </ReadMorePanel>
    </Stack>
  );
};

export default GoodToKnowSection;
