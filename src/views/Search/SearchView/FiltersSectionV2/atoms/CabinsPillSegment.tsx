'use client';

import { Box, ButtonBase } from '@mui/material';

import { searchV2, searchV2Type } from '@/styles/themes/searchV2';

interface CabinsPillSegmentProps {
  /** Selected cabin count. `null` = "Any" (no constraint). */
  value: number | null;
  onChange: (value: number | null) => void;
}

/**
 * `Any | 1 | 2 | 3 | 4 | 5 | 6+` segmented control per design handoff
 * Cabins atom. Internally keeps the URL params aligned with the
 * existing `minCabins`/`maxCabins` shape so the V2 redesign doesn't
 * touch the search backend contract:
 *   - "Any"  → minCabins=0, maxCabins=0 (existing semantics for "no cap")
 *   - "N"    → minCabins=N, maxCabins=N
 *   - "6+"   → minCabins=6, maxCabins=0 (open-ended)
 * Mapping happens in the parent (FiltersSectionV2); this atom stays
 * presentational.
 */
const PILLS: Array<{ label: string; value: number | null }> = [
  { label: 'Any', value: null },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6+', value: 6 },
];

const CabinsPillSegment = ({ value, onChange }: CabinsPillSegmentProps) => (
  <Box sx={{ display: 'flex', gap: '5px' }}>
    {PILLS.map(pill => {
      const on = pill.value === value;

      return (
        <ButtonBase
          key={pill.label}
          onClick={() => onChange(pill.value)}
          sx={{
            flex: 1,
            padding: '8px 0',
            background: on ? searchV2.brand : '#fff',
            color: on ? '#fff' : searchV2.ink,
            border: `1px solid ${on ? searchV2.brand : searchV2.line}`,
            borderRadius: '6px',
            fontSize: 12,
            fontWeight: 700,
            fontFamily: searchV2Type.fontFamily,
            transition: 'background .12s ease, color .12s ease, border-color .12s ease',
            '&:hover': { borderColor: on ? searchV2.brand : searchV2.lineStrong },
          }}
        >
          {pill.label}
        </ButtonBase>
      );
    })}
  </Box>
);

export default CabinsPillSegment;
