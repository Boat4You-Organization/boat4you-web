'use client';

import { useTranslations } from 'next-intl';

import SliderSection from '@/components/SliderSection';
import { CountryCountModel } from '@/models/locations.model';

import styles from './DestinationsSection.module.scss';
import DestinationsSlider from './DestinationsSlider';

interface DestinationsSectionProps {
  countries: CountryCountModel[];
}

// The rail is a horizontal scroller — users swipe through a handful, they
// never reach card 40+. Rendering the whole country list bloated the home
// HTML/DOM and queued dozens of card images on mobile. Cap the rail to the
// top 15 (already ordered by yacht count); the COMPLETE list still renders in
// AllDestinationsSection at the bottom, so nothing is lost for users or SEO.
const RAIL_LIMIT = 15;

const DestinationsSection = ({ countries }: DestinationsSectionProps) => {
  const t = useTranslations('home');

  const railCountries = countries.slice(0, RAIL_LIMIT);

  return (
    <SliderSection
      title={t('destinationsSection.theWorldIs')}
      emphasizedTitle={t('destinationsSection.yours')}
      subtitle={t('chooseFromFiveHundredLocations')}
      // eslint-disable-next-line react/no-unstable-nested-components
      SliderComponent={({ handleSwiper }) => <DestinationsSlider data={railCountries} handleSwiper={handleSwiper} />}
      customStyles={{
        container: styles.container,
        overlay: styles.overlay,
      }}
    />
  );
};

export default DestinationsSection;
