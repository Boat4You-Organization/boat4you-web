import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { CatalogBrand, CatalogModel } from '@/utils/server/modelCatalog';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { ModelFleetStats } from '@/utils/static/modelFleetStats';

import styles from './Models.module.scss';
import ModelsBreadcrumb, { Crumb } from './ModelsBreadcrumb';
import { formatRange } from './modelsText';

export interface BrandHubModel {
  model: CatalogModel;
  stats: ModelFleetStats;
}

interface BrandHubViewProps {
  locale: string;
  brand: CatalogBrand;
  models: BrandHubModel[];
  totalBoats: number;
  breadcrumb: Crumb[];
}

/** /yachts/{brand}: the brand's model pages with live counts, cabins and weekly price bands. */
const BrandHubView = async ({ locale, brand, models, totalBoats, breadcrumb }: BrandHubViewProps) => {
  const t = await getTranslations({ locale, namespace: 'models' });
  const price = (eur: number) => formatPriceWithCurrency({ clientPriceEur: Math.round(eur), locale });

  return (
    <article className={styles.root}>
      <ModelsBreadcrumb items={breadcrumb} label={t('breadcrumbLabel')} />
      <h1 className={styles.title}>{t('brand.h1', { brand: brand.brand })}</h1>
      <p className={styles.lede}>{t('brand.lede', { brand: brand.brand, count: totalBoats, models: models.length })}</p>

      <section className={styles.section} aria-labelledby="brand-models">
        <h2 id="brand-models" className={styles.sectionTitle}>
          {t('brand.modelsHeading', { brand: brand.brand })}
        </h2>
        <ul className={styles.modelList}>
          {models.map(({ model, stats }) => {
            const facts = [
              t('boats', { count: stats.boats }),
              stats.cabins ? t('cabinsRange', { range: formatRange(stats.cabins) ?? '' }) : null,
              stats.weeklyPrice
                ? t('priceBand', { p25: price(stats.weeklyPrice.p25), p75: price(stats.weeklyPrice.p75) })
                : null,
            ]
              .filter(Boolean)
              .join(' · ');

            return (
              <li key={model.path} className={styles.modelItem}>
                <Link href={model.path} prefetch={false} className={styles.modelLink}>
                  <span className={styles.modelName}>{model.displayName}</span>
                  <span className={styles.modelFacts}>{facts}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </article>
  );
};

export default BrandHubView;
