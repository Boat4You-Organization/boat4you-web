import { useEffect, useState } from 'react';

import { YachtAvailability } from '@/models/yacht.model';
import { fetchYachtAvailability } from '@/services/yacht.service';

export function useYachtAvailability(yachtSlug: string, year: number, month: number) {
  const [yachtAvailability, setYachtAvailability] = useState<YachtAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!yachtSlug) return;

    setLoading(true);
    fetchYachtAvailability({ yachtSlug, year, month })
      .then(data => {
        setYachtAvailability(data);
        setError(null);
      })
      .catch(e => {
        setYachtAvailability([]);
        setError(e);
      })
      .finally(() => setLoading(false));
  }, [yachtSlug, year, month]);

  return { yachtAvailability, loading, error };
}
