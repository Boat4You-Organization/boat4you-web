import { useTranslations } from 'next-intl';
import Link from 'next/link';

import type { ManufacturerCount } from '@/actions/catalogue.actions';

import styles from './ManufacturersSection.module.scss';

interface ManufacturersSectionProps {
  manufacturers: ManufacturerCount[];
}

/**
 * "Most popular yacht manufacturers" — internal-link block near the bottom of
 * the home page (just above AllDestinationsSection).
 *
 * De-MUI'd (Jun-2026): was MUI Container/Typography/Box/Stack, now plain HTML +
 * CSS module so it stays a zero-JS server component and adds NOTHING to mobile
 * hydration. Visual gabarit unchanged — same container shape, h1-variant title
 * and grid as before (mirrors FAQSection's de-MUI conversion). Deep links into
 * `/search?mfid=` earn brand long-tail crawl budget; the names + counts are in
 * the server HTML on first paint so the crawler reads them without running JS.
 */
const ManufacturersSection = ({ manufacturers }: ManufacturersSectionProps) => {
  const t = useTranslations('home');

  if (!manufacturers.length) return null;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        {t('manufacturersSection.preTitle')}{' '}
        <span className={styles.titleEmphasis}>{t('manufacturersSection.emphasizedTitle')}</span>
      </h2>
      <p className={styles.subtitle}>{t('manufacturersSection.subtitle')}</p>

      <div className={styles.grid}>
        {manufacturers.map(m => (
          <Link
            key={m.id}
            href={`/search?mfid=${m.id}&manufacturers=${encodeURIComponent(m.name)}`}
            className={styles.tile}
          >
            <span className={styles.name}>{m.name}</span>
            <span className={styles.count}>{t('hero.yachtsCount', { count: m.count.toLocaleString('en-US') })}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ManufacturersSection;
