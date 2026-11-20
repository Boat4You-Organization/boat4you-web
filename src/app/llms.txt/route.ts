import { GULET_CHARTER_PATH } from '@/config/guletCharter.config';
import { itineraries } from '@/config/itineraries.config';
import { PRICE_GUIDES, PRICE_GUIDE_HUB_PATH, priceGuidePath } from '@/config/priceGuides.config';
import { PROMOTED_COUNTRY_CODES } from '@/config/promoted-countries.config';
import { mapWithLimit } from '@/utils/server/landingGate';
import { countryLandingPath } from '@/utils/server/landingLinks';
import { loadLiveModelPages } from '@/utils/server/modelCatalog';
import { getSiteStats } from '@/utils/server/siteStats';
import { manufacturerPath, yachtsIndexPath } from '@/utils/static/yachtModelKey';

// The counts themselves are cached once for every surface (siteStats.ts,
// six hours); this route only re-reads that shared entry. It used to keep its
// own six-hour snapshot on top, so llms.txt could lag the pages by a whole
// stats cycle ("54 countries" here while the site said 53, audit B34). The
// landing gate and the model fleets below are Data Cache reads as well.
// force-dynamic (15.11.2026 review): a static llms.txt is pre-rendered by `next build`, which would pull the
// whole model catalogue from the production API during the build (same reason as sitemap-models.xml).
export const dynamic = 'force-dynamic';
export const revalidate = 60;

const numberFormat = new Intl.NumberFormat('en-US');
const countryName = new Intl.DisplayNames(['en'], { type: 'region' });

/** The WordPress guide on licences (blog sitemap, 15.11.2026). */
const LICENCE_GUIDE_PATH = '/blog/do-i-need-sailing-license-charter-yacht-croatia-greece-italy-spain-turkey-2026';

/** A section of links, or nothing when the source could not be read. */
const section = (title: string, lines: string[]): string =>
  lines.length ? `## ${title}\n\n${lines.join('\n')}\n\n` : '';

/** Country landings the index gate lets Google index in English, in the canonical URL form. */
const destinationLines = async (baseUrl: string): Promise<string[]> => {
  const codes = Array.from(PROMOTED_COUNTRY_CODES);
  const paths = await mapWithLimit(codes, 2, code => countryLandingPath(code, 'en'));

  return codes
    .map((code, i) => ({ name: countryName.of(code) ?? code, path: paths[i] }))
    .filter((row): row is { name: string; path: string } => !!row.path)
    .sort((a, b) => a.name.localeCompare(b.name, 'en'))
    .map(({ name, path }) => `- [Boats for charter in ${name}](${baseUrl}${path})`);
};

/** /yachts index, brand hubs and model pages — the URLs the model sitemap lists. */
const modelLines = async (baseUrl: string): Promise<string[]> => {
  try {
    const { models, brands } = await loadLiveModelPages();

    if (!models.length) return [];

    return [
      `- [Yacht models and brands](${baseUrl}${yachtsIndexPath()}): every model page with its fleet, typical weekly price and bases.`,
      ...brands.map(brand => `- [${brand.brand} charter models](${baseUrl}${manufacturerPath(brand.brandSlug)})`),
      ...models.map(model => `- [${model.displayName}](${baseUrl}${model.path})`),
    ];
  } catch {
    return [];
  }
};

/**
 * llms.txt as a route (it was a static file claiming "100+ countries"; the
 * catalogue lists boats in ~60). The catalogue size comes from the one count
 * source (siteStats.ts) shared with /about-us, the home hero and the
 * Organization JSON-LD; without it the sentence drops the numbers.
 *
 * Every statement mirrors the live site (audit 15.11.2026, K2): prices are
 * the boat hire for the charter period, obligatory extras and the deposit
 * come on top (they used to read "all mandatory fees included"); the
 * cancellation paragraph is the boat page's policy text (yacht.json
 * `cancellationPolicyDescription`). Every link is built from the same source
 * as the page it points to (landing gate, model catalogue, itinerary and
 * price guide configs), so a section that cannot be read is left out
 * instead of listing a URL that may not exist.
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.boat4you.com';
  const [stats, destinations, models] = await Promise.all([
    getSiteStats(),
    destinationLines(baseUrl).catch((): string[] => []),
    modelLines(baseUrl),
  ]);
  const scope = stats
    ? `with ${numberFormat.format(stats.display.boats)}+ boats in ${stats.display.countries} countries and ${numberFormat.format(stats.display.marinas)}+ marinas`
    : 'with thousands of boats across Europe, the Caribbean and the Indian Ocean';

  const itineraryLines = [
    `- [Sailing itineraries](${baseUrl}/itineraries): day-by-day 7-day routes with distances, anchorages and mooring tips.`,
    ...itineraries.flatMap(group =>
      group.itinerary.map(area => `- [${area.title}](${baseUrl}/itineraries/${area.id})`)
    ),
  ];

  const body = `# Boat4You

> Boat4You is a yacht charter and boat rental marketplace ${scope} — sailing yachts, catamarans, motor yachts and gulets — with live availability and prices from the charter companies, secure online booking and 24/7 support.

Boat4You lets travellers search live availability and prices from verified charter companies, compare boats by destination, dates, boat type and equipment, and book online or send an inquiry. Boats are offered bareboat (you skipper), with a hired skipper, or fully crewed. Boat4You is run by Cusmanich d.o.o. in Split, Croatia, and has worked in yacht charter since 2013.

## Prices and payment

- A boat's price is the charter fee for the whole period you pick (most charters run Saturday to Saturday), shown as one total, not per day.
- Boat4You charges no booking fee.
- Not in the charter fee: the obligatory extras each charter company sets (for example transit log, final cleaning or bed linen, usually paid at the base), the refundable security deposit (usually blocked on a card at check-in), a skipper if you need one, fuel, mooring fees outside the home marina and per-person taxes. Each boat page lists its obligatory extras and the deposit, and the booking form shows them again before you pay.
- Payment is by card (also Apple Pay and Google Pay) or Klarna through Mollie, or by bank transfer; the charter fee is usually split into instalments. Some payment methods may carry a payment fee, shown for each method before you pay.

## Cancellation

- Free cancellation within 72 hours of booking, when you book more than 14 days before the charter starts. After those 72 hours, and for any booking made closer to the start, the cancellation terms of the charter offer apply, as set out in your payment and cancellation schedule. Full terms: ${baseUrl}/terms-and-conditions (section 7).

## Licences

- A bareboat charter needs at least one person on board with a sailing licence recognised in the country of charter (for example an ICC, RYA Day Skipper or an equivalent national licence) and, in some countries (for example Croatia and Greece), a VHF radio licence. Without one you can book the same boat with a professional skipper.
- [Sailing licence guide by country](${baseUrl}${LICENCE_GUIDE_PATH})

${section('Destinations', destinations)}## Price guides

- [Yacht charter prices](${baseUrl}${PRICE_GUIDE_HUB_PATH}): what a charter week costs by country, computed every night from live prices.
${PRICE_GUIDES.map(({ slug, name }) => `- [Yacht charter prices in ${name}](${baseUrl}${priceGuidePath(slug)}): typical weekly price by month and boat type, skipper, extras and deposit.`).join('\n')}
- [Gulet charter with crew](${baseUrl}${GULET_CHARTER_PATH}): gulets in Türkiye, Greece, Croatia and Italy, always chartered with their crew.

${section('Boat models', models)}${section('Itineraries', itineraryLines)}## Core pages

- [Home & boat search](${baseUrl}/): search and book boats by destination, dates, and type with live prices.
- [Fleet directory](${baseUrl}/fleet): every listed boat, sorted by home marina.
- [How we work](${baseUrl}/how-we-work): the booking, payment, and charter process explained.
- [About us](${baseUrl}/about-us): who Boat4You is.
- [FAQ](${baseUrl}/faq): common questions about chartering and booking.
- [Blog](${baseUrl}/blog): sailing guides, destinations, and tips.
- [Contact & support](${baseUrl}/contact-us): get in touch, 24/7 support.

## Legal

- [Terms & conditions](${baseUrl}/terms-and-conditions)
- [Privacy policy](${baseUrl}/privacy-policy)
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
