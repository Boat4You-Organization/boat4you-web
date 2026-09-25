'use client';

import { ReactNode, createContext, useContext, useEffect, useSyncExternalStore } from 'react';

/**
 * Destination resolution done on the server for this /search render
 * (src/utils/server/destinationDid.ts). Landing URLs carry only
 * `?destinations=<name>`; the server resolves the did and filters the list,
 * and this hands the same did to the client-side helpers that build their
 * own backend query from the URL (filter distribution, relax hint), plus
 * the catalogue display names for headings.
 *
 * Two channels:
 *   - React context for everything rendered inside the page (SSR-safe, so
 *     the H1 carries the display name in the server HTML);
 *   - a small client-only store mirrored from the provider, for consumers
 *     that live OUTSIDE the page tree — the mobile header's filter modal is
 *     rendered by the (search) route-group layout, which never sees the
 *     page's resolution.
 */
export interface ResolvedDestinationValue {
  /** did values resolved from `?destinations=` (empty when the URL has its own did). */
  did: string[];
  /** Lowercased URL destination value → catalogue display name. */
  labels: Record<string, string>;
}

const EMPTY: ResolvedDestinationValue = { did: [], labels: {} };

const ResolvedDestinationContext = createContext<ResolvedDestinationValue | null>(null);

// Client-only mirror. Never written on the server (effects don't run there),
// so it can't leak one request's value into another.
let published: ResolvedDestinationValue = EMPTY;
const listeners = new Set<() => void>();

const publish = (value: ResolvedDestinationValue) => {
  published = value;
  listeners.forEach(listener => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export function ResolvedDestinationProvider({
  value,
  children,
}: {
  value: ResolvedDestinationValue;
  children: ReactNode;
}) {
  useEffect(() => {
    publish(value);

    return () => publish(EMPTY);
  }, [value]);

  return <ResolvedDestinationContext.Provider value={value}>{children}</ResolvedDestinationContext.Provider>;
}

export const useResolvedDestination = (): ResolvedDestinationValue => {
  const fromContext = useContext(ResolvedDestinationContext);
  const fromStore = useSyncExternalStore(
    subscribe,
    () => published,
    () => EMPTY
  );

  return fromContext ?? fromStore;
};

/**
 * Add the resolved did to a /search querystring that names a destination
 * but has no did of its own — the backend filters by did only.
 */
export const withResolvedDid = (qs: string, did: string[]): string => {
  if (!did.length) return qs;

  const params = new URLSearchParams(qs);

  if (params.get('did') || !params.get('destinations')) return qs;

  params.set('did', did.join(','));

  return params.toString();
};
