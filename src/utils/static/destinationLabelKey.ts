/**
 * Maps the lowercased URL `?destinations=` value (also used by the FE
 * client lookup in BoatsSection) to the matching JSON key under
 * `home.destinationsSection.destinations` / `destinationsLocative`. Keep
 * this in sync with the analogous client-side dict in BoatsSection.tsx —
 * any new POPULAR_SEARCHES entry needs an entry in both maps so the H1
 * (server-rendered title) and the page H1 (client-rendered) agree.
 *
 * Shared by the /search metadata and the server link blocks (boat
 * breadcrumb, blog / itinerary hub links), which show the localized name
 * for these places and the catalogue name for every other one.
 */
export const DESTINATION_KEY_BY_LABEL: Record<string, string> = {
  bahamas: 'bahamas',
  caribbean: 'caribbean',
  croatia: 'croatia',
  france: 'france',
  greece: 'greece',
  italy: 'italy',
  martinique: 'martinique',
  montenegro: 'montenegro',
  seychelles: 'seychelles',
  spain: 'spain',
  turkey: 'türkiye',
  türkiye: 'türkiye',
  'virgin islands (british)': 'virginIslandsBritish',
  grenada: 'grenada',
  'split region': 'splitRegion',
  'ionian region': 'ionianRegion',
};
