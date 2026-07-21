'use client';

/**
 * Client wrapper that owns the active-day state shared between the
 * map+panel surface above and the clickable Route summary in the SEO
 * extras below. Clicking a day in the summary jumps the map back into
 * view + activates that day's pin/panel. Single source of truth, no URL
 * hash tricks.
 */
import { useRef, useState } from 'react';

import { Box, Container } from '@mui/material';
import dynamic from 'next/dynamic';

import { ItineraryRoute } from '@/types/itinerary.type';
import RoutePdfDownloadButton from '@/views/Itineraries/RoutePdfDownloadButton';

const RouteDetailSection = dynamic(() => import('@/views/Itineraries/RouteDetailSection'));
const RouteSeoExtras = dynamic(() => import('@/views/Itineraries/RouteSeoExtras'));
const RouteDayDetailedJourney = dynamic(() => import('@/views/Itineraries/RouteDayDetailedJourney'));

interface Props {
  route: ItineraryRoute;
  sailingArea: string;
  itinerarySlug: string;
  /** Country label from the itineraries config group — feeds the PDF cover. */
  country: string;
  /** did-carrying /search link for the starting point (resolved server-side —
   *  a bare ?destinations= does not filter the listing). */
  boatsSearchHref: string;
}

const RouteDetailContent = ({ route, sailingArea, itinerarySlug, country, boatsSearchHref }: Props) => {
  const [activeDayId, setActiveDayId] = useState<string>(route.routeDays[0]?.id ?? '');
  const mapAnchorRef = useRef<HTMLDivElement | null>(null);

  const handleDaySelectFromSummary = (id: string) => {
    setActiveDayId(id);

    if (mapAnchorRef.current) {
      mapAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Take-it-with-you CTA right under the hero — the PDF mirrors the
          page (map, day summary, per-day prose) for offline reading. */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 }, mt: 2.5, display: 'flex', justifyContent: 'flex-end' }}>
        <RoutePdfDownloadButton
          route={route}
          sailingArea={sailingArea}
          itinerarySlug={itinerarySlug}
          country={country}
        />
      </Container>
      <Box ref={mapAnchorRef}>
        <RouteDetailSection route={route} activeDayId={activeDayId} onDaySelect={setActiveDayId} />
      </Box>
      <RouteSeoExtras
        route={route}
        sailingArea={sailingArea}
        itinerarySlug={itinerarySlug}
        boatsSearchHref={boatsSearchHref}
        onDaySelect={handleDaySelectFromSummary}
      />
      <RouteDayDetailedJourney route={route} />
    </>
  );
};

export default RouteDetailContent;
