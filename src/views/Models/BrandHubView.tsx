import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { CatalogBrand, CatalogModel } from '@/utils/server/modelCatalog';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { ModelFleetStats } from '@/utils/static/modelFleetStats';

import styles from './Models.module.scss';
import ModelsBreadcrumb, { Crumb } from './ModelsBreadcrumb';
import ModelsFaq, { ModelsFaqEntry } from './ModelsFaq';
import { formatRange } from './modelsText';

export interface BrandHubModel {
  model: CatalogModel;
  stats: ModelFleetStats;
}

export interface BrandWhereRow {
  countryCode: string;
  label: string;
  count: number;
  href: string | null;
}

interface BrandHubViewProps {
  locale: string;
  brand: CatalogBrand;
  models: BrandHubModel[];
  totalBoats: number;
  breadcrumb: Crumb[];
  where: BrandWhereRow[];
  faq: ModelsFaqEntry[];
}

/**
 * /yachts/{brand}: the brand's total fleet, its model pages with live
 * counts, a side-by-side comparison (length, cabins, guests, weekly price
 * band), where the models are based and a data-driven FAQ. It used to be
 * the model list alone (~160 words, audit B33).
 */
const BrandHubView = async ({ locale, brand, models, totalBoats, breadcrumb, where, faq }: BrandHubViewProps) => {
  const t = await getTranslations({ locale, namespace: 'models' });
  const price = (eur: number) => formatPriceWithCurrency({ clientPriceEur: Math.round(eur), locale });
  const number = (n: number) => n.toLocaleString(locale);
  const metres = (n: number) => n.toLocaleString(locale, { maximumFractionDigits: 1 });

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

      <section className={styles.section} aria-labelledby="brand-compare">
        <h2 id="brand-compare" className={styles.sectionTitle}>
          {t('brand.compareHeading', { brand: brand.brand })}
        </h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">{t('brand.colModel')}</th>
              <th scope="col">{t('brand.colBoats')}</th>
              <th scope="col">{t('brand.colLength')}</th>
              <th scope="col">{t('brand.colCabins')}</th>
              <th scope="col">{t('brand.colGuests')}</th>
              <th scope="col">{t('brand.colPrice')}</th>
            </tr>
          </thead>
          <tbody>
            {models.map(({ model, stats }) => (
              <tr key={model.path}>
                <td>
                  <Link href={model.path} prefetch={false} className={styles.tableLink}>
                    {model.displayName}
                  </Link>
                </td>
                <td className={styles.numeric} data-label={t('brand.colBoats')}>
                  {number(stats.boats)}
                </td>
                <td className={styles.numeric} data-label={t('brand.colLength')}>
                  {stats.lengthM ? `${formatRange(stats.lengthM, metres)} m` : '—'}
                </td>
                <td className={styles.numeric} data-label={t('brand.colCabins')}>
                  {formatRange(stats.cabins) ?? '—'}
                </td>
                <td className={styles.numeric} data-label={t('brand.colGuests')}>
                  {formatRange(stats.guests) ?? '—'}
                </td>
                <td className={styles.numeric} data-label={t('brand.colPrice')}>
                  {stats.weeklyPrice ? `${price(stats.weeklyPrice.p25)} – ${price(stats.weeklyPrice.p75)}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {where.length > 0 && (
        <section className={styles.section} aria-labelledby="brand-where">
          <h2 id="brand-where" className={styles.sectionTitle}>
            {t('brand.whereHeading', { brand: brand.brand })}
          </h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">{t('model.whereCountry')}</th>
                <th scope="col">{t('model.whereBoats')}</th>
              </tr>
            </thead>
            <tbody>
              {where.map(row => (
                <tr key={row.countryCode}>
                  <td>
                    {row.href ? (
                      <Link href={row.href} prefetch={false} className={styles.tableLink}>
                        {row.label}
                      </Link>
                    ) : (
                      row.label
                    )}
                  </td>
                  <td className={styles.numeric} data-label={t('model.whereBoats')}>
                    {number(row.count)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.note}>{t('brand.whereNote')}</p>
        </section>
      )}

      <ModelsFaq heading={t('faqHeading')} entries={faq} />
    </article>
  );
};

export default BrandHubView;
