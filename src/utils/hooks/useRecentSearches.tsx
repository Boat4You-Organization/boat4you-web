'use client';

import { useCallback, useEffect, useState } from 'react';

import { LocationModel } from '@/models/locations.model';

const STORAGE_KEY = 'b4y:recentLocationSearches';
const MAX_ITEMS = 5;

const readFromStorage = (): LocationModel[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is LocationModel =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as LocationModel).id === 'string' &&
        typeof (item as LocationModel).name === 'string'
    );
  } catch {
    return [];
  }
};

const writeToStorage = (items: LocationModel[]): void => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage quota or disabled — ignore, just skip persistence.
  }
};

/**
 * Tracks the user's recent location selections in localStorage.
 * Most-recent-first, capped at MAX_ITEMS, deduplicated by location id.
 */
const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<LocationModel[]>([]);

  // Load from storage on mount. Stays empty during SSR to avoid hydration mismatch.
  useEffect(() => {
    setRecentSearches(readFromStorage());
  }, []);

  const addRecentSearch = useCallback((location: LocationModel) => {
    setRecentSearches(prev => {
      const next = [location, ...prev.filter(item => item.id !== location.id)].slice(0, MAX_ITEMS);

      writeToStorage(next);

      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    writeToStorage([]);
    setRecentSearches([]);
  }, []);

  return { recentSearches, addRecentSearch, clearRecentSearches };
};

export default useRecentSearches;
