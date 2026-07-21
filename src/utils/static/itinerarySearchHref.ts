/**
 * Build a WORKING /search link for a destination NAME. The search page
 * filters by `did` ONLY — a bare `?destinations=Athens` renders the
 * unfiltered fleet (Sukošan boats under an Athens heading, Mario
 * 21.7.2026). Itinerary pages know their ports only by name, so we
 * resolve the did server-side at render (SSG) via /public/locations,
 * cached an hour; when the lookup misses we still emit the plain link
 * rather than break the page.
 */

interface PublicLocation {
  id: string;
  name?: string;
}

interface PagedLocations {
  content?: PublicLocation[];
}

export const resolveBoatsSearchHref = async (name: string): Promise<string> => {
  const plain = `/search?destinations=${encodeURIComponent(name)}`;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/locations?name=${encodeURIComponent(name)}&size=20`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) return plain;

    const json: PagedLocations = await response.json();
    const candidates = json.content ?? [];

    if (candidates.length === 0) return plain;

    const target = name.trim().toLowerCase();
    const best =
      candidates.find(c => c.name?.trim().toLowerCase() === target) ??
      candidates.find(c => c.name?.trim().toLowerCase().startsWith(target)) ??
      candidates[0];

    if (!best?.id) return plain;

    return `${plain}&did=${encodeURIComponent(best.id)}`;
  } catch {
    return plain;
  }
};
