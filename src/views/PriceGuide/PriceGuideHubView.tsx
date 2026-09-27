import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { PriceGuideData } from '@/utils/server/priceGuide';
import styles from '@/views/Models/Models.module.scss';
import ModelsBreadcrumb, { Crumb } from '@/views/Models/ModelsBreadcrumb';

import { GuideText } from './guideText';

export interface HubRow {
  data: PriceGuideData;
  text: GuideText;
  /** Locale-less path of the guide. */
  href: string;
}

interface PriceGuideHubViewProps {
  locale: string;
  rows: HubRow[];
  /** Boats behind the figures of every guide. */
  boats: number;
  computedAt: string;
  breadcrumb: Crumb[];
}

/**
 * /yacht-charter-prices: one card per country guide and a comparison table
 * of the headline figures, all from the same facts rows as the guides.
 */
const PriceGuideHubView = async ({ locale, rows, boats, computedAt, breadcrumb }: PriceGuideHubViewProps) => {
  const [t, tFacts] = await Promise.all([
    getTranslations({ locale, namespace: 'priceGuide' }),
    getTranslations({ locale, namespace: 'charterFacts' }),
  ]);
  const [{ text: firstText }] = rows;
  const { fmt } = firstText;
  const { money } = fmt;

  return (
    <article className={styles.root}>
      <ModelsBreadcrumb items={breadcrumb} label={t('breadcrumbLabel')} />
      <h1 className={styles.title}>{t('hub.h1')}</h1>
      <p className={styles.lede}>{t('hub.lede', { boats })}</p>

      <section className={styles.section} aria-label={t('hub.h1')}>
        <ul className={styles.modelList}>
          {rows.map(({ data, text, href }) => (
            <li key={href} className={styles.modelItem}>
              <Link href={href} prefetch={false} className={styles.modelLink}>
                <span className={styles.modelName}>{text.h1}</span>
                <span className={styles.modelFacts}>
                  {data.all
                    ? t('hub.cardFacts', {
                        boats: data.facts.activeBoats,
                        low: money(data.all.low),
                        high: money(data.all.high),
                      })
                    : tFacts('boats', { count: data.facts.activeBoats })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="hub-glance">
        <h2 id="hub-glance" className={styles.sectionTitle}>
          {t('hub.glanceHeading')}
        </h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">{t('hub.country')}</th>
              <th scope="col">{t('hub.typicalWeek')}</th>
              <th scope="col">{t('hub.priciestMonth')}</th>
              <th scope="col">{tFacts('skipper')}</th>
              <th scope="col">{t('hub.deposit')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ data, text, href }) => (
              <tr key={href}>
                <td>
                  <Link href={href} prefetch={false} className={styles.tableLink}>
                    {text.countryName}
                  </Link>
                </td>
                <td className={styles.numeric} data-label={t('hub.typicalWeek')}>
                  {data.all ? t('rangeValue', { low: money(data.all.low), high: money(data.all.high) }) : '—'}
                </td>
                <td data-label={t('hub.priciestMonth')}>
                  {data.all?.ranking?.priciest ? fmt.monthName(data.all.ranking.priciest) : '—'}
                </td>
                <td className={styles.numeric} data-label={tFacts('skipper')}>
                  {data.facts.skipperWeekly?.median ? money(data.facts.skipperWeekly.median) : '—'}
                </td>
                <td className={styles.numeric} data-label={t('hub.deposit')}>
                  {data.facts.deposit?.median ? money(data.facts.deposit.median) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.note}>{t('hub.note', { date: fmt.date(computedAt) })}</p>
      </section>
    </article>
  );
};

export default PriceGuideHubView;
