'use client';

import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';

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
const Legend = ({ compact = false }: LegendProps) => {
  const t = useTranslations('yacht.calendar');

  return (
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
        {t('legendPrice')}
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
        {t('legendLowPeak')}
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
        {t('booked')}
      </Box>
      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
        <Box
          component="span"
          sx={{
            width: '14px',
            height: '12px',
            borderRadius: '2px',
            background: 'repeating-linear-gradient(135deg, #F3F4F6 0 3px, rgba(71,85,105,0.18) 3px 4px)',
          }}
        />
        {t('service')}
      </Box>
      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
        <Box component="span" sx={{ width: '8px', height: '8px', borderRadius: '99px', background: T.amber }} />
        {t('option')}
      </Box>
    </Box>
  );
};

export default Legend;
