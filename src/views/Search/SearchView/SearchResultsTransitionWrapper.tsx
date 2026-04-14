'use client';

import { ReactNode, useContext } from 'react';

import BoatsSection from '@/components/Loaders/SearchPageLoader/BoatsSection';

import { SearchTransitionContext } from './SearchTransitionContext';

interface SearchResultsTransitionWrapperProps {
  children: ReactNode;
}

export function SearchResultsTransitionWrapper({ children }: SearchResultsTransitionWrapperProps) {
  const transition = useContext(SearchTransitionContext);

  if (transition?.isPending) {
    return <BoatsSection />;
  }

  return children;
}
