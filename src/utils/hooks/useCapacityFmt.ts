import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import { capacityFmt } from '@/utils/static/capacityFmt';
import type { Fmt } from '@/utils/static/yachtCapacity';

/** The `capacity` messages as the yacht capacity formatter's `Fmt` (client and server components). */
const useCapacityFmt = (): Fmt => {
  const t = useTranslations('capacity');

  return useMemo(() => capacityFmt(t), [t]);
};

export default useCapacityFmt;
