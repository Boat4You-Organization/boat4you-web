'use client';

import React from 'react';

import { Box, ButtonBase, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';

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

const renderStrong = (chunks: React.ReactNode) => (
  <Box component="strong" sx={{ color: '#2d2408' }}>
    {chunks}
  </Box>
);
const renderEm = (chunks: React.ReactNode) => <Box component="em">{chunks}</Box>;

/**
 * "Tip: removing X filter would show +N boats" strip that appears
 * above the result grid per design handoff AI-hint atom. Cream/gold
 * soft bg, light-bulb emoji, with a single `Relax filter` action on
 * the right. Hidden by parent when [delta] is below the surface
 * threshold (≥20 per spec).
 */
const AiHintStrip = ({ filterLabel, delta, onRelax }: AiHintStripProps) => {
  const t = useTranslations('filters');

  return (
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
        {t.rich('relaxTip', { filter: filterLabel, count: delta, b: renderStrong, em: renderEm })}
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
        {t('relaxAction')}
      </ButtonBase>
    </Stack>
  );
};

export default AiHintStrip;
