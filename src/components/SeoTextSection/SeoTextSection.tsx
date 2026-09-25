'use client';

/* eslint-disable @typescript-eslint/no-use-before-define */
import { useState } from 'react';

import { Box, Button, Collapse, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { PopularDestination } from '@/actions/locations.actions';
import { Link } from '@/i18n/navigation';
import colors from '@/styles/themes/colors';
import { useResolvedDestination } from '@/views/Search/SearchView/ResolvedDestinationContext';

interface SeoTextSectionProps {
  /** Raw `?destinations=` value of the search — shown in the title. */
  destination?: string | null;
  /** Curated long-form HTML for this (destination × boat type), resolved and
   *  read on the server (src/utils/server/curatedSeoContent.ts) so it is in
   *  the SSR markup. null → the corpus has no page for this query. */
  curatedHtml?: string | null;
  /** Optional internal-link block ("Most popular destinations") shown
   *  inside this section's collapse so we don't render two separate
   *  Show more toggles on the same page. Empty array → block hidden. */
  popularDestinations?: PopularDestination[];
  /** Area label used in the popular-destinations heading
   *  ("Most popular destinations in **{areaLabel}**"). */
  popularDestinationsArea?: string;
}

/**
 * Long-form SEO block rendered at the bottom of the search results list.
 *
 * Content: the curated per-(destination × boat type) HTML from
 * `public/seo-content/{locale}/`, passed in from the server. Until 25.9.2026
 * this component fetched the file in a useEffect after hydration, so the
 * server HTML carried only a generic common.json template ("X is one of the
 * most sought-after sailing destinations on the Adriatic" — wrong for Greece,
 * the Caribbean, …). That template is gone: without a curated page the
 * section shows only the popular-destinations links (or nothing).
 *
 * Collapsed by default (~3 lines + "Show more"). The collapse is CSS only —
 * the full text and every link stay in the DOM, so crawlers read all of it.
 */

// Maps the lowercased URL `?destinations=` value (the same one BoatsSection
// and the search `generateMetadata` server helper use) to the matching JSON
// key under `home.destinationsSection.destinationsLocative`. Keep in sync
// with those two sites — adding a new POPULAR_SEARCHES entry needs an entry
// in all three maps so the H2 sentence reads grammatically.
const DESTINATION_LOCATIVE_KEY: Record<string, string> = {
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

const SeoTextSection = ({
  destination,
  curatedHtml = null,
  popularDestinations = [],
  popularDestinationsArea = '',
}: SeoTextSectionProps) => {
  const t = useTranslations('common');
  const tHome = useTranslations('home');
  const { labels } = useResolvedDestination();
  const [expanded, setExpanded] = useState(false);
  const hasPopular = popularDestinations.length >= 4;

  if (!curatedHtml) {
    // No curated page → no generic filler text. The internal-link block
    // still renders (plain, no toggle) so the page keeps its related links.
    return hasPopular ? (
      <Box component="section" sx={{ mt: 4, mb: 2 }}>
        <PopularDestinationsBlock destinations={popularDestinations} areaLabel={popularDestinationsArea} t={t} />
      </Box>
    ) : null;
  }

  const rawDest = destination?.trim() || '';
  const dest = labels[rawDest.toLowerCase()] || rawDest || t('yourDestination');
  // Use the locative form when the destination is a known popular entry
  // (e.g. HR "Hrvatskoj" instead of nominative "Hrvatska") so the H2
  // template "Zašto unajmiti jahtu u {destination}?" reads grammatically.
  // For non-inflecting locales (EN/FR/IT/ES/PT/NL/DE) the locative value
  // mirrors the nominative one (set in messages/{locale}/home.json), so
  // the same lookup works across all 9 locales without conditionals.
  const destLocativeKey = DESTINATION_LOCATIVE_KEY[rawDest.toLowerCase()];
  const destForTitle = destLocativeKey
    ? (tHome.raw(
        `destinationsSection.destinationsLocative.${destLocativeKey}` as Parameters<typeof tHome.raw>[0]
      ) as string)
    : dest;
  const title = t('seoBlockTitle', { destination: destForTitle });

  return (
    <Box component="section" sx={{ mt: 4, mb: 2 }} aria-label={title}>
      <Typography variant="h3" component="h2" fontWeight={700} mb={1.5}>
        {title}
      </Typography>

      {/* Curated HTML straight from the authored file (server-sanitised).
          Collapsed: line-clamp the text with headings hidden; expanded: full
          styling. Both states keep the whole text in the markup. */}
      <Box
        sx={{
          ...(expanded
            ? {
                '& h2': { fontSize: 16, fontWeight: 700, mt: 2, mb: 1, color: colors.black800 },
                '& h3': { fontSize: 14, fontWeight: 700, mt: 1.5, mb: 0.5, color: colors.black800 },
                '& p': { fontSize: 14, lineHeight: 1.6, color: colors.black600, mb: 1 },
                '& a': { color: colors.blue500, textDecoration: 'underline' },
                '& strong': { fontWeight: 700, color: colors.black800 },
              }
            : {
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                '& h2, & h3': { display: 'none' },
                '& p': { fontSize: 14, lineHeight: 1.6, color: colors.black600, m: 0, display: 'inline' },
              }),
        }}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: curatedHtml }}
      />
      {/* Internal-link block lives inside the same toggle so a single Show
          more reveals body + popular destinations together. Anchors stay in
          the DOM regardless of `expanded` (Collapse uses height: 0, not
          unmount) so crawlers always see them. */}
      {hasPopular && (
        <Collapse in={expanded} timeout="auto" unmountOnExit={false}>
          <PopularDestinationsBlock destinations={popularDestinations} areaLabel={popularDestinationsArea} t={t} />
        </Collapse>
      )}

      <Button
        onClick={() => setExpanded(prev => !prev)}
        aria-expanded={expanded}
        sx={{
          mt: 1,
          px: 1.5,
          py: 0.5,
          minWidth: 'auto',
          color: colors.black700,
          backgroundColor: 'transparent',
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: '6px',
          transition: 'background-color 150ms ease, color 150ms ease',
          '&:hover': {
            backgroundColor: colors.blue500,
            color: '#fff',
          },
        }}
      >
        {expanded ? t('showLess') : t('showMore')}
      </Button>
    </Box>
  );
};

/**
 * Internal-link block ("Our most popular destinations in {area}") — a
 * "dumb" subcomponent without its own collapse / Show more, since it
 * lives inside SeoTextSection's collapse content. Renders an H2 plus a
 * flex-wrap list of anchor tags. The phrase template per link is
 * locale-driven (`popularDestinations.template0..7` in common.json) and
 * deterministic per destination name (server-side hash) so SEO bots see
 * stable anchor text on every crawl; boat-type links carry their own label
 * (the target's H1). Every href is an indexable landing (landingNav.ts).
 */
const PopularDestinationsBlock = ({
  destinations,
  areaLabel,
  t,
}: {
  destinations: PopularDestination[];
  areaLabel: string;
  t: ReturnType<typeof useTranslations<'common'>>;
}) => (
  <Box component="section" sx={{ mt: 3 }}>
    <Typography component="h2" variant="h4" fontWeight={700} mb={1.5} sx={{ fontSize: 16 }}>
      {t('popularDestinations.heading', { area: areaLabel })}
    </Typography>
    <Box
      component="ul"
      sx={{
        listStyle: 'none',
        p: 0,
        m: 0,
        // One link per line — Mario asked for vertical stack so the
        // list reads like body copy, not a horizontal pill cluster.
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        // Match the surrounding curated paragraph copy so the block
        // feels like a continuation of the SEO text rather than a
        // separate widget. Curated <p> uses 14px, lineHeight 1.6.
        fontSize: 14,
        lineHeight: 1.6,
      }}
    >
      {/* Locale-aware Link: on /de/… the related landings are the /de/ ones. */}
      {destinations.map(d => (
        <Box component="li" key={d.href}>
          <Link href={d.href} style={{ color: colors.blue500, textDecoration: 'underline', fontWeight: 500 }}>
            {d.label ??
              t(`popularDestinations.template${d.templateIdx}` as 'popularDestinations.template0', { dest: d.name })}
          </Link>
        </Box>
      ))}
    </Box>
  </Box>
);

export default SeoTextSection;
