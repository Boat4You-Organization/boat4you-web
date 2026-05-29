'use client';

import { Box, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import {
  WeekData,
  fmtPrice,
  statusColor,
  statusLabel,
} from '@/views/Boat/BoatContentSection/AvailabilityTab/LiveCalendar/parts/tier-helpers';
import { T } from '@/views/Boat/BoatContentSection/AvailabilityTab/LiveCalendar/parts/tokens';

interface AvailabilityCardProps {
  /** Adapter-prepared week record (see `tier-helpers.WeekData`). */
  w: WeekData;
  /** Drives the navy outline + lift transform. */
  selected: boolean;
  /** Card click target — fires the standard offer / price calc flow. */
  onClick: (week: WeekData) => void;
  /** Density mode — slightly different padding + price size. */
  size?: 'desktop' | 'mobile';
}

/**
 * One week of the availability widget, rendered as a status-aware card.
 * Mario rule 12.5.2026 — handoff dizajn: `WeekCard` pattern. Status renders
 * as a small pill at the top of the card (centered on desktop), dates stack
 * "From / ↓ 7 NIGHTS / To", price sits below a hairline divider.
 *
 * Desktop sizing tightened 12.5.2026 (Mario rule) so 5 cards + both arrow
 * buttons fit inside the standard yacht-detail content column without
 * horizontal overflow.
 */
const AvailabilityCard = ({ w, selected, onClick, size = 'desktop' }: AvailabilityCardProps) => {
  const isBooked = w.status === 'booked';
  const sc = statusColor(w.status);
  const compact = size !== 'desktop';
  // Narrow `w.regularPrice` (number | undefined) to a plain number so TS
  // accepts it inside `fmtPrice` + the discount math. Also makes the
  // strikethrough guard a clean boolean (avoids the JSX `{0 && jsx}` →
  // literal `0` rendering bug).
  const regular = w.regularPrice ?? 0;
  const showRegular = regular > 0 && w.price > 0 && !isBooked;

  return (
    <Box
      role="button"
      tabIndex={isBooked ? -1 : 0}
      onClick={() => !isBooked && onClick(w)}
      onKeyDown={e => {
        if (!isBooked && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(w);
        }
      }}
      sx={{
        background: T.card,
        borderRadius: compact ? '16px' : '12px',
        padding: compact ? '22px' : '14px 12px',
        border: selected ? `2px solid ${T.navy}` : `1px solid ${T.hair}`,
        boxShadow: selected ? '0 14px 30px -16px rgba(15,30,62,0.30)' : 'none',
        cursor: isBooked ? 'not-allowed' : 'pointer',
        transition: 'transform .15s, box-shadow .15s',
        transform: selected && !compact ? 'translateY(-4px)' : 'none',
        height: '100%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack direction="row" justifyContent="center">
        <Box
          component="span"
          sx={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            color: sc.fg,
            background: sc.bg,
            padding: '3px 8px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {statusLabel(w.status)}
        </Box>
      </Stack>

      <Box sx={{ mt: compact ? '18px' : '12px', textAlign: 'center', fontFeatureSettings: '"tnum"' }}>
        <Typography
          sx={{
            fontSize: compact ? '28px' : '17px',
            fontWeight: 700,
            color: T.ink,
            letterSpacing: '-0.4px',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
          }}
        >
          {w.from}
        </Typography>
        <Typography
          sx={{
            fontSize: compact ? '11px' : '9px',
            color: T.faint,
            margin: compact ? '4px 0' : '2px 0',
            fontWeight: 700,
            letterSpacing: '1.2px',
          }}
        >
          ↓ 7 NIGHTS
        </Typography>
        <Typography
          sx={{
            fontSize: compact ? '28px' : '17px',
            fontWeight: 700,
            color: T.ink,
            letterSpacing: '-0.4px',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
          }}
        >
          {w.to}
        </Typography>
        {compact && (
          <Typography sx={{ fontSize: '12px', color: T.muted, mt: '6px' }}>
            {w.dateFromIso ? dayjs(w.dateFromIso).format('YYYY') : ''} · 7 nights
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          mt: compact ? '22px' : 'auto',
          pt: compact ? '18px' : '10px',
          borderTop: `1px solid ${T.hair}`,
          textAlign: 'center',
        }}
      >
        {!compact && (
          <Typography
            sx={{
              fontSize: '9px',
              fontWeight: 700,
              color: T.muted,
              letterSpacing: '0.7px',
              textTransform: 'uppercase',
            }}
          >
            Per week
          </Typography>
        )}
        {showRegular && (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="baseline"
            gap={compact ? 1 : 0.75}
            sx={{ mt: compact ? '4px' : '4px', mb: compact ? '2px' : '2px' }}
          >
            <Typography
              sx={{
                fontSize: compact ? '14px' : '13px',
                fontWeight: 600,
                color: T.faint,
                textDecoration: 'line-through',
                fontFeatureSettings: '"tnum"',
              }}
            >
              {fmtPrice(regular)}
            </Typography>
            <Box
              component="span"
              sx={{
                fontSize: compact ? '11px' : '12px',
                fontWeight: 800,
                color: T.amber,
                letterSpacing: '0.3px',
                whiteSpace: 'nowrap',
              }}
            >
              −{Math.round(((regular - w.price) / regular) * 100)}%
            </Box>
          </Stack>
        )}
        <Typography
          sx={{
            fontSize: compact ? '32px' : '18px',
            fontWeight: 800,
            letterSpacing: compact ? '-1px' : '-0.5px',
            color: isBooked ? T.faint : T.greenDeep,
            mt: compact ? 0 : '2px',
            fontFeatureSettings: '"tnum"',
            whiteSpace: 'nowrap',
          }}
        >
          {/* Mario rule 12.5.2026: "makni gornju nulu, ostavi donju 0 €".
              Strikethrough regular price already hidden when `price ≤ 0`
              (guard above). Main `0 €` stays even when booked — same colour
              as the row, no strikethrough, no em-dash. */}
          {fmtPrice(w.price)}
        </Typography>
      </Box>
    </Box>
  );
};

export default AvailabilityCard;
