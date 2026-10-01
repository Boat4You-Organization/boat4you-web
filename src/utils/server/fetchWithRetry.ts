/**
 * fetch() that rides out a short backend outage instead of failing the page.
 *
 * cusma2 (api.boat4you.com, one node) answers 500/502 for a few seconds
 * while it restarts (29.9.2026: 10:31 and 11:11–11:13 UTC). A page that
 * throws on that answers 500, and a Googlebot visit in that window is a
 * "Server error (5xx)" in Search Console — 25 boat URLs on boat4you. So a
 * 5xx, a 429 or a network error is retried after 0.5 s, 1 s and 2 s; any
 * other answer (2xx, 3xx, 4xx) is returned at once for the caller to read.
 * When every attempt fails it throws ApiUnavailableError.
 *
 * A caller's `signal` is the deadline of the whole call, retries and
 * backoff included (a hung backend is not retried past it). A caller can
 * pass its own backoff list — `[]` is one attempt, no retry (an optional
 * page part that must not hold the page while the backend sheds load).
 *
 * No `server-only`: fetchYachts (services/yacht.service.ts) also runs in the
 * browser, and a node test imports this file directly.
 */

/** Backoff before the 1st, 2nd and 3rd retry. */
export const RETRY_DELAYS_MS = [500, 1000, 2000];

/** The API still answered 5xx / 429, or did not answer, after every retry. */
export class ApiUnavailableError extends Error {
  /** Last HTTP status, or null when the last attempt got no response. */
  readonly status: number | null;

  constructor(url: string, status: number | null, cause?: unknown, retries: number = RETRY_DELAYS_MS.length) {
    const answer = status ? `HTTP ${status}` : 'no response';

    super(`${url.replace(/\?.*$/, '')}: ${answer} after ${retries} retries`, { cause });
    this.name = 'ApiUnavailableError';
    this.status = status;
  }
}

const isRetryable = (status: number): boolean => status >= 500 || status === 429;

/** Waits `ms`, or less when `signal` aborts first. */
const backoff = (ms: number, signal?: AbortSignal | null): Promise<void> =>
  new Promise(resolve => {
    const timer = setTimeout(resolve, ms);

    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true }
    );
  });

export async function fetchWithRetry(
  url: string,
  // eslint-disable-next-line no-undef -- DOM type, not a runtime global the rule knows
  init: RequestInit = {},
  retryDelaysMs: readonly number[] = RETRY_DELAYS_MS
): Promise<Response> {
  let status: number | null = null;
  let cause: unknown;

  for (let attempt = 0; attempt <= retryDelaysMs.length; attempt += 1) {
    // Sequential by design: each retry waits for the previous answer.
    // eslint-disable-next-line no-await-in-loop
    if (attempt > 0) await backoff(retryDelaysMs[attempt - 1], init.signal);

    try {
      // A retry always carries a signal: Next memoises signal-less GETs for
      // the render (dedupe-fetch) and would hand it the failed response again.
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(
        url,
        attempt && !init.signal ? { ...init, signal: new AbortController().signal } : init
      );

      if (!isRetryable(response.status)) return response;

      status = response.status;
      cause = undefined;
      response.body?.cancel().catch(() => undefined);
    } catch (error) {
      status = null;
      cause = error;

      // The caller's deadline is over: no retry past it.
      if (init.signal?.aborted) break;
    }
  }

  throw new ApiUnavailableError(url, status, cause, retryDelaysMs.length);
}
