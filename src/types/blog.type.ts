import { Nodes } from './common.type';

type FeaturedImage = {
  sourceUrl: string;
  altText: string;
};

export type RankMathSEOData = {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  jsonld?: string;
};

export type BlogCategory = {
  id?: string;
  slug: string;
  name: string;
};

export type BlogTeaser = {
  id: string;
  title: string;
  slug: string;
  date: string;
  featuredImage: FeaturedImage;
  excerpt: string;
  seo?: RankMathSEOData | null;
};

// `content` (full article HTML) lives on Blog only — the listing/teaser
// payload (BlogTeaser) intentionally omits it so the homepage's getBlogs()
// call doesn't ship 9 full article bodies the cards never render
// (~150 KB+ off the SSR payload, PageSpeed mobile 28.5.2026).
export type Blog = Omit<BlogTeaser, 'excerpt'> & {
  content: string;
  categories: Nodes<BlogCategory[]>;
  seo?: RankMathSEOData | null;
};
