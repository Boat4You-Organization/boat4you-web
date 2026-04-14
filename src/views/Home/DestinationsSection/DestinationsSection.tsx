'use client';

import { useTranslations } from 'next-intl';

import SliderSection from '@/components/SliderSection';
import { CountryCountModel } from '@/models/locations.model';

import styles from './DestinationsSection.module.scss';
import DestinationsSlider from './DestinationsSlider';

interface DestinationsSectionProps {
  countries: CountryCountModel[];
}

const DestinationsSection = ({ countries }: DestinationsSectionProps) => {
  const t = useTranslations('home');

  return (
    <SliderSection
      title={t('destinationsSection.theWorldIs')}
      emphasizedTitle={t('destinationsSection.yours')}
      subtitle={t('chooseFromFiveHundredLocations')}
      // eslint-disable-next-line react/no-unstable-nested-components
      SliderComponent={({ handleSwiper }) => <DestinationsSlider data={countries} handleSwiper={handleSwiper} />}
      customStyles={{
        container: styles.container,
        overlay: styles.overlay,
      }}
    />
  );
};

export default DestinationsSection;
