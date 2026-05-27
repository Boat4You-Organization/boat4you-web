'use client';

import { useEffect, useState } from 'react';

import { Box, Button, Collapse, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import { PopularDestination } from '@/actions/locations.actions';
import { VesselType } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';

interface SeoTextSectionProps {
  /** Human-readable name of the searched destination — shown in the title. */
  destination?: string | null;
  /** Optional boat-type filter; combined with destination to look up a
   *  curated SEO page from `/public/seo-content/{locale}/{slug}.html`.
   *  When the lookup misses, we fall back to the generic translated copy. */
  boatType?: VesselType | null;
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
 * Two content sources, in order of preference:
 *   1. Curated per-(destination × boat type) HTML in `public/seo-content/{locale}/`
 *      (rich content authored offline; ~1,300 files per locale).
 *   2. Generic templated copy from `common.json` (fallback when no curated page
 *      exists for the active search yet).
 *
 * Curated body HTML is sanitized to keep only whitelisted tags (`h2`, `h3`, `p`,
 * `strong`, `em`, `a`) since the source files contain a full `<!DOCTYPE>` /
 * `<head>` we do NOT want to inject. The first `<h1>` is also stripped — the
 * search-results header already renders the page title above this section.
 *
 * Collapsed by default (~3 lines + "Show more"), expands on click.
 */

// Slug resolver — narrow PoC for Ionian × Catamaran. Extend by adding entries
// or replacing with a generated manifest as more curated pages are deployed.
//
// File-naming conventions in the source corpus (per `Desktop/TEKSTOVI BOAT4YOU`):
//   country/region/city + boat-type → `{area}-{boattype}-charter.html`
//   country/region/city overview    → `{area}-yacht-charter-and-boat-rental.html`
//   region overview                 → `{area}-sailing-area-yacht-charter-and-boat-rental.html`
//   marina + boat-type              → `{boattype}-charter-{marina}.html`
const VESSEL_SLUG: Partial<Record<VesselType, string>> = {
  [VesselType.CATAMARAN]: 'catamaran',
  [VesselType.SAILING_YACHT]: 'sailing-yacht',
  [VesselType.MOTOR_YACHT]: 'motor-yacht',
  [VesselType.LUXURY_MOTOR_YACHT]: 'luxury-motor-yacht',
  [VesselType.MOTORBOAT]: 'motorboat',
  [VesselType.MOTORSAILER]: 'motorsailer',
  [VesselType.GULET]: 'gulet',
  [VesselType.POWER_CATAMARAN]: 'power-catamaran',
};

const slugifyDestination = (name: string): string =>
  name
    .toLowerCase()
    // Slavic diacritics that don't decompose via NFD — explicit map so
    // "Šibenik" → "sibenik" (instead of "ibenik" after the strip below).
    .replace(/[čć]/g, 'c')
    .replace(/đ/g, 'd')
    .replace(/š/g, 's')
    .replace(/ž/g, 'z')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    // Treat slashes, ampersands, commas and apostrophes as word breaks BEFORE
    // stripping non-alphanumerics. Without this, "Athens area/Saronic/Peloponese"
    // collapses to "athens-areasaronicpeloponese", and "Côte d'Azur" produces
    // "cote-dazur" instead of the corpus's "cote-d-azur".
    .replace(/[/&,'’]+/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

// Alias map — our DB names some destinations with a longer/different label
// than the slug used in the curated SEO corpus. Add entries as gaps surface
// in the search → file matching. Keys are lowercased DB display names; values
// are the matching file-name prefix from `public/seo-content/{locale}/`.
const DESTINATION_ALIAS: Record<string, string> = {
  'ionian region': 'ionian-islands',
  'aegean region': 'aegean',
  'aegean sea': 'aegean',
  'caribbean sea': 'caribbean',
  türkiye: 'turkiye',
  turkey: 'turkiye',
  istria: 'istria-kvarner',
  kvarner: 'istria-kvarner',
  brittany: 'bretagne',
  liguria: 'liguria-toscana',
};

/**
 * Build the list of candidate slugs to try for a given (destination × boat
 * type) query, in priority order. The corpus uses four file-naming patterns:
 *   (a) `{area}-{boattype}-charter`                 (country/region/city + boat)
 *   (b) `{boattype}-charter-{marina}`               (marina + boat)
 *   (c) `{area}-sailing-area-yacht-charter-and-boat-rental` (region overview)
 *   (d) `{area}-yacht-charter-and-boat-rental`      (country overview)
 *
 * We try the most specific (boat-type-bearing) patterns first and fall back to
 * the broader overviews. The first 200 wins; misses fall through to the
 * generic translated copy in common.json.
 */
const resolveCuratedSlugCandidates = (destination: string, boatType?: VesselType | null): string[] => {
  const aliased = DESTINATION_ALIAS[destination.trim().toLowerCase()];
  const dest = aliased ?? slugifyDestination(destination);

  if (!dest) return [];

  const candidates: string[] = [];

  if (boatType) {
    const bt = VESSEL_SLUG[boatType];

    if (bt) {
      candidates.push(`${dest}-${bt}-charter`); // (a) area-boat
      candidates.push(`${bt}-charter-${dest}`); // (b) boat-marina
    }
  }

  candidates.push(`${dest}-sailing-area-yacht-charter-and-boat-rental`); // (c) region overview
  candidates.push(`${dest}-yacht-charter-and-boat-rental`); // (d) country/city overview

  return candidates;
};

/**
 * Strip everything outside `<body>...</body>`, then remove the first `<h1>` (we
 * render our own page title above the SEO block) and any tags not on the
 * whitelist. Keeps inline anchors so internal links stay clickable.
 */
const sanitizeCuratedHtml = (raw: string): string => {
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let html = bodyMatch ? bodyMatch[1] : raw;

  // Drop the first H1 — duplicates the page title already rendered above.
  html = html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, '');

  return html.trim();
};

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
  boatType,
  popularDestinations = [],
  popularDestinationsArea = '',
}: SeoTextSectionProps) => {
  const t = useTranslations('common');
  const tHome = useTranslations('home');
  const locale = useLocale();
  const [expanded, setExpanded] = useState(false);
  const [curatedHtml, setCuratedHtml] = useState<string | null>(null);

  const dest = destination?.trim() || t('yourDestination');
  // Use the locative form when the destination is a known popular entry
  // (e.g. HR "Hrvatskoj" instead of nominative "Hrvatska") so the new H2
  // template "Zašto unajmiti jahtu u {destination}?" reads grammatically.
  // For non-inflecting locales (EN/FR/IT/ES/PT/NL/DE) the locative value
  // mirrors the nominative one (set in messages/{locale}/home.json), so
  // the same lookup works across all 9 locales without conditionals.
  const destLocativeKey = DESTINATION_LOCATIVE_KEY[dest.toLowerCase()];
  const destForTitle = destLocativeKey
    ? (tHome.raw(
        `destinationsSection.destinationsLocative.${destLocativeKey}` as Parameters<typeof tHome.raw>[0]
      ) as string)
    : dest;
  const title = t('seoBlockTitle', { destination: destForTitle });

  // Try to load curated HTML for the active (destination × boat type) match.
  // We probe the candidate slug list in priority order — the first 200 wins,
  // 404s fall through. Final miss leaves curatedHtml=null and we fall back to
  // the generic translated copy below.
  useEffect(() => {
    if (!destination) {
      setCuratedHtml(null);

      return;
    }

    const candidates = resolveCuratedSlugCandidates(destination, boatType);

    if (candidates.length === 0) {
      setCuratedHtml(null);

      return;
    }

    let cancelled = false;

    (async () => {
      for (const slug of candidates) {
        if (cancelled) return;

        try {
          const res = await fetch(`/seo-content/${locale}/${slug}.html`);

          if (res.ok) {
            const text = await res.text();

            if (!cancelled) setCuratedHtml(sanitizeCuratedHtml(text));

            return;
          }
        } catch {
          /* swallow — keep trying remaining candidates */
        }
      }

      if (!cancelled) setCuratedHtml(null);
    })();

    return () => {
      cancelled = true;
    };
  }, [destination, boatType, locale]);

  // Generic fallback paragraphs (used when no curated page exists for this query).
  const intro = t('seoBlockIntro', { destination: dest });
  const fallbackParagraphs: string[] = [
    t('seoBlockP1', { destination: dest }),
    t('seoBlockP2', { destination: dest }),
    t('seoBlockP3'),
  ];

  return (
    <Box component="section" sx={{ mt: 4, mb: 2 }} aria-label={title}>
      <Typography variant="h3" component="h2" fontWeight={700} mb={1.5}>
        {title}
      </Typography>

      {curatedHtml ? (
        // Curated path — render sanitized HTML straight from the authored file.
        // Collapsed: line-clamp the first paragraph; expanded: show the rest.
        <>
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
            dangerouslySetInnerHTML={{ __html: curatedHtml }}
          />
          {/* Internal-link block lives inside the curated-path collapse
              so a single Show more toggle reveals body + popular
              destinations together. Anchors stay in the DOM regardless
              of `expanded` (Collapse uses height: 0, not unmount) so
              SEO crawlers always see them. */}
          {popularDestinations.length >= 4 && (
            <Collapse in={expanded} timeout="auto" unmountOnExit={false}>
              <PopularDestinationsBlock destinations={popularDestinations} areaLabel={popularDestinationsArea} t={t} />
            </Collapse>
          )}
        </>
      ) : (
        // Generic fallback — translated paragraphs from common.json.
        <>
          <Box sx={{ position: 'relative' }}>
            <Typography
              variant="body2"
              color={colors.black600}
              sx={{
                lineHeight: 1.6,
                ...(expanded
                  ? {}
                  : {
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }),
              }}
            >
              {intro}
            </Typography>
          </Box>

          <Collapse in={expanded} timeout="auto" unmountOnExit={false}>
            <Box mt={1.5}>
              {fallbackParagraphs.map((p, i) => (
                <Typography
                  key={`p-${i + 1}`}
                  variant="body2"
                  color={colors.black600}
                  sx={{ lineHeight: 1.6, mt: i === 0 ? 0 : 1.5 }}
                >
                  {p}
                </Typography>
              ))}
              {popularDestinations.length >= 4 && (
                <PopularDestinationsBlock
                  destinations={popularDestinations}
                  areaLabel={popularDestinationsArea}
                  t={t}
                />
              )}
            </Box>
          </Collapse>
        </>
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
 * stable anchor text on every crawl.
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
      {destinations.map(d => (
        <Box component="li" key={d.href}>
          <Link href={d.href} style={{ color: colors.blue500, textDecoration: 'underline', fontWeight: 500 }}>
            {t(`popularDestinations.template${d.templateIdx}` as 'popularDestinations.template0', { dest: d.name })}
          </Link>
        </Box>
      ))}
    </Box>
  </Box>
);

export default SeoTextSection;
