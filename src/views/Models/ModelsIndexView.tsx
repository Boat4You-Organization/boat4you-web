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

/** /yachts: every model page, grouped by brand (brand name links to its hub when it has one). */
const ModelsIndexView = async ({ locale, catalog, breadcrumb }: ModelsIndexViewProps) => {
  const t = await getTranslations({ locale, namespace: 'models' });
  const total = catalog.models.reduce((sum, m) => sum + m.fleet, 0);

  return (
    <article className={styles.root}>
      <ModelsBreadcrumb items={breadcrumb} label={t('breadcrumbLabel')} />
      <h1 className={styles.title}>{t('index.h1')}</h1>
      <p className={styles.lede}>{t('index.lede', { models: catalog.models.length, count: total })}</p>

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
    </article>
  );
};

export default ModelsIndexView;
