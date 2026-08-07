import React, { useState } from 'react';

import { Font, pdf } from '@react-pdf/renderer';

import CustomItineraryPDF, { CustomPdfData } from '@/components/CustomItineraryPDF/CustomItineraryPDF';
import { CustomStop } from '@/config/itinerary/customLegs.config';

/** Same Inter registration as useItineraryPdfDownload — Helvetica drops
 *  č/ž/š/ğ from place names. Guarded so both hooks can coexist. */
let fontsRegistered = false;

const registerFonts = (baseUrl: string): void => {
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

/**
 * Custom routes have no pre-rendered map, so paint a schematic course
 * chart on a canvas: sea-blue field, subtle graticule, dashed course
 * line and numbered pins over a lat/lng bounding box (equirectangular
 * with cos-lat correction — fine at charter-area scale).
 */
const drawCourseMap = (stops: CustomStop[]): string => {
  const W = 1200;
  const H = 620;
  const canvas = document.createElement('canvas');

  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#dbe7f5';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(40, 86, 255, 0.08)';
  ctx.lineWidth = 1;
  Array.from({ length: 11 }, (_, i) => i).forEach(i => {
    ctx.beginPath();
    ctx.moveTo((W / 10) * i, 0);
    ctx.lineTo((W / 10) * i, H);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, (H / 10) * i);
    ctx.lineTo(W, (H / 10) * i);
    ctx.stroke();
  });

  const lats = stops.map(s => s.lat);
  const lngs = stops.map(s => s.lng);
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const kx = Math.cos((midLat * Math.PI) / 180);
  const minX = Math.min(...lngs) * kx;
  const maxX = Math.max(...lngs) * kx;
  const minY = Math.min(...lats);
  const maxY = Math.max(...lats);
  const spanX = Math.max(maxX - minX, 0.05);
  const spanY = Math.max(maxY - minY, 0.05);
  const pad = 90;
  const scale = Math.min((W - 2 * pad) / spanX, (H - 2 * pad) / spanY);
  const ox = (W - spanX * scale) / 2;
  const oy = (H - spanY * scale) / 2;
  const px = (s: CustomStop) => ox + (s.lng * kx - minX) * scale;
  const py = (s: CustomStop) => H - (oy + (s.lat - minY) * scale);

  ctx.strokeStyle = '#2856ff';
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  stops.forEach((s, i) => (i === 0 ? ctx.moveTo(px(s), py(s)) : ctx.lineTo(px(s), py(s))));
  ctx.stroke();
  ctx.setLineDash([]);

  stops.forEach((s, i) => {
    const x = px(s);
    const y = py(s);

    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#2856ff';
    ctx.stroke();
    ctx.fillStyle = '#141857';
    ctx.font = '700 15px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i === stops.length - 1 && s.key === stops[0].key ? 1 : i + 1), x, y);

    if (!(i === stops.length - 1 && s.key === stops[0].key)) {
      ctx.font = '600 14px Arial';
      ctx.fillStyle = '#141857';
      ctx.fillText(s.label, x, y - 26);
    }
  });

  return canvas.toDataURL('image/jpeg', 0.9);
};

interface Payload {
  downloadCustomPdf: (data: CustomPdfData, stops: CustomStop[]) => Promise<void>;
  isDownloading: boolean;
}

const useCustomItineraryPdf = (): Payload => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadCustomPdf = async (data: CustomPdfData, stops: CustomStop[]) => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const baseUrl = window.location.origin;

      registerFonts(baseUrl);

      const mapSrc = drawCourseMap(stops);
      const blob = await pdf(<CustomItineraryPDF data={data} mapSrc={mapSrc} baseUrl={baseUrl} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `boat4you-custom-itinerary-${data.startLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadCustomPdf, isDownloading };
};

export default useCustomItineraryPdf;
