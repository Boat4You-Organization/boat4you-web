import { useLocale, useTranslations } from 'next-intl';

import { YachtEquipmentCategoryType } from '@/models/yacht-amenities.model';
import { MAIN_SAIL_TYPE_LABEL_MAP, MainSailType } from '@/models/yacht.model';
import { YachtDescriptionSource } from '@/types/yacht-description.type';

// The "a/an" article machinery below is ENGLISH grammar and must never run
// for other locales — it produced leaks like the Croatian "…pohvaliti a
// ravni televizor and a sup daska" (Mario 11.7.2026). For non-English
// locales we skip articles entirely and join with the locale's own
// conjunction. The three sentence templates ("boatEquipmentFeatures" etc.)
// are already translated per language.
const LIST_CONJUNCTION: Record<string, string> = {
  en: 'and',
  de: 'und',
  es: 'y',
  fr: 'et',
  hr: 'i',
  it: 'e',
  nl: 'en',
  pl: 'i',
  pt: 'e',
};
// Locales that capitalize common nouns mid-sentence — their amenity labels
// must NOT be lowercased (German "Flachbildfernseher", not "flachbildfernseher").
const NOUN_CAPITALIZING_LOCALES = new Set(['de']);

// SEO-friendly list join: "X", "X and Y", "X, Y and Z". Prepends "a/an"
// only for countable singular items — plural nouns (winches, speakers)
// and uncountable nouns (heating, air conditioning, lighting) stay bare,
// otherwise the sentence reads "an electric winches" / "a heating" which
// is ungrammatical. Acronyms inside the label (TV, WiFi, GPS, AC) also
// get upper-cased so the copy reads like a human wrote it.
const A_VOWEL_SOUND = /^[aeiou]/i;
// Words that look plural but are singular / no-s-plural — keep article.
const PLURAL_SAFE_ALLOWLIST = /(chassis|series|news|bus|lens|status|atlas|species)$/i;
// Standalone uncountable nouns commonly in yacht amenity lists. Extend as
// new amenity labels surface.
const UNCOUNTABLE_NOUNS = new Set([
  'heating',
  'cooling',
  'lighting',
  'air conditioning',
  'hot water',
  'cold water',
  'wifi',
  'wi-fi',
  'internet',
  'electricity',
  'power',
  'equipment',
  'water',
  'gas',
  'fuel',
]);

const needsNoArticle = (item: string): boolean => {
  const clean = item.toLowerCase().trim();

  if (UNCOUNTABLE_NOUNS.has(clean)) return true;

  if (/ing$/i.test(clean)) return true; // heating, lighting, cooling, plumbing, ...

  if (/s$/i.test(clean) && !PLURAL_SAFE_ALLOWLIST.test(clean)) return true; // winches, speakers

  return false;
};

// Uppercase well-known acronyms when they appear as whole tokens. Avoids
// "a flat screen tv" / "an usb port" and reads closer to competitor copy.
const ACRONYMS = ['TV', 'GPS', 'WiFi', 'AC', 'DC', 'VHF', 'AIS', 'EPIRB', 'LED', 'USB', 'SUP', 'BBQ'];
const prettifyLabel = (item: string): string =>
  ACRONYMS.reduce((acc, acr) => acc.replace(new RegExp(`\\b${acr.toLowerCase()}\\b`, 'gi'), acr), item);

const withArticle = (rawItem: string): string => {
  const item = prettifyLabel(rawItem);

  if (needsNoArticle(item)) return item;

  return `${A_VOWEL_SOUND.test(item) ? 'an' : 'a'} ${item}`;
};

const joinWithAnd = (items: string[], and: string): string => {
  if (items.length === 0) return '';

  if (items.length === 1) return items[0];

  if (items.length === 2) return `${items[0]} ${and} ${items[1]}`;

  return `${items.slice(0, -1).join(', ')} ${and} ${items[items.length - 1]}`;
};

const equipmentByCategory = (
  yacht: YachtDescriptionSource,
  category: YachtEquipmentCategoryType,
  amenitiesT: (key: string) => string,
  lowercase: boolean
): string[] =>
  yacht.amenities
    ?.filter(amenity => amenity.equipment?.category === category)
    ?.map(amenity => {
      const label = amenitiesT(amenity.equipment!.labelCode).trim();

      return lowercase ? label.toLowerCase() : label;
    })
    ?.filter(item => item && item.length > 0)
    ?.sort((a, b) => a.localeCompare(b)) || [];

export const useBoatEquipmentDescription = (): ((yacht: YachtDescriptionSource) => string) => {
  const t = useTranslations();
  const amenitiesT = useTranslations('yacht.amenitiesList');
  const locale = useLocale();

  const isEnglish = locale === 'en';
  const conjunction = LIST_CONJUNCTION[locale] ?? 'and';
  const lowercaseLabels = !NOUN_CAPITALIZING_LOCALES.has(locale);
  // English gets the "a/an" article; every other language joins bare labels
  // (still upper-casing acronyms) with its own conjunction.
  const formatItem = (item: string): string => (isEnglish ? withArticle(item) : prettifyLabel(item));
  const joinList = (items: string[]): string => joinWithAnd(items.map(formatItem), conjunction);

  const generateStructuredEquipmentDescription = (yacht: YachtDescriptionSource): string => {
    const sentences: string[] = [];

    // Sail type + navigation/safety equipment folded into one sentence:
    // "Boat equipment features a classic mainsail, a generator and an
    // outside GPS plotter." If no sail type, start directly with the
    // equipment list so grammar still reads.
    let sailType: string | null = null;

    if (yacht.mainSailType !== MainSailType.UNKNOWN) {
      const sailTypeKey = MAIN_SAIL_TYPE_LABEL_MAP[yacht.mainSailType];

      if (sailTypeKey) {
        const resolved = t(sailTypeKey);

        if (resolved && resolved !== sailTypeKey) sailType = lowercaseLabels ? resolved.toLowerCase() : resolved;
      }
    }

    const navigationItems = equipmentByCategory(
      yacht,
      YachtEquipmentCategoryType.NAVIGATION_AND_SAFETY,
      amenitiesT as (key: string) => string,
      lowercaseLabels
    );

    const equipmentItems: string[] = [];

    if (sailType) equipmentItems.push(sailType);

    equipmentItems.push(...navigationItems);

    if (equipmentItems.length > 0) {
      sentences.push(`${t('yacht.boatEquipmentFeatures')} ${joinList(equipmentItems)}`);
    }

    const saloonItems = equipmentByCategory(
      yacht,
      YachtEquipmentCategoryType.ENTERTAINMENT,
      amenitiesT as (key: string) => string,
      lowercaseLabels
    );

    if (saloonItems.length > 0) {
      sentences.push(`${t('yacht.itAlsoBoasts')} ${joinList(saloonItems)}`);
    }

    const galleyItems = equipmentByCategory(
      yacht,
      YachtEquipmentCategoryType.SALOON_AND_CABINS,
      amenitiesT as (key: string) => string,
      lowercaseLabels
    );

    if (galleyItems.length > 0) {
      sentences.push(`${t('yacht.fullyEquippedInclude')} ${joinList(galleyItems)}`);
    }

    return sentences.join('. ') + (sentences.length > 0 ? '.' : '');
  };

  return generateStructuredEquipmentDescription;
};
