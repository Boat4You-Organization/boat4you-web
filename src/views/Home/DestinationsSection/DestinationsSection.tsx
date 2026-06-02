import { useTranslations } from 'next-intl';

import { CountryCountModel } from '@/models/locations.model';

import styles from './DestinationsSection.module.scss';
import DestinationCard from './DestinationsSlider/DestinationCard';

interface DestinationsSectionProps {
  countries: CountryCountModel[];
}

// 4 x 3 static grid (Mario, Jun-2026) using the same card design as the fleet
// grid — was a Swiper carousel. Server component now, no Swiper JS. The COMPLETE
// country list still renders in AllDestinationsSection at the bottom.
const GRID_LIMIT = 12;

const DestinationsSection = ({ countries }: DestinationsSectionProps) => {
  const t = useTranslations('home');

  const visible = countries.slice(0, GRID_LIMIT);

  if (!visible.length) return null;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        {t('destinationsSection.theWorldIs')}{' '}
        <span className={styles.titleEmphasis}>{t('destinationsSection.yours')}</span>
      </h2>
      <p className={styles.subtitle}>{t('chooseFromFiveHundredLocations')}</p>

      <div className={styles.grid}>
        {visible.map((country, index) => (
          <DestinationCard key={country.id} {...country} priority={index < 4} />
        ))}
      </div>
    </section>
  );
};

export default DestinationsSection;
