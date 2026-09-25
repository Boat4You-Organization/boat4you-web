import { Container } from '@mui/material';
import { getTranslations } from 'next-intl/server';

import { isPromotedCountry } from '@/config/promoted-countries.config';
import { Link } from '@/i18n/navigation';
import { findModelForYacht } from '@/utils/server/modelCatalog';

import styles from './ModelPageLink.module.scss';

interface ModelPageLinkProps {
  manufacturerName?: string | null;
  modelName?: string | null;
  /** The boat's country: model pages cover the 12 promoted countries only. */
  countryCode?: string | null;
  locale: string;
}

/**
 * "All Lagoon 42 boats (438)" under the boat content — only when the model
 * has a /yachts model page (modelCatalog.ts), so every boat of a top model
 * links up to its model hub. Renders nothing otherwise — also for a boat
 * outside the promoted countries, which the model page (and its count) does
 * not include — and never holds the boat page up for longer than the
 * catalogue lookup budget.
 */
const ModelPageLink = async ({ manufacturerName, modelName, countryCode, locale }: ModelPageLinkProps) => {
  if (!isPromotedCountry(countryCode)) return null;

  // Partner sync sometimes leaves the manufacturer empty while the model
  // carries the brand ("Lagoon 42") — same fallback as the Product schema.
  const brand = manufacturerName?.trim() || (modelName ?? '').trim().split(/\s+/)[0];
  const model = await findModelForYacht(brand, modelName);

  if (!model) return null;

  const t = await getTranslations({ locale, namespace: 'models' });

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Link href={model.path} prefetch={false} className={styles.link}>
        {t('boatLink', { model: model.displayName, count: model.fleet })}
        <span aria-hidden="true" className={styles.arrow}>
          →
        </span>
      </Link>
    </Container>
  );
};

export default ModelPageLink;
