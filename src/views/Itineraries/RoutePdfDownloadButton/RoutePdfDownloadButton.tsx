'use client';

import { FileDownloadOutlined } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import { useTranslations } from 'next-intl';

import { ItineraryPdfData } from '@/components/ItineraryPDF/ItineraryPDF';
import { computeDayStats } from '@/helper/itineraryDayStats';
import { itineraryNamespace, resolveDayList, resolveDayText, resolveRouteText } from '@/helper/itineraryI18n';
import { ItineraryRoute } from '@/types/itinerary.type';
import useItineraryPdfDownload from '@/utils/hooks/useItineraryPdfDownload';

interface RoutePdfDownloadButtonProps {
  route: ItineraryRoute;
  sailingArea: string;
  itinerarySlug: string;
  country: string;
}

/**
 * "Download PDF (free)" CTA for the route detail page. The PDF hook
 * consumes plain pre-resolved strings, so THIS component (which owns
 * the translations context) resolves all localized route copy via the
 * itineraryI18n helpers — same resolve path the visible deep-read
 * section uses — and hands a flat ItineraryPdfData to the hook.
 */
const RoutePdfDownloadButton = ({ route, sailingArea, itinerarySlug, country }: RoutePdfDownloadButtonProps) => {
  // Button label lives in the shared `itinerary` namespace; per-day route
  // copy in the route's country namespace (config fallback via t.has).
  const tUi = useTranslations('itinerary');
  const t = useTranslations(itineraryNamespace(route));

  const numberOfDays = route.numberOfDays ?? route.routeDays.length;
  // Many EY-ported config metaTitles end in "… | Europe Yachts" — keep only
  // the segment before the first pipe so a Boat4You PDF never prints a
  // sister brand; empty/missing metaTitle falls back to the plain formula.
  const metaTitle = resolveRouteText(route, 'metaTitle', route.metaTitle, t) || '';
  const routeName = metaTitle.split('|')[0].trim() || `${route.startingPoint} · ${numberOfDays}-day route`;

  const data: ItineraryPdfData = {
    routeId: route.id,
    routeName,
    areaName: sailingArea,
    country,
    // Canonical www URL (QR target) — memory rule: web URLs always carry www.
    url: `https://www.boat4you.com/itineraries/${itinerarySlug}/${route.id}`,
    cardImageSrc: route.cardImage.src,
    mapImageSrc: route.map.desktop.image.src,
    days: route.routeDays.map(day => {
      const stats = computeDayStats(day);

      return {
        day: day.day,
        from: day.routeFrom,
        to: day.routeTo,
        description: resolveDayText(route, day, 'description', day.description, t) ?? '',
        thingsToDo: resolveDayList(route, day, 'thingsToDo', day.thingsToDo, t) ?? [],
        mooringTip: resolveDayText(route, day, 'mooringTip', day.mooringTip, t) ?? '',
        distanceNm: stats?.nauticalMiles ?? null,
        sailingHours: stats?.sailingHours ?? null,
      };
    }),
  };

  const { downloadItineraryPDF, isDownloading } = useItineraryPdfDownload({ data });

  return (
    <Button
      variant="containedInfo"
      startIcon={isDownloading ? <CircularProgress size={16} /> : <FileDownloadOutlined />}
      onClick={downloadItineraryPDF}
      disabled={isDownloading}
      aria-label={tUi('pdfDownload')}
    >
      {tUi('pdfDownload')}
    </Button>
  );
};

export default RoutePdfDownloadButton;
