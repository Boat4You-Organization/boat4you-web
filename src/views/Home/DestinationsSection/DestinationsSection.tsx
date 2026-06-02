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

      {/* No `priority` on any card: these sit below the fold (hero + search bar
          fill the mobile viewport) and are never the LCP element. Marking the
          first row priority preloaded 4 images at fetchPriority=high, stealing
          slow-4G bandwidth from the actual LCP (hero). Default lazy loading
          fetches them when they scroll into view. */}
      <div className={styles.grid}>
        {visible.map(country => (
          <DestinationCard key={country.id} {...country} />
        ))}
      </div>
    </section>
  );
};

export default DestinationsSection;
