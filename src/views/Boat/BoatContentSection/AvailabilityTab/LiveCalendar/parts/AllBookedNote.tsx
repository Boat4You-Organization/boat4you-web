'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { toggleBoatInquiryModalOpen } from '@/valtio/yacht/yacht.actions';

import { T } from './tokens';

interface AllBookedNoteProps {
  /** Tighter type for the mobile strip area. */
  compact?: boolean;
}

/**
 * The line above the week cards of a boat with no bookable week (owner rule
 * 16.10.2026, showsAllBookedCalendar): every published week is reserved, the
 * inquiry is the way to other dates — its button right there, as the inquiry
 * panel had it. The hatched swatch is the legend's "Reserved" one.
 */
const AllBookedNote = ({ compact = false }: AllBookedNoteProps) => {
  const t = useTranslations('yacht.calendar');
  const tCommon = useTranslations('common');

  return (
    <Stack
      direction={compact ? 'column' : 'row'}
      alignItems="center"
      justifyContent="center"
      flexWrap="wrap"
      gap={compact ? '10px' : '16px'}
    >
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
      <Button size="small" sx={{ flexShrink: 0 }} onClick={() => toggleBoatInquiryModalOpen(true)}>
        {tCommon('sendInquiry')}
      </Button>
    </Stack>
  );
};

export default AllBookedNote;
