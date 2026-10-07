/**
 * The boat that replaced an inactive one (owner decision 7.10.2026).
 *
 * A partner sometimes lists the same physical boat again under a new id: the
 * old record is deactivated and its page answered 404, which Bing kept
 * ranking (`/boat/lagoon-bnteau-lagoon-42-4-2-cab-masterpiece-4066`, now
 * `/boat/lagoon-42-masterpiece-11681`). The detail API still answers such a
 * boat with 400 `{"code":1502,"message":"Yacht is not active"}`, and adds
 * `successorSlug` (and `successorId`) only when exactly one active boat is the
 * same boat. The page then answers 308 to that boat, in the same language and
 * without the query; with no successor it stays a 404, as before.
 *
 * No imports: `yarn test:successor` runs this file with plain Node.
 */

/** The detail API's error code for a boat that is no longer active. */
export const YACHT_NOT_ACTIVE = 1502;

/** A backend slug (SlugUtils): lower-case letters, digits and hyphens, ending in the boat id. */
const SLUG = /^[a-z0-9-]*[a-z0-9]$/;

/** The boat id a slug ends in (backend `SlugUtils.idFromSlug`), or null. */
const idFromSlug = (slug: string): number | null => {
  const last = slug.split('-').pop() ?? '';

  return /^\d+$/.test(last) ? Number(last) : null;
};

/**
 * The slug of the active boat the API names for an inactive one, or null.
 *
 * Only a 400 whose body has code 1502 and a well-formed `successorSlug`
 * ending in a boat id counts; a `successorId`, when sent, must be that id.
 * A successor that is the boat in the URL itself (the same id, under any
 * slug) is null too: a redirect to itself would loop. Any other answer (404,
 * 410, another code, no or junk `successorSlug`, an unreadable body) is null,
 * and the page stays a 404.
 */
export const successorSlugOf = async (response: Response, requestedSlug: string): Promise<string | null> => {
  if (response.status !== 400) return null;

  const body: unknown = await response.json().catch(() => null);

  if (!body || typeof body !== 'object') return null;

  const { code, successorSlug, successorId } = body as {
    code?: unknown;
    successorSlug?: unknown;
    successorId?: unknown;
  };

  if (code !== YACHT_NOT_ACTIVE || typeof successorSlug !== 'string') return null;

  const slug = successorSlug.trim();
  const requested = requestedSlug.trim().toLowerCase();

  if (!SLUG.test(slug) || slug === requested) return null;

  const id = idFromSlug(slug);

  if (id === null || id === idFromSlug(requested)) return null;

  if (successorId !== undefined && successorId !== null && successorId !== id) return null;

  return slug;
};

/**
 * The successor's page in the requested language — `/boat/<slug>` for the
 * default locale (no prefix), `/<locale>/boat/<slug>` otherwise — without the
 * query: the redirect target is the clean boat URL.
 */
export const successorBoatPath = (slug: string, locale: string, defaultLocale: string): string =>
  `${locale === defaultLocale ? '' : `/${locale}`}/boat/${slug}`;
