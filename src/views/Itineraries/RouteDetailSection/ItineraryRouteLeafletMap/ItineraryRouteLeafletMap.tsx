'use client';

/**
 * Interactive route map (EY port). Each route day pins on its canonical
 * destination via `resolveLocationCoords`. The map auto-fits to all
 * visible pins, draws a dashed connector between them, and emits the
 * active day's id back up to the parent so the right-side detail panel
 * can highlight it.
 *
 * SSR note: leaflet hits `window` at module load, so the parent must
 * import this with `dynamic(() => …, { ssr: false })`.
 */
import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { LatLng, resolveLocationCoords } from '@/config/itinerary/locationCoords.config';
import colors from '@/styles/themes/colors';
import { ItineraryDay } from '@/types/itinerary.type';

interface PinnedDay {
  day: ItineraryDay;
  coords: LatLng;
}

interface Props {
  routeDays: ItineraryDay[];
  activeDayId: string;
  onPinClick: (id: string) => void;
  /** When set, the map flies to the active day's pin at THIS zoom instead of
   *  panning at the fit-bounds zoom — used by the scroll-driven background map
   *  in the day-by-day journey so each day frames its own waters. */
  flyToZoom?: number;
  /** Decorative / scroll-driven mode: disables every user gesture so the map
   *  never traps page scroll or touch. Defaults to fully interactive. */
  interactive?: boolean;
  /** Use the lighter CartoDB Positron basemap instead of standard OSM colours —
   *  keeps the scroll-driven background map from mirroring the top map and lets
   *  the floating day cards read more clearly over it. */
  lightTiles?: boolean;
}

const PIN_DIAMETER = 32;

/** Build a styled DivIcon with the day number and an active highlight ring. */
const buildPinIcon = (day: number, isActive: boolean): L.DivIcon =>
  L.divIcon({
    className: '',
    html: `<div style="
      width:${PIN_DIAMETER}px;
      height:${PIN_DIAMETER}px;
      border-radius:50%;
      background:${isActive ? colors.black950 : colors.blue800};
      color:#fff;
      display:flex;
      align-items:center;
      justify-content:center;
      font-family:inherit;
      font-weight:700;
      font-size:14px;
      box-shadow:0 4px 12px rgba(0,0,0,0.25), 0 0 0 ${isActive ? 4 : 0}px ${colors.blue100};
      border:2px solid #fff;
      cursor:pointer;
      transition:box-shadow 150ms ease, transform 150ms ease;
    ">${day}</div>`,
    iconSize: [PIN_DIAMETER, PIN_DIAMETER],
    iconAnchor: [PIN_DIAMETER / 2, PIN_DIAMETER / 2],
  });

/** Auto-fit the map to all pinned days; runs once on mount + whenever
 *  the list of resolved pins changes. Skipped in fly mode (the background
 *  map opens framed on day 1 instead of the whole route). */
const FitBounds = ({ pins, enabled }: { pins: PinnedDay[]; enabled: boolean }) => {
  const map = useMap();
  const fittedRef = useRef(false);

  useEffect(() => {
    if (!enabled || pins.length === 0 || fittedRef.current) return;

    const bounds = L.latLngBounds(pins.map(p => [p.coords.lat, p.coords.lng] as [number, number]));

    map.fitBounds(bounds, { padding: [40, 40] });
    fittedRef.current = true;
  }, [map, pins, enabled]);

  return null;
};

/** Recompute the map size once the sticky/grid layout has settled. Leaflet
 *  caches the container size at mount; inside a sticky + stacked-grid cell that
 *  size can be measured before the cell reaches full height, which makes
 *  flyTo/panTo target the wrong pixel and appear to do nothing. */
const InvalidateSize = () => {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();

    const t = setTimeout(() => map.invalidateSize(), 300);

    return () => clearTimeout(t);
  }, [map]);

  return null;
};

/** Move to the active day's pin. Pans at the current zoom by default; when
 *  `flyToZoom` is set, flies in to that zoom so each day frames its own coast. */
const MoveToActive = ({
  pins,
  activeDayId,
  flyToZoom,
}: {
  pins: PinnedDay[];
  activeDayId: string;
  flyToZoom?: number;
}) => {
  const map = useMap();

  useEffect(() => {
    const active = pins.find(p => p.day.id === activeDayId);

    if (!active) return;

    const target: [number, number] = [active.coords.lat, active.coords.lng];

    if (flyToZoom != null) {
      // setView (not flyTo) — flyTo proved unreliable for rapid scroll-driven
      // changes (the active pin updated but the view never moved). setView with
      // animate pans+zooms smoothly between adjacent days and is robust when a
      // new target arrives mid-animation. Do NOT invalidateSize per change —
      // that forces a sync reflow every frame and storms the main thread; the
      // one-time <InvalidateSize/> on mount already fixes the cached size.
      map.setView(target, flyToZoom, { animate: true, duration: 0.9 });
    } else {
      map.panTo(target, { animate: true, duration: 0.6 });
    }
  }, [activeDayId, pins, map, flyToZoom]);

  return null;
};

const ItineraryRouteLeafletMap = ({
  routeDays,
  activeDayId,
  onPinClick,
  flyToZoom,
  interactive = true,
  lightTiles = false,
}: Props) => {
  const pins = useMemo<PinnedDay[]>(
    () =>
      routeDays
        .map(day => {
          const coords = resolveLocationCoords(day.routeTo) || resolveLocationCoords(day.routeFrom);

          return coords ? { day, coords } : null;
        })
        .filter((p): p is PinnedDay => p !== null),
    [routeDays]
  );

  const polylinePositions = useMemo<[number, number][]>(() => pins.map(p => [p.coords.lat, p.coords.lng]), [pins]);

  const initialCenter: [number, number] = pins.length ? [pins[0].coords.lat, pins[0].coords.lng] : [43.5, 16]; // Adriatic-ish fallback

  return (
    <MapContainer
      center={initialCenter}
      zoom={flyToZoom ?? 9}
      scrollWheelZoom={false}
      dragging={interactive}
      doubleClickZoom={interactive}
      touchZoom={interactive}
      boxZoom={interactive}
      keyboard={interactive}
      zoomControl={interactive}
      attributionControl={false}
      style={{ height: '100%', width: '100%', borderRadius: 12, zIndex: 0 }}
    >
      {lightTiles ? (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          subdomains="abcd"
        />
      ) : (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      )}
      <Polyline
        positions={polylinePositions}
        pathOptions={{
          color: colors.blue600,
          weight: 3,
          opacity: 0.85,
          dashArray: '8 8',
        }}
      />
      {pins.map(({ day, coords }) => (
        <Marker
          key={day.id}
          position={[coords.lat, coords.lng]}
          icon={buildPinIcon(day.day, day.id === activeDayId)}
          eventHandlers={{ click: () => onPinClick(day.id) }}
        />
      ))}
      <InvalidateSize />
      <FitBounds pins={pins} enabled={flyToZoom == null} />
      <MoveToActive pins={pins} activeDayId={activeDayId} flyToZoom={flyToZoom} />
    </MapContainer>
  );
};

export default ItineraryRouteLeafletMap;
