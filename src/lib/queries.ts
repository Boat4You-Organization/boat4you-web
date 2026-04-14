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
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      excerpt
      content
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}`;

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
      content
    }
  }
}`;
