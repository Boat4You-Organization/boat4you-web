'use client';

import { ReactNode, createContext, useMemo, useTransition } from 'react';

import { NavigationWrapperContext } from '@/utils/context/NavigationWrapperContext';

export interface SearchTransitionContextValue {
  isPending: boolean;
  startTransition: (callback: () => void) => void;
}

export const SearchTransitionContext = createContext<SearchTransitionContextValue | null>(null);

interface SearchTransitionProviderProps {
  children: ReactNode;
}

export function SearchTransitionProvider({ children }: SearchTransitionProviderProps) {
  const [isPending, startTransition] = useTransition();

  const value = useMemo<SearchTransitionContextValue>(
    () => ({
      isPending,
      startTransition,
    }),
    [isPending, startTransition]
  );

  return (
    <SearchTransitionContext.Provider value={value}>
      <NavigationWrapperContext.Provider value={startTransition}>{children}</NavigationWrapperContext.Provider>
    </SearchTransitionContext.Provider>
  );
}
