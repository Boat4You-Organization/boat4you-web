/**
 * Safely serialize JSON-LD data for `<script type="application/ld+json">`.
 *
 * Standard `JSON.stringify` does NOT escape `<` — if any nested string
 * contains the literal sequence `</script>` (e.g. malicious partner-supplied
 * yacht/manufacturer name), the browser closes the script tag early and any
 * following HTML can execute as new JS (DOM-based XSS).
 *
 * Encoding `<` as `<` keeps the JSON valid for any parser while
 * defusing the HTML lexer.
 */
export const serializeJsonLd = (data: unknown): string => JSON.stringify(data).replace(/</g, '\\u003c');
