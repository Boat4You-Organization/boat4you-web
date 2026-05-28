const API_URL = `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}`;

const fetchAPI = async <T extends {}>(query: string, { variables = {} } = {}): Promise<T> => {
  const headers = new Headers();

  headers.append('Content-Type', 'application/json');

  // GraphQL via POST defaults to no-store under Next 16 — the home blog
  // strip would re-hit WordPress on every SSR cold start and dominate TTFB.
  // 5 min SWR is plenty for editorial content; admin can purge via redeploy.
  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 300 },
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
