'use client';

import { FC } from 'react';

import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { itineraryNamespace, resolveRouteText } from '@/helper/itineraryI18n';
import { areaForMarina, findItineraryArea, suggestedRoutesForArea } from '@/helper/itineraryMatch';
import { Link } from '@/i18n/navigation';
import colors from '@/styles/themes/colors';
import { staticSrcSet } from '@/utils/static/staticImageSrcSet';

/**
 * "Suggested itineraries" strip — shared by boat detail (full),
 * my-bookings (compact) and blog posts (direct `areaId`). The sailing
 * area is resolved from the departure marina name + country code via
 * `areaForMarina`; no match renders NOTHING (a missing suggestion is
 * never an error state — see itineraryMatch.ts). Cards mirror the
 * ItineraryArea route-card idiom in a lighter cut and link into
 * /itineraries/{areaId}/{routeId}.
 */

interface SuggestedItinerariesProps {
  marinaName?: string | null;
  countryCode?: string | null;
  /** Charter length in nights — 12+ floats 14-day routes first. */
  nights?: number;
  variant?: 'full' | 'compact';
  headingOverride?: string;
  /** Direct area target (e.g. blog keyword match) — bypasses areaForMarina. */
  areaId?: string | null;
  /** Cap on rendered route cards. */
  maxRoutes?: number;
}

const SuggestedItineraries: FC<SuggestedItinerariesProps> = ({
  marinaName,
  countryCode,
  nights,
  variant = 'full',
  headingOverride,
  areaId,
  maxRoutes = 4,
}) => {
  const t = useTranslations('itinerary');

  const resolvedAreaId = areaId ?? areaForMarina(marinaName, countryCode);
  const area = findItineraryArea(resolvedAreaId);

  // Route metaTitles live in the area's per-country namespace. Hooks must
  // run unconditionally, so a missing area falls back to the default
  // namespace (the resolve* helpers t.has-guard every lookup anyway).
  const tArea = useTranslations(itineraryNamespace(area ?? {}));

  if (!area) return null;

  const routes = suggestedRoutesForArea(area.id, nights, marinaName).slice(0, maxRoutes);

  if (routes.length === 0) return null;

  const compact = variant === 'compact';

  return (
    <Box component="section" sx={{ mt: compact ? 4 : { xs: 5, md: 6 }, mb: compact ? 0 : { xs: 2, md: 4 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'baseline' }}
        gap={1}
        sx={{ mb: compact ? 2 : 2.5 }}
      >
        <Typography
          component="h2"
          sx={{
            fontSize: compact ? { xs: 18, md: 20 } : { xs: 22, md: 26 },
            fontWeight: 700,
            color: colors.blue950,
            lineHeight: 1.2,
            m: 0,
          }}
        >
          {headingOverride ?? t('suggested.heading')}
        </Typography>
        <Typography
          component={Link}
          href={`/itineraries/${area.id}`}
          sx={{
            color: colors.blue700,
            fontSize: 12,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 600,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {t('suggested.viewAll', { area: area.sailingArea })} →
        </Typography>
      </Stack>
      <Box
        sx={{
          display: { xs: 'flex', sm: 'grid' },
          gridTemplateColumns: { sm: 'repeat(2, 1fr)', lg: compact ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)' },
          gap: 2,
          overflowX: { xs: 'auto', sm: 'visible' },
          pb: { xs: 1, sm: 0 },
        }}
      >
        {routes.map(route => {
          const days = route.numberOfDays ?? route.routeDays.length;
          const pathLabel = [route.startingPoint, ...(route.otherPoints || [])].join(' → ');
          // Card label = metaTitle minus the "| Brand" SEO suffix — the
          // suffix belongs in <title>, not on a route card.
          const shortName = resolveRouteText(route, 'metaTitle', route.metaTitle, tArea)?.split(' | ')[0];

          return (
            <Box
              key={route.id}
              component={Link}
              href={`/itineraries/${area.id}/${route.id}`}
              sx={{
                flex: { xs: '0 0 auto', sm: 'unset' },
                width: { xs: 240, sm: 'auto' },
                display: 'block',
                textDecoration: 'none',
                backgroundColor: colors.white,
                borderRadius: 3,
                overflow: 'hidden',
                border: `1px solid ${colors.black200}`,
                transition: 'border-color 200ms ease, box-shadow 200ms ease',
                '&:hover': {
                  borderColor: colors.blue500,
                  boxShadow: '0 12px 32px -12px rgb(0 0 0 / 18%)',
                },
                '&:hover .suggested-route-img': { transform: 'scale(1.04)' },
              }}
            >
              <Box sx={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={route.cardImage.src}
                  srcSet={staticSrcSet(route.cardImage.src)}
                  sizes="(max-width: 599px) 70vw, (max-width: 1199px) 50vw, 25vw"
                  alt={route.cardImage.alt}
                  className="suggested-route-img"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 700ms ease',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    backgroundColor: 'rgb(255 255 255 / 95%)',
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 99,
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: colors.blue950,
                    fontWeight: 600,
                  }}
                >
                  {t('hub.daysExact', { days })}
                </Box>
              </Box>
              <Box sx={{ p: compact ? 1.75 : 2 }}>
                <Typography
                  component="h3"
                  sx={{
                    fontSize: compact ? 14 : 15,
                    fontWeight: 700,
                    color: colors.blue950,
                    lineHeight: 1.4,
                    m: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {pathLabel}
                </Typography>
                {!compact && shortName && (
                  <Typography
                    sx={{
                      mt: 1,
                      color: colors.black600,
                      fontSize: 13,
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {shortName}
                  </Typography>
                )}
                <Typography
                  component="span"
                  sx={{
                    display: 'block',
                    mt: 1.5,
                    color: colors.blue600,
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  {t('area.seeDayByDay')} →
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default SuggestedItineraries;
