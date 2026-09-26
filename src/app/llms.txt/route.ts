import { getSiteStats } from '@/utils/server/siteStats';

// The counts themselves are cached once for every surface (siteStats.ts,
// six hours); this route only re-reads that shared entry. It used to keep its
// own six-hour snapshot on top, so llms.txt could lag the pages by a whole
// stats cycle ("54 countries" here while the site said 53, audit B34).
export const revalidate = 60;

const numberFormat = new Intl.NumberFormat('en-US');

/**
 * llms.txt as a route (it was a static file claiming "100+ countries"; the
 * catalogue lists boats in ~60). The catalogue size comes from the one count
 * source (siteStats.ts) shared with /about-us, the home hero and the
 * Organization JSON-LD; without it the sentence drops the numbers.
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.boat4you.com';
  const stats = await getSiteStats();
  const scope = stats
    ? `with ${numberFormat.format(stats.display.boats)}+ boats in ${stats.display.countries} countries and ${numberFormat.format(stats.display.marinas)}+ marinas`
    : 'with thousands of boats across Europe and the Caribbean';

  const body = `# Boat4You

> Boat4You is a yacht charter and boat rental marketplace ${scope} — sailing yachts, catamarans, and motorboats — with real-time availability, transparent pricing, secure online booking, and 24/7 support.

Boat4You lets travellers search live availability and prices across thousands of boats from verified charter operators, compare options by destination, dates, boat type, and amenities, and book online. Boats are offered bareboat or crewed. Prices are shown per week with all mandatory fees included.

## Core pages

- [Home & boat search](${baseUrl}/): search and book boats by destination, dates, and type with live prices.
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
