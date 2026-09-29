import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { ModelCatalog } from '@/utils/server/modelCatalog';
import { manufacturerPath } from '@/utils/static/yachtModelKey';

import styles from './Models.module.scss';
import ModelsBreadcrumb, { Crumb } from './ModelsBreadcrumb';

interface ModelsIndexViewProps {
  locale: string;
  catalog: ModelCatalog;
  breadcrumb: Crumb[];
}

/** Brands named in the lede, biggest first. */
const LEDE_BRANDS = 5;

/**
 * /yachts: every model page, grouped by brand (brand name links to its hub
 * when it has one). The lede names the biggest brands with their live
 * counts, and a "how to choose" guide closes the page — the index read as a
 * 300-word list of links (audit 29.9.2026, R35).
 */
const ModelsIndexView = async ({ locale, catalog, breadcrumb }: ModelsIndexViewProps) => {
  const t = await getTranslations({ locale, namespace: 'models' });
  const total = catalog.models.reduce((sum, m) => sum + m.fleet, 0);
  const topBrands = [...catalog.brands]
    .sort((a, b) => b.total - a.total)
    .slice(0, LEDE_BRANDS)
    .map(brand => `${brand.brand} (${t('boats', { count: brand.total })})`);
  const brandsLede = topBrands.length
    ? t('index.brandsLede', { brands: new Intl.ListFormat(locale, { type: 'conjunction' }).format(topBrands) })
    : null;

  return (
    <article className={styles.root}>
      <ModelsBreadcrumb items={breadcrumb} label={t('breadcrumbLabel')} />
      <h1 className={styles.title}>{t('index.h1')}</h1>
      <p className={styles.lede}>{t('index.lede', { models: catalog.models.length, count: total })}</p>
      {brandsLede && <p className={styles.lede}>{brandsLede}</p>}

      {catalog.brands.map(brand => (
        <section key={brand.brandSlug} className={styles.brandGroup} aria-labelledby={`brand-${brand.brandSlug}`}>
          <h2 id={`brand-${brand.brandSlug}`} className={styles.brandTitle}>
            {brand.hasHub ? (
              <Link href={manufacturerPath(brand.brandSlug)} prefetch={false} className={styles.brandLink}>
                {brand.brand}
              </Link>
            ) : (
              brand.brand
            )}
          </h2>
          <ul className={styles.modelList}>
            {brand.models.map(model => (
              <li key={model.path} className={styles.modelItem}>
                <Link href={model.path} prefetch={false} className={styles.modelLink}>
                  <span className={styles.modelName}>{model.displayName}</span>
                  <span className={styles.modelFacts}>{t('boats', { count: model.fleet })}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className={styles.section} aria-labelledby="models-choose">
        <h2 id="models-choose" className={styles.sectionTitle}>
          {t('index.chooseHeading')}
        </h2>
        <div className={styles.prose}>
          <p className={styles.body}>{t('index.choose1')}</p>
          <p className={styles.body}>{t('index.choose2')}</p>
          <p className={styles.body}>{t('index.choose3')}</p>
          <p className={styles.body}>{t('index.choose4')}</p>
          <p className={styles.body}>{t('index.choose5')}</p>
        </div>
      </section>
    </article>
  );
};

export default ModelsIndexView;
