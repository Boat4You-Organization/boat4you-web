'use client';

/* eslint-disable no-nested-ternary -- vendored heatmap tier logic */
import { Box } from '@mui/material';

import { WeekData, fmtPrice, statusLabel, tierBg } from './tier-helpers';
import { T } from './tokens';

interface HeatmapStripProps {
  weeks: WeekData[];
  activeId?: string;
  /** Inclusive-exclusive window highlighted with a faint outline — shows
   *  the user which weeks are currently in the desktop card-grid viewport. */
  visibleRange?: [number, number];
  onCellClick: (week: WeekData, index: number) => void;
  /** Strip height — handoff: 56 px desktop, 36 px mobile. */
  height?: number;
}

/**
 * Single-row colour-tier heatmap of every available week. Click any cell to
 * jump to that period. Status overlays: hatched pattern for `booked`, amber
 * dot for `option`, navy outline for the active selection.
 */
const HeatmapStrip = ({ weeks, activeId, visibleRange, onCellClick, height = 56 }: HeatmapStripProps) => (
  <Box>
    <Box sx={{ display: 'flex', gap: '3px', height: `${height}px` }}>
      {weeks.map((w, i) => {
        const isActive = w.id === activeId;
        const isVisible = visibleRange && i >= visibleRange[0] && i < visibleRange[1];
        const isBooked = w.status === 'booked';
        const isOpt = w.status === 'option';
        const tier = w.tier ?? 0;

        return (
          <Box
            component="button"
            key={w.id}
            onClick={() => !isBooked && onCellClick(w, i)}
            disabled={isBooked}
            title={`${w.from} → ${w.to} · ${fmtPrice(w.price)} · ${statusLabel(w.status)}`}
            aria-label={`Week ${w.from} to ${w.to}, ${fmtPrice(w.price)}, ${statusLabel(w.status)}`}
            sx={{
              flex: 1,
              padding: 0,
              border: 0,
              borderRadius: '6px',
              background: isBooked ? '#F3F4F6' : tierBg(tier),
              outline: isActive ? `2.5px solid ${T.navy}` : isVisible ? '1.5px solid rgba(15,30,62,0.25)' : 'none',
              outlineOffset: isActive ? '1px' : '-1px',
              cursor: isBooked ? 'not-allowed' : 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {isBooked && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '6px',
                  background: 'repeating-linear-gradient(45deg, transparent 0 4px, rgba(0,0,0,0.12) 4px 5px)',
                }}
              />
            )}
            {isOpt && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  width: '6px',
                  height: '6px',
                  borderRadius: '99px',
                  background: T.amber,
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  </Box>
);

export default HeatmapStrip;
