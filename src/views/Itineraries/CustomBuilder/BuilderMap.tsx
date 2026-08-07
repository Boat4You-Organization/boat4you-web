'use client';

/**
 * Live course preview for the tailor-made builder — numbered pins over
 * the chosen stops, dashed course line, auto-fit on every change.
 * Leaflet touches `window` at module load, so the parent imports this
 * with `dynamic(..., { ssr: false })`.
 */
import { useEffect } from 'react';
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { CustomStop } from '@/config/itinerary/customLegs.config';

const pinIcon = (n: number, isStart: boolean) =>
  L.divIcon({
    className: '',
    html: `<div style="width:26px;height:26px;border-radius:50%;background:${isStart ? '#141857' : '#2856ff'};color:#fff;font:700 12px/26px Arial;text-align:center;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)">${n}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });

/** Hovered-suggestion preview pin — orange, labelled, clearly not part of the course yet. */
const previewIcon = (label: string) =>
  L.divIcon({
    className: '',
    html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-4px)"><div style="background:#e8622a;color:#fff;font:600 11px/1 Arial;padding:4px 8px;border-radius:8px;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,.35)">${label}</div><div style="width:14px;height:14px;border-radius:50%;background:#e8622a;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);margin-top:3px"></div></div>`,
    iconSize: [0, 0],
    iconAnchor: [7, 24],
  });

const FitBounds = ({ stops, preview }: { stops: CustomStop[]; preview: CustomStop | null }) => {
  const map = useMap();

  useEffect(() => {
    if (!stops.length) return;

    const all = preview ? [...stops, preview] : stops;
    const bounds = L.latLngBounds(all.map(s => [s.lat, s.lng] as [number, number]));

    map.fitBounds(bounds.pad(0.25), { maxZoom: 11 });
  }, [map, stops, preview]);

  return null;
};

const BuilderMap = ({ stops, previewStop = null }: { stops: CustomStop[]; previewStop?: CustomStop | null }) => {
  if (!stops.length) return null;

  return (
    <MapContainer
      center={[stops[0].lat, stops[0].lng]}
      zoom={9}
      style={{ width: '100%', height: '100%', borderRadius: 12 }}
      scrollWheelZoom={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <Polyline
        positions={stops.map(s => [s.lat, s.lng] as [number, number])}
        pathOptions={{ color: '#2856ff', weight: 3, dashArray: '8 7' }}
      />
      {stops.map((s, i) => (
        <Marker
          // eslint-disable-next-line react/no-array-index-key -- the same stop can legally appear twice (loop close)
          key={`${s.key}-${i}`}
          position={[s.lat, s.lng]}
          icon={pinIcon(i + 1, i === 0)}
        />
      ))}
      {previewStop && (
        <>
          <Polyline
            positions={[
              [stops[stops.length - 1].lat, stops[stops.length - 1].lng],
              [previewStop.lat, previewStop.lng],
            ]}
            pathOptions={{ color: '#e8622a', weight: 2.5, dashArray: '4 7', opacity: 0.85 }}
          />
          <Marker position={[previewStop.lat, previewStop.lng]} icon={previewIcon(previewStop.label)} />
        </>
      )}
      <FitBounds stops={stops} preview={previewStop} />
    </MapContainer>
  );
};

export default BuilderMap;
