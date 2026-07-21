'use client';

/**
 * Long-form "deep-read" version of the route (EY port) — full per-day
 * prose, hero image, and practical bullets. Below the SEO extras; still
 * fully server-rendered content (all prose in the DOM) so search engines
 * and patient readers get the complete narrative.
 *
 * Scroll-driven map: a sticky route map sits behind the day cards and
 * flies to the day currently centred in the viewport, so the reader
 * watches the boat's position move down the coast as they scroll. A
 * rAF-throttled scroll listener on each day block drives the active-day
 * state; the shared Leaflet map handles the fly-to. The map is
 * decorative + gesture-disabled (interactive=false) so it never traps
 * page scroll or touch.
 */
import { useEffect, useRef, useState } from 'react';

import { Box, Container, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import { itineraryNamespace, resolveDayList, resolveDayText } from '@/helper/itineraryI18n';
import colors from '@/styles/themes/colors';
import { ItineraryRoute } from '@/types/itinerary.type';

// Leaflet touches `window` at module load — client-only dynamic import.
const ItineraryRouteLeafletMap = dynamic(
  () => import('@/views/Itineraries/RouteDetailSection/ItineraryRouteLeafletMap'),
  { ssr: false, loading: () => <Box sx={{ height: '100%', width: '100%', backgroundColor: colors.black100 }} /> }
);

// Per-day fly-in zoom for the background map — close enough to read the
// coastline, wide enough to keep the next island in frame.
const JOURNEY_FLY_ZOOM = 11;

interface Props {
  route: ItineraryRoute;
}

const RouteDayDetailedJourney = ({ route }: Props) => {
  const { routeDays } = route;
  // Static section chrome lives in the shared `itinerary` namespace.
  const tUi = useTranslations('itinerary');
  // Per-day route copy (description, things to do, mooring tip) — namespaced
  // per country; harmless stub namespace for not-yet-migrated areas.
  const t = useTranslations(itineraryNamespace(route));

  const [activeDayId, setActiveDayId] = useState<string>(routeDays[0]?.id ?? '');
  const blockRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Activate the day whose block sits closest to the vertical centre of the
  // viewport. A plain scroll listener (rAF-throttled) rather than an
  // IntersectionObserver: the day blocks are taller than the viewport, and a
  // thin centre-band observer proved unreliable for that case. Cheap — a
  // handful of getBoundingClientRect reads per animation frame, and state
  // only updates when the nearest day actually changes.
  useEffect(() => {
    const pickNearest = () => {
      const mid = window.innerHeight / 2;
      let bestId: string | null = null;
      let bestDist = Infinity;

      blockRefs.current.forEach((el, i) => {
        if (!el || !routeDays[i]) return;

        const r = el.getBoundingClientRect();
        const dist = Math.abs((r.top + r.bottom) / 2 - mid);

        if (dist < bestDist) {
          bestDist = dist;
          bestId = routeDays[i].id;
        }
      });

      if (bestId) {
        const next = bestId;

        setActiveDayId(prev => (prev === next ? prev : next));
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        pickNearest();
        ticking = false;
      });
    };

    // Some layouts scroll on an inner element rather than the window — a
    // capture-phase listener on the document catches the scroll wherever it
    // originates.
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    pickNearest();

    return () => {
      document.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('scroll', onScroll);
    };
  }, [routeDays]);

  if (!routeDays || routeDays.length === 0) return null;

  const activeIndex = Math.max(
    0,
    routeDays.findIndex(d => d.id === activeDayId)
  );

  return (
    <Box
      component="section"
      sx={{ borderTop: `1px solid ${colors.black200}`, pt: { xs: 6, md: 8 }, pb: { xs: 7, md: 12 } }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
        <Stack
          gap={1}
          sx={{ maxWidth: 920, mx: 'auto', textAlign: { xs: 'left', md: 'center' }, mb: { xs: 4, md: 6 } }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: colors.blue800,
              fontWeight: 700,
            }}
          >
            {tUi('journey.eyebrow')}
          </Typography>
          <Typography
            component="h2"
            sx={{ fontSize: { xs: 26, md: 36 }, fontWeight: 800, color: colors.blue950, lineHeight: 1.12, m: 0 }}
          >
            {tUi('journey.heading')}
          </Typography>
          <Typography sx={{ color: colors.black700, fontSize: { xs: 13.5, sm: 14.5 }, lineHeight: 1.6, mt: 0.5 }}>
            {tUi('journey.intro')}
          </Typography>
        </Stack>
      </Container>

      {/* Scrolly stage: sticky map cell + flowing day cells share one grid
          slot so the map pins in place while the cards scroll over it. */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
        <Box sx={{ gridColumn: 1, gridRow: 1 }}>
          <Box sx={{ position: 'sticky', top: 88, height: '82svh', overflow: 'hidden' }}>
            <ItineraryRouteLeafletMap
              routeDays={routeDays}
              activeDayId={activeDayId}
              onPinClick={setActiveDayId}
              flyToZoom={JOURNEY_FLY_ZOOM}
              interactive={false}
              lightTiles
            />
            {/* Day counter chip, top-left (over the open map, clear of the
                right-aligned day card) */}
            <Box
              sx={{
                pointerEvents: 'none',
                position: 'absolute',
                left: 16,
                top: 16,
                zIndex: 500,
                borderRadius: 99,
                backgroundColor: 'rgb(20 24 87 / 85%)',
                px: 1.75,
                py: 0.75,
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: colors.white,
                boxShadow: '0 8px 20px rgb(0 0 0 / 25%)',
                backdropFilter: 'blur(4px)',
              }}
            >
              {tUi('journey.dayLabel', { number: activeIndex + 1 })}
              <Box component="span" sx={{ opacity: 0.6 }}>
                {' '}
                / {routeDays.length}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ gridColumn: 1, gridRow: 1, position: 'relative', zIndex: 10 }}>
          <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
            {routeDays.map((day, i) => {
              const heroImage = day.gallery?.[0];
              const thingsToDo = resolveDayList(route, day, 'thingsToDo', day.thingsToDo, t);
              const mooringTip = resolveDayText(route, day, 'mooringTip', day.mooringTip, t);
              const isActive = day.id === activeDayId;

              return (
                <Box
                  key={day.id}
                  id={`journey-day-${day.day}`}
                  data-day-id={day.id}
                  ref={(el: HTMLDivElement | null) => {
                    blockRefs.current[i] = el;
                  }}
                  sx={{
                    display: 'flex',
                    minHeight: '86svh',
                    alignItems: 'center',
                    py: 4,
                    justifyContent: { xs: 'center', md: 'flex-start', lg: 'flex-end' },
                  }}
                >
                  {/* Frosted day card floating over the map */}
                  <Box
                    component="article"
                    sx={{
                      width: '100%',
                      maxWidth: 500,
                      overflow: 'hidden',
                      borderRadius: 3,
                      border: `1px solid ${isActive ? colors.blue500 : colors.black200}`,
                      backgroundColor: 'rgb(255 255 255 / 92%)',
                      boxShadow: '0 24px 60px -20px rgb(0 0 0 / 35%)',
                      backdropFilter: 'blur(6px)',
                      transition: 'border-color 300ms ease, box-shadow 300ms ease',
                    }}
                  >
                    {heroImage?.src && (
                      <Box
                        sx={{
                          position: 'relative',
                          aspectRatio: '16 / 9',
                          width: '100%',
                          backgroundColor: colors.black100,
                        }}
                      >
                        <Image
                          src={heroImage.src}
                          alt={heroImage.alt || `${day.routeFrom} — ${day.routeTo}`}
                          fill
                          sizes="(max-width: 1024px) 92vw, 500px"
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                    )}

                    <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
                      <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 1.5 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            height: 32,
                            width: 32,
                            flexShrink: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            backgroundColor: colors.blue600,
                            fontSize: 14,
                            fontWeight: 700,
                            color: colors.white,
                          }}
                        >
                          {day.day}
                        </Box>
                        <Typography
                          component="span"
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.16em',
                            color: colors.black600,
                          }}
                        >
                          {tUi('journey.dayLabel', { number: day.day })}
                        </Typography>
                      </Stack>
                      <Typography
                        component="h3"
                        sx={{
                          fontSize: { xs: 19, md: 23 },
                          fontWeight: 700,
                          color: colors.blue950,
                          lineHeight: 1.3,
                          m: 0,
                          mb: 1.5,
                        }}
                      >
                        {day.routeFrom} → {day.routeTo}
                      </Typography>
                      <Typography sx={{ fontSize: { xs: 14, sm: 15 }, lineHeight: 1.65, color: colors.black700 }}>
                        {resolveDayText(route, day, 'description', day.description, t)}
                      </Typography>

                      {thingsToDo && thingsToDo.length > 0 && (
                        <Box sx={{ mt: 2.5 }}>
                          <Typography
                            sx={{
                              mb: 1.25,
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.12em',
                              color: colors.black600,
                            }}
                          >
                            {tUi('journey.thingsToDo')}
                          </Typography>
                          <Stack gap={1}>
                            {thingsToDo.map(item => (
                              <Stack key={item} direction="row" alignItems="flex-start" gap={1}>
                                <Box
                                  component="svg"
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  sx={{ mt: '2px', height: 16, width: 16, flexShrink: 0, fill: colors.blue600 }}
                                >
                                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
                                </Box>
                                <Typography
                                  sx={{ fontSize: { xs: 13.5, sm: 14 }, lineHeight: 1.45, color: colors.black700 }}
                                >
                                  {item}
                                </Typography>
                              </Stack>
                            ))}
                          </Stack>
                        </Box>
                      )}

                      {mooringTip && (
                        <Stack
                          direction="row"
                          alignItems="flex-start"
                          gap={1}
                          sx={{
                            mt: 2.5,
                            borderRadius: 2,
                            borderLeft: `3px solid ${colors.blue600}`,
                            backgroundColor: colors.blue50,
                            p: 2,
                          }}
                        >
                          <Box
                            component="svg"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            sx={{ mt: '2px', height: 18, width: 18, flexShrink: 0, fill: colors.blue600 }}
                          >
                            <path d="M17 15l1.55 1.55c-.96 1.69-3.33 3.04-5.55 3.37V11h3V9h-3V7.82C14.16 7.4 15 6.3 15 5c0-1.65-1.35-3-3-3S9 3.35 9 5c0 1.3.84 2.4 2 2.82V9H8v2h3v9.92c-2.22-.33-4.59-1.68-5.55-3.37L7 15l-4-3v3c0 3.88 4.92 7 9 7s9-3.12 9-7v-3l-4 3zM12 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                mb: 0.25,
                                fontSize: 11,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.12em',
                                color: colors.black600,
                              }}
                            >
                              {tUi('journey.mooringTip')}
                            </Typography>
                            <Typography
                              sx={{ fontSize: { xs: 13.5, sm: 14 }, lineHeight: 1.45, color: colors.black700 }}
                            >
                              {mooringTip}
                            </Typography>
                          </Box>
                        </Stack>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default RouteDayDetailedJourney;
