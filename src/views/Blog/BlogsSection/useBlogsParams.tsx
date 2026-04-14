'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import blogCategories from '@/config/blogCategories.config';
import { BLOG_PAGE_SIZE } from '@/config/constants.config';
import { getBlogs } from '@/lib/api';
import { BlogTeaser } from '@/types/blog.type';

const DEFAULT_CATEGORY = 'all';
const VALID_CATEGORIES = blogCategories.map(cat => cat.slug);

interface BlogType {
  blogs: BlogTeaser[];
  isLoading: boolean;
  isLoadingMore: boolean;
  nextPage: string | null;
  hasNextPage: boolean;
}

const useBlogParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const abortControllerRef = useRef<AbortController | null>(null);

  const urlCategory = searchParams.get('category') || DEFAULT_CATEGORY;
  const category = VALID_CATEGORIES.includes(urlCategory) ? urlCategory : DEFAULT_CATEGORY;

  const [state, setState] = useState<BlogType>({
    blogs: [],
    isLoading: false,
    isLoadingMore: false,
    nextPage: null,
    hasNextPage: false,
  });

  const updateUrl = useCallback(
    (newCategory: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newCategory === DEFAULT_CATEGORY) {
        params.delete('category');
      } else {
        params.set('category', newCategory);
      }

      const newUrl = params.toString() ? `${pathname}?${params}` : pathname;

      router.replace(newUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const fetchBlogs = useCallback(async (cat: string, after?: string) => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      setState(prev => ({
        ...prev,
        isLoading: !after,
        isLoadingMore: !!after,
      }));

      const categoryParam = cat === DEFAULT_CATEGORY ? undefined : cat;
      const response = await getBlogs(BLOG_PAGE_SIZE, categoryParam, after);

      if (abortControllerRef.current?.signal.aborted) return;

      setState(prev => {
        const newBlogs = after ? [...prev.blogs, ...response.nodes] : response.nodes;

        return {
          ...prev,
          blogs: newBlogs,
          nextPage: response.pageInfo.hasNextPage ? response.pageInfo.endCursor : null,
          hasNextPage: response.pageInfo.hasNextPage,
          isLoading: false,
          isLoadingMore: false,
        };
      });
    } catch (error) {
      if (!abortControllerRef.current?.signal.aborted) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isLoadingMore: false,
        }));
      }
    }
  }, []);

  useEffect(() => {
    fetchBlogs(category);
  }, [category, fetchBlogs]);

  useEffect(() => () => abortControllerRef.current?.abort(), []);

  const handleCategoryChange = useCallback(
    (categorySlug: string) => {
      if (!VALID_CATEGORIES.includes(categorySlug) || categorySlug === category) return;

      setState(prev => ({
        ...prev,
        blogs: [],
        nextPage: null,
        hasNextPage: false,
      }));
      updateUrl(categorySlug);
    },
    [category, updateUrl]
  );

  const handlePageChange = useCallback(() => {
    if (state.nextPage && !state.isLoadingMore) {
      fetchBlogs(category, state.nextPage);
    }
  }, [state.nextPage, state.isLoadingMore, fetchBlogs, category]);

  return {
    filteredBlogs: state.blogs,
    isLoading: state.isLoading,
    isLoadingMore: state.isLoadingMore,
    hasNextPage: state.hasNextPage,
    activeCategory: category,
    handleCategoryChange,
    handlePageChange,
  };
};

export default useBlogParams;
