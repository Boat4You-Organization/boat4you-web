import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { PriceGuideData } from '@/utils/server/priceGuide';
import { displayPlaceName } from '@/utils/static/croatianPlaceNames';
import { isOperatorName } from '@/utils/static/operatorNames';
import styles from '@/views/Models/Models.module.scss';
import ModelsBreadcrumb, { Crumb } from '@/views/Models/ModelsBreadcrumb';

import { GuideText } from './guideText';

/** Bases named in a country teaser. */
const TEASER_BASES = 3;

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
 * of the headline figures, all from the same facts rows as the guides — and,
 * since the hub read as a 260-word list (audit 29.9.2026, R35), how the
 * figures are to be read, a teaser per country in prose from the same live
 * facts (boats, typical week, cheapest / priciest month, skipper, deposit,
 * main bases) and when a charter week costs less.
 */
const PriceGuideHubView = async ({ locale, rows, boats, computedAt, breadcrumb }: PriceGuideHubViewProps) => {
  const [t, tFacts] = await Promise.all([
    getTranslations({ locale, namespace: 'priceGuide' }),
    getTranslations({ locale, namespace: 'charterFacts' }),
  ]);
  const [{ text: firstText }] = rows;
  const { fmt } = firstText;
  const { money } = fmt;
  const listFormat = new Intl.ListFormat(locale, { type: 'conjunction' });
  // "in Croatia" → "In Croatia" at the start of the teaser sentence.
  const sentenceCase = (phrase: string) => phrase.charAt(0).toLocaleUpperCase(locale) + phrase.slice(1);

  /** One country in prose, from the guide's own facts row; only the figures the row has. */
  const teaserFor = ({ data, text }: HubRow): string => {
    const { facts, all } = data;
    const where = sentenceCase(text.where);
    const priced = facts.boatsWithWeeklyPrices ?? facts.activeBoats;
    const ranking = all?.ranking;
    const sentences: string[] = [];

    if (all && ranking?.cheapest && ranking?.priciest) {
      sentences.push(
        t('hub.countryTeaser', {
          where,
          boats: priced,
          low: money(all.low),
          high: money(all.high),
          cheapest: fmt.monthName(ranking.cheapest),
          priciest: fmt.monthName(ranking.priciest),
        })
      );
    } else if (all) {
      sentences.push(t('hub.countryTeaserRange', { where, boats: priced, low: money(all.low), high: money(all.high) }));
    } else {
      sentences.push(t('hub.countryTeaserNoPrices', { where, boats: facts.activeBoats }));
    }

    if (facts.skipperWeekly?.median) sentences.push(t('hub.countryTeaserSkipper', { skipper: money(facts.skipperWeekly.median) }));

    if (facts.deposit?.median) sentences.push(t('hub.countryTeaserDeposit', { deposit: money(facts.deposit.median) }));

    // Marina names with their diacritics (R32); never a base named after a charter company.
    const bases = (facts.topBases ?? [])
      .map(base => base.name)
      .filter(name => name && !isOperatorName(name))
      .slice(0, TEASER_BASES)
      .map(displayPlaceName);

    if (bases.length) sentences.push(t('hub.countryTeaserBases', { bases: listFormat.format(bases) }));

    return sentences.join(' ');
  };

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

      <section className={styles.section} aria-labelledby="hub-read">
        <h2 id="hub-read" className={styles.sectionTitle}>
          {t('hub.readHeading')}
        </h2>
        <div className={styles.prose}>
          <p className={styles.body}>{t('hub.read1')}</p>
          <p className={styles.body}>{t('hub.read2')}</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="hub-countries">
        <h2 id="hub-countries" className={styles.sectionTitle}>
          {t('hub.countriesHeading')}
        </h2>
        <div className={styles.faqList}>
          {rows.map(row => (
            <div key={row.href} className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                <Link href={row.href} prefetch={false} className={styles.tableLink}>
                  {row.text.countryName}
                </Link>
              </h3>
              <p className={styles.faqAnswer}>{teaserFor(row)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="hub-save">
        <h2 id="hub-save" className={styles.sectionTitle}>
          {t('hub.saveHeading')}
        </h2>
        <div className={styles.prose}>
          <p className={styles.body}>{t('hub.save1')}</p>
          <p className={styles.body}>{t('hub.save2')}</p>
          <p className={styles.body}>{t('hub.save3')}</p>
        </div>
      </section>
    </article>
  );
};

export default PriceGuideHubView;
