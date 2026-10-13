/**
 * What the map looks up for a marina: its coordinates when the API sends
 * them (an exact pin), otherwise the catalogue name without the "Marina |
 * Town" pipe — Google read "Marina Kaštela | Kaštel Gomilica" as two places
 * and landed off the marina (owner 13.10.2026).
 */
export const googleMapsQuery = (name: string, lat?: number | null, lon?: number | null): string => {
  if (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    (lat || lon)
  ) {
    return `${lat},${lon}`;
  }

  return name
    .split('|')
    .map(part => part.trim())
    .filter(Boolean)
    .join(', ');
};

export const generateGoogleMapsLink = (location: string): string => {
  const encodedLocation = encodeURIComponent(location);

  // t=k opens Google Maps in satellite view by default so users see the actual
  // marina from above (boat charter context — aerial shot reads faster than map).
  return `https://www.google.com/maps?q=${encodedLocation}&t=k`;
};
