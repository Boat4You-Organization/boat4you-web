import React from 'react';

import { pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';

import YachtPDF from '@/components/YachtPDF/YachtPDF';
import { YachtOfferModel } from '@/models/yacht-offer.model';
import { YachtModel } from '@/models/yacht.model';
import { getBoatImageUrl } from '@/utils/static/imageUtils';
import { toTitleCase } from '@/utils/static/toTitleCase';

interface UseYachtPdfDownloadProps {
  yacht: YachtModel;
  /** Currently selected offer (dated view); null renders the season card. */
  selectedOffer: YachtOfferModel | null;
}

interface UseYachtPdfDownloadPayload {
  downloadYachtPDF: () => Promise<void>;
  isDownloading: boolean;
}

/** The image API serves WEBP only, which @react-pdf can't decode — pull the
 *  photo through a canvas and hand the renderer a JPEG data-URL instead.
 *  crossOrigin works because the CDN allows our origin (verified 10.7.2026). */
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
 * Browser-side yacht presentation PDF (mirrors useInvoiceDownload): the
 * document is rendered with @react-pdf in the client and downloaded as a
 * blob — no server round-trip, nothing for cusma1 to render. The QR code
 * targets the clean boat URL; the in-document links carry the selected
 * dates so a desktop reader lands on the exact priced week.
 */
const useYachtPdfDownload = ({ yacht, selectedOffer }: UseYachtPdfDownloadProps): UseYachtPdfDownloadPayload => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const downloadYachtPDF = async (): Promise<void> => {
    if (!yacht || isDownloading) return;

    setIsDownloading(true);

    try {
      const baseUrl = window.location.origin;
      const cleanUrl = `${baseUrl}/boat/${yacht.slug}`;
      const pageUrl = selectedOffer
        ? `${cleanUrl}?startDate=${selectedOffer.dateFrom}&endDate=${selectedOffer.dateTo}`
        : cleanUrl;

      const qrDataUrl = await QRCode.toDataURL(cleanUrl, { width: 300, margin: 1 });

      const mainImageId = yacht.yachtImages.find(i => i.mainImage)?.id || yacht.yachtImages[0]?.id;
      const galleryIds = yacht.yachtImages
        .filter(i => i.id !== mainImageId)
        .slice(0, 4)
        .map(i => i.id);
      const [heroSrc, ...gallerySrcs] = await Promise.all([
        toJpegDataUrl(getBoatImageUrl(mainImageId, 1200)),
        ...galleryIds.map(id => toJpegDataUrl(getBoatImageUrl(id, 800))),
      ]);

      const now = new Date();
      const generatedDate = `${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

      const blob = await pdf(
        <YachtPDF
          yacht={yacht}
          offer={selectedOffer}
          pageUrl={pageUrl}
          heroSrc={heroSrc}
          gallerySrcs={gallerySrcs}
          qrDataUrl={qrDataUrl}
          baseUrl={baseUrl}
          generatedDate={generatedDate}
        />
      ).toBlob();

      const link = document.createElement('a');
      const fileName = toTitleCase(yacht.name)
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-|-$/g, '');

      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}-boat4you.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadYachtPDF, isDownloading };
};

export default useYachtPdfDownload;
