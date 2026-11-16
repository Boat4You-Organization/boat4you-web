import sanitizeHtml from 'sanitize-html';

/**
 * WordPress post HTML through an allowlist before it reaches the page (security audit 15.11.2026, MEDIUM: the blog body
 * was rendered with dangerouslySetInnerHTML as WordPress sent it, so a script or an onclick added through a WordPress
 * account or plugin would run on www.boat4you.com). Server-side only (lib/api.ts getBlog), nothing of it reaches the
 * browser bundle.
 *
 * Allowed: what the 65 posts of 16.11.2026 use (paragraphs, headings, links, figures with images and captions, tables,
 * lists, quotes) plus the rest of Gutenberg's plain text markup, the video placeholder (div.b4y-video with data-*,
 * utils/static/blogVideo.ts) and YouTube iframes (turned into click-to-load facades after this). Dropped: scripts and
 * styles (the only scripts in posts are the Article JSON-LD that stripEmbeddedArticleLd removes anyway), event
 * handlers, javascript:/data: links, forms, embeds and iframes from anywhere else.
 */
const OPTIONS = {
  allowedTags: [
    'p',
    'br',
    'hr',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'del',
    'ins',
    'mark',
    'small',
    'sub',
    'sup',
    'code',
    'pre',
    'kbd',
    'blockquote',
    'cite',
    'q',
    'abbr',
    'time',
    'ul',
    'ol',
    'li',
    'dl',
    'dt',
    'dd',
    'a',
    'img',
    'picture',
    'source',
    'figure',
    'figcaption',
    'table',
    'caption',
    'colgroup',
    'col',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'th',
    'td',
    'div',
    'span',
    'section',
    'details',
    'summary',
    'iframe',
  ],
  allowedAttributes: {
    '*': ['class', 'id', 'title', 'lang', 'dir', 'aria-*'],
    a: ['href', 'target', 'rel', 'name'],
    img: ['src', 'srcset', 'sizes', 'alt', 'width', 'height', 'loading', 'decoding'],
    source: ['srcset', 'sizes', 'type', 'media'],
    // div.b4y-video carries the video's id, title, description, upload date, duration and credit.
    div: ['data-*'],
    span: ['data-*'],
    figure: ['data-*'],
    table: ['border', 'cellspacing', 'cellpadding'],
    th: ['colspan', 'rowspan', 'scope', 'headers', 'align'],
    td: ['colspan', 'rowspan', 'headers', 'align'],
    col: ['span'],
    colgroup: ['span'],
    ol: ['start', 'reversed', 'type'],
    time: ['datetime'],
    iframe: ['src', 'title', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'loading', 'referrerpolicy'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['http', 'https'], source: ['http', 'https'], iframe: ['https'] },
  allowProtocolRelative: false,
  allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'youtube-nocookie.com'],
  allowIframeRelativeUrls: false,
  // Unknown tags lose the tag and keep their text; script, style and the like lose their content too.
  disallowedTagsMode: 'discard' as const,
  transformTags: {
    // A link opening a new tab must not hand window.opener to the other site.
    a: (tagName: string, attribs: Record<string, string>) => {
      if (attribs.target !== '_blank') return { tagName, attribs };

      const rel = new Set((attribs.rel ?? '').split(/\s+/).filter(Boolean));

      rel.add('noopener');
      rel.add('noreferrer');

      return { tagName, attribs: { ...attribs, rel: [...rel].join(' ') } };
    },
  },
};

export const sanitizeWpHtml = (html: string): string =>
  typeof html === 'string' && html ? sanitizeHtml(html, OPTIONS) : html;
