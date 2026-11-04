/* An error caught by a Next.js error boundary (error.tsx) is handed to the Contact Center session recorder. React 19 only
 * logs such an error with console.error, and the recorder (cc-widget, clarity-js fork) hears window "error" events alone,
 * so the recording of a visit that ended on the error page said "Errors: 0" (recording 7285, 4.11.2026). The error is
 * dispatched once, as an ErrorEvent, when the recorder is on the page: a hydration error happens before it starts, so the
 * recorder bundle (it sets window.__b4yRec) is awaited for up to a minute. The message carries the error's name and
 * message, its digest and the first stack frame; a query string or an e-mail address is dropped, so no visitor data
 * travels with it. */

declare global {
  interface Window {
    /** Set by the recorder bundle of the Contact Center widget (infra/cc-widget/src/rec-entry.ts). */
    __b4yRec?: unknown;
  }
}

/** rec_error.message is VARCHAR(500) in the backend. */
const MAX_LENGTH = 450;
const WAIT_MS = 1000;
const WAIT_TRIES = 60;
const SERVER_BOILERPLATE = /^An error occurred in the Server Components render\b.*/s;
const reported = new WeakSet<object>();

/** A query string (search dates, tokens, filters), a fragment with parameters and an e-mail address (plain or URL-encoded;
 * a message may quote the visitor's) never go into a recording. The query goes first, it may hold an e-mail. A "fn@https://…"
 * stack frame is not an e-mail: the part after the @ must have no scheme or path. */
const scrub = (text: string): string =>
  text
    .replace(/\?[^\s)'"]*/g, '?…')
    .replace(/#[^\s)'"=]*=[^\s)'"]*/g, '#…')
    .replace(/[^\s@/(]+(?:@|%40)[^\s@/:]+\.[^\s@/:),;]+/g, '[e-mail]');

/** The first frame of a stack: "at fn (url:line:col)" (Chrome) or "fn@url:line:col" (Firefox, Safari). Chrome's stack starts
 * with the message itself, so a frame is only a line whose @ is followed by a URL (scheme or path), never a bare address. */
const firstFrame = (stack: unknown): string | undefined =>
  typeof stack === 'string'
    ? stack
        .split('\n')
        .map(line => line.trim())
        .find(line => /^at |^[^\s]*@(?:[a-z-]+:|\/)/i.test(line))
    : undefined;

/** The text the recorder stores: "Error page: TypeError: x is not a function · digest 123 · at fn (…/chunk.js:1:2)". */
export const recorderErrorMessage = (error: unknown): string => {
  const e = (typeof error === 'object' && error !== null ? error : { message: String(error) }) as Partial<
    Error & { digest?: string }
  >;
  const message = String(e.message || '(no message)').replace(
    SERVER_BOILERPLATE,
    'Server Components render error (message omitted in production)'
  );
  const parts = [scrub(`Error page: ${e.name || 'Error'}: ${message}`)];

  if (e.digest) parts.push(`digest ${e.digest}`);

  const frame = firstFrame(e.stack);

  if (frame) parts.push(scrub(frame));

  return parts.join(' · ').slice(0, MAX_LENGTH);
};

/** Reports the error once; waits for the recorder when it is not on the page yet. Safe to call from a useEffect. */
export const reportErrorToRecorder = (error: unknown): void => {
  if (typeof window === 'undefined') return;

  const key = typeof error === 'object' && error !== null ? error : null;

  if (key) {
    if (reported.has(key)) return;

    reported.add(key);
  }

  const message = recorderErrorMessage(error);
  let tries = 0;
  const attempt = (): void => {
    try {
      if (window.__b4yRec) {
        window.dispatchEvent(new ErrorEvent('error', { message, error: new Error(message) }));

        return;
      }

      tries += 1;

      if (tries < WAIT_TRIES) setTimeout(attempt, WAIT_MS);
    } catch {
      // the error page must never fail because of its reporting
    }
  };

  attempt();
};
