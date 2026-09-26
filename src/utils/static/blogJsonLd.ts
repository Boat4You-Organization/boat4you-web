import { LocaleType } from '@/config/locales.config';
import { routing } from '@/i18n/routing';
import { Blog } from '@/types/blog.type';
import { decodeHtmlEntities } from '@/utils/static/decodeHtmlEntities';

import { localizedUrl } from './buildMetadata';

const stripTags = (html: string): string =>
  decodeHtmlEntities(
    html
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );

/**
 * BlogPosting JSON-LD for a single post. Google's AI-optimization guide keeps
 * structured data optional, but Article markup remains the recommended way to
 * describe editorial pages — the sister sites already emit it, boat4you's blog
 * didn't (audit 25.8.2026).
 */
// Posts come from WordPress in English only, so the article's identity is the
// English URL and its language is English on every locale shell — the same
// canonical the page's <head> declares.
export const buildBlogPostingLd = (post: Blog) => {
  const url = localizedUrl(routing.defaultLocale as LocaleType, `/blog/${post.slug}`);
  const description = stripTags(post.content).slice(0, 300);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: decodeHtmlEntities(post.title),
    description,
    image: post.featuredImage?.sourceUrl ? [post.featuredImage.sourceUrl] : undefined,
    datePublished: post.date,
    dateModified: post.modified || post.date,
    inLanguage: routing.defaultLocale,
    articleSection: post.categories?.nodes?.map(c => c.name),
    author: { '@type': 'Organization', name: 'Boat4You', url: 'https://www.boat4you.com' },
    // Same @id as the site-wide Organization node — one KG entity.
    publisher: {
      '@type': 'Organization',
      '@id': 'https://www.boat4you.com/#organization',
      name: 'Boat4You',
      url: 'https://www.boat4you.com',
    },
  };
};

/**
 * BreadcrumbList for a post: Home › Blog › post (audit 26.9.2026, B44 — the
 * posts were the one indexable template without it). English names and URLs,
 * like the BlogPosting above: the English URL is the canonical of every
 * locale copy of a post.
 */
export const buildBlogBreadcrumbLd = (post: Pick<Blog, 'slug' | 'title'>) => {
  const locale = routing.defaultLocale as LocaleType;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: localizedUrl(locale, '/') },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: localizedUrl(locale, '/blog') },
      {
        '@type': 'ListItem',
        position: 3,
        name: decodeHtmlEntities(post.title),
        item: localizedUrl(locale, `/blog/${post.slug}`),
      },
    ],
  };
};

/**
 * FAQPage JSON-LD extracted from the post body. Our posts render FAQ as an
 * <h2> whose text contains "FAQ" / "Frequently Asked", followed by <h3>
 * question headings with the answer paragraphs between them (same extractor
 * convention as the sister sites). Returns null unless at least two clean
 * Q/A pairs are found, so ordinary posts emit nothing.
 */
export const extractFaqLd = (contentHtml: string) => {
  if (!contentHtml) return null;

  // Sections start at each <h2>; a section's heading is the text before </h2>.
  const faqSection = contentHtml
    .split(/<h2\b[^>]*>/i)
    .slice(1)
    .find(section => /faq|frequently asked/i.test(stripTags(section.split(/<\/h2>/i)[0] || '')));

  if (!faqSection) return null;

  const body = faqSection
    .split(/<\/h2>/i)
    .slice(1)
    .join('</h2>');
  const parts = body.split(/<h3\b[^>]*>/i).slice(1);

  const pairs = parts
    .map(part => {
      const [questionHtml, ...answerParts] = part.split(/<\/h3>/i);
      const question = stripTags(questionHtml || '');
      const answer = stripTags(answerParts.join('</h3>'));

      return question && answer ? { question, answer } : null;
    })
    .filter((p): p is { question: string; answer: string } => p !== null);

  if (pairs.length < 2) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
};
