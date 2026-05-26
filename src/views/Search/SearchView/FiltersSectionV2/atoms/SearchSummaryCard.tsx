'use client';

import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';

import { searchV2, searchV2Type } from '@/styles/themes/searchV2';

interface SearchSummaryCardProps {
  destination: string;
  startDate?: string;
  endDate?: string;
  /** Total boats in current candidate set (from the search response).
   *  Pass `null` to suppress the pill while loading. */
  liveCount: number | null;
}

/**
 * Top sidebar card with the user's current search context per design
 * handoff Search summary atom. Cream gradient bg, eyebrow + destination
 * + dates, and a "live count" pill (blue circle with N + green pulse
 * dot). The pulse is a static box-shadow ring — keeping it CSS-only
 * dodges layout shift and avoids an animation library dep.
 */
const SearchSummaryCard = ({ destination, startDate, endDate, liveCount }: SearchSummaryCardProps) => {
  const t = useTranslations('filters');
  const locale = useLocale();
  const dateLabel = (() => {
    if (!startDate || !endDate) return null;

    const start = dayjs(startDate).locale(locale);
    const end = dayjs(endDate).locale(locale);

    if (!start.isValid() || !end.isValid()) return null;

    const nights = end.diff(start, 'day');
    const sameMonth = start.month() === end.month() && start.year() === end.year();
    const startFmt = sameMonth ? start.format('D') : start.format('D MMM');
    const endFmt = end.format('D MMM YYYY');
    const range = t('dateRange', { start: startFmt, end: endFmt });
    const nightsText = t('nightsCount', { count: nights });

    return `${range} · ${nightsText}`;
  })();

  return (
    <Box
      sx={{
        padding: '18px 20px',
        borderBottom: `1px solid ${searchV2.line}`,
        background: 'linear-gradient(180deg, #fbf9f4 0%, #fff 100%)',
      }}
    >
      <Box sx={{ ...searchV2Type.sectionLabel, color: searchV2.inkSoft, mb: '6px' }}>{t('yourSearch')}</Box>
      <Box sx={{ fontSize: 14, fontWeight: 700, color: searchV2.ink, lineHeight: 1.3 }}>
        {destination || t('allDestinations')}
      </Box>
      {dateLabel && <Box sx={{ fontSize: 12.5, color: searchV2.inkSoft, mt: '2px' }}>{dateLabel}</Box>}
      <Box
        sx={{
          mt: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 10px',
          background: searchV2.brandSoft,
          borderRadius: '6px',
        }}
      >
        <Box
          sx={{
            // Pill width grows with the digit count — 22px circle for
            // ≤2 digits, expands to a horizontal capsule for 3+ so
            // numbers like "4,195" don't overflow the brand-soft bg.
            minWidth: 22,
            height: 22,
            borderRadius: '11px',
            background: searchV2.brand,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 800,
            fontVariantNumeric: 'tabular-nums',
            padding: '0 7px',
            whiteSpace: 'nowrap',
          }}
        >
          {liveCount != null ? liveCount.toLocaleString('en-US') : '—'}
        </Box>
        <Box sx={{ fontSize: 12, color: searchV2.ink, fontWeight: 500, flex: 1 }}>{t('boatsAvailableLive')}</Box>
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: searchV2.livePulse,
            boxShadow: `0 0 0 4px ${searchV2.livePulse}33`,
          }}
        />
      </Box>
    </Box>
  );
};

export default SearchSummaryCard;
