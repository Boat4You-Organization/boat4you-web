import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import { Link } from '@/i18n/navigation';
import { YachtModelShortInfo } from '@/models/yacht.model';
import { CatalogModel } from '@/utils/server/modelCatalog';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { getBoatImageBaseUrl } from '@/utils/static/imageUtils';
import { ModelFleetStats, weeklyPriceEur } from '@/utils/static/modelFleetStats';
import { toTitleCase } from '@/utils/static/toTitleCase';

import styles from './Models.module.scss';
import ModelsBreadcrumb, { Crumb } from './ModelsBreadcrumb';
import { M_PER_FT, formatRange } from './modelsText';

export interface WhereRow {
  countryCode: string;
  label: string;
  href: string | null;
  count: number;
  bases: Array<{ name: string; count: number; href: string | null }>;
}

interface ModelPageViewProps {
  locale: string;
  model: CatalogModel;
  stats: ModelFleetStats;
  layout: { berths: number | null; wc: number | null };
  boats: YachtModelShortInfo[];
  where: WhereRow[];
  otherModels: CatalogModel[];
  brandName: string;
  blogPost: { slug: string; title: string } | null;
  showAllHref: string;
  breadcrumb: Crumb[];
}

/**
 * /yachts/{brand}/{model}: everything is computed from the model's live
 * fleet (modelCatalog.ts), so the page carries its own facts — specs,
 * where the boats are based, what a week costs and the boats themselves.
 */
const ModelPageView = async ({
  locale,
  model,
  stats,
  layout,
  boats,
  where,
  otherModels,
  brandName,
  blogPost,
  showAllHref,
  breadcrumb,
}: ModelPageViewProps) => {
  const t = await getTranslations({ locale, namespace: 'models' });
  const price = (eur: number) => formatPriceWithCurrency({ clientPriceEur: Math.round(eur), locale });
  const name = model.displayName;
  const number = (n: number) => n.toLocaleString(locale);

  const lengthText = stats.lengthM
    ? t('model.lengthValue', {
        m: formatRange(stats.lengthM, v => v.toLocaleString(locale, { maximumFractionDigits: 1 })) ?? '',
        ft: formatRange(stats.lengthM, v => String(Math.round(v / M_PER_FT))) ?? '',
      })
    : null;

  const specs: Array<{ label: string; value: string | null }> = [
    { label: t('model.specFleet'), value: number(stats.boats) },
    { label: t('model.specLength'), value: lengthText },
    { label: t('model.specCabins'), value: formatRange(stats.cabins) },
    { label: t('model.specGuests'), value: formatRange(stats.guests) },
    { label: t('model.specBerths'), value: layout.berths ? String(layout.berths) : null },
    { label: t('model.specHeads'), value: layout.wc ? String(layout.wc) : null },
    { label: t('model.specBuildYears'), value: formatRange(stats.buildYear) },
  ].filter(s => s.value);

  let yearsSentence: string | null = null;

  if (stats.buildYear && stats.buildYear.min === stats.buildYear.max) {
    yearsSentence = t('model.ledeYear', { year: String(stats.buildYear.min) });
  } else if (stats.buildYear) {
    yearsSentence = t('model.ledeYears', { from: String(stats.buildYear.min), to: String(stats.buildYear.max) });
  }

  const lede = [
    t('model.lede', { count: stats.boats, model: name, countryCount: where.length }),
    yearsSentence,
    stats.weeklyPrice
      ? t('model.ledePrice', { p25: price(stats.weeklyPrice.p25), p75: price(stats.weeklyPrice.p75) })
      : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={styles.root}>
      <ModelsBreadcrumb items={breadcrumb} label={t('breadcrumbLabel')} />
      <h1 className={styles.title}>{t('model.h1', { model: name })}</h1>
      <p className={styles.lede}>{lede}</p>

      <section className={styles.section} aria-labelledby="model-specs">
        <h2 id="model-specs" className={styles.sectionTitle}>
          {t('model.specsHeading', { model: name })}
        </h2>
        <dl className={styles.specs}>
          {specs.map(spec => (
            <div key={spec.label} className={styles.spec}>
              <dt>{spec.label}</dt>
              <dd className={styles.numeric}>{spec.value}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.note}>{t('model.specNote', { model: name })}</p>
      </section>

      {where.length > 0 && (
        <section className={styles.section} aria-labelledby="model-where">
          <h2 id="model-where" className={styles.sectionTitle}>
            {t('model.whereHeading', { model: name })}
          </h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">{t('model.whereCountry')}</th>
                <th scope="col">{t('model.whereBoats')}</th>
                <th scope="col">{t('model.whereBases')}</th>
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
                  <td data-label={t('model.whereBases')}>
                    <ul className={styles.baseList}>
                      {row.bases.map(base => (
                        <li key={base.name}>
                          {base.href ? (
                            <Link href={base.href} prefetch={false} className={styles.baseLink}>
                              {base.name}
                            </Link>
                          ) : (
                            base.name
                          )}
                          <span className={styles.baseCount}>({number(base.count)})</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {stats.weeklyPrice && (
        <section className={styles.section} aria-labelledby="model-prices">
          <h2 id="model-prices" className={styles.sectionTitle}>
            {t('model.priceHeading', { model: name })}
          </h2>
          <p className={styles.body}>
            {t('model.priceBody', {
              model: name,
              p25: price(stats.weeklyPrice.p25),
              p75: price(stats.weeklyPrice.p75),
              n: stats.weeklyPrice.n,
            })}
          </p>
        </section>
      )}

      <section className={styles.section} aria-labelledby="model-boats">
        <h2 id="model-boats" className={styles.sectionTitle}>
          {t('model.boatsHeading', { model: name })}
        </h2>
        <ul className={styles.grid}>
          {boats.map(boat => {
            const weekly = weeklyPriceEur(boat);
            const meta = [
              boat.buildYear ? String(boat.buildYear) : null,
              boat.cabins ? t('cabins', { count: boat.cabins }) : null,
              boat.maxPersons ? t('guests', { count: boat.maxPersons }) : null,
            ]
              .filter(Boolean)
              .join(' · ');
            const title = [toTitleCase(boat.modelName), toTitleCase(boat.name)].filter(Boolean).join(' | ');

            return (
              <li key={boat.id} className={styles.card}>
                <Link href={`/boat/${boat.slug}`} prefetch={false} className={styles.cardLink}>
                  <div className={styles.cardImage}>
                    {boat.mainImageId ? (
                      <Image
                        src={getBoatImageBaseUrl(boat.mainImageId)}
                        alt={title}
                        fill
                        loading="lazy"
                        sizes="(min-width: 1024px) 380px, (min-width: 600px) 50vw, 100vw"
                      />
                    ) : null}
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{title}</h3>
                    {boat.location?.name && <span className={styles.cardMeta}>{boat.location.name}</span>}
                    {meta && <span className={styles.cardMeta}>{meta}</span>}
                    {weekly != null && (
                      <span className={styles.cardPrice}>{t('model.fromPerWeek', { price: price(weekly) })}</span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        {stats.boats > boats.length && (
          <div className={styles.actions}>
            <Link href={showAllHref} prefetch={false} className={styles.button} rel="nofollow">
              {t('model.showAll', { model: name })}
            </Link>
          </div>
        )}
      </section>

      {blogPost && (
        <section className={styles.section} aria-labelledby="model-blog">
          <h2 id="model-blog" className={styles.sectionTitle}>
            {t('model.blogHeading')}
          </h2>
          <Link href={`/blog/${blogPost.slug}`} prefetch={false} className={styles.blogLink}>
            {blogPost.title}
          </Link>
        </section>
      )}

      {otherModels.length > 0 && (
        <section className={styles.section} aria-labelledby="model-other">
          <h2 id="model-other" className={styles.sectionTitle}>
            {t('model.otherModels', { brand: brandName })}
          </h2>
          <ul className={styles.modelList}>
            {otherModels.map(other => (
              <li key={other.path} className={styles.modelItem}>
                <Link href={other.path} prefetch={false} className={styles.modelLink}>
                  <span className={styles.modelName}>{other.displayName}</span>
                  <span className={styles.modelFacts}>{t('boats', { count: other.fleet })}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
};

export default ModelPageView;
