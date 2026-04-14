'use client';

import SearchPageLoader from '@/components/Loaders/SearchPageLoader';
import useScrollToTop from '@/utils/hooks/useScrollToTop';

const SearchLoader = () => {
  useScrollToTop();

  return <SearchPageLoader />;
};

export default SearchLoader;
