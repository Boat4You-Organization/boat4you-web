'use client';

/* eslint-disable react/no-array-index-key */
import { Box, Slider } from '@mui/material';

import { searchV2 } from '@/styles/themes/searchV2';

interface FilterRangeSliderV2Props {
  min: number;
  max: number;
  vMin: number;
  vMax: number;
  step?: number;
  onChange: (next: [number, number]) => void;
  /** Optional histogram, normalized externally. Bars between handles
   *  render at full accent; outside the range fade muted. */
  hist?: number[];
  format?: (n: number) => string;
  accent?: string;
  /** Accessible name for the two thumbs ("<label> minimum" / "<label>
   *  maximum"). MUI renders each thumb as an `<input type="range">`;
   *  without this Lighthouse flags "Form elements do not have associated
   *  labels" on every search page (and the agentic-browsing audit fails). */
  ariaLabel?: string;
}

/**
 * Two-handle range slider built on top of MUI `Slider`. The previous
 * stacked-native-inputs approach had z-index issues — clicking the lower
 * handle when both were near the start of the track would silently bind
 * to the upper input, so the lower handle felt "stuck". MUI handles
 * thumb dispatch correctly on every click position.
 */
const FilterRangeSliderV2 = ({
  min,
  max,
  vMin,
  vMax,
  step = 1,
  onChange,
  hist,
  format,
  accent = searchV2.brand,
  ariaLabel = 'Range',
}: FilterRangeSliderV2Props) => {
  const range = Math.max(1, max - min);
  const pctA = ((vMin - min) / range) * 100;
  const pctB = ((vMax - min) / range) * 100;

  return (
    <Box>
      {hist && hist.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: 36, mb: '6px' }}>
          {hist.map((h, i) => {
            const mid = ((i + 0.5) / hist.length) * 100;
            const on = mid >= pctA && mid <= pctB;
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
      <Box sx={{ px: '8px' }}>
        <Slider
          size="small"
          value={[vMin, vMax]}
          min={min}
          max={max}
          step={step}
          disableSwap
          getAriaLabel={index => `${ariaLabel} ${index === 0 ? 'minimum' : 'maximum'}`}
          getAriaValueText={v => (format ? format(v) : String(v))}
          onChange={(_e, value) => {
            if (Array.isArray(value)) onChange([value[0], value[1]]);
          }}
          sx={{
            color: accent,
            padding: '10px 0 !important',
            '& .MuiSlider-rail': { backgroundColor: searchV2.line, opacity: 1, height: '1px !important' },
            '& .MuiSlider-track': { border: 'none', height: '1px !important' },
            '& .MuiSlider-thumb': {
              width: 14,
              height: 14,
              background: '#fff',
              border: `2px solid ${accent}`,
              boxShadow: '0 1px 3px rgba(0,0,0,.15)',
              '&:hover, &.Mui-focusVisible, &.Mui-active': {
                boxShadow: '0 1px 3px rgba(0,0,0,.15)',
              },
            },
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          color: searchV2.inkSoft,
          mt: '7px',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span>{format ? format(vMin) : vMin}</span>
        <span>{format ? format(vMax) : vMax}</span>
      </Box>
    </Box>
  );
};

export default FilterRangeSliderV2;
