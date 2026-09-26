import { Container } from '@mui/material';
import { getTranslations } from 'next-intl/server';

import SuggestedItineraries from '@/components/SuggestedItineraries';
import { areaSuggestionText } from '@/components/SuggestedItineraries/suggestedRouteTitles';

/**
 * Blog post → itinerary-area matcher ("Sail it yourself" strip under the
 * article). Matches the post's slug + title + category text against a
 * small keyword table; no match renders nothing. ORDER MATTERS: specific
 * area names run before the country-level catch-alls, so "Sailing the
 * Ionian in Greece" hits `ionian` and not the greece→cyclades default.
 * Server-only (async): see RelatedItineraries below.
 */

const KEYWORD_TO_AREA: [string, string[]][] = [
  ['dubrovnik', ['dubrovnik']],
  ['zadar', ['zadar', 'kornati']],
  ['ionian', ['ionian', 'lefkas', 'lefkada', 'corfu']],
  ['sardinia', ['sardinia']],
  ['sicily', ['sicily']],
  ['amalfi', ['amalfi', 'naples']],
  ['ibiza', ['ibiza']],
  ['mallorca', ['mallorca', 'balearic']],
  ['gocek', ['gocek', 'fethiye']],
  ['bodrum', ['bodrum']],
  ['bvi', ['bvi', 'virgin']],
  ['bahamas', ['bahamas']],
  ['grenada', ['grenada']],
  ['martinique', ['martinique']],
  // Country-level catch-alls LAST — busiest hub area per country.
  ['split', ['croatia', 'split', 'hvar', 'dalmatia']],
  ['cyclades', ['greece', 'athens', 'cyclades', 'santorini', 'mykonos']],
  ['bodrum', ['turkey']],
  ['bvi', ['caribbean']],
];

const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** First keyword hit wins; null = no itinerary content for this post. */
export const itineraryAreaForBlogText = (text: string): string | null => {
  const haystack = normalize(text);
  const hit = KEYWORD_TO_AREA.find(([, keywords]) => keywords.some(k => haystack.includes(k)));

  return hit ? hit[0] : null;
};

interface RelatedItinerariesProps {
  title: string;
  slug: string;
  /** Category slugs/names, pre-joined per category by the caller. */
  categories?: string[];
  locale: string;
}

/**
 * Server component: the area name and the route card titles are resolved
 * here in the page locale (the per-country itinerary namespaces are not
 * shipped to the client outside /itineraries) — the strip read "View all
 * Cyclades itineraries" and English route titles on every locale (B16).
 */
const RelatedItineraries = async ({ title, slug, categories, locale }: RelatedItinerariesProps) => {
  const areaId = itineraryAreaForBlogText([slug, title, ...(categories ?? [])].join(' '));

  if (!areaId) return null;

  const [t, { routeTitles, areaLabel }] = await Promise.all([
    getTranslations({ locale, namespace: 'itinerary' }),
    areaSuggestionText(locale, areaId),
  ]);

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 }, pb: { xs: 4, md: 6 } }}>
      <SuggestedItineraries
        areaId={areaId}
        headingOverride={t('suggested.blogHeading')}
        maxRoutes={3}
        routeTitles={routeTitles}
        areaLabel={areaLabel}
      />
    </Container>
  );
};

export default RelatedItineraries;
