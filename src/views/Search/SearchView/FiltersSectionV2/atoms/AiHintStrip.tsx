'use client';

import { Box, ButtonBase, Stack } from '@mui/material';

import { searchV2, searchV2Type } from '@/styles/themes/searchV2';

interface AiHintStripProps {
  /** Human-readable filter label, e.g. "Year ≥ 2018". */
  filterLabel: string;
  /** Number of additional boats that would appear if the filter were
   *  dropped. Server-side computed; only surface when ≥ 20. */
  delta: number;
  /** Click → drop the offending filter (parent decides which URL
   *  params to clear). */
  onRelax: () => void;
}

/**
 * "Tip: removing X filter would show +N boats" strip that appears
 * above the result grid per design handoff AI-hint atom. Cream/gold
 * soft bg, light-bulb emoji, with a single `Relax filter` action on
 * the right. Hidden by parent when [delta] is below the surface
 * threshold (≥20 per spec).
 */
const AiHintStrip = ({ filterLabel, delta, onRelax }: AiHintStripProps) => (
  <Stack
    direction="row"
    alignItems="center"
    gap={1.5}
    sx={{
      padding: '12px 14px',
      borderRadius: '8px',
      background: searchV2.goldSoft,
      border: '1px solid #ebddb2',
      fontSize: 12.5,
      fontFamily: searchV2Type.fontFamily,
      mb: '18px',
    }}
  >
    <Box component="span" sx={{ fontSize: 16 }}>
      💡
    </Box>
    <Box component="span" sx={{ color: '#4a3a12', flex: 1 }}>
      <Box component="strong" sx={{ color: '#2d2408' }}>
        Tip:
      </Box>{' '}
      Removing the <Box component="em">{filterLabel}</Box> filter would show{' '}
      <Box component="strong">+{delta.toLocaleString('en-US')} boats</Box> with comparable fit.
    </Box>
    <ButtonBase
      onClick={onRelax}
      sx={{
        background: '#fff',
        border: '1px solid #ebddb2',
        fontSize: 11.5,
        padding: '5px 10px',
        borderRadius: '4px',
        fontWeight: 700,
        color: '#2d2408',
        fontFamily: searchV2Type.fontFamily,
      }}
    >
      Relax filter
    </ButtonBase>
  </Stack>
);

export default AiHintStrip;
