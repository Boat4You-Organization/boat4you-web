import 'server-only';

import { Currency } from '@/models/user.model';
import { VesselType } from '@/models/yacht.model';
import { CharterFacts } from '@/utils/server/charterFacts';
import { loadDestinationIndex, locationForDid, resolveDestinationName } from '@/utils/server/destinationDid';
import { findModelForYacht } from '@/utils/server/modelCatalog';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { canonicalManufacturer, modelDisplayName } from '@/utils/static/yachtModelKey';

import { MIN_ROW_BOATS, isTypeNameModel } from './factsMath';

/**
 * Formatting and rows of the nightly charter facts, shared by the landing
 * facts block (CharterFactsBlock) and the price guides (/yacht-charter-prices):
 * one wording of the same figures on every page that shows them.
 */

const ISO_DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
/** Check-in days below this share are noise next to the main change-over day. */
const MIN_DAY_SHARE = 0.05;

export interface FactsFormat {
  /** Page currency of the amounts (EUR unless converted). */
  currency: Currency;
  converted: boolean;
  money: (eur: number | null | undefined) => string;
  /** "July 2027" / "Jul 2027" in the locale. */
  monthName: (month: string, style?: 'long' | 'short') => string;
  /** "SATURDAY" → "Saturday" in the locale. */
  dayName: (day: string) => string;
  percent: (share: number) => string;
  number: (n: number) => string;
  /** "27 September 2026" in the locale. */
  date: (iso: string) => string;
}

/** Formatters of one page; amounts are converted only when `rate` (EUR → currency) is known. */
export const factsFormat = (
  locale: string,
  currency: Currency = Currency.EUR,
  rate: number | null = null
): FactsFormat => {
  const converted = currency !== Currency.EUR && !!rate && rate > 0;
  const shown = converted ? currency : Currency.EUR;

  return {
    currency: shown,
    converted,
    money: eur =>
      formatPriceWithCurrency({
        clientPriceInfo: { amount: Math.round((eur ?? 0) * (converted ? (rate as number) : 1)), currency: shown },
        locale,
      }),
    monthName: (month, style = 'long') => {
      const [year, m] = month.split('-').map(Number);

      if (!year || !m) return month;

      return new Intl.DateTimeFormat(locale, { month: style, year: 'numeric', timeZone: 'UTC' }).format(
        new Date(Date.UTC(year, m - 1, 1))
      );
    },
    dayName: day => {
      const index = ISO_DAYS.indexOf(day);

      // 2024-01-01 was a Monday.
      return index < 0
        ? day
        : new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(
            new Date(Date.UTC(2024, 0, 1 + index))
          );
    },
    percent: share => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(share),
    number: n => n.toLocaleString(locale),
    date: iso =>
      new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso)),
  };
};

/** HR month names end with the ordinal dot ("srpanj 2027."), which meets a sentence's own full stop ("2027.."). */
export const joinSentences = (sentences: Array<string | null | undefined | false>): string =>
  sentences.filter(Boolean).join(' ').replace(/\.\./g, '.');

/** The main check-in days (share ≥ 5 %), most common first, at most three. */
export const mainCheckInDays = (facts: Pick<CharterFacts, 'checkInDays'>): Array<{ day: string; share: number }> =>
  (facts.checkInDays ?? [])
    .filter(d => d.share >= MIN_DAY_SHARE)
    .sort((a, b) => b.share - a.share)
    .slice(0, 3);

export interface FactsTileLabels {
  activeBoats: string;
  skipper: string;
  obligatoryExtras: string;
  deposit: string;
  checkIn: string;
  medianBuildYear: string;
  medianWithRange: (values: { median: string; p25: string; p75: string }) => string;
  depositValue: (values: { min: string; max: string; median: string }) => string;
}

/**
 * The figure tiles of a facts row: boats, skipper, obligatory extras, deposit,
 * check-in days and median build year — each only when the row carries it.
 * `listingTotal` (the landing's count H2) replaces the nightly boat count when
 * known, so a page states one number (audit B12).
 */
export const factsTiles = (
  facts: CharterFacts,
  labels: FactsTileLabels,
  fmt: FactsFormat,
  listingTotal: number | null = null
): Array<{ label: string; value: string }> => {
  const { money } = fmt;
  const checkIn = mainCheckInDays(facts);

  return [
    {
      label: labels.activeBoats,
      value: fmt.number(listingTotal && listingTotal > 0 ? listingTotal : facts.activeBoats),
    },
    ...(facts.skipperWeekly && facts.skipperWeekly.median > 0
      ? [
          {
            label: labels.skipper,
            value:
              facts.skipperWeekly.p25 != null && facts.skipperWeekly.p75 != null
                ? labels.medianWithRange({
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
      ? [{ label: labels.obligatoryExtras, value: money(facts.obligatoryExtrasWeekly.median) }]
      : []),
    ...(facts.deposit && facts.deposit.median > 0
      ? [
          {
            label: labels.deposit,
            value:
              facts.deposit.min != null && facts.deposit.max != null && facts.deposit.min !== facts.deposit.max
                ? labels.depositValue({
                    min: money(facts.deposit.min),
                    max: money(facts.deposit.max),
                    median: money(facts.deposit.median),
                  })
                : money(facts.deposit.median),
          },
        ]
      : []),
    ...(checkIn.length
      ? [
          {
            label: labels.checkIn,
            value: checkIn.map(d => `${fmt.dayName(d.day)} (${fmt.percent(d.share)})`).join(', '),
          },
        ]
      : []),
    ...(facts.medianBuildYear ? [{ label: labels.medianBuildYear, value: String(facts.medianBuildYear) }] : []),
  ];
};

const DISTRIBUTION_REVALIDATE_SECONDS = 21600;

/**
 * byModel facets of a place — the same request (URL + cache window) the
 * landing's model links read (landingNav.ts), so a model row states the
 * number its link does ("Bavaria Cruiser 46 (146)", not 139 here).
 */
const placeModelFacets = async (
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

export interface FactsRow {
  label: string;
  count: number;
  /** Locale-less link, or null (plain text). */
  href: string | null;
}

/**
 * Most common models of a facts row: real model names with MIN_ROW_BOATS
 * boats, linked to their /yachts model page when one exists (the model
 * catalogue), counted like that page's listing facet. Two partner spellings
 * of one model page fold into one row.
 */
export const factsModelRows = async (
  facts: CharterFacts,
  placeDids: string[],
  vesselType: VesselType | null,
  /** false: always the facts row's own count (price guides: stable, equals the API; the facet times out cold). */
  useFacets = true
): Promise<FactsRow[]> => {
  const rows = (facts.topModels ?? []).filter(
    m => m.count >= MIN_ROW_BOATS && m.model && !isTypeNameModel(m.model, m.manufacturer)
  );
  const [facets, pages] = await Promise.all([
    useFacets ? placeModelFacets(placeDids, vesselType) : Promise.resolve(null),
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
      if (seen.has(m.label)) return false;

      seen.add(m.label);

      return true;
    });
};

export interface FactsBaseGroup {
  /** The base as its landing names it (catalogue name). */
  label: string;
  count: number;
  /** The facts row's did of the base (the first of the group). */
  did: string;
  /** Every did of the catalogue place. */
  dids: string[];
}

/**
 * Main bases of a facts row, one per catalogue place: the same marina
 * imported by two partners under names the catalogue folds together
 * (Kastela / Kaštela, combined rows like "l-57,l-1749") is one base — the
 * backend groups by its own transliterated name (audit B13). Biggest first.
 */
export const factsBaseGroups = async (facts: CharterFacts): Promise<FactsBaseGroup[]> => {
  const index = await loadDestinationIndex().catch(() => null);
  const groups = new Map<string, FactsBaseGroup>();

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

  return Array.from(groups.values()).sort((a, b) => b.count - a.count);
};
