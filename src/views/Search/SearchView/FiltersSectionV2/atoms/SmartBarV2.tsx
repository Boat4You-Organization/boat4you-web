'use client';

import { Box, ButtonBase, Stack } from '@mui/material';
import dayjs from 'dayjs';

import { searchV2, searchV2Type } from '@/styles/themes/searchV2';

interface SmartBarV2Props {
  /** Total result count from the active search response. */
  liveCount: number | null;
  destination?: string;
  startDate?: string;
  endDate?: string;
  /** Stub — wired in a later iteration. Renders disabled while empty. */
  compareCount?: number;
  onApply?: () => void;
}

/**
 * Sticky main-column header per design handoff Smart bar atom. Dark
 * navy bg, white text. Left side: live result count + search context
 * (destination + dates). Right side: ghost Compare + solid blue Apply
 * filters CTA. The `Apply` button is mostly cosmetic — filters commit
 * automatically on every change — but the handoff calls for it as a
 * UX backstop, so the click is a no-op unless [onApply] is wired.
 */
const SmartBarV2 = ({ liveCount, destination, startDate, endDate, compareCount = 0, onApply }: SmartBarV2Props) => {
  const dateLabel = (() => {
    if (!startDate || !endDate) return null;

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (!start.isValid() || !end.isValid()) return null;

    const sameMonth = start.month() === end.month() && start.year() === end.year();

    return sameMonth
      ? `${start.format('D')}–${end.format('D MMM')}`
      : `${start.format('D MMM')} – ${end.format('D MMM')}`;
  })();

  const summary = (() => {
    const parts: string[] = [];

    if (liveCount != null) parts.push(`${liveCount.toLocaleString('en-US')} boats`);

    if (destination) parts.push(`in ${destination}`);

    if (dateLabel) parts.push(`· ${dateLabel}`);

    return parts.join(' ');
  })();

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        background: searchV2.ink,
        color: '#fff',
        padding: '14px 24px',
        fontFamily: searchV2Type.fontFamily,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
        <Box>
          <Box sx={{ fontSize: 18, fontWeight: 800 }}>{summary || 'Searching boats'}</Box>
          <Box sx={{ fontSize: 12, color: 'rgba(255,255,255,.7)', mt: '2px' }}>Sorted by best fit</Box>
        </Box>
        <Stack direction="row" gap={1}>
          <ButtonBase
            disabled={compareCount === 0}
            sx={{
              background: 'rgba(255,255,255,.1)',
              border: '1px solid rgba(255,255,255,.2)',
              color: '#fff',
              padding: '7px 12px',
              borderRadius: '6px',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: searchV2Type.fontFamily,
              opacity: compareCount === 0 ? 0.6 : 1,
            }}
          >
            Compare ({compareCount})
          </ButtonBase>
          <ButtonBase
            onClick={onApply}
            sx={{
              background: searchV2.brand,
              color: '#fff',
              padding: '7px 14px',
              borderRadius: '6px',
              fontSize: 12,
              fontWeight: 800,
              fontFamily: searchV2Type.fontFamily,
              '&:hover': { background: '#1428e1' },
            }}
          >
            Apply filters
          </ButtonBase>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SmartBarV2;
