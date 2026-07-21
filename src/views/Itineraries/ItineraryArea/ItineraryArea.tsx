'use client';

import { FC, useMemo, useState } from 'react';

import { Box, Container, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { itineraries } from '@/config/itineraries.config';
import { isOneWayItinerary } from '@/helper/itineraryDaysHelper';
import { itineraryNamespace, resolveAreaText, resolveRouteText } from '@/helper/itineraryI18n';
import { Link } from '@/i18n/navigation';
import colors from '@/styles/themes/colors';
import { staticSrcSet } from '@/utils/static/staticImageSrcSet';

/**
 * `/itineraries/[slug]` (sailing area) body — port of EY's
 * CCItineraryArea restyled with MUI. Route-card grid first (image + day
 * badge + path label + metaDesc), starting-point filter chips, then the
 * area long-form description. ALL content comes from
 * `itineraries.config` verbatim; each card links to
 * `/itineraries/{slug}/{routeId}`.
 */

// Internal sentinel for the "all starting points" filter state — never
// shown to the user (the label is rendered via t('area.allStartingPoints')).
const ALL_LABEL = '__ALL__';

interface ItineraryAreaProps {
  slug: string;
}

const ItineraryArea: FC<ItineraryAreaProps> = ({ slug }) => {
  const t = useTranslations('itinerary');

  const itinerary = useMemo(() => itineraries.flatMap(group => group.itinerary).find(item => item.id === slug), [slug]);
  const country = useMemo(
    () => itineraries.find(({ itinerary: items }) => items.some(item => item.id === slug))?.country,
    [slug]
  );

  // Per-country itinerary copy (area essay + per-route metaDesc) lives in
  // the area's namespace (itinerary.i18nNamespace, stamped in
  // itineraries.config). resolveAreaText/resolveRouteText t.has-guard so
  // unmigrated areas fall back to the raw config strings.
  const tArea = useTranslations(itineraryNamespace(itinerary ?? {}));

  const formatRoutePath = (startingPoint: string, otherPoints: string[]) => {
    if (!otherPoints?.length) return t('area.roundTrip', { start: startingPoint });

    return [startingPoint, ...otherPoints, startingPoint].join(' → ');
  };

  const description = itinerary ? (resolveAreaText(itinerary, 'description', itinerary.description, tArea) ?? '') : '';

  const paragraphs = useMemo(
    () =>
      description
        .split(/\n+/)
        .map(p => p.trim())
        .filter(Boolean),
    [description]
  );

  const startingPoints = useMemo(() => {
    const seen: string[] = [];

    (itinerary?.routes ?? []).forEach(r => {
      if (!seen.includes(r.startingPoint)) seen.push(r.startingPoint);
    });

    return seen;
  }, [itinerary]);

  const [activeStart, setActiveStart] = useState<string>(ALL_LABEL);
  const filteredRoutes = useMemo(() => {
    const routes = itinerary?.routes ?? [];

    if (activeStart === ALL_LABEL) return routes;

    return routes.filter(r => r.startingPoint === activeStart);
  }, [itinerary, activeStart]);

  if (!itinerary) return null;

  return (
    <>
      <Container maxWidth="xl" component="section" sx={{ px: { xs: 2, md: 3 }, py: { xs: 5, md: 8 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'flex-end' }}
          gap={2}
          sx={{ mb: { xs: 3, md: 4 } }}
        >
          <Box>
            <Typography
              component="span"
              sx={{
                fontSize: 11,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: colors.blue700,
                fontWeight: 600,
              }}
            >
              {filteredRoutes.length}{' '}
              {filteredRoutes.length === 1 ? t('area.routeCountSingular') : t('area.routeCountPlural')}
              {activeStart !== ALL_LABEL ? ` ${t('area.routesFrom', { start: activeStart })}` : ''}
            </Typography>
            <Typography
              component="h2"
              sx={{ fontSize: { xs: 28, md: 38 }, fontWeight: 800, color: colors.blue950, lineHeight: 1.1, mt: 1 }}
            >
              {t('area.pickTitle')}{' '}
              <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 400 }}>
                {t('area.pickTitleItalic', { area: itinerary.sailingArea })}
              </Box>
            </Typography>
            {country && (
              <Typography sx={{ mt: 1.5, color: colors.black600, fontSize: { xs: 14, md: 15 } }}>
                {t('area.areaSubtitle', { country, area: itinerary.sailingArea })}
              </Typography>
            )}
          </Box>
          <Typography
            component={Link}
            href="/search"
            sx={{
              color: colors.blue700,
              fontSize: 12,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {t('area.tailorLink')}
          </Typography>
        </Stack>

        {startingPoints.length > 1 && (
          <Box sx={{ mb: { xs: 4, md: 5 } }}>
            <Typography
              sx={{
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: colors.black600,
                mb: 1.5,
                fontWeight: 600,
              }}
            >
              {t('area.pickStartingPoint')}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.25}>
              {[ALL_LABEL, ...startingPoints].map(point => {
                const isActive = point === activeStart;
                const count =
                  point === ALL_LABEL
                    ? itinerary.routes.length
                    : itinerary.routes.filter(r => r.startingPoint === point).length;
                const label = point === ALL_LABEL ? t('area.allStartingPoints') : point;

                return (
                  <Box
                    key={point}
                    component="button"
                    type="button"
                    onClick={() => setActiveStart(point)}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      borderRadius: 99,
                      px: 2.25,
                      py: 1,
                      fontSize: { xs: 12, sm: 13 },
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'border-color 150ms ease, background-color 150ms ease',
                      backgroundColor: isActive ? colors.blue600 : colors.white,
                      color: isActive ? colors.white : colors.blue950,
                      border: `1px solid ${isActive ? colors.blue600 : colors.black300}`,
                      '&:hover': { borderColor: isActive ? colors.blue600 : colors.black600 },
                    }}
                  >
                    <span>{label}</span>
                    <Box
                      component="span"
                      sx={{ fontSize: 11, fontVariantNumeric: 'tabular-nums', opacity: isActive ? 0.75 : 0.5 }}
                    >
                      {count}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: { xs: 2.5, sm: 3.5 },
          }}
        >
          {filteredRoutes.map((route, i) => {
            const days = route.routeDays?.length ?? 7;
            const oneWay = isOneWayItinerary(route);
            const pathLabel = formatRoutePath(route.startingPoint, route.otherPoints || []);
            const metaDesc = resolveRouteText(route, 'metaDesc', route.metaDesc, tArea);

            return (
              <Box
                key={route.id}
                component={Link}
                href={`/itineraries/${itinerary.id}/${route.id}`}
                sx={{
                  display: 'block',
                  height: '100%',
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
                  '&:hover .route-card-img': { transform: 'scale(1.04)' },
                }}
              >
                <Box sx={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={route.cardImage.src}
                    srcSet={staticSrcSet(route.cardImage.src)}
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    alt={route.cardImage.alt}
                    className="route-card-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 700ms ease',
                    }}
                    loading={i === 0 ? undefined : 'lazy'}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      backgroundColor: 'rgb(255 255 255 / 95%)',
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 99,
                      fontSize: 10,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: colors.blue950,
                      fontWeight: 600,
                    }}
                  >
                    {oneWay ? t('area.dayBadgeOneWay', { days }) : t('area.dayBadgeLoop', { days })}
                  </Box>
                </Box>
                <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
                  <Typography
                    component="span"
                    sx={{
                      display: 'block',
                      fontSize: 11,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: colors.blue700,
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {t('area.routeCardKicker', { index: `0${i + 1}`, start: route.startingPoint })}
                  </Typography>
                  <Typography
                    component="h3"
                    sx={{
                      fontSize: { xs: 18, sm: 20 },
                      fontWeight: 700,
                      color: colors.blue950,
                      lineHeight: 1.35,
                      m: 0,
                    }}
                  >
                    {pathLabel}
                  </Typography>
                  {metaDesc && (
                    <Typography
                      sx={{
                        mt: 1.5,
                        color: colors.black700,
                        fontSize: { xs: 13.5, sm: 14.5 },
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {metaDesc}
                    </Typography>
                  )}
                  <Typography
                    component="span"
                    sx={{
                      display: 'block',
                      mt: 2.5,
                      color: colors.blue600,
                      fontSize: 12,
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
      </Container>

      {paragraphs.length > 0 && (
        <Box component="section" sx={{ borderTop: `1px solid ${colors.black200}` }}>
          <Container maxWidth="md" sx={{ px: { xs: 2, md: 3 }, py: { xs: 5, md: 8 } }}>
            <Typography
              component="span"
              sx={{
                fontSize: 11,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: colors.blue700,
                fontWeight: 600,
              }}
            >
              {t('area.aboutEyebrow', { area: itinerary.sailingArea })}
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 22, md: 28 },
                fontWeight: 800,
                color: colors.blue950,
                lineHeight: 1.15,
                mt: 1,
                mb: { xs: 3, md: 4 },
              }}
            >
              {t('area.aboutHeading', { area: itinerary.sailingArea })}{' '}
              <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 400 }}>
                {t('area.aboutHeadingItalic')}
              </Box>
            </Typography>
            <Stack gap={2.5}>
              {paragraphs.map(para => (
                <Typography
                  key={para.slice(0, 40)}
                  sx={{ color: colors.black700, fontSize: { xs: 14.5, md: 16 }, lineHeight: 1.7 }}
                >
                  {para}
                </Typography>
              ))}
            </Stack>
          </Container>
        </Box>
      )}
    </>
  );
};

export default ItineraryArea;
