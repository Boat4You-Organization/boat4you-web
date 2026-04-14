'use client';

import { ReactNode, createContext, useMemo, useTransition } from 'react';

import { NavigationWrapperContext } from '@/utils/context/NavigationWrapperContext';

export interface BoatTransitionContextValue {
  isPending: boolean;
  startTransition: (callback: () => void) => void;
}

export const BoatTransitionContext = createContext<BoatTransitionContextValue | null>(null);

interface BoatTransitionProviderProps {
  children: ReactNode;
}

export function BoatTransitionProvider({ children }: BoatTransitionProviderProps) {
  const [isPending, startTransition] = useTransition();

  const value = useMemo<BoatTransitionContextValue>(
    () => ({
      isPending,
      startTransition,
    }),
    [isPending, startTransition]
  );

  return (
    <BoatTransitionContext.Provider value={value}>
      <NavigationWrapperContext.Provider value={startTransition}>{children}</NavigationWrapperContext.Provider>
    </BoatTransitionContext.Provider>
  );
}
