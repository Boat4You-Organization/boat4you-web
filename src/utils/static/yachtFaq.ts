import { CharterType, YachtModel } from '@/models/yacht.model';
import { toTitleCase } from '@/utils/static/toTitleCase';

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
 */
export const buildYachtFaq = (yacht: YachtModel, t: TranslateFn, locale: string): YachtFaqEntry[] => {
  const name = yacht.name ? toTitleCase(yacht.name) : yacht.model;
  const entries: YachtFaqEntry[] = [];
  const v = (salt: number, count = 3) => yachtVariant(yacht.id, salt, count);

  if (yacht.maxPersons && yacht.cabins) {
    entries.push({
      question: t('faqSleepsQ', { name }),
      answer: t(`faqSleepsA${v(6)}`, { name, maxPersons: yacht.maxPersons, cabins: yacht.cabins }),
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

    entries.push({
      question: t('faqBaseQ', { name }),
      answer: country
        ? t(`faqBaseA${v(7)}`, { name, location: yacht.location.name, country })
        : t('faqBaseANoCountry', { name, location: yacht.location.name }),
    });
  }

  const charterTypes = Array.isArray(yacht.charterType) ? yacht.charterType : [yacht.charterType].filter(Boolean);
  const bareboat = charterTypes.includes(CharterType.BAREBOAT);

  entries.push({
    question: t('faqLicenceQ', { name }),
    answer: bareboat ? t(`faqLicenceBareboatA${v(8)}`, { name }) : t(`faqLicenceCrewedA${v(8, 2)}`, { name }),
  });

  // "From €X per week" — cheapest FREE weekly offer in the loaded window.
  const weekly = (yacht.offers || []).filter(
    o => o.status === 'FREE' && (o.numberOfDays ?? 0) === 7 && o.clientPriceEur > 0
  );

  if (weekly.length > 0) {
    const minPrice = Math.round(Math.min(...weekly.map(o => o.clientPriceEur)));

    entries.push({
      question: t('faqPriceQ', { name }),
      answer: t(`faqPriceA${v(9)}`, { name, price: minPrice.toLocaleString('en-US') }),
    });
  }

  if (yacht.defaultCheckin && yacht.defaultCheckout) {
    entries.push({
      question: t('faqCheckinQ', { name }),
      answer: t(`faqCheckinA${v(10)}`, { name, checkin: yacht.defaultCheckin, checkout: yacht.defaultCheckout }),
    });
  }

  entries.push({
    question: t('faqBookQ', { name }),
    answer: t(`faqBookA${v(11)}`, { name }),
  });

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
