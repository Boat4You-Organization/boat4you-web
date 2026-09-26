import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { Currency } from '@/models/user.model';
import { VESSEL_TYPE_LABEL_MAP_PLURAL, VesselType } from '@/models/yacht.model';
import { fetchCharterFacts } from '@/utils/server/charterFacts';
import { loadDestinationIndex, locationForDid, resolveDestinationName } from '@/utils/server/destinationDid';
import { gatedLandingPath } from '@/utils/server/landingLinks';
import { findModelForYacht } from '@/utils/server/modelCatalog';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { canonicalManufacturer, modelDisplayName } from '@/utils/static/yachtModelKey';

import styles from './CharterFactsBlock.module.scss';
import { MIN_ROW_BOATS, isTypeNameModel, monthRanking, reliableMonths } from './factsMath';

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

const ISO_DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
/** Check-in days below this share are noise next to the main change-over day. */
const MIN_DAY_SHARE = 0.05;

/**
 * "Charter facts" on gated destination landings: real inventory figures
 * computed nightly by the backend (charterFacts.ts). Server-rendered, so
 * the numbers are in the HTML crawlers read. Renders nothing when the
 * backend has no row, times out or errors — no empty frame, no layout gap.
 *
 * Prices follow the site rule: totals per charter week, never per day.
 */
const DISTRIBUTION_REVALIDATE_SECONDS = 21600;

/**
 * byModel facets of this landing — the same request (URL + cache window) the
 * landing's model links read (landingNav.ts), so a model row states the
 * number its link does ("Bavaria Cruiser 46 (146)", not 139 here).
 */
const landingModelFacets = async (
  dids: string[],
  boatType: VesselType | null
): Promise<Record<string, number> | null> => {
  const did = [...dids].sort().join(',');
  const typeQuery = boatType ? `&boatTypes=${encodeURIComponent(boatType)}` : '';

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/yachts/distribution?did=${encodeURIComponent(did)}${typeQuery}`,
      { next: { revalidate: DISTRIBUTION_REVALIDATE_SECONDS }, signal: AbortSignal.timeout(1500) }
    );

    return response.ok ? (((await response.json()) as { byModel?: Record<string, number> }).byModel ?? null) : null;
  } catch {
    return null;
  }
};

const CharterFactsBlock = async ({ target, locale, currency, rate, listingTotal = null }: CharterFactsBlockProps) => {
  const facts = await fetchCharterFacts(target.did, target.vesselType);

  if (!facts) return null;

  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'charterFacts' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);

  const convert = currency !== Currency.EUR && rate && rate > 0;
  const shownCurrency = convert ? currency : Currency.EUR;
  const money = (eur: number | null | undefined): string =>
    formatPriceWithCurrency({
      clientPriceInfo: { amount: Math.round((eur ?? 0) * (convert ? (rate as number) : 1)), currency: shownCurrency },
      locale,
    });
  const monthName = (month: string, style: 'long' | 'short' = 'long'): string => {
    const [year, m] = month.split('-').map(Number);

    if (!year || !m) return month;

    return new Intl.DateTimeFormat(locale, { month: style, year: 'numeric', timeZone: 'UTC' }).format(
      new Date(Date.UTC(year, m - 1, 1))
    );
  };
  const dayName = (day: string): string => {
    const index = ISO_DAYS.indexOf(day);

    // 2024-01-01 was a Monday.
    return index < 0
      ? day
      : new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(
          new Date(Date.UTC(2024, 0, 1 + index))
        );
  };
  const percent = (share: number): string =>
    new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(share);

  const typeLabel = target.vesselType
    ? (tCommon.raw(VESSEL_TYPE_LABEL_MAP_PLURAL[target.vesselType].replace(/^common\./, '') as never) as string)
    : null;
  const heading = t('heading', { area: typeLabel ? `${target.areaLabel} · ${typeLabel}` : target.areaLabel });

  // Only full months with a real sample and a real price are shown; a month
  // is named cheapest / priciest only under the rules in factsMath.ts (B11).
  const shownMonths = reliableMonths(facts);
  const { months } = shownMonths;
  const ranking = monthRanking(shownMonths, target.countryCode);
  const checkIn = (facts.checkInDays ?? [])
    .filter(d => d.share >= MIN_DAY_SHARE)
    .sort((a, b) => b.share - a.share)
    .slice(0, 3);

  // Links only to pages that exist and are indexable: model pages from the
  // model catalogue, bases through the landing gate (the page's boat type
  // first, then the base's own landing).
  const [models, bases] = await Promise.all([
    (async () => {
      const rows = (facts.topModels ?? []).filter(
        m => m.count >= MIN_ROW_BOATS && m.model && !isTypeNameModel(m.model, m.manufacturer)
      );
      const [facets, pages] = await Promise.all([
        landingModelFacets(target.placeDids, target.vesselType),
        Promise.all(rows.map(m => findModelForYacht(m.manufacturer, m.model, 800))),
      ]);
      const seen = new Set<string>();

      return rows
        .map((m, i) => {
          const page = pages[i];
          const brand = canonicalManufacturer(m.manufacturer);
          // A model with its own page: the listing facet (its link's number).
          const listed = page && facets ? page.modelIds.reduce((sum, id) => sum + (facets[String(id)] ?? 0), 0) : 0;

          return {
            label: page?.displayName ?? (brand ? modelDisplayName(brand, m.model) : m.model),
            count: listed > 0 ? listed : m.count,
            href: page?.path ?? null,
          };
        })
        .filter(m => {
          // Two partner spellings of one model page fold into one row.
          if (seen.has(m.label)) return false;

          seen.add(m.label);

          return true;
        });
    })(),
    (async () => {
      // One row per catalogue place: the same marina imported by two partners
      // under names the catalogue folds together (Kastela / Kaštela, combined
      // rows like "l-57,l-1749") is one base — the backend groups by its own
      // transliterated name (audit B13). Named and linked as its landing.
      const index = await loadDestinationIndex().catch(() => null);
      const groups = new Map<string, { label: string; count: number; did: string; dids: string[] }>();

      await Promise.all(
        (facts.topBases ?? []).map(async b => {
          const location = index ? locationForDid(index, b.did) : null;
          const resolved = index ? await resolveDestinationName(index, location?.name ?? b.name) : null;
          const dids = resolved?.dids.includes(b.did) ? resolved.dids : [b.did];
          const key = [...dids].sort().join(',');
          const group = groups.get(key) ?? {
            label: (resolved?.dids.includes(b.did) ? resolved.name : null) ?? location?.name ?? b.name,
            count: 0,
            did: b.did,
            dids,
          };

          group.count += b.count;
          groups.set(key, group);
        })
      );

      return Promise.all(
        Array.from(groups.values())
          .sort((a, b) => b.count - a.count)
          .map(async g => ({
            label: g.label,
            count: g.count,
            href:
              (target.vesselType && (await gatedLandingPath(g.did, g.label, locale, target.vesselType))) ||
              (await gatedLandingPath(g.did, g.label, locale)),
          }))
      );
    })(),
  ]);

  const tiles: Array<{ label: string; value: string }> = [
    // The page's own listing total (the count H2's number); the nightly
    // weekly-offer count only when the listing total is unknown.
    {
      label: t('activeBoats'),
      value: (listingTotal && listingTotal > 0 ? listingTotal : facts.activeBoats).toLocaleString(locale),
    },
    ...(facts.skipperWeekly && facts.skipperWeekly.median > 0
      ? [
          {
            label: t('skipper'),
            value:
              facts.skipperWeekly.p25 != null && facts.skipperWeekly.p75 != null
                ? t('medianWithRange', {
                    median: money(facts.skipperWeekly.median),
                    p25: money(facts.skipperWeekly.p25),
                    p75: money(facts.skipperWeekly.p75),
                  })
                : money(facts.skipperWeekly.median),
          },
        ]
      : []),
    // A 0 € median means most boats list no obligatory extras — "0 €" read
    // like the old "7 days 0 €" bug (audit B13), so the tile is left out.
    ...(facts.obligatoryExtrasWeekly && facts.obligatoryExtrasWeekly.median > 0
      ? [{ label: t('obligatoryExtras'), value: money(facts.obligatoryExtrasWeekly.median) }]
      : []),
    ...(facts.deposit && facts.deposit.median > 0
      ? [
          {
            label: t('deposit'),
            value:
              facts.deposit.min != null && facts.deposit.max != null && facts.deposit.min !== facts.deposit.max
                ? t('depositValue', {
                    min: money(facts.deposit.min),
                    max: money(facts.deposit.max),
                    median: money(facts.deposit.median),
                  })
                : money(facts.deposit.median),
          },
        ]
      : []),
    ...(checkIn.length
      ? [{ label: t('checkIn'), value: checkIn.map(d => `${dayName(d.day)} (${percent(d.share)})`).join(', ') }]
      : []),
    ...(facts.medianBuildYear ? [{ label: t('medianBuildYear'), value: String(facts.medianBuildYear) }] : []),
  ];

  const updated = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(facts.computedAt)
  );

  return (
    <section className={styles.root} aria-labelledby="charter-facts-heading">
      <h2 id="charter-facts-heading" className={styles.title}>
        {heading}
      </h2>
      <p className={styles.updated}>{t('updated', { date: updated })}</p>

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
              {/* HR month names end with the ordinal dot ("listopad 2026."),
                  which met the sentence's own full stop ("2026.."). */}
              {[
                ranking.cheapest ? t('cheapestMonth', { month: monthName(ranking.cheapest) }) : null,
                ranking.priciest ? t('priciestMonth', { month: monthName(ranking.priciest) }) : null,
              ]
                .filter(Boolean)
                .join(' ')
                .replace(/\.\./g, '.')}
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
        {t('note')} {convert ? t('noteConverted', { currency: shownCurrency }) : t('noteEur')}
      </p>
    </section>
  );
};

export default CharterFactsBlock;
