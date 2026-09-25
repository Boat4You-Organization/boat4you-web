/**
 * Serialise a JSON-LD object for `<script type="application/ld+json">` via
 * dangerouslySetInnerHTML. JSON.stringify leaves `<`, `>` and `&` as they
 * are, so a value reflected from the URL (`?destinations=</script><script>…`)
 * closes the script element and runs as HTML (reflected XSS, 25.9.2026).
 * Those characters, plus U+2028/U+2029, are written as JSON unicode escapes,
 * which parse back to the same string.
 */
const UNSAFE_IN_SCRIPT = new RegExp(`[<>&${String.fromCharCode(0x2028, 0x2029)}]`, 'g');

const escapeChar = (char: string): string => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`;

export const serializeJsonLd = (data: unknown): string => JSON.stringify(data).replace(UNSAFE_IN_SCRIPT, escapeChar);
