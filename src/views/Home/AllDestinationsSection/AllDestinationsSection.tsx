'use client';

import { useMemo, useState } from 'react';

import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { continentsTabs } from '@/config/tabs.config';
import { CountryCountModel } from '@/models/locations.model';
import colors from '@/styles/themes/colors';

import styles from './AllDestinationsSection.module.scss';
import DestinationsGrid from './DestinationsGrid';

interface AllDestinationsSectionProps {
  countries: CountryCountModel[];
}

const groupLocationsByContinent = (countries: CountryCountModel[]) => {
  const continentMap: Record<string, string> = {
    Europe: 'europe',
    'North America': 'americas',
    'South America': 'americas',
    Asia: 'asia',
    Africa: 'africa',
    Australia: 'australia',
    Oceania: 'australia',
  };

  const grouped = countries.reduce(
    (acc, location) => {
      const continentKey = continentMap[location.continent] || 'europe';

      if (!acc[continentKey]) {
        acc[continentKey] = [];
      }

      acc[continentKey].push(location);

      return acc;
    },
    {} as Record<string, CountryCountModel[]>
  );

  return {
    europe: grouped.europe || [],
    americas: grouped.americas || [],
    asia: grouped.asia || [],
    africa: grouped.africa || [],
    australia: grouped.australia || [],
  };
};

const AllDestinationsSection = ({ countries }: AllDestinationsSectionProps) => {
  const [tabValue, setTabValue] = useState<number>(0);
  const t = useTranslations('home');

  const groupedDestinations = useMemo(() => groupLocationsByContinent(countries), [countries]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderTabsPanel = () => {
    switch (tabValue) {
      case 0:
        return <DestinationsGrid destinations={groupedDestinations.europe} />;
      case 1:
        return <DestinationsGrid destinations={groupedDestinations.americas} />;
      case 2:
        return <DestinationsGrid destinations={groupedDestinations.asia} />;
      case 3:
        return <DestinationsGrid destinations={groupedDestinations.africa} />;
      case 4:
        return <DestinationsGrid destinations={groupedDestinations.australia} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" component="section" disableGutters className={styles.container}>
      <Typography variant="h1" component="h2" color={colors.blue950}>
        {t('allDestinationsSection.allOf')}{' '}
        <Typography
          variant="h1"
          component="span"
          fontStyle="italic"
          fontWeight={800}
          color={colors.blue500}
          sx={{ pl: '0.1em', wordBreak: 'break-word' }}
        >
          {t('allDestinationsSection.ourDestinations')}
        </Typography>
      </Typography>
      <Typography variant="body2" color={colors.black350}>
        {t('allDestinationsSection.specialDeals')}
      </Typography>
      <Box sx={{ width: '100%', mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: colors.black200 }}>
          <Tabs value={tabValue} onChange={handleChange} variant="scrollable" aria-label="all destinations tabs">
            {continentsTabs.map(continent => (
              <Tab
                key={continent}
                label={t(`allDestinationsSection.continents.${continent}`)}
                sx={{ color: colors.black400, width: 'auto' }}
              />
            ))}
          </Tabs>
        </Box>
      </Box>
      {renderTabsPanel()}
    </Container>
  );
};

export default AllDestinationsSection;
