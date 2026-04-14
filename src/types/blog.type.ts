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
  content: string;
  seo?: RankMathSEOData | null;
};

export type Blog = Omit<BlogTeaser, 'excerpt'> & {
  categories: Nodes<BlogCategory[]>;
  seo?: RankMathSEOData | null;
};
