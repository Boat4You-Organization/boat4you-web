'use client';

import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { T } from './tokens';

interface AllBookedNoteProps {
  /** Tighter type for the mobile strip area. */
  compact?: boolean;
}

/**
 * The line above the week cards of a boat with no bookable week (owner rule
 * 16.10.2026, showsAllBookedCalendar): every published week is reserved, the
 * inquiry is the way to other dates. The hatched swatch is the legend's
 * "Reserved" one.
 */
const AllBookedNote = ({ compact = false }: AllBookedNoteProps) => {
  const t = useTranslations('yacht.calendar');

  return (
    <Typography
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: compact ? '13px' : '14px',
        fontWeight: 600,
        color: T.body,
        textAlign: 'center',
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{
          flexShrink: 0,
          width: '14px',
          height: '12px',
          borderRadius: '2px',
          background: 'repeating-linear-gradient(45deg, #F3F4F6 0 3px, rgba(0,0,0,0.12) 3px 4px)',
        }}
      />
      {t('allBookedNote')}
    </Typography>
  );
};

export default AllBookedNote;
