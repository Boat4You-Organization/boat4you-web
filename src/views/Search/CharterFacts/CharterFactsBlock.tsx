import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { Currency } from '@/models/user.model';
import { VESSEL_TYPE_LABEL_MAP_PLURAL, VesselType } from '@/models/yacht.model';
import { fetchCharterFacts } from '@/utils/server/charterFacts';
import { gatedLandingPath } from '@/utils/server/landingLinks';
import { findModelForYacht } from '@/utils/server/modelCatalog';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { canonicalManufacturer, modelDisplayName } from '@/utils/static/yachtModelKey';

import styles from './CharterFactsBlock.module.scss';

export interface CharterFactsTarget {
  /** The single did the facts row is keyed by (see factsDidFor). */
  did: string;
  vesselType: VesselType | null;
  /** Place name as the page shows it (localised for countries). */
  areaLabel: string;
}

interface CharterFactsBlockProps {
  target: CharterFactsTarget;
  locale: string;
  /** Page currency; figures are converted only when `rate` (EUR → currency) is known. */
  currency: Currency;
  rate: number | null;
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
const CharterFactsBlock = async ({ target, locale, currency, rate }: CharterFactsBlockProps) => {
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

  const months = (facts.priceByMonth ?? []).filter(m => m.median != null);
  const checkIn = (facts.checkInDays ?? [])
    .filter(d => d.share >= MIN_DAY_SHARE)
    .sort((a, b) => b.share - a.share)
    .slice(0, 3);

  // Links only to pages that exist and are indexable: model pages from the
  // model catalogue, bases through the landing gate (the page's boat type
  // first, then the base's own landing).
  const [models, bases] = await Promise.all([
    Promise.all(
      (facts.topModels ?? []).map(async m => {
        const page = await findModelForYacht(m.manufacturer, m.model, 800);

        const brand = canonicalManufacturer(m.manufacturer);

        return {
          label: page?.displayName ?? (brand ? modelDisplayName(brand, m.model) : m.model),
          count: m.count,
          href: page?.path ?? null,
        };
      })
    ),
    Promise.all(
      (facts.topBases ?? []).map(async b => ({
        label: b.name,
        count: b.count,
        href:
          (target.vesselType && (await gatedLandingPath(b.did, b.name, locale, target.vesselType))) ||
          (await gatedLandingPath(b.did, b.name, locale)),
      }))
    ),
  ]);

  const tiles: Array<{ label: string; value: string }> = [
    { label: t('activeBoats'), value: facts.activeBoats.toLocaleString(locale) },
    ...(facts.skipperWeekly
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
    ...(facts.obligatoryExtrasWeekly
      ? [{ label: t('obligatoryExtras'), value: money(facts.obligatoryExtrasWeekly.median) }]
      : []),
    ...(facts.deposit
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
          {(facts.cheapestMonth || facts.priciestMonth) && (
            <p className={styles.text}>
              {[
                facts.cheapestMonth ? t('cheapestMonth', { month: monthName(facts.cheapestMonth) }) : null,
                facts.priciestMonth ? t('priciestMonth', { month: monthName(facts.priciestMonth) }) : null,
              ]
                .filter(Boolean)
                .join(' ')}
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
