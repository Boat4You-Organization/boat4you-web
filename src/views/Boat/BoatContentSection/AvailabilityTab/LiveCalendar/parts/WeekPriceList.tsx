'use client';

import { useMemo } from 'react';

import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';

import { WeekData, fmtPrice, statusColor, statusKey, weekPriceLabel } from './tier-helpers';
import { T } from './tokens';

interface WeekPriceListProps {
  /** The calendar's weeks: the same weeks, in the same order, from the same (live) state. */
  weeks: WeekData[];
}

/** "Sat, 7 Aug 2027" in English (the dayjs form of the cards), the locale's own pattern elsewhere (Intl, as DateTime.formatLong). */
const dayWithYear = (iso: string, locale: string): string =>
  locale.startsWith('en')
    ? dayjs(iso).locale('en').format('ddd, D MMM YYYY')
    : new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(
        dayjs(iso).toDate()
      );

/** "August 2027" in English, the locale's own pattern elsewhere ("kolovoz 2027." in HR). */
const monthWithYear = (iso: string, locale: string): string =>
  locale.startsWith('en')
    ? dayjs(iso).locale('en').format('MMMM YYYY')
    : new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(dayjs(iso).toDate());

/**
 * Every week of the calendar as plain text, grouped by month (owner
 * 26.10.2026): the dates with the year, the nights, the status and the
 * week's total price as its card shows it (the list price struck through and
 * the discount, then the price; a reserved week keeps its price; never
 * "0 €", weekPriceLabel). A closed <details> under the calendar, in the
 * server HTML: a reader that keeps only the text (AI assistants, crawlers)
 * finds the price of any upcoming week on the plain boat URL, not only of the
 * 6-month page the calendar shows.
 *
 * Outside English the dates go through Intl; a browser with another ICU may
 * write them slightly differently, so their text keeps the server's until
 * the weeks change (suppressHydrationWarning).
 */
const WeekPriceList = ({ weeks }: WeekPriceListProps) => {
  const t = useTranslations('yacht');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const byMonth = useMemo(() => {
    const groups = new Map<string, WeekData[]>();

    weeks.forEach(w => {
      if (!w.dateFromIso || !w.dateToIso) return;

      const key = w.dateFromIso.slice(0, 7);

      groups.set(key, [...(groups.get(key) ?? []), w]);
    });

    return [...groups];
  }, [weeks]);

  return (
    <Box component="details" sx={{ mt: '16px' }}>
      {/* Mario 26.10.2026: barely visible for people (the list is long); every week stays in the HTML for search engines and AI assistants. */}
      <Box
        component="summary"
        sx={{
          cursor: 'pointer',
          userSelect: 'none',
          fontSize: '11px',
          color: `${T.navy}73`,
          transition: 'color .15s',
          '&:hover': { color: `${T.navy}B3` },
        }}
      >
        {t('calendar.pricesEveryWeek')}
      </Box>
      <Box sx={{ mt: '12px', display: 'grid', gap: '16px' }}>
        {byMonth.map(([month, monthWeeks]) => (
          <div key={month}>
            <Box
              component="p"
              suppressHydrationWarning
              sx={{
                m: 0,
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                color: T.body,
              }}
            >
              {monthWithYear(`${month}-01`, locale)}
            </Box>
            <Box component="ul" sx={{ m: '4px 0 0', p: 0, listStyle: 'none' }}>
              {monthWeeks.map(w => {
                const from = dayjs(w.dateFromIso);
                const to = dayjs(w.dateToIso);
                // The card's rules (AvailabilityCard): a blocked or locked week
                // shows no list price and its price in grey.
                const isBooked = w.status === 'booked' || w.status === 'service' || !!w.locked;
                const regular = w.regularPrice ?? 0;
                const showRegular = regular > 0 && w.price > 0 && !isBooked;

                return (
                  <Box
                    component="li"
                    key={w.id}
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'baseline',
                      gap: '2px 12px',
                      py: '6px',
                      fontSize: '13px',
                      color: T.navy,
                      borderTop: `1px solid ${T.hair}`,
                      '&:first-of-type': { borderTop: 0 },
                    }}
                  >
                    <Box
                      component="span"
                      suppressHydrationWarning
                      sx={{ flexBasis: { xs: '100%', sm: 'auto' }, minWidth: { sm: '15rem' }, fontWeight: 600 }}
                    >
                      {`${dayWithYear(w.dateFromIso as string, locale)} – ${dayWithYear(w.dateToIso as string, locale)}`}
                    </Box>{' '}
                    <Box component="span" sx={{ color: T.muted, whiteSpace: 'nowrap' }}>
                      {t('calendar.nights', { count: Math.max(1, to.diff(from, 'day')) })} ·{' '}
                      <span style={{ color: statusColor(w.status).fg }}>{t(statusKey(w.status))}</span>
                    </Box>{' '}
                    <Box component="span" sx={{ ml: 'auto', whiteSpace: 'nowrap', fontFeatureSettings: '"tnum"' }}>
                      {showRegular && (
                        <>
                          <s style={{ color: T.muted }}>{fmtPrice(regular, w.currency, locale)}</s>{' '}
                          <span style={{ color: T.amber, fontWeight: 700 }}>
                            {`−${Math.round(((regular - w.price) / regular) * 100)}%`}
                          </span>{' '}
                        </>
                      )}
                      <span style={{ color: isBooked ? T.muted : T.greenDeep, fontWeight: 700 }}>
                        {weekPriceLabel(w, locale, tCommon('priceOnRequest'))}
                      </span>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default WeekPriceList;
