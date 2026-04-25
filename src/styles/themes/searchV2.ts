/**
 * Design tokens for the V2 search filter sidebar (`/search` page).
 *
 * Lifted from the design handoff at
 * `~/Downloads/design_handoff_filter/README.md`. Kept separate from
 * `colors.ts` so the rest of the customer site (which still leans on
 * the legacy `blue/black/yellow` palette) doesn't pick these up by
 * accident — V2 search is the only surface that should consume them
 * for now.
 *
 * Brand blue is intentionally identical to `colors.blue500` (#2856ff),
 * so any value referenced here can be swapped to `colors.blue500`
 * later if we promote the V2 palette site-wide.
 */
export const searchV2 = {
  /** Primary text, sidebar dividers (deep navy). */
  ink: '#0b1a2b',
  /** Secondary text, labels. */
  inkSoft: '#5b6b7d',
  /** Page background — cream/paper, NOT pure white. */
  bg: '#f7f6f3',
  /** Sidebar + cards (true white). */
  paper: '#ffffff',
  /** Hairline divider between groups. */
  line: '#e5e2db',
  /** Stronger line — slider track inactive, input borders. */
  lineStrong: '#d8d3c8',
  /** Sliders, primary CTA, accents (= colors.blue500). */
  brand: '#2856ff',
  /** Live-count pill bg, badges. */
  brandSoft: '#eaeffe',
  /** Discount accent — RESERVED, do not reuse. */
  gold: '#c9a24b',
  /** AI-hint strip background. */
  goldSoft: '#f5ecd1',
  /** Live-status pulse dot (green). */
  livePulse: '#10b981',
} as const;

/**
 * Typography tokens. Sidebar uses Inter / system stack (NOT the site's
 * default Raleway) per design handoff — body 13px, section labels
 * 11px uppercase tracked .14em.
 */
export const searchV2Type = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
  body: 13,
  sectionLabel: { fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase' as const, fontWeight: 700 },
  groupTitle: { fontSize: 13, fontWeight: 700 },
  countBadge: { fontSize: 10, fontWeight: 700 },
  smallLabel: { fontSize: 11, fontWeight: 600 },
  numericValue: { fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' as const },
  numericBig: { fontSize: 18, fontWeight: 800, fontVariantNumeric: 'tabular-nums' as const },
} as const;

/** Layout tokens. */
export const searchV2Layout = {
  sidebarWidth: 340,
  sidebarPaddingX: 20,
  groupPaddingY: 16,
  smartBarHeight: 64,
} as const;
