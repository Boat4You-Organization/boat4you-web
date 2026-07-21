import React from 'react';

import { pdf } from '@react-pdf/renderer';
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

/** The itinerary assets (card image + static route map) are WEBP, which
 *  @react-pdf can't decode — pull them through a canvas and hand the
 *  renderer a JPEG data-URL instead (same trick as useYachtPdfDownload).
 *  They live in /public on this origin, so no CORS taint to dodge. */
const toJpegDataUrl = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new window.Image();

    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('canvas 2d context unavailable'));

        return;
      }

      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => reject(new Error(`image load failed: ${url}`));
    img.src = url;
  });

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

      const [qrDataUrl, heroSrc, mapSrc] = await Promise.all([
        QRCode.toDataURL(data.url, { width: 300, margin: 1 }),
        toJpegDataUrl(data.cardImageSrc),
        toJpegDataUrl(data.mapImageSrc),
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
