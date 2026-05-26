'use client';

import { Box } from '@mui/material';

import { searchV2 } from '@/styles/themes/searchV2';

interface CheckV2Props {
  label: string;
  /** Right-side counter — e.g. "(123)" — rendered in tabular-nums so
   *  the digits don't jitter as numbers update on filter changes. Pass
   *  `undefined` to suppress the counter (when backend aggregates aren't
   *  available yet). */
  count?: number | null;
  checked: boolean;
  onToggle: () => void;
}

/**
 * Boxed checkbox with label + count, per design handoff `<Check>` atom.
 * Click anywhere on the row toggles. Box fills `--ink` when checked,
 * white tick inside.
 */
const CheckV2 = ({ label, count, checked, onToggle }: CheckV2Props) => (
  <Box
    component="label"
    onClick={(e: React.MouseEvent) => {
      e.preventDefault();
      onToggle();
    }}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      py: '7px',
      cursor: 'pointer',
      fontSize: 13,
      userSelect: 'none',
    }}
  >
    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
      <Box
        component="span"
        sx={{
          width: 16,
          height: 16,
          borderRadius: '4px',
          border: `1.5px solid ${checked ? searchV2.ink : searchV2.lineStrong}`,
          background: checked ? searchV2.ink : '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          transition: 'background .12s ease, border-color .12s ease',
        }}
      >
        {checked && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </Box>
      <Box component="span" sx={{ color: searchV2.ink }}>
        {label}
      </Box>
    </Box>
    {count != null && (
      <Box
        component="span"
        sx={{
          color: searchV2.inkSoft,
          fontSize: 12,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        ({count.toLocaleString('en-US')})
      </Box>
    )}
  </Box>
);

export default CheckV2;
