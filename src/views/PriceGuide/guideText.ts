import { getTranslations } from 'next-intl/server';
import 'server-only';

import { VESSEL_TYPE_LABEL_MAP_PLURAL, VesselType } from '@/models/yacht.model';
import { placeText } from '@/utils/server/placeText';
import { PriceGuideData } from '@/utils/server/priceGuide';
import { fitDescription } from '@/utils/static/metaLength';
import { ModelsFaqEntry } from '@/views/Models/ModelsFaq';
import { FactsFormat, factsFormat, joinSentences, mainCheckInDays } from '@/views/Search/CharterFacts/factsContent';

/**
 * The words of one price guide, every number from its facts row
 * (priceGuide.ts): title, meta description, H1, the summary paragraph and
 * the FAQ. Shared by generateMetadata and the page, so the snippet and the
 * page state the same figures. Sentences are separate messages, each left
 * out when its figure is missing.
 */

/** Longest <title> (with or without the brand suffix) and meta description. */
export const GUIDE_TITLE_MAX = 60;
export const GUIDE_DESCRIPTION_MAX = 155;

const BRAND_SUFFIX = ' | Boat4You';

export interface GuideText {
  fmt: FactsFormat;
  /** Localised country name ("Hrvatska") and its phrase ("u Hrvatskoj"). */
  countryName: string;
  where: string;
  h1: string;
  /** Absolute <title>, at most GUIDE_TITLE_MAX characters. */
  title: string;
  description: string;
  summary: string;
  updated: string;
  faq: ModelsFaqEntry[];
  /** Nominative plural of a boat type ("Sailing Yachts"), or the all-boats label. */
  typeLabel: (type: VesselType | null) => string;
}

/**
 * The longest title that fits: "{h1}: weekly costs by month | Boat4You",
 * then without the brand, then the H1 with and without it.
 */
export const fitTitle = (candidates: string[]): string => {
  const options = candidates.flatMap(c => [`${c}${BRAND_SUFFIX}`, c]);

  return options.find(o => o.length <= GUIDE_TITLE_MAX) ?? options[options.length - 1];
};

/**
 * Sentences in order, each kept only when the text still fits `max` — a
 * later, shorter sentence can follow one that did not fit (fitDescription
 * only drops from the end).
 */
export const fitSentences = (sentences: Array<string | null | undefined>, max: number): string =>
  sentences.reduce<string>((out, sentence) => {
    if (!sentence) return out;

    const next = joinSentences([out, sentence]);

    return next.length <= max ? next : out;
  }, '');

/** A type label inside a sentence: lower case, except German nouns. */
const inSentence = (label: string, locale: string): string =>
  locale === 'de' ? label : label.toLocaleLowerCase(locale);

export const buildGuideText = async (data: PriceGuideData, locale: string): Promise<GuideText> => {
  const [t, tCommon, place] = await Promise.all([
    getTranslations({ locale, namespace: 'priceGuide' }),
    getTranslations({ locale, namespace: 'common' }),
    placeText(locale, data.guide.name),
  ]);
  const fmt = factsFormat(locale);
  const { money, monthName } = fmt;
  const { facts, all, types } = data;
  const { where } = place;

  const typeLabel = (type: VesselType | null): string =>
    type
      ? (tCommon.raw(VESSEL_TYPE_LABEL_MAP_PLURAL[type].replace(/^common\./, '') as never) as string)
      : t('allBoats');

  const h1 = t('h1', { where });
  const title = fitTitle([t('meta.title', { h1 }), h1]);
  const priced = facts.boatsWithWeeklyPrices ?? facts.activeBoats;

  const skipper = facts.skipperWeekly && facts.skipperWeekly.median > 0 ? facts.skipperWeekly : null;
  const extras =
    facts.obligatoryExtrasWeekly && facts.obligatoryExtrasWeekly.median > 0 ? facts.obligatoryExtrasWeekly : null;
  const deposit = facts.deposit && facts.deposit.median > 0 ? facts.deposit : null;
  let depositSentence: string | null = null;

  if (deposit && deposit.min != null && deposit.max != null && deposit.min !== deposit.max) {
    depositSentence = t('summary.deposit', {
      median: money(deposit.median),
      min: money(deposit.min),
      max: money(deposit.max),
    });
  } else if (deposit) {
    depositSentence = t('summary.depositSingle', { median: money(deposit.median) });
  }

  let costsSentence: string | null = null;

  if (skipper && extras) {
    costsSentence = t('summary.skipperExtras', { skipper: money(skipper.median), extras: money(extras.median) });
  } else if (skipper) {
    costsSentence = t('summary.skipper', { skipper: money(skipper.median) });
  } else if (extras) {
    costsSentence = t('summary.extras', { extras: money(extras.median) });
  }

  // Month claims only where factsMath.ts lets the page name the month.
  const monthOf = (month: string | null | undefined) => (month ? all?.months.find(m => m.month === month) : null);
  const priciest = monthOf(all?.ranking?.priciest);
  const cheapest = monthOf(all?.ranking?.cheapest);
  let priciestSentence: string | null = null;

  if (priciest && priciest.p25 != null && priciest.p75 != null) {
    priciestSentence = t('summary.priciestRange', {
      month: monthName(priciest.month),
      median: money(priciest.median),
      p25: money(priciest.p25),
      p75: money(priciest.p75),
    });
  } else if (priciest) {
    priciestSentence = t('summary.priciest', { month: monthName(priciest.month), median: money(priciest.median) });
  }

  const cheapestSentence = cheapest
    ? t('summary.cheapest', { month: monthName(cheapest.month), median: money(cheapest.median) })
    : null;

  const summary = joinSentences([
    t('summary.fleet', { active: facts.activeBoats, priced, where }),
    all ? t('summary.range', { low: money(all.low), high: money(all.high) }) : null,
    cheapestSentence,
    priciestSentence,
    costsSentence,
    depositSentence,
  ]);

  const list = (items: string[]) => new Intl.ListFormat(locale, { type: 'conjunction' }).format(items);
  // The sentences in order of importance, each kept only while the whole still fits.
  const description =
    fitSentences(
      [
        all ? t('meta.descRange', { where, low: money(all.low), high: money(all.high) }) : null,
        types.length
          ? t('meta.descTypes', { types: list(types.map(tb => inSentence(typeLabel(tb.vesselType), locale))) })
          : null,
        skipper ? t('meta.descSkipper', { skipper: money(skipper.median) }) : null,
      ],
      GUIDE_DESCRIPTION_MAX
    ) || fitDescription(h1, GUIDE_DESCRIPTION_MAX);

  // FAQ — 4–6 questions, each answered with the figures above.
  const faq: ModelsFaqEntry[] = [];

  if (all) {
    faq.push({
      question: t('faq.costQ', { where }),
      answer: t('faq.costA', { where, low: money(all.low), high: money(all.high), priced }),
    });
  }

  if (cheapestSentence) {
    faq.push({ question: t('faq.cheapQ', { where }), answer: joinSentences([cheapestSentence, priciestSentence]) });
  } else if (priciestSentence) {
    faq.push({ question: t('faq.peakQ', { where }), answer: priciestSentence });
  }

  if (types.length >= 2) {
    faq.push({
      question: t('faq.typesQ', { where }),
      answer: t('faq.typesA', {
        list: types
          .map(tb => `${inSentence(typeLabel(tb.vesselType), locale)} ${money(tb.low)} – ${money(tb.high)}`)
          // French sets a space before the semicolon.
          .join(locale === 'fr' ? ' ; ' : '; '),
      }),
    });
  }

  if (skipper) {
    faq.push({
      question: t('faq.skipperQ', { where }),
      answer:
        skipper.p25 != null && skipper.p75 != null && skipper.p25 !== skipper.p75
          ? t('faq.skipperA', {
              median: money(skipper.median),
              p25: money(skipper.p25),
              p75: money(skipper.p75),
              n: skipper.n,
            })
          : t('faq.skipperSingleA', { median: money(skipper.median), n: skipper.n }),
    });
  }

  const extrasSentence = extras ? t('summary.extras', { extras: money(extras.median) }) : null;

  if (extrasSentence || depositSentence) {
    faq.push({ question: t('faq.costsQ', { where }), answer: joinSentences([extrasSentence, depositSentence]) });
  }

  const [firstDay, secondDay] = mainCheckInDays(facts);

  if (firstDay) {
    faq.push({
      question: t('faq.checkInQ', { where }),
      answer: joinSentences([
        t('faq.checkInA', { day: fmt.dayName(firstDay.day), share: fmt.percent(firstDay.share) }),
        secondDay
          ? t('faq.checkInSecond', { day: fmt.dayName(secondDay.day), share: fmt.percent(secondDay.share) })
          : null,
      ]),
    });
  }

  return {
    fmt,
    countryName: place.name,
    where,
    h1,
    title,
    description,
    summary,
    updated: t('updated', { date: fmt.date(facts.computedAt), boats: priced }),
    faq: faq.slice(0, 6),
    typeLabel,
  };
};
