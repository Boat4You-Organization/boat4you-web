import { useTranslations } from 'next-intl';
import Link from 'next/link';

import type { ManufacturerCount } from '@/actions/catalogue.actions';
import { Link as IntlLink } from '@/i18n/navigation';
import { yachtsIndexPath } from '@/utils/static/yachtModelKey';

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
 * and grid as before (mirrors FAQSection's de-MUI conversion).
 *
 * A brand with a /yachts brand hub links the hub (indexable, its models and
 * counts). Other brands deep-link into `/search?mfid=` for visitors; that URL
 * is noindex and canonicalises to bare `/search`, so those links carry
 * rel="nofollow" (audit 25.9.2026). The /yachts index closes the block.
 */
const ManufacturersSection = ({ manufacturers }: ManufacturersSectionProps) => {
  const t = useTranslations('home');
  const tModels = useTranslations('models');

  if (!manufacturers.length) return null;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        {t('manufacturersSection.preTitle')}{' '}
        <span className={styles.titleEmphasis}>{t('manufacturersSection.emphasizedTitle')}</span>
      </h2>
      <p className={styles.subtitle}>{t('manufacturersSection.subtitle')}</p>

      <div className={styles.grid}>
        {manufacturers.map(m => {
          const body = (
            <>
              <span className={styles.name}>{m.name}</span>
              <span className={styles.count}>{t('hero.yachtsCount', { count: m.count.toLocaleString('en-US') })}</span>
            </>
          );

          return m.hubPath ? (
            <IntlLink key={m.id} href={m.hubPath} prefetch={false} className={styles.tile}>
              {body}
            </IntlLink>
          ) : (
            <Link
              key={m.id}
              href={`/search?mfid=${m.id}&manufacturers=${encodeURIComponent(m.name)}`}
              rel="nofollow"
              className={styles.tile}
            >
              {body}
            </Link>
          );
        })}
      </div>
      <IntlLink href={yachtsIndexPath()} prefetch={false} className={styles.allModels}>
        {tModels('index.h1')} →
      </IntlLink>
    </section>
  );
};

export default ManufacturersSection;
