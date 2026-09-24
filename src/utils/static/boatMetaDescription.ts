/**
 * Boat description sentence shared by the boat page's meta description, the
 * boat page's Product JSON-LD fallback and the /search listing's Product
 * JSON-LD — one localized template instead of three English copies.
 *
 * Copy lives in `metadata.boat.desc*` (every locale). Only EN and HR used to
 * be native; the other seven locales shipped the English sentence ("Charter
 * the … Check availability and book directly on boat4you.com."), which is
 * the snippet Google shows under a German or Polish boat title (24.9.2026).
 *
 * The assembly is fixed (lead. specs. cta) so the catalog only carries short
 * fragments; word order inside each fragment is the translator's.
 */
export type BoatDescKey = 'descLead' | 'descLeadFrom' | 'descCabins' | 'descBerths' | 'descGuests' | 'descCta';

export type BoatDescTranslate = (key: BoatDescKey, values?: Record<string, string | number>) => string;

interface BoatDescInput {
  /** Model + quoted boat name + build year, e.g. "Oceanis 52 'Sunny' (2027)". */
  name: string;
  /** Home base as the partner spells it; omitted from the sentence when empty. */
  marina?: string | null;
  cabins?: number | null;
  berths?: number | null;
  /** /search listing variant: "up to N guests" instead of berths. */
  guests?: number | null;
}

export const buildBoatDescription = (
  t: BoatDescTranslate,
  { name, marina, cabins, berths, guests }: BoatDescInput
): string => {
  const lead = marina ? t('descLeadFrom', { name, marina }) : t('descLead', { name });
  const specs: string[] = [];

  if (cabins != null) specs.push(t('descCabins', { count: cabins }));

  if (berths != null) specs.push(t('descBerths', { count: berths }));

  if (guests != null) specs.push(t('descGuests', { count: guests }));

  return `${lead}.${specs.length ? ` ${specs.join(', ')}.` : ''} ${t('descCta')}`;
};
