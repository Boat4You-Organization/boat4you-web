import type { YachtCustomDetails, YachtModel } from '@/models/yacht.model';
import getYouTubeEmbedUrl from '@/utils/static/getYoutubeEmbedUrlUtils';

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

/**
 * The player URL of a video link: Vimeo ("vimeo.com/<id>",
 * "player.vimeo.com/video/<id>", an unlisted video's hash kept) as Vimeo's
 * player without tracking or the uploader's title, byline and portrait; any
 * other link as before (getYouTubeEmbedUrl: YouTube through
 * youtube-nocookie.com).
 */
export const getVideoEmbedUrl = (url: string): string => {
  const vimeo = VIMEO_URL.exec(url.trim());

  if (!vimeo) return getYouTubeEmbedUrl(url);

  const hash = vimeo[2] || VIMEO_HASH.exec(url)?.[1];

  return `https://player.vimeo.com/video/${vimeo[1]}?dnt=1&title=0&byline=0&portrait=0${hash ? `&h=${hash}` : ''}`;
};
