/**
 * Croatian place names as the catalogue and the itinerary config spell them
 * without diacritics ("Marina Kastela", "Sibenik", "Komiza") → the proper
 * form for anything a visitor reads (audit 29.9.2026, R32: 327 crawled pages
 * showed "Kastela" beside "Kaštela", "Sibenik" ×18 beside "Šibenik" ×23 on
 * one page). URL slugs and lookups stay ASCII — this is display only, so it
 * is applied where a label is rendered: landing link labels (placeText),
 * charter-facts bases, the fleet directory and the itinerary hubs.
 *
 * One map, word by word: only these tokens change, everything else in a
 * name is kept ("Marina Kastela | Kastel Gomilica" → "Marina Kaštela |
 * Kaštel Gomilica"; "Trogir" has no diacritic and stays).
 */
const DIACRITIC_FORMS: Record<string, string> = {
  sibenik: 'Šibenik',
  kastela: 'Kaštela',
  kastel: 'Kaštel',
  komiza: 'Komiža',
  bisevo: 'Biševo',
  palmizana: 'Palmižana',
  primosten: 'Primošten',
  sukosan: 'Sukošan',
  korcula: 'Korčula',
  losinj: 'Lošinj',
  sipan: 'Šipan',
  scedro: 'Šćedro',
  rogac: 'Rogač',
  necujam: 'Nečujam',
  stomorska: 'Stomorska',
};

const TOKEN_PATTERN = new RegExp(`\\b(${Object.keys(DIACRITIC_FORMS).join('|')})\\b`, 'gi');

/** The form with the case of the original token: "SIBENIK" → "ŠIBENIK", "sibenik" → "šibenik", else "Šibenik". */
const withCaseOf = (original: string, form: string): string => {
  if (original === original.toUpperCase()) return form.toUpperCase();

  return original[0] === original[0].toLowerCase() ? form.toLowerCase() : form;
};

/**
 * A place or base name for display, Croatian diacritics restored. Names that
 * already carry them, and every non-Croatian name, come back unchanged.
 */
export const displayPlaceName = (name: string): string =>
  name.replace(TOKEN_PATTERN, token => withCaseOf(token, DIACRITIC_FORMS[token.toLowerCase()]));

/**
 * A boat's base for display. Partners deliver it as "Marina | Town" ("D-Marin
 * Dalmacija Marina | Sukošan"), which the FAQ, the boat page and the cards
 * printed as is; it reads "D-Marin Dalmacija Marina, Sukošan", the form the
 * boat meta description already uses (live check 8.10.2026, F6), with the
 * diacritics restored. Map look-ups and links keep the catalogue name.
 */
export const displayBaseName = (name: string | null | undefined): string =>
  displayPlaceName(
    (name ?? '')
      .split('|')
      .map(part => part.trim())
      .filter(Boolean)
      .join(', ')
  );
