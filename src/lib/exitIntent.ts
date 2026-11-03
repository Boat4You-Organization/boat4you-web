/**
 * Exit intent on the boat page (owner 3.11.2026): a visitor about to leave a
 * boat without an inquiry gets one popup that sends them to the boat's own
 * inquiry form. The rules, the same on all 7 sites:
 *
 * - At most once per visitor per boat (localStorage, per boat id).
 * - Never after an inquiry or a paid reservation in this visit (sessionStorage,
 *   set by `trackInquiry` / `trackPurchase` before their gtag check, so it
 *   holds without consent too).
 * - Never to a bot or an automated browser.
 * - Desktop (fine pointer): the mouse leaves the window through its top edge,
 *   toward the tabs and the address bar.
 * - Phone / tablet (no hover): after real engagement (time on the page and
 *   half the page read), a fast scroll back up toward the address bar. The
 *   history stack is never touched, so the back button keeps working.
 * - Never over another open dialog (the inquiry sheet, the gallery …) or the
 *   cookie banner: it waits until the visitor has answered it.
 */

const SHOWN_KEY = 'exitIntent:v1:shown:';
const SENT_KEY = 'exitIntent:v1:inquirySent';

/** Desktop: no popup in the first seconds — a mouse crossing the top edge right after landing is not leaving. */
const DESKTOP_ARM_MS = 8_000;
/** Touch: engagement first — this long on the page … */
const TOUCH_ARM_MS = 15_000;
/** … and this far down the page (share of the scrollable height). */
const TOUCH_MIN_DEPTH = 0.5;
/** A "fast scroll up": at least this many viewport heights … */
const TOUCH_FLICK_VIEWPORTS = 1;
/** … within this window. */
const TOUCH_FLICK_MS = 700;

const BOT_UA =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|bingpreview|embedly|python|curl|wget|httpclient|phantom|selenium|puppeteer|playwright/i;

const safe = <T>(read: () => T, fallback: T): T => {
  try {
    return read();
  } catch {
    return fallback;
  }
};

/** Called by `trackInquiry` / `trackPurchase`: no exit popup for the rest of the visit. */
export const markInquirySent = (): void => {
  safe(() => window.sessionStorage.setItem(SENT_KEY, '1'), undefined);
};

const inquirySent = (): boolean => safe(() => window.sessionStorage.getItem(SENT_KEY) === '1', false);

const shownFor = (boatId: number | string): boolean =>
  safe(() => window.localStorage.getItem(SHOWN_KEY + boatId) !== null, false);

/** Remembers the popup for this boat; false when storage is unavailable (then it is never shown, rather than every visit). */
const rememberShown = (boatId: number | string): boolean =>
  safe(() => {
    window.localStorage.setItem(SHOWN_KEY + boatId, String(Date.now()));

    return true;
  }, false);

const isBot = (): boolean => navigator.webdriver === true || BOT_UA.test(navigator.userAgent || '');

/**
 * Another modal is already open (the Contact Center widget's test), or the cookie banner is still up. Only what is
 * shown counts: a closed keepMounted MUI drawer keeps its role="dialog" aria-modal paper in the DOM, hidden.
 */
const otherDialogOpen = (): boolean =>
  Array.from(
    document.querySelectorAll<HTMLElement>(
      '[role="dialog"][aria-modal="true"]:not([data-exit-intent]), .MuiModal-root:not(.MuiModal-hidden), [data-cc-dialog-open], [data-cookie-consent-open]'
    )
  ).some(el => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden');

/**
 * Starts watching for exit intent on a boat page; calls `onExit` at most once
 * and only when every rule above allows it. Returns the cleanup.
 */
export const watchExitIntent = (boatId: number | string, onExit: () => void): (() => void) => {
  if (typeof window === 'undefined' || isBot() || inquirySent() || shownFor(boatId)) return () => undefined;

  const startedAt = Date.now();
  const cleanups: Array<() => void> = [];
  const stop = () => cleanups.splice(0).forEach(fn => fn());

  const fire = () => {
    if (inquirySent() || shownFor(boatId) || otherDialogOpen() || document.visibilityState !== 'visible') return;

    const remembered = rememberShown(boatId);

    stop();

    if (remembered) onExit();
  };

  const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (hasHover) {
    const onMouseOut = (event: MouseEvent) => {
      if (event.relatedTarget || event.clientY > 0) return;

      if (Date.now() - startedAt < DESKTOP_ARM_MS) return;

      fire();
    };

    document.addEventListener('mouseout', onMouseOut);
    cleanups.push(() => document.removeEventListener('mouseout', onMouseOut));
  } else {
    let maxDepth = 0;
    let samples: Array<{ at: number; y: number }> = [];

    const onScroll = () => {
      const now = Date.now();
      const y = window.scrollY;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollable > 0) maxDepth = Math.max(maxDepth, y / scrollable);

      samples = samples.filter(s => now - s.at <= TOUCH_FLICK_MS);
      samples.push({ at: now, y });

      if (now - startedAt < TOUCH_ARM_MS || maxDepth < TOUCH_MIN_DEPTH) return;

      const highest = Math.max(...samples.map(s => s.y));

      if (highest - y >= window.innerHeight * TOUCH_FLICK_VIEWPORTS) fire();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener('scroll', onScroll));
  }

  return stop;
};
