import { Blog, BlogTeaser } from '@/types/blog.type';
import { Nodes, QueryNodesAndPageInfoResult } from '@/types/common.type';

export type GetBlogsResult = QueryNodesAndPageInfoResult<'posts', BlogTeaser>;

export const GET_ALL_BLOGS = `
query GetAllBlogs($pageSize: Int!,$categoryName: String, $after: String) {
    posts(where: {orderby: {field: DATE, order: DESC}, categoryName: $categoryName}, first: $pageSize, after: $after) {
    nodes {
      id
      title
      slug
      date
      dateGmt
      modifiedGmt
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      excerpt
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}`;

/**
 * The newest WordPress stamps of the published posts — the latest
 * modification and the latest publication (a scheduled post is published
 * after its last edit). The later of the two is the newest `<lastmod>` in the
 * blog sitemap (wpGmtLastmod over each post's dateGmt and modifiedGmt), i.e.
 * that child's `<lastmod>` in the sitemap index.
 */
export const GET_BLOGS_LASTMOD = `
query GetBlogsLastmod {
  byModified: posts(where: {orderby: {field: MODIFIED, order: DESC}}, first: 1) {
    nodes {
      dateGmt
      modifiedGmt
    }
  }
  byDate: posts(where: {orderby: {field: DATE, order: DESC}}, first: 1) {
    nodes {
      dateGmt
      modifiedGmt
    }
  }
}`;

type BlogStamps = { nodes: Array<{ dateGmt?: string | null; modifiedGmt?: string | null }> };

export type GetBlogsLastmodResult = {
  byModified: BlogStamps;
  byDate: BlogStamps;
};

export type GetBlogAndRelatedBlogsResult = {
  post: Blog;
  posts: Nodes<BlogTeaser[]>;
};

export type GetUnwrapedBlogAndRelatedBlogsResult = {
  post: Blog;
  posts: BlogTeaser[];
};

export const GET_BLOG = `
query GetBlog($id: ID!, $pageSize: Int!) {
  post(idType: SLUG, id: $id) {
    id
    slug
    title
    date
    modified
    categories {
      nodes {
        id
        name
        slug
      }
    }
    content
    featuredImage {
      node {
        altText
        sourceUrl
      }
    }
  }
  posts(where: {orderby: {field: DATE, order: DESC}}, first: $pageSize) {
    nodes {
      id
      title
      slug
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      excerpt
    }
  }
}`;
