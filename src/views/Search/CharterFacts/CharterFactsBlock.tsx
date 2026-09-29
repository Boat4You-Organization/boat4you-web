import { getTranslations } from 'next-intl/server';

import { priceGuideByDid, priceGuidePath } from '@/config/priceGuides.config';
import { Link } from '@/i18n/navigation';
import { Currency } from '@/models/user.model';
import { VESSEL_TYPE_LABEL_MAP_PLURAL, VesselType } from '@/models/yacht.model';
import { fetchCharterFacts } from '@/utils/server/charterFacts';
import { gatedLandingPath } from '@/utils/server/landingLinks';
import { placeText } from '@/utils/server/placeText';
import { displayPlaceName } from '@/utils/static/croatianPlaceNames';

import styles from './CharterFactsBlock.module.scss';
import { factsBaseGroups, factsFormat, factsModelRows, factsTiles, joinSentences } from './factsContent';
import { monthRanking, reliableMonths } from './factsMath';

export interface CharterFactsTarget {
  /** The single did the facts row is keyed by (see factsDidFor). */
  did: string;
  vesselType: VesselType | null;
  /** Place name as the page shows it (localised for countries). */
  areaLabel: string;
  /** ISO country of the place: the sailing season a month ranking must fit (factsMath.ts). */
  countryCode: string | null;
  /** Every did the landing lists (dual-source places have several) — the
   *  listing facets the model counts are read from. */
  placeDids: string[];
}

interface CharterFactsBlockProps {
  target: CharterFactsTarget;
  locale: string;
  /** Page currency; figures are converted only when `rate` (EUR → currency) is known. */
  currency: Currency;
  rate: number | null;
  /** The landing's listing total, the number its count H2 shows; the "boats
   *  for charter" tile repeats it so the page states one number (audit B12).
   *  The block is rendered on unfiltered, undated landings only (search
   *  page), so this is never a filtered or dated count. */
  listingTotal?: number | null;
}

/**
 * "Charter facts" on gated destination landings: real inventory figures
 * computed nightly by the backend (charterFacts.ts). Server-rendered, so
 * the numbers are in the HTML crawlers read. Renders nothing when the
 * backend has no row, times out or errors — no empty frame, no layout gap.
 *
 * Prices follow the site rule: totals per charter week, never per day.
 * Formatting and rows are shared with the price guides (factsContent.ts).
 */
const CharterFactsBlock = async ({ target, locale, currency, rate, listingTotal = null }: CharterFactsBlockProps) => {
  const facts = await fetchCharterFacts(target.did, target.vesselType);

  if (!facts) return null;

  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'charterFacts' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);

  const fmt = factsFormat(locale, currency, rate);
  const { money, monthName } = fmt;

  const typeLabel = target.vesselType
    ? (tCommon.raw(VESSEL_TYPE_LABEL_MAP_PLURAL[target.vesselType].replace(/^common\./, '') as never) as string)
    : null;
  const heading = t('heading', { area: typeLabel ? `${target.areaLabel} · ${typeLabel}` : target.areaLabel });

  // Only full months with a real sample and a real price are shown; a month
  // is named cheapest / priciest only under the rules in factsMath.ts (B11).
  const shownMonths = reliableMonths(facts);
  const { months } = shownMonths;
  const ranking = monthRanking(shownMonths, target.countryCode);

  // Links only to pages that exist and are indexable: model pages from the
  // model catalogue, bases through the landing gate (the page's boat type
  // first, then the base's own landing).
  const [models, bases] = await Promise.all([
    factsModelRows(facts, target.placeDids, target.vesselType),
    factsBaseGroups(facts).then(groups =>
      Promise.all(
        groups.map(async g => ({
          // The catalogue's spelling may lack the diacritics ("Marina Kastela", R32).
          label: displayPlaceName(g.label),
          count: g.count,
          href:
            (target.vesselType && (await gatedLandingPath(g.did, g.label, locale, target.vesselType))) ||
            (await gatedLandingPath(g.did, g.label, locale)),
        }))
      )
    ),
  ]);

  // The country's price guide (/yacht-charter-prices/{country}) — on its
  // landing and on the country's boat-type landings (same facts did).
  const guide = priceGuideByDid(target.did);
  const guideLink = guide
    ? await Promise.all([
        getTranslations({ locale, namespace: 'priceGuide' }),
        // The country's localised phrase ("u Hrvatskoj").
        placeText(locale, guide.name),
      ]).then(([tGuide, place]) => ({
        href: priceGuidePath(guide.slug),
        label: tGuide('landingLink', { where: place.where }),
      }))
    : null;

  const tiles = factsTiles(
    facts,
    {
      activeBoats: t('activeBoats'),
      skipper: t('skipper'),
      obligatoryExtras: t('obligatoryExtras'),
      deposit: t('deposit'),
      checkIn: t('checkIn'),
      medianBuildYear: t('medianBuildYear'),
      medianWithRange: values => t('medianWithRange', values),
      depositValue: values => t('depositValue', values),
    },
    fmt,
    listingTotal
  );

  return (
    <section className={styles.root} aria-labelledby="charter-facts-heading">
      <h2 id="charter-facts-heading" className={styles.title}>
        {heading}
      </h2>
      <p className={styles.updated}>{t('updated', { date: fmt.date(facts.computedAt) })}</p>

      <dl className={styles.tiles}>
        {tiles.map(tile => (
          <div key={tile.label} className={styles.tile}>
            <dt>{tile.label}</dt>
            <dd>{tile.value}</dd>
          </div>
        ))}
      </dl>

      {months.length > 0 && (
        <div className={styles.block}>
          <h3 className={styles.subtitle}>{t('pricesHeading')}</h3>
          {ranking && (
            <p className={styles.text}>
              {joinSentences([
                ranking.cheapest ? t('cheapestMonth', { month: monthName(ranking.cheapest) }) : null,
                ranking.priciest ? t('priciestMonth', { month: monthName(ranking.priciest) }) : null,
              ])}
            </p>
          )}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">{t('month')}</th>
                  <th scope="col">{t('median')}</th>
                  <th scope="col">{t('middleHalf')}</th>
                </tr>
              </thead>
              <tbody>
                {months.map(m => (
                  <tr key={m.month}>
                    <th scope="row">{monthName(m.month, 'short')}</th>
                    <td>{money(m.median)}</td>
                    <td>{m.p25 != null && m.p75 != null ? `${money(m.p25)} – ${money(m.p75)}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {guideLink && (
        <p className={styles.guide}>
          <Link href={guideLink.href} prefetch={false} className={styles.link}>
            {guideLink.label} →
          </Link>
        </p>
      )}

      {(models.length > 0 || bases.length > 0) && (
        <div className={styles.lists}>
          {models.length > 0 && (
            <div>
              <h3 className={styles.subtitle}>{t('topModels')}</h3>
              <ul className={styles.list}>
                {models.map(m => (
                  <li key={m.label}>
                    {m.href ? (
                      <Link href={m.href} prefetch={false} className={styles.link}>
                        {m.label}
                      </Link>
                    ) : (
                      m.label
                    )}
                    <span className={styles.count}>{t('boats', { count: m.count })}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {bases.length > 0 && (
            <div>
              <h3 className={styles.subtitle}>{t('topBases')}</h3>
              <ul className={styles.list}>
                {bases.map(b => (
                  <li key={b.label}>
                    {b.href ? (
                      <Link href={b.href} prefetch={false} className={styles.link}>
                        {b.label}
                      </Link>
                    ) : (
                      b.label
                    )}
                    <span className={styles.count}>{t('boats', { count: b.count })}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <p className={styles.note}>
        {t('note')} {fmt.converted ? t('noteConverted', { currency: fmt.currency }) : t('noteEur')}
      </p>
    </section>
  );
};

export default CharterFactsBlock;
