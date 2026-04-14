import { Divider, Grid, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import Bulp from '@/components/SvgIcons/Bulp';
import ExternalLink from '@/components/SvgIcons/ExternalLink';
import Information from '@/components/SvgIcons/Information';
import DateTime from '@/utils/static/DateTime';
import { generateGoogleMapsLink } from '@/utils/static/googleMapsUtils';
import GoodToKnowItem from '@/views/Boat/BoatContentSection/GoodToKnowItem';

import styles from './MainInfoTab.module.scss';

interface MainInfoTabProps {
  dateFrom: string;
  dateTo: string;
  locationFrom: string;
  defaultCheckin: string;
  defaultCheckout: string;
  specialRequest?: string;
}

const MainInfoTab = ({
  dateFrom,
  dateTo,
  locationFrom,
  defaultCheckin,
  defaultCheckout,
  specialRequest,
}: MainInfoTabProps) => {
  const t = useTranslations('common');
  const tYacht = useTranslations('yacht');

  const locale = useLocale();

  return (
    <Stack component="section" className={styles.container}>
      <Stack>
        <Stack direction="row" alignItems="center" gap={1}>
          <Information size={32} variant="secondary" />
          <Typography variant="h3" component="h2" fontWeight={700}>
            {t('reservationTabs.mainInfo')}
          </Typography>
        </Stack>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }} mt={3}>
            <Typography variant="h4" component="p">
              {t('dates')}
            </Typography>
            <Typography variant="body1" mt={1} textTransform="capitalize">
              {DateTime.formatLong(DateTime.date(dateFrom), locale)} -{' '}
              {DateTime.formatLong(DateTime.date(dateTo), locale)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} mt={3}>
            <Typography variant="h4" component="p">
              {t('pickUpLocation')}
            </Typography>
            <Link href={generateGoogleMapsLink(locationFrom)} target="_blank" className={styles.link}>
              <Typography variant="body1">{locationFrom}</Typography>
              <ExternalLink />
            </Link>
          </Grid>
        </Grid>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }} mt={3}>
            <Typography variant="h4" component="p">
              {t('pickUpTime')}
            </Typography>
            <Typography variant="body1" mt={1} textTransform="capitalize">
              {defaultCheckin || '-'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} mt={3}>
            <Typography variant="h4" component="p">
              {t('dropOffTime')}
            </Typography>
            <Typography variant="body1" mt={1} textTransform="capitalize">
              {defaultCheckout || '-'}
            </Typography>
          </Grid>
        </Grid>
        {specialRequest && (
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12 }} mt={3}>
              <Typography variant="h4" component="p">
                {t('specialRequest')}
              </Typography>
              <Typography variant="body1" mt={1}>
                {specialRequest}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Stack>
      <Divider classes={{ root: styles.rootDivider }} className={styles.divider} />
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
          <GoodToKnowItem title={t('paymentMethod')} value={tYacht('localCurrency')} />
          <GoodToKnowItem title={t('sailingLicenceRequired')} value={tYacht('standardSailingLicence')} />
          <GoodToKnowItem title={t('cancellationPolicy')} value={tYacht('cancellationPolicyDescription')} />
        </Grid>
      </Stack>
    </Stack>
  );
};

export default MainInfoTab;
