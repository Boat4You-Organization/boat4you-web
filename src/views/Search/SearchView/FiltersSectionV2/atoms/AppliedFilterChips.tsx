'use client';

/* eslint-disable no-nested-ternary, react/no-array-index-key */
import { Box } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import { currencySymbols } from '@/config/currencies.config';
import { Currency } from '@/models/user.model';
import { CharterType, MainSailType, VESSEL_TYPE_LABEL_MAP_PLURAL, isVesselType } from '@/models/yacht.model';
import { searchV2 } from '@/styles/themes/searchV2';
import { SearchParams } from '@/utils/hooks/useQueryParams';

interface AppliedFilterChipsProps {
  params: SearchParams;
  setMultipleParams: (updates: Partial<SearchParams>) => void;
  /** i18n: ako se prosljeđuje, koristi za vessel-type / charter / mainsail
   *  labele. Ako null, fallback na enum naziv. Drži se BoatsSection patterna
   *  gdje je translator već instanciran (next-intl). */
  t?: (key: string) => string;
}

interface Chip {
  label: string;
  /** Updates passed to setMultipleParams to remove this chip's filter. */
  remove: Partial<SearchParams>;
}

const AppliedFilterChips = ({ params, setMultipleParams, t }: AppliedFilterChipsProps) => {
  // Chip texts in the page language and number format (they were English
  // literals with en-US digits on every locale, audit B29).
  const tf = useTranslations('filters');
  const number = new Intl.NumberFormat(useLocale());
  const symbol = currencySymbols[(params.currency as Currency) || Currency.EUR] ?? params.currency;
  const chips: Chip[] = [];

  // Vessel types
  (params.boatTypes || []).forEach(bt => {
    const labelKey = isVesselType(bt) ? VESSEL_TYPE_LABEL_MAP_PLURAL[bt] : null;

    chips.push({
      label: labelKey && t ? t(labelKey) : bt,
      remove: { boatTypes: (params.boatTypes || []).filter(x => x !== bt) },
    });
  });

  // Charter types
  (params.charterType || []).forEach(ct => {
    chips.push({
      label: ct === CharterType.BAREBOAT ? tf('bareboat') : ct === CharterType.CREWED ? tf('skippered') : ct,
      remove: { charterType: (params.charterType || []).filter(x => x !== ct) },
    });
  });

  // Mainsail types
  (params.mainSailType || []).forEach(ms => {
    chips.push({
      label:
        ms === MainSailType.CLASSIC_SAIL
          ? tf('classicMainsail')
          : ms === MainSailType.ROLLING_SAIL
            ? tf('rollingMainsail')
            : ms,
      remove: { mainSailType: (params.mainSailType || []).filter(x => x !== ms) },
    });
  });

  // Manufacturers — paired (id, label) arrays in URL state.
  (params.manufacturers || []).forEach((label, i) => {
    chips.push({
      label,
      remove: {
        manufacturers: (params.manufacturers || []).filter((_, j) => j !== i),
        mfid: (params.mfid || []).filter((_, j) => j !== i),
        // Removing a manufacturer also clears its models (cascade like the
        // manufacturer dropdown does on its own).
        models: [],
        mid: [],
      },
    });
  });

  // Models
  (params.models || []).forEach((label, i) => {
    chips.push({
      label,
      remove: {
        models: (params.models || []).filter((_, j) => j !== i),
        mid: (params.mid || []).filter((_, j) => j !== i),
      },
    });
  });

  // Amenities
  (params.amenityLabels || []).forEach((label, i) => {
    chips.push({
      label,
      remove: {
        amenityLabels: (params.amenityLabels || []).filter((_, j) => j !== i),
        amenities: (params.amenities || []).filter((_, j) => j !== i),
      },
    });
  });

  // Cabins (single chip, mapping mirrors `CabinsPillSegment`)
  if (params.minCabins || params.maxCabins) {
    let cabinsLabel: string | null = null;

    if (params.minCabins === params.maxCabins && params.minCabins > 0 && params.minCabins <= 5) {
      cabinsLabel = tf('cabinsChip', { count: params.minCabins });
    } else if (params.minCabins >= 6 && !params.maxCabins) {
      cabinsLabel = tf('cabinsChipPlus', { count: 6 });
    }

    if (cabinsLabel) {
      chips.push({ label: cabinsLabel, remove: { minCabins: 0, maxCabins: 0 } });
    }
  }

  // Range chips — render a single chip per dimension when any side is active.
  const rangeChip = (
    minKey: keyof SearchParams,
    maxKey: keyof SearchParams,
    fmt: (lo?: number, hi?: number) => string
  ) => {
    const lo = params[minKey] as number | undefined;
    const hi = params[maxKey] as number | undefined;

    if (!lo && !hi) return;

    chips.push({
      label: fmt(lo, hi),
      remove: { [minKey]: undefined, [maxKey]: undefined } as Partial<SearchParams>,
    });
  };

  const upTo = (hi?: number) => (hi ? number.format(hi) : '∞');

  rangeChip('minPersons', 'maxPersons', (lo, hi) => tf('guestsRange', { min: number.format(lo ?? 0), max: upTo(hi) }));
  rangeChip('minBerths', 'maxBerths', (lo, hi) => tf('berthsRange', { min: number.format(lo ?? 0), max: upTo(hi) }));
  rangeChip('minLength', 'maxLength', (lo, hi) => tf('lengthRange', { min: number.format(lo ?? 0), max: upTo(hi) }));
  rangeChip('minBuildYear', 'maxBuildYear', (lo, hi) => `${lo ?? 2000} – ${hi ?? new Date().getFullYear() + 1}`);
  rangeChip('minWc', 'maxWc', (lo, hi) =>
    tf('toiletsRange', { min: number.format(lo ?? 0), max: upTo(hi), count: hi ?? 2 })
  );
  rangeChip(
    'minPrice',
    'maxPrice',
    (lo, hi) => `${number.format(lo ?? 500)} ${symbol} – ${number.format(hi ?? 200_000)} ${symbol}`
  );
  rangeChip('minEnginePower', 'maxEnginePower', (lo, hi) =>
    tf('engineRangeHp', { min: number.format(lo ?? 5), max: number.format(hi ?? 7296) })
  );

  if (chips.length === 0) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        py: '8px',
      }}
    >
      {chips.map((chip, i) => (
        <Box
          key={`${chip.label}-${i}`}
          onClick={() => setMultipleParams({ ...chip.remove, page: 1 })}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px 4px 12px',
            borderRadius: '999px',
            border: `1px solid ${searchV2.line}`,
            background: searchV2.paper,
            fontSize: 12,
            fontWeight: 500,
            color: searchV2.ink,
            cursor: 'pointer',
            transition: 'border-color .12s ease, background .12s ease',
            '&:hover': {
              borderColor: searchV2.lineStrong,
              background: searchV2.bg,
            },
          }}
        >
          <span>{chip.label}</span>
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 14,
              height: 14,
              borderRadius: '50%',
              color: searchV2.inkSoft,
              fontSize: 14,
              lineHeight: 1,
            }}
          >
            ×
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default AppliedFilterChips;
