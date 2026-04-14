'use client';

import { Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import ChevronRight from '@/components/SvgIcons/ChevronRight';
import { getTranslationKeyByCountryCode, getTranslationKeyByDestinationName } from '@/config/destinations.config';
import { CountryCountModel } from '@/models/locations.model';
import colors from '@/styles/themes/colors';
import useBreakpoint from '@/utils/hooks/useBreakpoint';

import styles from './DestinationsGrid.module.scss';

interface DestinationsGridProps {
  destinations: CountryCountModel[];
}

const DestinationsGrid = ({ destinations }: DestinationsGridProps) => {
  const t = useTranslations('home');
  const { isMobile } = useBreakpoint();

  return (
    <Grid container className={styles.container} rowSpacing={1.5} columnSpacing={isMobile ? 2 : 2.5}>
      {destinations.map(destination => {
        const translationKey =
          getTranslationKeyByCountryCode(destination.countryCode) ||
          getTranslationKeyByDestinationName(destination.name);
        const localizedName = translationKey ? t(translationKey) : destination.name;

        return (
          <Grid key={destination.id} size={{ xs: 6, md: 3, xl: 2 }} height="100%" className={styles.itemWrapper}>
            <Link href={`/search?destinations=${destination.name}&did=${destination.id}`} className={styles.item}>
              <Stack>
                <Typography component="h3" variant="h4" fontWeight={700} color={colors.blue950}>
                  {localizedName}
                </Typography>
                <Typography variant="body2" color={colors.black350}>
                  {destination.yachtCount} {t('ourFleetSection.boat')}
                </Typography>
              </Stack>
              <ChevronRight size={20} />
            </Link>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DestinationsGrid;
