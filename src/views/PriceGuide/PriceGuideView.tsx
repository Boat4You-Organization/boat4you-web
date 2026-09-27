import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { GuideLanding, GuideTable, PriceGuideData } from '@/utils/server/priceGuide';
import styles from '@/views/Models/Models.module.scss';
import ModelsBreadcrumb, { Crumb } from '@/views/Models/ModelsBreadcrumb';
import ModelsFaq from '@/views/Models/ModelsFaq';
import factsStyles from '@/views/Search/CharterFacts/CharterFactsBlock.module.scss';
import { FactsRow, factsTiles, joinSentences } from '@/views/Search/CharterFacts/factsContent';
import { firstFullMonth } from '@/views/Search/CharterFacts/factsMath';

import guideStyles from './PriceGuide.module.scss';
import { GuideText } from './guideText';

interface PriceGuideViewProps {
  locale: string;
  data: PriceGuideData;
  text: GuideText;
  breadcrumb: Crumb[];
  countryLanding: GuideLanding | null;
  typeLandings: GuideLanding[];
  models: FactsRow[];
  bases: FactsRow[];
}

/**
 * /yacht-charter-prices/{country}: what a charter week costs, every figure
 * from the country's nightly charter facts (priceGuide.ts) — summary, key
 * figures, a month table for all boats and each main boat type, bases and
 * models, the method and a data-driven FAQ. Server-rendered, so the numbers
 * are in the HTML crawlers and AI assistants read.
 */
const PriceGuideView = async ({
  locale,
  data,
  text,
  breadcrumb,
  countryLanding,
  typeLandings,
  models,
  bases,
}: PriceGuideViewProps) => {
  const [t, tFacts] = await Promise.all([
    getTranslations({ locale, namespace: 'priceGuide' }),
    getTranslations({ locale, namespace: 'charterFacts' }),
  ]);
  const { fmt, where } = text;
  const { money, monthName } = fmt;
  const { facts, all, types } = data;
  const tables: GuideTable[] = [...(all ? [all] : []), ...types];
  const landingOf = (table: GuideTable): GuideLanding | null =>
    table.vesselType ? (typeLandings.find(l => l.boatType === table.vesselType) ?? null) : countryLanding;

  const tiles = [
    ...(all
      ? [{ label: t('typicalWeek'), value: t('rangeValue', { low: money(all.low), high: money(all.high) }) }]
      : []),
    ...factsTiles(
      facts,
      {
        activeBoats: tFacts('activeBoats'),
        skipper: tFacts('skipper'),
        obligatoryExtras: tFacts('obligatoryExtras'),
        deposit: tFacts('deposit'),
        checkIn: tFacts('checkIn'),
        medianBuildYear: tFacts('medianBuildYear'),
        medianWithRange: values => tFacts('medianWithRange', values),
        depositValue: values => tFacts('depositValue', values),
      },
      fmt
    ),
  ];

  // The full months the figures cover (factsMath.ts: never a partial or past month).
  const windowFrom = all ? firstFullMonth(facts, new Date()) : null;
  const windowTo = facts.windowTo?.slice(0, 7) ?? all?.months[all.months.length - 1]?.month;

  return (
    <article className={styles.root}>
      <ModelsBreadcrumb items={breadcrumb} label={t('breadcrumbLabel')} />
      <h1 className={styles.title}>{text.h1}</h1>
      <p className={guideStyles.updated}>{text.updated}</p>
      <p className={styles.lede}>{text.summary}</p>
      {countryLanding && (
        <p className={guideStyles.cta}>
          <Link href={countryLanding.href} prefetch={false} className={styles.tableLink}>
            {`${t('browseAll', { where })} (${fmt.number(countryLanding.fleet)}) →`}
          </Link>
        </p>
      )}

      <section className={styles.section} aria-labelledby="guide-figures">
        <h2 id="guide-figures" className={styles.sectionTitle}>
          {t('figuresHeading')}
        </h2>
        <dl className={styles.specs}>
          {tiles.map(tile => (
            <div key={tile.label} className={styles.spec}>
              <dt>{tile.label}</dt>
              <dd className={guideStyles.figure}>{tile.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {tables.length > 0 && (
        <section className={styles.section} aria-labelledby="guide-prices">
          <h2 id="guide-prices" className={styles.sectionTitle}>
            {t('pricesHeading')}
          </h2>
          <div className={guideStyles.tables}>
            {tables.map(table => {
              const key = table.vesselType ?? 'ALL';
              const landing = landingOf(table);
              const ranking = table.ranking
                ? joinSentences([
                    table.ranking.cheapest
                      ? tFacts('cheapestMonth', { month: monthName(table.ranking.cheapest) })
                      : null,
                    table.ranking.priciest
                      ? tFacts('priciestMonth', { month: monthName(table.ranking.priciest) })
                      : null,
                  ])
                : null;

              return (
                <div key={key} className={guideStyles.tableCard}>
                  <h3 id={`guide-table-${key}`} className={guideStyles.tableTitle}>
                    {t('tableHeading', { type: text.typeLabel(table.vesselType) })}
                  </h3>
                  <p className={guideStyles.tableNote}>
                    {t('typeNote', { boats: table.facts.activeBoats, low: money(table.low), high: money(table.high) })}
                  </p>
                  {ranking && <p className={guideStyles.tableRanking}>{ranking}</p>}
                  <div className={factsStyles.tableWrap}>
                    <table className={factsStyles.table} aria-labelledby={`guide-table-${key}`}>
                      <thead>
                        <tr>
                          <th scope="col">{tFacts('month')}</th>
                          <th scope="col">{tFacts('median')}</th>
                          <th scope="col">{tFacts('middleHalf')}</th>
                          <th scope="col">{t('boatsColumn')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.months.map(m => (
                          <tr key={m.month}>
                            <th scope="row">{monthName(m.month, 'short')}</th>
                            <td>{money(m.median)}</td>
                            <td>{m.p25 != null && m.p75 != null ? `${money(m.p25)} – ${money(m.p75)}` : '—'}</td>
                            <td>{fmt.number(m.boats ?? m.offers)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {landing && table.vesselType && (
                    <p className={guideStyles.tableLink}>
                      <Link href={landing.href} prefetch={false} className={factsStyles.link}>
                        {`${t('browseType', { type: text.typeLabel(table.vesselType), where })} (${fmt.number(landing.fleet)}) →`}
                      </Link>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {(bases.length > 0 || models.length > 0) && (
        <section className={styles.section} aria-label={`${tFacts('topBases')} · ${tFacts('topModels')}`}>
          <div className={factsStyles.lists}>
            {bases.length > 0 && (
              <div>
                <h2 className={styles.sectionTitle}>{tFacts('topBases')}</h2>
                <ul className={factsStyles.list}>
                  {bases.map(b => (
                    <li key={b.label}>
                      {b.href ? (
                        <Link href={b.href} prefetch={false} className={factsStyles.link}>
                          {b.label}
                        </Link>
                      ) : (
                        b.label
                      )}
                      <span className={factsStyles.count}>{tFacts('boats', { count: b.count })}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {models.length > 0 && (
              <div>
                <h2 className={styles.sectionTitle}>{tFacts('topModels')}</h2>
                <ul className={factsStyles.list}>
                  {models.map(m => (
                    <li key={m.label}>
                      {m.href ? (
                        <Link href={m.href} prefetch={false} className={factsStyles.link}>
                          {m.label}
                        </Link>
                      ) : (
                        m.label
                      )}
                      <span className={factsStyles.count}>{tFacts('boats', { count: m.count })}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {(countryLanding || typeLandings.length > 0) && (
        <section className={styles.section} aria-labelledby="guide-browse">
          <h2 id="guide-browse" className={styles.sectionTitle}>
            {t('browseHeading', { where })}
          </h2>
          <ul className={styles.modelList}>
            {[...(countryLanding ? [countryLanding] : []), ...typeLandings].map(landing => (
              <li key={landing.href} className={styles.modelItem}>
                <Link href={landing.href} prefetch={false} className={styles.modelLink}>
                  <span className={styles.modelName}>
                    {landing.boatType
                      ? t('browseType', { type: text.typeLabel(landing.boatType), where })
                      : t('browseAll', { where })}
                  </span>
                  <span className={styles.modelFacts}>{tFacts('boats', { count: landing.fleet })}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.section} aria-labelledby="guide-method">
        <h2 id="guide-method" className={styles.sectionTitle}>
          {t('methodHeading')}
        </h2>
        <div className={guideStyles.method}>
          {windowFrom && windowTo && (
            <p className={styles.body}>
              {joinSentences([
                t('method.population', {
                  priced: facts.boatsWithWeeklyPrices ?? facts.activeBoats,
                  where,
                  from: monthName(windowFrom),
                  to: monthName(windowTo),
                }),
              ])}
            </p>
          )}
          <p className={styles.body}>{t('method.median')}</p>
          <p className={styles.body}>{t('method.panel')}</p>
          <p className={styles.body}>{t('method.costs', { zero: money(0) })}</p>
          <p className={styles.note}>{t('method.updated', { date: fmt.date(facts.computedAt) })}</p>
        </div>
      </section>

      <ModelsFaq heading={t('faqHeading')} entries={text.faq} />
    </article>
  );
};

export default PriceGuideView;
