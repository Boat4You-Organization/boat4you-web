'use client';

import { Box } from '@mui/material';

import { tierBg } from './tier-helpers';
import { T } from './tokens';

interface LegendProps {
  /** Tighter spacing for the mobile strip area. */
  compact?: boolean;
}

/**
 * Legend that walks the user through the heatmap encoding:
 * PRICE [tier swatches] low → peak | [hatched] Reserved | • Pre-reserved
 */
const Legend = ({ compact = false }: LegendProps) => (
  <Box
    sx={{
      display: 'flex',
      gap: compact ? '10px' : '14px',
      fontSize: '11px',
      color: T.muted,
      alignItems: 'center',
      flexWrap: 'wrap',
    }}
  >
    <Box component="span" sx={{ fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
      Price
    </Box>
    <Box sx={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {([0, 1, 2, 3] as const).map(i => (
        <Box
          key={i}
          component="span"
          sx={{ width: '14px', height: '12px', borderRadius: '2px', background: tierBg(i) }}
        />
      ))}
    </Box>
    <Box component="span" sx={{ ml: '-6px' }}>
      low → peak
    </Box>
    <Box component="span" sx={{ width: '1px', height: '12px', background: T.hair, mx: '2px' }} />
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      <Box
        component="span"
        sx={{
          width: '14px',
          height: '12px',
          borderRadius: '2px',
          background: 'repeating-linear-gradient(45deg, #F3F4F6 0 3px, rgba(0,0,0,0.12) 3px 4px)',
        }}
      />
      Reserved
    </Box>
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      <Box component="span" sx={{ width: '8px', height: '8px', borderRadius: '99px', background: T.amber }} />
      Pre-reserved
    </Box>
  </Box>
);

export default Legend;
