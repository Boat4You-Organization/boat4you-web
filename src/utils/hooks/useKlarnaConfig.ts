import { useEffect, useState } from 'react';

import { getKlarnaConfig } from '@/actions/klarna.actions';
import { KlarnaConfig } from '@/models/klarna.model';

/**
 * Klarna config for the booking payment surfaces. `undefined` while loading, `null` when Klarna is not offered.
 * `enabled` lets a modal load it only once it is opened.
 */
export const useKlarnaConfig = (enabled = true): KlarnaConfig | null | undefined => {
  const [config, setConfig] = useState<KlarnaConfig | null | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return undefined;

    let cancelled = false;

    getKlarnaConfig()
      .catch(() => null)
      .then(result => {
        if (!cancelled) setConfig(result);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return config;
};
