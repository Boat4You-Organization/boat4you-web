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
  locationType?: string;
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
    const norm = (value?: string) => value?.trim().toLowerCase() ?? '';

    // A region carrying the same name beats the namesake city/marina:
    // "Split" the location lists a handful of boats moored in town while
    // "Split region" (r-5) holds the whole charter fleet (Mario 22.7).
    const region = candidates.find(
      c =>
        (c.locationType === 'REGION' || c.id.startsWith('r-')) &&
        (norm(c.name) === target || norm(c.name) === `${target} region` || norm(c.name).startsWith(target))
    );
    const best =
      region ??
      candidates.find(c => norm(c.name) === target) ??
      candidates.find(c => norm(c.name).startsWith(target)) ??
      candidates[0];

    if (!best?.id) return plain;

    const label = region?.name ?? name;

    return `/search?destinations=${encodeURIComponent(label)}&did=${encodeURIComponent(best.id)}`;
  } catch {
    return plain;
  }
};
