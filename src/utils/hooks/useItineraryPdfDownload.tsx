import React from 'react';

import { Font, pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';

import ItineraryPDF, { ItineraryPdfData } from '@/components/ItineraryPDF/ItineraryPDF';

interface UseItineraryPdfDownloadProps {
  /** Pre-resolved, plain-string route payload — the caller resolves all
   *  localized copy via the itineraryI18n helpers before handing it in. */
  data: ItineraryPdfData;
}

interface UseItineraryPdfDownloadPayload {
  downloadItineraryPDF: () => Promise<void>;
  isDownloading: boolean;
}

/** Register the site's Inter TTFs with @react-pdf exactly once. The
 *  built-in Helvetica has no Croatian/Turkish diacritics (č ž š ğ ı) —
 *  they silently DROP from place names ("Brač" → "Bra"). Inter ships in
 *  /public/fonts and covers Latin Extended. SemiBold doubles as 700 —
 *  the repo ships no Bold cut and 600 reads as bold at PDF sizes. */
let fontsRegistered = false;

const registerPdfFonts = (baseUrl: string): void => {
  if (fontsRegistered) return;

  Font.register({
    family: 'Inter',
    fonts: [
      { src: `${baseUrl}/fonts/Inter/Inter-Regular.ttf`, fontWeight: 400 },
      { src: `${baseUrl}/fonts/Inter/Inter-Medium.ttf`, fontWeight: 500 },
      { src: `${baseUrl}/fonts/Inter/Inter-SemiBold.ttf`, fontWeight: 600 },
      { src: `${baseUrl}/fonts/Inter/Inter-SemiBold.ttf`, fontWeight: 700 },
    ],
  });
  fontsRegistered = true;
};

/** The itinerary assets (card image + static route map) are WEBP, which
 *  @react-pdf can't decode — pull them through a canvas and hand the
 *  renderer a JPEG data-URL instead (same trick as useYachtPdfDownload).
 *  They live in /public on this origin, so no CORS taint to dodge. */
const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new window.Image();

    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`image load failed: ${url}`));
    img.src = url;
  });

const toJpegDataUrl = async (url: string): Promise<string> => {
  const img = await loadImage(url);
  const canvas = document.createElement('canvas');

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('canvas 2d context unavailable');

  ctx.drawImage(img, 0, 0);

  return canvas.toDataURL('image/jpeg', 0.82);
};

interface MapPin {
  day: number;
  leftPct: number;
  topPct: number;
}

/** Paint the ROUTE onto the static area map: a dashed course line
 *  through the day pins plus numbered circles — the raw map.webp is
 *  just the sea chart and gave the PDF a "map without a route"
 *  (Mario 21.7.2026). Pin positions come from the config's
 *  mapPin.desktop percentages (the same ones the web overlay uses). */
const toRouteMapDataUrl = async (url: string, pins: MapPin[]): Promise<string> => {
  const img = await loadImage(url);
  const canvas = document.createElement('canvas');

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('canvas 2d context unavailable');

  ctx.drawImage(img, 0, 0);

  const w = canvas.width;
  const h = canvas.height;
  const points = pins.map(p => ({ day: p.day, x: (p.leftPct / 100) * w, y: (p.topPct / 100) * h }));

  if (points.length > 0) {
    const r = Math.max(11, Math.round(w * 0.016));

    // Course line first, pins on top.
    ctx.strokeStyle = 'rgba(40, 86, 255, 0.85)';
    ctx.lineWidth = Math.max(2.5, w * 0.004);
    ctx.setLineDash([ctx.lineWidth * 2.4, ctx.lineWidth * 1.8]);
    ctx.lineJoin = 'round';
    ctx.beginPath();
    points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();
    ctx.setLineDash([]);

    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = '#2856ff';
      ctx.fill();
      ctx.lineWidth = Math.max(2, r * 0.18);
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = `700 ${Math.round(r * 1.15)}px Inter, Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(p.day), p.x, p.y + r * 0.06);
    });
  }

  return canvas.toDataURL('image/jpeg', 0.85);
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Browser-side itinerary route PDF (clone of useYachtPdfDownload): the
 * document is rendered with @react-pdf in the client and downloaded as
 * a blob — no server round-trip, nothing for cusma1 to render. The QR
 * code and in-document links target the canonical route page URL.
 */
const useItineraryPdfDownload = ({ data }: UseItineraryPdfDownloadProps): UseItineraryPdfDownloadPayload => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const downloadItineraryPDF = async (): Promise<void> => {
    if (!data || isDownloading) return;

    setIsDownloading(true);

    try {
      const baseUrl = window.location.origin;

      registerPdfFonts(baseUrl);

      const pins: MapPin[] = data.days
        .filter(d => d.pinLeft !== null && d.pinTop !== null)
        .map(d => ({ day: d.day, leftPct: d.pinLeft as number, topPct: d.pinTop as number }));

      const [qrDataUrl, heroSrc, mapSrc] = await Promise.all([
        QRCode.toDataURL(data.url, { width: 300, margin: 1 }),
        toJpegDataUrl(data.cardImageSrc),
        toRouteMapDataUrl(data.mapImageSrc, pins),
      ]);

      const now = new Date();
      const generatedDate = `${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

      const blob = await pdf(
        <ItineraryPDF
          data={data}
          heroSrc={heroSrc}
          mapSrc={mapSrc}
          qrDataUrl={qrDataUrl}
          baseUrl={baseUrl}
          generatedDate={generatedDate}
        />
      ).toBlob();

      const link = document.createElement('a');

      link.href = URL.createObjectURL(blob);
      link.download = `boat4you-itinerary-${data.routeId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadItineraryPDF, isDownloading };
};

export default useItineraryPdfDownload;
