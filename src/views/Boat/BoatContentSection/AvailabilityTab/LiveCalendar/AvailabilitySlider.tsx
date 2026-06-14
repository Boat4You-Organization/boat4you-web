'use client';

/* Vendored from the catamaran sites' availability widget — keeps its original
   structure (main component above its desktop/mobile sub-components, a couple
   of nested ternaries, a DOM ScrollBehavior type). Disabling these stylistic
   rules for the port rather than rewriting proven logic. */
/* eslint-disable @typescript-eslint/no-use-before-define, consistent-return, no-undef */
import { startTransition, useActionState, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Box, Stack, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

import { getSingleYachtStandardOffers } from '@/actions/yacht.actions';
import AvailabilityCard from '@/components/AvailabilityCard';
import { Currency } from '@/models/user.model';
import { Status, YachtOfferModel } from '@/models/yacht-offer.model';
import { YachtModel } from '@/models/yacht.model';
import useBreakpoint from '@/utils/hooks/useBreakpoint';
import useQueryParams from '@/utils/hooks/useQueryParams';
import DateTime from '@/utils/static/DateTime';
import { useUserStore } from '@/valtio/user/user.store';
import { setselectedOffer } from '@/valtio/yacht/yacht.actions';

import ArrowBtn from './parts/ArrowBtn';
import HeatmapStrip from './parts/HeatmapStrip';
import Legend from './parts/Legend';
import MonthAxis from './parts/MonthAxis';
import { WeekData, monthAxis as deriveMonthAxis, withTiers } from './parts/tier-helpers';
import { T } from './parts/tokens';

dayjs.extend(weekOfYear);

interface AvailabilitySliderProps {
  yacht: YachtModel;
}

// ────────────────────────────────────────────────────────────────────────────
//  Adapter — turn the partner's published `YachtOfferModel[]` (any check-in day,
//  any length) into the widget's `WeekData[]` shape. Honest 4-state mapping:
//      Status.FREE        → 'available'  (selectable → reserve)
//      Status.OPTION      → 'option'     (selectable → inquiry)
//      Status.RESERVATION → 'booked'     (hard-block, red/hatched)
//      Status.SERVICE     → 'service'    (hard-block, slate, distinct tier)
//      Status.UNAVAILABLE → 'booked'     (legacy fallback, hard-block)
//  Display labels (`from`, `to`, `fromMonth`) come from dayjs to stay locale-
//  consistent with the rest of the detail page.
// ────────────────────────────────────────────────────────────────────────────

const mapStatus = (s: Status | undefined): WeekData['status'] => {
  if (s === Status.OPTION) return 'option';

  if (s === Status.SERVICE) return 'service';

  if (s === Status.RESERVATION || s === Status.UNAVAILABLE) return 'booked';

  return 'available';
};

const toWeek = (offer: YachtOfferModel): WeekData => {
  const from = dayjs(offer.dateFrom);
  const to = dayjs(offer.dateTo);
  // Use the currency-converted amounts from the partner price-info (the backend
  // converts when the fetch passes ?currency=), falling back to the EUR fields.
  // `currency` drives the card symbol so AUD/USD/... render correctly instead of
  // a hardcoded €. clientPriceInfo.currency is the source of truth for the unit.
  const finalPrice =
    offer.clientPriceInfo?.amount ?? (typeof offer.clientPriceEur === 'number' ? offer.clientPriceEur : 0);
  // Original ("list") rate before the offered price. boat4you's
  // `/standard-offers` ships per-week list price, so we use it directly — no
  // uniform yacht-wide ratio approximation like the catamaran/EY port did.
  // Struck-through + savings % render only when the list price is genuinely
  // above the final price, matching the Europe Yachts card (list · −% · final).
  const listPrice = offer.listPriceInfo?.amount ?? (typeof offer.listPriceEur === 'number' ? offer.listPriceEur : 0);
  const regularPrice = listPrice > finalPrice ? listPrice : undefined;

  return {
    id: String(offer.id ?? `${offer.dateFrom}|${offer.dateTo}`),
    from: from.format('MMM DD'),
    to: to.format('MMM DD'),
    fromMonth: from.format('MMM'),
    price: finalPrice,
    regularPrice,
    currency: offer.clientPriceInfo?.currency,
    status: mapStatus(offer.status as Status),
    raw: offer,
    dateFromIso: offer.dateFrom,
    dateToIso: offer.dateTo,
  };
};

const AvailabilitySlider = ({ yacht }: AvailabilitySliderProps) => {
  const { isBelowLg } = useBreakpoint();
  const [standardOffers, standardOffersAction] = useActionState(getSingleYachtStandardOffers, []);
  const safeYachtOffers = useMemo(() => (Array.isArray(standardOffers) ? standardOffers : []), [standardOffers]);
  // boat4you selects a week by writing startDate/endDate to the URL — the
  // blue AvailabilityDateSelector + offer detail card react to those params
  // (same channel the legacy week-cards picker used). No valtio date actions
  // here (boat4you doesn't expose them).
  const { setMultipleParams, params } = useQueryParams();
  const { user } = useUserStore();
  // Currency precedence mirrors useStandardOffers: logged-in user preference,
  // then the ?currency= URL param, else EUR. Drives both the fetch (so the
  // backend converts) and the rendered symbol.
  const currency = user?.currency || (params.currency as Currency) || Currency.EUR;

  const fetchOffersForCurrentParams = useCallback(() => {
    const startDate = DateTime.now();

    startTransition(() => {
      standardOffersAction({
        yachtSlug: yacht.slug,
        dateFrom: DateTime.formatFull(startDate as Dayjs),
        // 18-month horizon (Mario rule 12.5.2026) — klijent treba moći
        // scroll-ati u sljedeću sezonu (npr. August 2027) iz spring 2026.
        dateTo: DateTime.formatFull(startDate?.add(18, 'month') as Dayjs),
        currency,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yacht.slug, currency]);

  useEffect(() => {
    fetchOffersForCurrentParams();
  }, [fetchOffersForCurrentParams]);

  // Honest availability (Deploy 4): render EXACTLY the periods the partner
  // published — any check-in day, any length — sorted chronologically so the
  // strip reads left-to-right. No Saturday→Saturday scaffold: gaps are simply
  // absent rather than synthesized as fake "booked" weeks (which mis-stated
  // non-Sat-Sat fleets, e.g. MMK OfferType.OTHER, as all-grey). The chunk math
  // below (26 weeks ≈ 6 months) slices whatever array length results.
  const weeks = useMemo<WeekData[]>(() => {
    const published = [...safeYachtOffers].sort((a, b) => a.dateFrom.localeCompare(b.dateFrom));

    return withTiers(published.map(toWeek));
  }, [safeYachtOffers]);

  const months = useMemo(() => deriveMonthAxis(weeks), [weeks]);

  // Selected week pointer. Initialised once weeks arrive — pick the URL
  // period (yacht-detail page sets it from `?startDate=…&endDate=…`) by
  // matching the dateFromIso/dateToIso, otherwise default to the first
  // available row.
  const [selId, setSelId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!weeks.length || selId) return;

    const search = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
    const start = search.get('startDate');
    const end = search.get('endDate');
    const urlMatch = start && end ? weeks.find(w => w.dateFromIso === start && w.dateToIso === end) : null;
    const firstAvail = weeks.find(w => w.status !== 'booked' && w.status !== 'service');

    setSelId(urlMatch?.id ?? firstAvail?.id ?? weeks[0]?.id);
  }, [weeks, selId]);

  const handleSelect = useCallback(
    (w: WeekData) => {
      if (w.status === 'booked' || w.status === 'service') return;

      setSelId(w.id);

      // Select the offer in the store → BoatContentSection's selectedOffer
      // effect recalculates the price, which is what enables the "Reserve"
      // button + total. Without this the picked week sets dates but Reserve
      // stays disabled (only `yacht.offers[0]` was ever priced).
      const raw = w.raw as YachtOfferModel | undefined;

      if (raw?.id) setselectedOffer(raw);

      // Also reflect the week in the URL so the blue date selector shows it.
      if (w.dateFromIso && w.dateToIso) {
        setMultipleParams({
          startDate: DateTime.formatFull(dayjs(w.dateFromIso)),
          endDate: DateTime.formatFull(dayjs(w.dateToIso)),
        });
      }
    },
    [setMultipleParams]
  );

  if (!weeks.length) return null;

  return isBelowLg ? (
    <AvailabilityMobile weeks={weeks} months={months} selId={selId} onSelect={handleSelect} />
  ) : (
    <AvailabilityDesktop weeks={weeks} months={months} selId={selId} onSelect={handleSelect} />
  );
};

// ────────────────────────────────────────────────────────────────────────────
//  DESKTOP
// ────────────────────────────────────────────────────────────────────────────

interface BranchProps {
  weeks: WeekData[];
  months: string[];
  selId: string | undefined;
  onSelect: (w: WeekData) => void;
}

const VISIBLE_COUNT = 5;
/** Heatmap chunk size — Mario rule 12.5.2026: pokazati 6 mjeseci odjednom
 *  + dvije strelice za skok na sljedećih ili prethodnih 6 mjeseci (18-mjesečni
 *  horizon → 3 chunka). 26 weeks ≈ 6 months (4.33 weeks/month). */
const WEEKS_PER_CHUNK = 26;

const AvailabilityDesktop = ({ weeks, selId, onSelect }: BranchProps) => {
  const totalChunks = Math.max(1, Math.ceil(weeks.length / WEEKS_PER_CHUNK));
  const [chunkIdx, setChunkIdx] = useState(0);

  // When selId changes from outside, snap to the chunk that contains it.
  useEffect(() => {
    if (!selId) return;

    const idx = weeks.findIndex(w => w.id === selId);

    if (idx < 0) return;

    const target = Math.floor(idx / WEEKS_PER_CHUNK);

    setChunkIdx(prev => (prev === target ? prev : target));
  }, [selId, weeks]);

  const chunkStart = chunkIdx * WEEKS_PER_CHUNK;
  const chunkEnd = Math.min(weeks.length, chunkStart + WEEKS_PER_CHUNK);
  const chunkWeeks = useMemo(() => weeks.slice(chunkStart, chunkEnd), [weeks, chunkStart, chunkEnd]);
  const chunkMonths = useMemo(() => {
    const labels: string[] = [];

    chunkWeeks.forEach(w => {
      if (!labels.includes(w.fromMonth)) labels.push(w.fromMonth);
    });

    return labels;
  }, [chunkWeeks]);

  // Window pointer is RELATIVE to the current chunk (0..chunkWeeks.length-5).
  const [windowStart, setWindowStart] = useState(0);

  // Reset window when chunk changes — start each new 6-month view from its
  // first card, then re-centre on selection within the chunk.
  useEffect(() => {
    if (!selId) {
      setWindowStart(0);

      return;
    }

    const idxInChunk = chunkWeeks.findIndex(w => w.id === selId);

    if (idxInChunk < 0) {
      setWindowStart(0);

      return;
    }

    setWindowStart(prev => {
      if (idxInChunk >= prev && idxInChunk < prev + VISIBLE_COUNT) return prev;

      return Math.max(0, Math.min(chunkWeeks.length - VISIBLE_COUNT, idxInChunk - Math.floor(VISIBLE_COUNT / 2)));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunkIdx, selId]);

  const scroll = (dir: 1 | -1) => {
    setWindowStart(s => Math.max(0, Math.min(chunkWeeks.length - VISIBLE_COUNT, s + dir)));
  };

  const onCellClick = (w: WeekData, idxInChunk: number) => {
    setWindowStart(
      Math.max(0, Math.min(chunkWeeks.length - VISIBLE_COUNT, idxInChunk - Math.floor(VISIBLE_COUNT / 2)))
    );
    onSelect(w);
  };

  // Chunk label — e.g. "MAY 2026 → OCT 2026". Year always shown so the
  // user knows which season they're scrolling through; using the LAST
  // week's `dateToIso` for the right-hand month so the label reflects the
  // actual closing edge of the 6-month window.
  const chunkLabel = useMemo(() => {
    const first = chunkWeeks[0];
    const last = chunkWeeks[chunkWeeks.length - 1];

    if (!first || !last) return '';

    const parseMonth = (iso?: string) => {
      if (!iso) return { m: '', y: '' };

      const d = dayjs(iso);

      return { m: d.format('MMM').toUpperCase(), y: d.format('YYYY') };
    };
    const from = parseMonth(first.dateFromIso);
    // Use `dateToIso` of the last week so "OCT 24 → 31" reads as OCT
    // rather than slipping into NOV because the start dayjs falls on Oct 31.
    const to = parseMonth(last.dateToIso ?? last.dateFromIso);

    if (from.y === to.y) {
      return `${from.m} → ${to.m} ${from.y}`;
    }

    return `${from.m} ${from.y} → ${to.m} ${to.y}`;
  }, [chunkWeeks]);

  return (
    <Box sx={{ fontFamily: 'inherit' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        sx={{ mb: '24px', gap: '12px 20px' }}
      >
        <Typography
          sx={{
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '1.4px',
            color: T.muted,
            textTransform: 'uppercase',
          }}
        >
          Season at a glance · tap a week to jump
        </Typography>
        <Legend />
      </Stack>

      {/* Chunk navigation — 6-month "page" switcher. */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: '16px', gap: '12px' }}>
        <ArrowBtn dir="<" onClick={() => setChunkIdx(c => Math.max(0, c - 1))} disabled={chunkIdx === 0} />
        <Typography
          sx={{
            flex: 1,
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '1.2px',
            color: T.navy,
            textTransform: 'uppercase',
            fontFeatureSettings: '"tnum"',
          }}
        >
          {chunkLabel}
          <Box component="span" sx={{ ml: '10px', color: T.faint, fontSize: '11px', letterSpacing: '0.8px' }}>
            {chunkIdx + 1} of {totalChunks}
          </Box>
        </Typography>
        <ArrowBtn
          dir=">"
          onClick={() => setChunkIdx(c => Math.min(totalChunks - 1, c + 1))}
          disabled={chunkIdx === totalChunks - 1}
        />
      </Stack>

      <Box
        sx={{
          background: T.card,
          borderRadius: '16px',
          padding: '22px 24px 18px',
          border: `1px solid ${T.hair}`,
        }}
      >
        <HeatmapStrip
          weeks={chunkWeeks}
          activeId={selId}
          visibleRange={[windowStart, windowStart + VISIBLE_COUNT]}
          onCellClick={onCellClick}
          height={56}
        />
        <MonthAxis labels={chunkMonths} />
      </Box>
      <Box sx={{ mt: '24px', display: 'flex', alignItems: 'stretch', gap: '12px' }}>
        <ArrowBtn dir="<" onClick={() => scroll(-1)} disabled={windowStart === 0} />
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'grid',
            gridTemplateColumns: `repeat(${VISIBLE_COUNT}, minmax(0, 1fr))`,
            gap: '14px',
          }}
        >
          {chunkWeeks.slice(windowStart, windowStart + VISIBLE_COUNT).map(w => (
            <AvailabilityCard key={w.id} w={w} selected={w.id === selId} onClick={onSelect} size="desktop" />
          ))}
        </Box>
        <ArrowBtn dir=">" onClick={() => scroll(1)} disabled={windowStart >= chunkWeeks.length - VISIBLE_COUNT} />
      </Box>
    </Box>
  );
};

// ────────────────────────────────────────────────────────────────────────────
//  MOBILE
// ────────────────────────────────────────────────────────────────────────────

type MobileProps = BranchProps;

const AvailabilityMobile = ({ weeks, selId, onSelect }: MobileProps) => {
  const totalChunks = Math.max(1, Math.ceil(weeks.length / WEEKS_PER_CHUNK));
  const [chunkIdx, setChunkIdx] = useState(0);

  // Snap chunk to whichever holds the selected week (initial mount + URL period).
  useEffect(() => {
    if (!selId) return;

    const idx = weeks.findIndex(w => w.id === selId);

    if (idx < 0) return;

    const target = Math.floor(idx / WEEKS_PER_CHUNK);

    setChunkIdx(prev => (prev === target ? prev : target));
  }, [selId, weeks]);

  const chunkStart = chunkIdx * WEEKS_PER_CHUNK;
  const chunkEnd = Math.min(weeks.length, chunkStart + WEEKS_PER_CHUNK);
  const chunkWeeks = useMemo(() => weeks.slice(chunkStart, chunkEnd), [weeks, chunkStart, chunkEnd]);
  const chunkMonths = useMemo(() => {
    const labels: string[] = [];

    chunkWeeks.forEach(w => {
      if (!labels.includes(w.fromMonth)) labels.push(w.fromMonth);
    });

    return labels;
  }, [chunkWeeks]);

  // `active` is the index of the currently-snapped card RELATIVE to chunk.
  const [active, setActive] = useState(0);
  const [scrollerEl, setScrollerEl] = useState<HTMLDivElement | null>(null);
  // Guard so user-driven swipe scroll updates `active` from scroll position,
  // but programmatic `scrollTo` from arrow clicks doesn't fight back through
  // the scroll listener.
  const programmaticScrollRef = useRef(false);

  const cardSlotWidth = () => {
    const firstChild = scrollerEl?.firstChild as HTMLElement | null;
    const card = firstChild?.firstChild as HTMLElement | null;

    return (card?.offsetWidth ?? 280) + 12;
  };

  const goToIdx = (i: number, behavior: ScrollBehavior = 'smooth') => {
    const clamped = Math.max(0, Math.min(chunkWeeks.length - 1, i));

    setActive(clamped);

    if (scrollerEl) {
      programmaticScrollRef.current = true;
      scrollerEl.scrollTo({ left: clamped * cardSlotWidth(), behavior });
      // Release guard after a beat — smooth scroll fires multiple events.
      window.setTimeout(() => {
        programmaticScrollRef.current = false;
      }, 400);
    }
  };

  // On chunk change → reset to first card (or matching selId within chunk)
  // AND scroll the strip to that position immediately (no animation).
  useEffect(() => {
    const idxInChunk = selId ? chunkWeeks.findIndex(w => w.id === selId) : -1;
    const target = idxInChunk >= 0 ? idxInChunk : 0;

    setActive(target);

    if (scrollerEl) {
      programmaticScrollRef.current = true;
      // Defer one frame so the new chunkWeeks have rendered + scroller has
      // the correct scrollWidth for the new content.
      requestAnimationFrame(() => {
        scrollerEl.scrollTo({ left: target * cardSlotWidth(), behavior: 'auto' });
        window.setTimeout(() => {
          programmaticScrollRef.current = false;
        }, 100);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunkIdx]);

  // Re-sync active when selId flips (heatmap selection) — but only when the
  // selected week sits inside the current chunk (the chunkIdx effect above
  // handles the cross-chunk case).
  useEffect(() => {
    if (!selId) return;

    const idxInChunk = chunkWeeks.findIndex(w => w.id === selId);

    if (idxInChunk < 0) return;

    goToIdx(idxInChunk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selId, chunkWeeks]);

  // Track user-driven scroll → active card (ignored during programmatic scroll).
  useEffect(() => {
    if (!scrollerEl) return;

    let raf = 0;
    const onScroll = () => {
      if (programmaticScrollRef.current) return;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const slot = cardSlotWidth();
        const idx = Math.round(scrollerEl.scrollLeft / slot);

        setActive(prev => {
          const next = Math.max(0, Math.min(chunkWeeks.length - 1, idx));

          return next === prev ? prev : next;
        });
      });
    };

    scrollerEl.addEventListener('scroll', onScroll, { passive: true });

    return () => scrollerEl.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollerEl, chunkWeeks.length]);

  // Chunk label "MAY → OCT 2026" (year suffix; expand to dual-year when chunk
  // spans Dec/Jan boundary).
  const chunkLabel = useMemo(() => {
    const first = chunkWeeks[0];
    const last = chunkWeeks[chunkWeeks.length - 1];

    if (!first || !last) return '';

    const parseMonth = (iso?: string) => {
      if (!iso) return { m: '', y: '' };

      const d = dayjs(iso);

      return { m: d.format('MMM').toUpperCase(), y: d.format('YYYY') };
    };
    const from = parseMonth(first.dateFromIso);
    const to = parseMonth(last.dateToIso ?? last.dateFromIso);

    return from.y === to.y ? `${from.m} → ${to.m} ${from.y}` : `${from.m} ${from.y} → ${to.m} ${to.y}`;
  }, [chunkWeeks]);

  return (
    <Box sx={{ fontFamily: 'inherit', background: T.card }}>
      {/* Mobile header "Availability & price" + subtitle removed 12.5.2026
          per Mario — parent `YachtAvailability` already renders the
          "Availability" + LIVE pill row above the widget, so the duplicate
          read as noise. */}
      <Box sx={{ padding: '16px 16px 8px' }}>
        {/* Chunk navigation (mirrors desktop "page" switcher). */}
        <Stack direction="row" alignItems="center" sx={{ padding: '0 4px 10px', gap: '10px' }}>
          <ArrowBtn
            dir="<"
            onClick={() => setChunkIdx(c => Math.max(0, c - 1))}
            disabled={chunkIdx === 0}
            size="mobile"
          />
          <Box
            sx={{
              flex: 1,
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: T.navy,
              fontFeatureSettings: '"tnum"',
              lineHeight: 1.2,
            }}
          >
            {chunkLabel}
            <Box
              component="span"
              sx={{ display: 'block', mt: '2px', color: T.faint, fontSize: '10px', letterSpacing: '0.8px' }}
            >
              {chunkIdx + 1} of {totalChunks}
            </Box>
          </Box>
          <ArrowBtn
            dir=">"
            onClick={() => setChunkIdx(c => Math.min(totalChunks - 1, c + 1))}
            disabled={chunkIdx === totalChunks - 1}
            size="mobile"
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ padding: '0 4px 12px' }}>
          <Box
            sx={{ fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: T.muted }}
          >
            {chunkWeeks.length} weeks
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              display: 'inline-flex',
              gap: '6px',
              padding: '4px 10px 4px 8px',
              borderRadius: '999px',
              background: T.greenSoft,
              color: T.greenDeep,
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
            }}
          >
            <Box
              component="span"
              sx={{
                width: '6px',
                height: '6px',
                borderRadius: '99px',
                background: T.greenDeep,
                boxShadow: `0 0 0 3px ${T.greenSoft}, 0 0 0 4px ${T.green}40`,
              }}
            />
            Live
          </Stack>
        </Stack>
        <Box
          sx={{
            background: T.card,
            borderRadius: '14px',
            padding: '12px 12px 10px',
            border: `1px solid ${T.hair}`,
          }}
        >
          <HeatmapStrip
            weeks={chunkWeeks}
            activeId={selId}
            visibleRange={[active, active + 1]}
            onCellClick={(w, i) => {
              goToIdx(i);
              onSelect(w);
            }}
            height={36}
          />
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mt: '6px', fontSize: '10px', color: T.faint, fontWeight: 600, letterSpacing: '0.8px' }}
          >
            {chunkMonths.map(m => (
              <Box component="span" key={m}>
                {m.toUpperCase()}
              </Box>
            ))}
          </Stack>
          <Box sx={{ mt: '12px' }}>
            <Legend compact />
          </Box>
        </Box>
      </Box>
      <Box
        ref={setScrollerEl}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          padding: '6px 16px 20px',
          gap: '12px',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Box sx={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
          {chunkWeeks.map((w, i) => {
            const isAct = i === active;

            return (
              <Box
                key={w.id}
                sx={{
                  scrollSnapAlign: 'center',
                  flexShrink: 0,
                  width: '280px',
                  transition: 'all .2s',
                  transform: isAct ? 'scale(1)' : 'scale(0.96)',
                  opacity: isAct ? 1 : 0.7,
                }}
              >
                <AvailabilityCard w={w} selected={w.id === selId} onClick={onSelect} size="mobile" />
              </Box>
            );
          })}
        </Box>
      </Box>
      <Stack direction="row" justifyContent="center" sx={{ gap: '16px', padding: '0 16px 16px' }}>
        <ArrowBtn dir="<" onClick={() => goToIdx(active - 1)} disabled={active === 0} size="mobile" />
        <Box
          sx={{
            flex: 1,
            textAlign: 'center',
            fontSize: '13px',
            color: T.muted,
            fontWeight: 600,
            alignSelf: 'center',
            fontFeatureSettings: '"tnum"',
          }}
        >
          {(() => {
            const w = chunkWeeks[active];

            if (!w?.dateFromIso) return null;

            const d = dayjs(w.dateFromIso);

            return (
              <>
                Week{' '}
                <Box component="span" sx={{ color: T.navy, fontWeight: 700 }}>
                  {d.week()}
                </Box>
                {' · '}
                <Box component="span" sx={{ color: T.faint }}>
                  {d.format('YYYY')}
                </Box>
              </>
            );
          })()}
        </Box>
        <ArrowBtn
          dir=">"
          onClick={() => goToIdx(active + 1)}
          disabled={active === chunkWeeks.length - 1}
          size="mobile"
        />
      </Stack>
    </Box>
  );
};

export default AvailabilitySlider;
