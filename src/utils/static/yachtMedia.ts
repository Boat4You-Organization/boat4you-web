import type { YachtCustomDetails, YachtModel } from '@/models/yacht.model';

export type MediaYacht = Partial<Pick<YachtModel, 'videoUrl' | 'crewProfileUrl'>> & {
  customDetails?: Partial<Pick<YachtCustomDetails, 'videoUrl'>> | null;
};

/**
 * The boat's video (owner, 17.10.2026 — gulet Allure): our own, which the
 * admin sets on any boat (`videoUrl`), else the custom boat's showreel
 * (customDetails.videoUrl, as before). None when neither is set.
 */
export const yachtVideoUrl = (yacht?: MediaYacht | null): string | null =>
  yacht?.videoUrl?.trim() || yacht?.customDetails?.videoUrl?.trim() || null;

/**
 * The crew-profile PDF's link as the API sends it (absolute, on the API), or
 * none: nothing else than an https URL ever becomes a link on the page.
 */
export const crewProfileHref = (yacht?: MediaYacht | null): string | null => {
  const url = yacht?.crewProfileUrl?.trim();

  return url && /^https:\/\//iu.test(url) ? url : null;
};

const VIMEO_URL =
  /^https?:\/\/(?:(?:www\.)?vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)(?:\/([\da-f]+))?(?:[/?#]|$)/iu;
const VIMEO_HASH = /[?&]h=([\da-f]+)/iu;
const YOUTUBE_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
];
const YOUTUBE_ID = /^[\w-]{11}$/u;
const YOUTUBE_ID_PATH = /^\/(?:embed|shorts|live)\/([\w-]{11})\/?$/u;

/**
 * The 11-character id of a YouTube link: `youtube.com/watch?v=<id>` (v at any
 * place in the query), `youtu.be/<id>`, `youtube.com/embed|shorts|live/<id>`,
 * a trailing slash allowed, the host in any letter case (URL lowercases it).
 * None for anything else.
 */
const youTubeId = (url: string): string | null => {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;

  const { hostname, pathname, searchParams } = parsed;
  let id: string | null | undefined = null;

  if (hostname === 'youtu.be') {
    [, id] = pathname.split('/');
  } else if (YOUTUBE_HOSTS.includes(hostname)) {
    id = /^\/watch\/?$/u.test(pathname) ? searchParams.get('v') : YOUTUBE_ID_PATH.exec(pathname)?.[1];
  }

  return id && YOUTUBE_ID.test(id) ? id : null;
};

/**
 * The player URL of a video link, or none when it is neither YouTube nor Vimeo
 * (the page then shows no player rather than a frame the site refuses):
 * YouTube through youtube-nocookie.com; Vimeo ("vimeo.com/<id>",
 * "player.vimeo.com/video/<id>", an unlisted video's hash kept) as Vimeo's
 * player without tracking or the uploader's title, byline and portrait.
 */
export const getVideoEmbedUrl = (url: string): string | null => {
  const trimmed = url.trim();
  const vimeo = VIMEO_URL.exec(trimmed);

  if (vimeo) {
    const hash = vimeo[2] || VIMEO_HASH.exec(trimmed)?.[1];

    return `https://player.vimeo.com/video/${vimeo[1]}?dnt=1&title=0&byline=0&portrait=0${hash ? `&h=${hash}` : ''}`;
  }

  const youTube = youTubeId(trimmed);

  return youTube ? `https://www.youtube-nocookie.com/embed/${youTube}?rel=0&modestbranding=1` : null;
};

/** The boat's video as a player URL (yachtVideoUrl, getVideoEmbedUrl), or none. */
export const yachtVideoEmbedUrl = (yacht?: MediaYacht | null): string | null => {
  const url = yachtVideoUrl(yacht);

  return url ? getVideoEmbedUrl(url) : null;
};
