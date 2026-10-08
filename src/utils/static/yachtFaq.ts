import { CharterType, YachtModel } from '@/models/yacht.model';
import { shownGuestBerths } from '@/utils/static/capacityProse';
import { displayBaseName } from '@/utils/static/croatianPlaceNames';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { isBookedByInquiry, isInquiryOnlyBoat } from '@/utils/static/inquiryOnlyBoat';
import { toTitleCase } from '@/utils/static/toTitleCase';
import { todayIso, weeklyOfferSummary } from '@/utils/static/weeklyOffers';
import { CapacityFacts, capacityFacts, fromYacht } from '@/utils/static/yachtCapacity';

/**
 * Deterministic per-yacht variant rotation — same idea as the smart
 * description template in DetailsTab: every yacht picks its own phrasing
 * from its id, so the FAQ block stops being byte-identical across the
 * catalogue while SSR and client always agree.
 */
export const yachtVariant = (id: number | undefined, salt: number, count = 3): number =>
  (((id ?? 0) % 100003) * (2 * salt + 1) + salt * 31) % count;

export interface YachtFaqEntry {
  question: string;
  answer: string;
}

type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

/**
 * Server-rendered, data-driven FAQ for one yacht — sleeping capacity, home
 * base, licence rules, price-from, check-in times and booking. Questions
 * embed the yacht's own name and figures (unique, indexable content) and
 * answers rotate between phrasings per yacht id. Entries whose underlying
 * data is missing are skipped rather than rendered empty. The same list
 * feeds the visible accordion AND the FAQPage JSON-LD, so the markup never
 * drifts from what the page shows.
 *
 * `weekFromPriceEur` is the boat's "from" price for a week — the page passes
 * the one its Product JSON-LD and its "From … / week" line use
 * (weeklyOffers.ts), so the three always name the same amount.
 */
export const buildYachtFaq = (
  yacht: YachtModel,
  t: TranslateFn,
  locale: string,
  facts: CapacityFacts = capacityFacts(fromYacht(yacht, { locale })),
  weekFromPriceEur: number | null = weeklyOfferSummary(yacht.offers, todayIso())?.cheapestBookable?.clientPriceEur ??
    null
): YachtFaqEntry[] => {
  const name = yacht.name ? toTitleCase(yacht.name) : yacht.model;
  const entries: YachtFaqEntry[] = [];
  const v = (salt: number, count = 3) => yachtVariant(yacht.id, salt, count);

  // Sleeping places are the partner's berths; max. people on board is a
  // sentence of its own, never "sleeps up to {maxPersons}" (Dione II: 13
  // berths, 14 people on board; capacity contract 7.4). "For guests" only
  // where the partner's own split leaves berths to the crew.
  const { cabins, berths, maxPersons } = facts;
  const guestBerths = shownGuestBerths(facts);

  if (berths || maxPersons) {
    let sleeps = t('faqSleepsNoBerths', { name });

    if (berths && cabins) sleeps = t(`faqSleepsA${v(6)}`, { name, berths, cabins, guestBerths });
    else if (berths) sleeps = t('faqSleepsNoCabins', { name, berths, guestBerths });

    entries.push({
      question: t('faqSleepsQ', { name }),
      answer: [sleeps, maxPersons ? t('faqOnBoard', { name, maxPersons }) : null].filter(Boolean).join(' '),
    });
  }

  if (yacht.location?.name) {
    const country = (() => {
      const code = yacht.location?.countryCode;

      if (!code) return '';

      try {
        return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? '';
      } catch {
        return '';
      }
    })();

    // "D-Marin Dalmacija Marina, Sukošan" as the meta description reads it,
    // not the partner's "D-Marin Dalmacija Marina | Sukošan" (live check 8.10.2026, F6).
    const location = displayBaseName(yacht.location.name);

    entries.push({
      question: t('faqBaseQ', { name }),
      answer: country ? t(`faqBaseA${v(7)}`, { name, location, country }) : t('faqBaseANoCountry', { name, location }),
    });
  }

  const charterTypes = Array.isArray(yacht.charterType) ? yacht.charterType : [yacht.charterType].filter(Boolean);
  const bareboat = charterTypes.includes(CharterType.BAREBOAT);

  entries.push({
    question: t('faqLicenceQ', { name }),
    answer: bareboat ? t(`faqLicenceBareboatA${v(8)}`, { name }) : t(`faqLicenceCrewedA${v(8, 2)}`, { name }),
  });

  // Booked by inquiry (no bookable future offer, or an agency that takes
  // inquiries only): no price to quote, and no online checkout to promise.
  const inquiryOnly = isBookedByInquiry(yacht);

  // "From €X per week" — the cheapest bookable 7-night week ahead.
  if (!inquiryOnly && weekFromPriceEur != null && Math.round(weekFromPriceEur) > 0) {
    const minPrice = Math.round(weekFromPriceEur);

    entries.push({
      question: t('faqPriceQ', { name }),
      // Page-locale amount with its currency sign ("4,976 €" / "4.976 €"),
      // the site's price format — the template used to glue "€" to an
      // en-US number on every locale.
      answer: t(`faqPriceA${v(9)}`, { name, price: formatPriceWithCurrency({ clientPriceEur: minPrice, locale }) }),
    });
  }

  if (yacht.defaultCheckin && yacht.defaultCheckout) {
    entries.push({
      question: t('faqCheckinQ', { name }),
      answer: t(`faqCheckinA${v(10)}`, { name, checkin: yacht.defaultCheckin, checkout: yacht.defaultCheckout }),
    });
  }

  // The inquiry answer of a boat without a bookable offer says no dates are
  // published; an inquiry-only agency's boat shows its free dates in the
  // calendar, so its answer asks for dates from there.
  const inquiryAnswer = isInquiryOnlyBoat(yacht) ? 'faqBookInquiryA' : 'faqBookAgencyInquiryA';

  entries.push(
    inquiryOnly
      ? { question: t('faqBookInquiryQ', { name }), answer: t(inquiryAnswer, { name }) }
      : { question: t('faqBookQ', { name }), answer: t(`faqBookA${v(11)}`, { name }) }
  );

  return entries;
};

/** FAQPage JSON-LD mirroring exactly the visible accordion entries. */
export const buildYachtFaqSchema = (entries: YachtFaqEntry[]) =>
  entries.length >= 2
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: entries.map(e => ({
          '@type': 'Question',
          name: e.question,
          acceptedAnswer: { '@type': 'Answer', text: e.answer },
        })),
      }
    : null;
