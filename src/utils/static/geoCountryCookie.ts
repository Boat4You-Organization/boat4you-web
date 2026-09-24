// nginx (GeoIP2) tells the app where the visitor is via the `X-Country-Code`
// request header. `src/proxy.ts` mirrors it into this cookie — deliberately
// NOT httpOnly — so client components (the phone field's dial-code default)
// can read the visitor's country without a third-party geo lookup.
export const GEO_COUNTRY_COOKIE_NAME = 'b4y_country';

const COUNTRY_CODE_PATTERN = /^[A-Z]{2}$/i;

/** ISO-3166 alpha-2, upper-cased — or null when the input is not a 2-letter code. */
export const normalizeCountryCode = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();

  if (!trimmed || !COUNTRY_CODE_PATTERN.test(trimmed)) return null;

  return trimmed.toUpperCase();
};

/**
 * Browser-only: the GeoIP country the proxy stored in `b4y_country`, or null
 * when the cookie is absent (dev, no nginx) or malformed. The component that
 * calls this is server-rendered, so call it from an effect, never during render.
 */
export const readGeoCountryCookie = (): string | null => {
  if (typeof document === 'undefined') return null;

  try {
    const prefix = `${GEO_COUNTRY_COOKIE_NAME}=`;
    const cookie = document.cookie.split('; ').find(row => row.startsWith(prefix));

    if (!cookie) return null;

    return normalizeCountryCode(cookie.slice(prefix.length));
  } catch {
    return null;
  }
};
