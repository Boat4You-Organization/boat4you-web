'use client';

import { Box } from '@mui/material';

import { searchV2 } from '@/styles/themes/searchV2';

interface FilterSliderV2Props {
  /** Current selected value. */
  value: number;
  /** Maximum (inclusive). Slider range starts at 0 unless [min] is set. */
  max: number;
  min?: number;
  step?: number;
  onChange: (value: number) => void;
  /** Optional histogram, normalized externally (any non-negative numbers
   *  — bar heights are relative to the max in this array). 50ish bars
   *  read best per design handoff. */
  hist?: number[];
  /** Formatter for min / max labels under the track. */
  format?: (n: number) => string;
  /** Active-side colour. Defaults to brand blue. */
  accent?: string;
}

/**
 * Single-handle slider with optional histogram strip above the track,
 * per design handoff `<Slider>` atom.
 *
 * Track rendered with two stacked `<Box>` rows (background + filled
 * portion). Handle is a 16px circle layered on top via absolute
 * positioning. Native `<input type="range">` lives transparently on
 * top so keyboard / accessibility behaviour stays correct without us
 * shimming it ourselves. Histogram bars on the left of the handle
 * render at full accent colour; on the right they fade to muted.
 */
const FilterSliderV2 = ({
  value,
  max,
  min = 0,
  step = 1,
  onChange,
  hist,
  format,
  accent = searchV2.brand,
}: FilterSliderV2Props) => {
  const range = Math.max(1, max - min);
  const pct = ((value - min) / range) * 100;

  return (
    <Box>
      {hist && hist.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: 36, mb: '6px' }}>
          {hist.map((h, i) => {
            const mid = ((i + 0.5) / hist.length) * 100;
            const on = mid <= pct;
            const peak = Math.max(...hist, 1);

            return (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  height: `${Math.max(4, (h / peak) * 100)}%`,
                  background: on ? accent : searchV2.lineStrong,
                  borderRadius: '1.5px',
                  opacity: on ? 1 : 0.55,
                }}
              />
            );
          })}
        </Box>
      )}
      <Box sx={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
        {/* Inactive track */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 9,
            height: 2,
            background: searchV2.lineStrong,
            borderRadius: '2px',
          }}
        />
        {/* Active fill 0 → handle */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            width: `${pct}%`,
            top: 9,
            height: 2,
            background: accent,
            borderRadius: '2px',
          }}
        />
        {/* Handle */}
        <Box
          sx={{
            position: 'absolute',
            left: `calc(${pct}% - 8px)`,
            top: 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            border: `2px solid ${accent}`,
            boxShadow: '0 1px 3px rgba(0,0,0,.15)',
            pointerEvents: 'none',
          }}
        />
        {/* Native input — transparent, sits on top so keyboard +
            screen readers behave correctly. */}
        <Box
          component="input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            width: '100%',
            height: '100%',
            margin: 0,
            opacity: 0,
            cursor: 'pointer',
            // Hides the native track / thumb on Firefox + Chromium.
            '&::-webkit-slider-thumb': { appearance: 'none', width: 16, height: 16 },
            '&::-moz-range-thumb': { width: 16, height: 16, border: 'none', background: 'transparent' },
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          color: searchV2.inkSoft,
          mt: '7px',
          fontSize: 11,
          fontWeight: 400,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </Box>
    </Box>
  );
};

export default FilterSliderV2;
