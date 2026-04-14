'use client';

import { useTranslations } from 'next-intl';

import OurFleetSectionSlider from '@/components/OurFleetSectionSlider';
import SliderSection from '@/components/SliderSection';
import { YachtFleet } from '@/models/yacht.model';

import styles from './OurFleetSection.module.scss';

interface OurFleetSectionProps {
  fleet: YachtFleet[];
}

const OurFleetSection = ({ fleet }: OurFleetSectionProps) => {
  const t = useTranslations('home');

  return (
    <SliderSection
      title={t('ourFleetSection.getToKnow')}
      emphasizedTitle={t('ourFleetSection.ourFleet')}
      subtitle={t('ourFleetSection.boatSelection')}
      // eslint-disable-next-line react/no-unstable-nested-components
      SliderComponent={props => <OurFleetSectionSlider {...props} fleet={fleet} />}
      customStyles={{
        container: styles.container,
        overlay: styles.overlay,
      }}
    />
  );
};

export default OurFleetSection;
