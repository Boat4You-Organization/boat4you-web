import { FC } from 'react';

import { Container } from '@mui/material';
import { useTranslations } from 'next-intl';

import SuggestedItineraries from '@/components/SuggestedItineraries';

/**
 * Blog post → itinerary-area matcher ("Sail it yourself" strip under the
 * article). Matches the post's slug + title + category text against a
 * small keyword table; no match renders nothing. ORDER MATTERS: specific
 * area names run before the country-level catch-alls, so "Sailing the
 * Ionian in Greece" hits `ionian` and not the greece→cyclades default.
 * Server-safe — no client hooks beyond RSC-compatible useTranslations.
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
}

const RelatedItineraries: FC<RelatedItinerariesProps> = ({ title, slug, categories }) => {
  const t = useTranslations('itinerary');

  const areaId = itineraryAreaForBlogText([slug, title, ...(categories ?? [])].join(' '));

  if (!areaId) return null;

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 }, pb: { xs: 4, md: 6 } }}>
      <SuggestedItineraries areaId={areaId} headingOverride={t('suggested.blogHeading')} maxRoutes={3} />
    </Container>
  );
};

export default RelatedItineraries;
