'use client';

import { Box } from '@mui/material';

import { T } from './tokens';

interface MonthAxisProps {
  labels: string[];
}

/** Month-name X-axis rendered evenly under the heatmap strip. */
const MonthAxis = ({ labels }: MonthAxisProps) => (
  <Box sx={{ display: 'flex', mt: 1, position: 'relative', height: '14px' }}>
    {labels.map((m, i) => (
      <Box
        key={m}
        sx={{
          position: 'absolute',
          left: `${labels.length === 1 ? 50 : (i / (labels.length - 1)) * 100}%`,
          transform: 'translateX(-50%)',
          fontSize: '10px',
          fontWeight: 700,
          color: T.faint,
          letterSpacing: '1.4px',
          textTransform: 'uppercase',
        }}
      >
        {m}
      </Box>
    ))}
  </Box>
);

export default MonthAxis;
