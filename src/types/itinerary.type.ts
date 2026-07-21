import Image from './image.type';

interface MapPin {
  top: number;
  left: number;
}

interface MapImage {
  image: Image;
  width: number;
  height: number;
}

export type ItineraryDay = {
  id: string;
  routeFrom: string;
  routeTo: string;
  day: number;
  /** Long-form day narrative (~150-200 words). Surfaces in the
   *  "Day-by-day journey" deep-read section below the route SEO extras. */
  description: string;
  /** Optional short teaser (~40-60 words) shown in the right-side day
   *  panel next to the Leaflet map. When omitted, the panel falls back to
   *  the first ~280 chars of `description`. */
  shortDescription?: string;
  gallery: Image[];
  mapPin?: {
    desktop: MapPin;
    mobile: MapPin;
  };
  /** Optional skim-friendly highlights — 3-6 items, ~3-8 words each. */
  thingsToDo?: string[];
  /** Optional one-liner s mooring info za destinaciju — anchorage type,
   *  book-ahead notes, marina caveat. */
  mooringTip?: string;
};

export type ItineraryRouteTeaser = {
  id: string;
  startingPoint: string;
  otherPoints: string[];
  cardImage: Image;
  numberOfDays?: number;
};

export type ItineraryRoute = ItineraryRouteTeaser & {
  metaTitle?: string;
  metaDesc?: string;
  /**
   * next-intl namespace holding this route's localized day/meta copy
   * (e.g. 'itineraryCroatia'). Stamped at the `itineraries.config`
   * aggregation point from the country→namespace map — NOT declared in
   * the per-route config files. The resolve* helpers in
   * `@/helper/itineraryI18n` t.has-guard every lookup, so a route whose
   * namespace JSON has no matching key falls back to the raw config
   * string (English) verbatim.
   */
  i18nNamespace?: string;
  gallery: Image[];
  routeDays: ItineraryDay[];
  map: {
    desktop: MapImage;
    mobile: MapImage;
  };
};

export type ItineraryTeaser = {
  id: string;
  sailingArea: string;
  image: Image;
};

export type Itinerary = ItineraryTeaser & {
  metaTitle?: string;
  metaDesc?: string;
  /**
   * next-intl namespace holding this area's localized copy (e.g.
   * 'itineraryCroatia'). Stamped at the `itineraries.config`
   * aggregation point from the country→namespace map. Absent →
   * resolveAreaText falls back to the raw config string.
   */
  i18nNamespace?: string;
  title: string;
  description: string;
  backgroundImage: Image;
  routes: ItineraryRoute[];
};

export type Itineraries = {
  country: string;
  itinerary: Itinerary[];
};
