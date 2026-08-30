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

const MAP_W = 1200;
const MAP_H = 575;
const TILE = 256;

const loadTile = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new window.Image();

    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`tile failed: ${url}`));
    img.src = url;
  });

/** Web-mercator world pixel coords at zoom z (Carto/OSM tile scheme). */
const mercX = (lng: number, z: number) => ((lng + 180) / 360) * TILE * 2 ** z;
const mercY = (lat: number, z: number) => {
  const rad = (lat * Math.PI) / 180;

  return ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * TILE * 2 ** z;
};

/** Course + numbered pins over the base map (or the plain fallback). */
const drawCourse = (
  ctx: CanvasRenderingContext2D,
  stops: CustomStop[],
  px: (s: CustomStop) => number,
  py: (s: CustomStop) => number
) => {
  ctx.strokeStyle = '#2856ff';
  ctx.lineWidth = 3.5;
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
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#fff';
      ctx.strokeText(s.label, x, y - 26);
      ctx.fillStyle = '#141857';
      ctx.fillText(s.label, x, y - 26);
    }
  });
};

/** Last-resort schematic (sea field + graticule) when tiles are unreachable —
 *  the PDF must never fail just because the tile CDN does. */
const drawFallbackBase = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = '#dbe7f5';
  ctx.fillRect(0, 0, MAP_W, MAP_H);
  ctx.strokeStyle = 'rgba(40, 86, 255, 0.08)';
  ctx.lineWidth = 1;
  Array.from({ length: 11 }, (_, i) => i).forEach(i => {
    ctx.beginPath();
    ctx.moveTo((MAP_W / 10) * i, 0);
    ctx.lineTo((MAP_W / 10) * i, MAP_H);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, (MAP_H / 10) * i);
    ctx.lineTo(MAP_W, (MAP_H / 10) * i);
    ctx.stroke();
  });
};

/**
 * Real course chart for the PDF: OSM tiles (same basemap as the builder's
 * live Leaflet map; CORS-open so the canvas stays untainted) stitched
 * around the route's bounding box, with the dashed course and numbered
 * pins drawn on top. Mario 7.8: the schematic-only chart read as "no map"
 * — the PDF must show real coastline like the web map does.
 */
const drawCourseMap = async (stops: CustomStop[]): Promise<string> => {
  const canvas = document.createElement('canvas');

  canvas.width = MAP_W;
  canvas.height = MAP_H;

  const ctx = canvas.getContext('2d')!;
  const pad = 90;
  // Highest zoom (≤11, ≥4) whose padded bbox still fits the canvas.
  const zoom =
    Array.from({ length: 8 }, (_, i) => 11 - i).find(z => {
      const spanX = Math.max(...stops.map(s => mercX(s.lng, z))) - Math.min(...stops.map(s => mercX(s.lng, z)));
      const spanY = Math.max(...stops.map(s => mercY(s.lat, z))) - Math.min(...stops.map(s => mercY(s.lat, z)));

      return spanX <= MAP_W - 2 * pad && spanY <= MAP_H - 2 * pad;
    }) ?? 4;
  const xs = stops.map(s => mercX(s.lng, zoom));
  const ys = stops.map(s => mercY(s.lat, zoom));
  const originX = (Math.min(...xs) + Math.max(...xs)) / 2 - MAP_W / 2;
  const originY = (Math.min(...ys) + Math.max(...ys)) / 2 - MAP_H / 2;
  const px = (s: CustomStop) => mercX(s.lng, zoom) - originX;
  const py = (s: CustomStop) => mercY(s.lat, zoom) - originY;

  const tiles: { tx: number; ty: number }[] = [];

  Array.from(
    { length: Math.floor((originX + MAP_W) / TILE) - Math.floor(originX / TILE) + 1 },
    (_, i) => Math.floor(originX / TILE) + i
  ).forEach(tx =>
    Array.from(
      { length: Math.floor((originY + MAP_H) / TILE) - Math.floor(originY / TILE) + 1 },
      (_, i) => Math.floor(originY / TILE) + i
    ).forEach(ty => tiles.push({ tx, ty }))
  );

  const loaded = await Promise.all(
    tiles.map(({ tx, ty }, i) =>
      loadTile(`https://tile.openstreetmap.org/${zoom}/${tx}/${ty}.png`)
        .then(img => ({ tx, ty, img }))
        .catch(() => null)
    )
  );
  const drawn = loaded.filter(Boolean) as { tx: number; ty: number; img: HTMLImageElement }[];

  if (drawn.length === 0) {
    drawFallbackBase(ctx);
  } else {
    ctx.fillStyle = '#dbe7f5';
    ctx.fillRect(0, 0, MAP_W, MAP_H);
    drawn.forEach(({ tx, ty, img }) => ctx.drawImage(img, tx * TILE - originX, ty * TILE - originY, TILE, TILE));
    // Same Positron-like muting as the web maps' .tiles-light-mute filter —
    // ctx.filter isn't supported in every browser, a white wash is.
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillRect(0, 0, MAP_W, MAP_H);
    ctx.font = '400 11px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'rgba(20, 24, 87, 0.55)';
    ctx.fillText('© OpenStreetMap contributors', MAP_W - 8, MAP_H - 6);
  }

  drawCourse(ctx, stops, px, py);

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

      const mapSrc = await drawCourseMap(stops);
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
