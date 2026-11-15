/**
 * YouTube videos in blog posts (15.11.2026): a click-to-load facade instead of the YouTube iframe.
 *
 * A YouTube iframe pasted into WordPress loads the player (~1 MB of script) and sets YouTube cookies as soon as the
 * post opens, before the visitor has chosen anything in the cookie notice. Google's Modern Web Guidance
 * ("lazy-load-video-and-audio") and the privacy rules point the same way: show the video's thumbnail and a play
 * button, and load the player from youtube-nocookie.com only when the visitor presses play
 * (SingleBlogContent.tsx swaps the facade for the iframe).
 *
 * Two inputs are turned into the same facade markup:
 * - the editor's placeholder, which also carries what Google needs for a VideoObject:
 *   <div class="b4y-video" data-yt="VIDEO_ID" data-title="…" data-description="…" data-upload="2026-06-13"
 *        data-duration="PT6M21S" data-credit="Croatian National Tourist Board"></div>
 * - a plain YouTube embed iframe (youtube.com / youtube-nocookie.com /embed/ID), so a pasted iframe is never
 *   rendered as is.
 * The facade keeps those values as data-yt-* attributes, so buildBlogVideoObjects() can read them from the
 * processed post body.
 */

const YT_ID = /^[\w-]{11}$/u;

export interface BlogVideo {
  id: string;
  title: string;
  description?: string;
  uploadDate?: string;
  duration?: string;
  credit?: string;
  /** Start offset in seconds (an embed's ?start=). */
  start?: number;
}

const PLACEHOLDER = /<div\b[^>]*\sclass=["'](?:[^"']*\s)?b4y-video(?:\s[^"']*)?["'][^>]*>(?:\s|&nbsp;)*<\/div>/giu;
// Not /embed/videoseries?list=… or /embed/live_stream?channel=… (11 characters too): those stay as they are.
const IFRAME =
  /<iframe\b[^>]*\ssrc=["']https?:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/(?!videoseries|live_stream)([\w-]{11})([^"']*)["'][^>]*>\s*<\/iframe>/giu;
const FACADE = /<div\b[^>]*\bclass=["']b4y-yt["'][^>]*>/giu;

/** The value of one attribute in a tag string, HTML entities left as they are. Double- or single-quoted; the other
 *  quote may appear inside ("It's", 'say "hi"'). */
const ATTRIBUTE = /\s([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/gu;

const attr = (tag: string, name: string): string | undefined => {
  // Attributes are read left to right, each value consumed whole, so a `data-yt=` written inside another attribute's
  // value is never taken for the attribute itself.
  const found = Array.from(tag.replace(/^<\w+/u, '').replace(/\/?>$/u, '').matchAll(ATTRIBUTE)).find(
    m => m[1].toLowerCase() === name.toLowerCase()
  );

  return (found?.[2] ?? found?.[3] ?? found?.[4])?.trim() || undefined;
};

const ESCAPES: Record<string, string> = { '"': '&quot;', '<': '&lt;', '>': '&gt;' };

/** Attribute-safe text: the values come from the post body already entity-encoded, so only double quotes and angle
 *  brackets are guarded here. */
const safe = (value: string): string => value.replace(/["<>]/gu, ch => ESCAPES[ch] ?? ch);

/** The facade: thumbnail + play button; the player itself is loaded on click (SingleBlogContent). */
export const videoFacade = (video: BlogVideo): string => {
  const title = safe(video.title);
  const data = [
    `data-yt-id="${video.id}"`,
    `data-yt-title="${title}"`,
    video.description ? `data-yt-description="${safe(video.description)}"` : '',
    video.uploadDate ? `data-yt-upload="${safe(video.uploadDate)}"` : '',
    video.duration ? `data-yt-duration="${safe(video.duration)}"` : '',
    video.credit ? `data-yt-credit="${safe(video.credit)}"` : '',
    video.start ? `data-yt-start="${video.start}"` : '',
  ]
    .filter(Boolean)
    .join(' ');
  const credit = video.credit ? `<p class="b4y-yt__credit">Video: ${safe(video.credit)}</p>` : '';
  // Our own origin (next.config.js rewrite to i.ytimg.com): no Google request from the browser before play.
  const thumb = `/yt-thumb/${video.id}.jpg`;
  const img = `<img class="b4y-yt__thumb" src="${thumb}" alt="${title}" width="480" height="360" loading="lazy" decoding="async" referrerpolicy="no-referrer">`;
  const button = `<button type="button" class="b4y-yt__play" aria-label="Play video: ${title}">${img}<span class="b4y-yt__icon" aria-hidden="true"></span></button>`;

  return `<div class="b4y-yt" ${data}>${button}${credit}</div>`;
};

/** Replace the editor's placeholders and any YouTube embed iframes in a post body with click-to-load facades. */
export const blogVideoFacades = (html: string): string =>
  html
    .replace(PLACEHOLDER, tag => {
      const id = attr(tag, 'data-yt');

      if (!id || !YT_ID.test(id)) return '';

      return videoFacade({
        id,
        title: attr(tag, 'data-title') ?? 'Video',
        description: attr(tag, 'data-description'),
        uploadDate: attr(tag, 'data-upload'),
        duration: attr(tag, 'data-duration'),
        credit: attr(tag, 'data-credit'),
      });
    })
    .replace(IFRAME, (tag, id: string, query: string) => {
      const start = Number(query.match(/[?&](?:start|t)=(\d+)/u)?.[1]);

      return videoFacade({ id, title: attr(tag, 'title') ?? 'Video', start: start > 0 ? start : undefined });
    });

/** The videos of a processed post body (its facades). */
export const blogVideosIn = (html: string): BlogVideo[] =>
  (html.match(FACADE) ?? [])
    .map(tag => ({
      id: attr(tag, 'data-yt-id') ?? '',
      title: attr(tag, 'data-yt-title') ?? '',
      description: attr(tag, 'data-yt-description'),
      uploadDate: attr(tag, 'data-yt-upload'),
      duration: attr(tag, 'data-yt-duration'),
      credit: attr(tag, 'data-yt-credit'),
    }))
    .filter(video => YT_ID.test(video.id));

const ISO_DATE = /^\d{4}-\d{2}-\d{2}(?:T[\d:.]+(?:Z|[+-]\d{2}:\d{2})?)?$/u;
const ISO_DURATION = /^PT(?:\d+H)?(?:\d+M)?(?:\d+S)?$/u;

/** A valid Unicode code point as text, else undefined (a mistyped &#99999999; must not throw and 500 the post). */
const codePoint = (n: number): string | undefined =>
  Number.isInteger(n) && n > 0 && n <= 0x10ffff && (n < 0xd800 || n > 0xdfff) ? String.fromCodePoint(n) : undefined;

/** Entity-decoded text for the JSON-LD (the values are attribute text, e.g. WordPress' &#8217;). */
const plain = (value: string): string =>
  value
    .replace(/&#x([\da-f]+);/giu, (whole, hex: string) => codePoint(parseInt(hex, 16)) ?? whole)
    .replace(/&#(\d+);/gu, (whole, dec: string) => codePoint(Number(dec)) ?? whole)
    .replace(/&quot;/gu, '"')
    .replace(/&apos;/gu, "'")
    .replace(/&lt;/gu, '<')
    .replace(/&gt;/gu, '>')
    .replace(/&amp;/gu, '&');

/**
 * VideoObject JSON-LD for the videos that carry what Google requires (name, thumbnail, upload date). A bare pasted
 * iframe has no upload date, so it gets the facade but no VideoObject (no invented dates).
 */
export const buildBlogVideoObjects = (html: string) =>
  blogVideosIn(html)
    .filter(
      video =>
        video.title &&
        video.uploadDate &&
        ISO_DATE.test(video.uploadDate) &&
        !Number.isNaN(Date.parse(video.uploadDate)) &&
        new Date(Date.parse(video.uploadDate)).toISOString().slice(0, 10) === video.uploadDate.slice(0, 10)
    )
    .map(video => ({
      '@type': 'VideoObject',
      name: plain(video.title),
      description: plain(video.description ?? video.title),
      thumbnailUrl: [`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`],
      uploadDate: video.uploadDate,
      ...(video.duration && ISO_DURATION.test(video.duration) ? { duration: video.duration } : {}),
      embedUrl: `https://www.youtube.com/embed/${video.id}`,
      ...(video.credit ? { creator: { '@type': 'Organization', name: plain(video.credit) } } : {}),
    }));

/** The player URL loaded on click (no cookies until the visitor plays it). */
export const nocookieEmbedUrl = (id: string, start?: number): string =>
  `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1${
    start && Number.isInteger(start) && start > 0 ? `&start=${start}` : ''
  }`;
