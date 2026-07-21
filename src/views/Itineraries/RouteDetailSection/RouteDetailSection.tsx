'use client';

/**
 * Map + day-detail panel surface — EY port. Active-day state lives one
 * level up (in `RouteDetailContent`) so the SEO Route summary can
 * activate the same day as a map pin.
 */
import { Box, Container, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

import colors from '@/styles/themes/colors';
import { ItineraryRoute } from '@/types/itinerary.type';

import RouteDayPanel from './RouteDayPanel';

// Leaflet bundles `window` access at module load — the only safe way
// through Next.js is a client-only dynamic import. Neutral placeholder
// while the chunk hydrates so the layout doesn't jump.
const ItineraryRouteLeafletMap = dynamic(() => import('./ItineraryRouteLeafletMap'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        borderRadius: 1.5,
        backgroundColor: colors.black100,
      }}
    />
  ),
});

interface Props {
  route: ItineraryRoute;
  activeDayId: string;
  onDaySelect: (id: string) => void;
}

const RouteDetailSection = ({ route, activeDayId, onDaySelect }: Props) => {
  const t = useTranslations('itinerary');
  const { routeDays } = route;
  const activeDay = routeDays.find(d => d.id === activeDayId) ?? routeDays[0];

  if (!activeDay) return null;

  return (
    <Container component="section" maxWidth="xl" sx={{ pt: { xs: 5, md: 7 }, pb: { xs: 4, lg: 14 } }}>
      <Stack
        gap={0.75}
        sx={{
          maxWidth: 920,
          mx: { md: 'auto' },
          textAlign: { xs: 'left', md: 'center' },
          mb: { xs: 3, md: 4 },
        }}
      >
        <Typography
          component="span"
          sx={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: colors.blue800,
            textTransform: 'uppercase',
          }}
        >
          {t('detail.eyebrow')}
        </Typography>
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: 22, md: 28 },
            fontWeight: 700,
            color: colors.blue950,
            lineHeight: 1.2,
            m: 0,
          }}
        >
          {t('detail.heading')}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 13.5, md: 14.5 },
            lineHeight: 1.6,
            color: colors.black700,
            mt: 0.25,
          }}
        >
          {t('detail.intro')}
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.45fr 1fr' },
          gap: { xs: 3, lg: 3 },
          alignItems: 'stretch',
          height: { xs: 'auto', lg: 640 },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 320, lg: '100%' },
            borderRadius: 2,
            overflow: 'hidden',
            border: `1px solid ${colors.black100}`,
          }}
        >
          <ItineraryRouteLeafletMap routeDays={routeDays} activeDayId={activeDay.id} onPinClick={onDaySelect} />
        </Box>
        <RouteDayPanel route={route} activeDay={activeDay} />
      </Box>
    </Container>
  );
};

export default RouteDetailSection;
