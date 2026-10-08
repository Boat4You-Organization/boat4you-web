/**
 * A country's name in the page's language from its ISO code ("HR" → "Croatie"
 * on /fr), the code itself when the runtime does not know it. Used for the
 * flag images' alt text, which read "HR flag" on every locale (live check
 * 8.10.2026, F4).
 */
export const countryDisplayName = (code: string | null | undefined, locale: string): string => {
  if (!code) return '';

  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
};
