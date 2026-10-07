const API_URL = `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}`;

interface FetchApiOptions {
  variables?: Record<string, unknown>;
  /** Data Cache window in seconds (default 5 min). */
  revalidate?: number;
  /** Give up after this many ms (the call then throws); default: no limit. */
  timeoutMs?: number;
}

const fetchAPI = async <T extends {}>(
  query: string,
  { variables = {}, revalidate = 300, timeoutMs }: FetchApiOptions = {}
): Promise<T> => {
  const headers = new Headers();

  headers.append('Content-Type', 'application/json');

  // GraphQL via POST defaults to no-store under Next 16 — the home blog
  // strip would re-hit WordPress on every SSR cold start and dominate TTFB.
  // 5 min SWR is plenty for editorial content; admin can purge via redeploy.
  // A caller inside an hourly ISR route (the sitemap index) passes its own
  // window: a shorter fetch window would make the whole route regenerate as
  // often.
  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate },
    ...(timeoutMs ? { signal: AbortSignal.timeout(timeoutMs) } : {}),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch API: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error('Failed to fetch API');
  }

  return json.data as T;
};

export default fetchAPI;
