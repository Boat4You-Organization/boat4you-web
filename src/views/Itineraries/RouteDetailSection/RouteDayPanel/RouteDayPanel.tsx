'use client';

/**
 * Right-side panel paired with the Leaflet map (EY port). Compact,
 * scroll-free teaser per day: image + heading + short description +
 * sailing stats. The full prose, "Things to do" bullets, and Mooring tip
 * live in the "Day-by-day journey" deep-read section below — no
 * duplicated info.
 */
import { DirectionsBoat, Schedule } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { computeDayStats } from '@/helper/itineraryDayStats';
import { itineraryNamespace, resolveDayText } from '@/helper/itineraryI18n';
import colors from '@/styles/themes/colors';
import { ItineraryDay, ItineraryRoute } from '@/types/itinerary.type';

interface Props {
  route: ItineraryRoute;
  activeDay: ItineraryDay;
}

const PANEL_FALLBACK_CHARS = 280;

/** Trim long-form prose to a scannable teaser without breaking words. */
const truncateForPanel = (text: string, max: number): string => {
  if (text.length <= max) return text;

  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');

  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
};

const RouteDayPanel = ({ route, activeDay }: Props) => {
  // Panel chrome (Day eyebrow, Distance/Sailing stat labels) lives in the
  // shared `itinerary` namespace.
  const t = useTranslations('itinerary');
  // Per-day teaser copy (shortDescription → truncated description) lives in
  // the route's country namespace; resolveDayText t.has-guards → config
  // fallback. Hook called unconditionally (rules of hooks).
  const tRoute = useTranslations(itineraryNamespace(route));
  const heroImage = activeDay.gallery?.[0];
  const shortDescription = resolveDayText(route, activeDay, 'shortDescription', activeDay.shortDescription, tRoute);
  const description = resolveDayText(route, activeDay, 'description', activeDay.description, tRoute) ?? '';
  const teaser = shortDescription ?? truncateForPanel(description, PANEL_FALLBACK_CHARS);
  const stats = computeDayStats(activeDay);

  return (
    <Stack
      sx={{
        height: '100%',
        backgroundColor: colors.black50,
        border: `1px solid ${colors.black100}`,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Active day hero — image on top, then heading + copy underneath */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          backgroundColor: colors.black100,
        }}
      >
        {heroImage?.src && (
          <Image
            key={heroImage.src}
            src={heroImage.src}
            alt={heroImage.alt || `${activeDay.routeFrom} — ${activeDay.routeTo}`}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            style={{ objectFit: 'cover' }}
          />
        )}
      </Box>

      <Box sx={{ p: { xs: 2.5, md: 3 } }}>
        <Typography
          component="span"
          sx={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: colors.blue800,
          }}
        >
          {t('panel.dayLabel', { number: activeDay.day })}
        </Typography>
        <Typography
          component="h3"
          sx={{
            fontSize: { xs: 18, md: 20 },
            fontWeight: 700,
            color: colors.black900,
            lineHeight: 1.3,
            mt: 0.5,
            mb: 1.5,
          }}
        >
          {activeDay.routeFrom} → {activeDay.routeTo}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 13.5, md: 14 },
            lineHeight: 1.65,
            color: colors.black700,
          }}
        >
          {teaser}
        </Typography>

        {/* Sailing stats — distance + estimated hours, computed from the
            canonical lat/lon of routeFrom→routeTo. Hidden silently when
            either endpoint is unmapped. */}
        {stats && (
          <Stack
            direction="row"
            gap={2}
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 1.5,
              backgroundColor: colors.blue50,
              border: `1px solid ${colors.blue100}`,
            }}
          >
            <Stack direction="row" gap={0.75} alignItems="center">
              <DirectionsBoat sx={{ fontSize: 16, color: colors.blue800 }} />
              <Box>
                <Typography
                  sx={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: colors.black600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('panel.distanceLabel')}
                </Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.blue950 }}>
                  {t('panel.distanceValue', { nm: stats.nauticalMiles })}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" gap={0.75} alignItems="center">
              <Schedule sx={{ fontSize: 16, color: colors.blue800 }} />
              <Box>
                <Typography
                  sx={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: colors.black600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('panel.sailingLabel')}
                </Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.blue950 }}>
                  {t('panel.sailingValue', { hours: stats.sailingHours })}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default RouteDayPanel;
