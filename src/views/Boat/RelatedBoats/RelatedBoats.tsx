import { Box, Container, Grid, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';

import BoatListingItemCard from '@/components/BoatListingItemCard';
import { Currency, UserModel } from '@/models/user.model';
import { MeasurementInfo, MeasurementUnit } from '@/models/yacht-feature.model';
import { MatchKind, VesselType, YachtModel, YachtModelShortInfo, isVesselType } from '@/models/yacht.model';
import { fetchYachts } from '@/services/yacht.service';
import { rotateCandidates } from '@/utils/static/relatedRotation';

/**
 * "You might also like" — up to 3 boats from the SAME marina, sized like
 * the current one. Pool comes from the regular /public/yachts listing
 * filtered by the marina's did; the ±5 ft window mirrors the sister-site
 * RelatedYachts rule (Mario 12.5.2026). Renders nothing when
 * the marina id is unknown or the pool is empty — never an empty shell.
 *
 * Same vessel type first (Codex re-audit 2.10.2026: a Bavaria Cruiser 41
 * monohull sat next to the Lagoon 39 "Gin Tonic" catamaran): the pool is
 * asked for the boat's own type, and the marina's other types only fill up
 * when fewer than three same-type boats fit the ±5 ft window.
 *
 * A dated boat page (`?startDate=&endDate=`) asks the pool for the same
 * period, with the request shape of a dated search: the cards then show that
 * period's price and availability, and link to it — before, an undated pool
 * linked every card to the boat's own next free week (10.–17.10. on a page
 * for 17.–24.10.). Undated pages keep the weekly-priced undated pool, and so
 * do pages whose period has started already (an old shared link) or whose
 * dated pool comes back empty — the section then still shows the marina's
 * boats instead of disappearing (review 6.10.2026).
 *
 * Which of the fitting boats: the ones after this boat on a fixed ring
 * (relatedRotation.ts, 7.10.2026), over every boat of the type at the marina
 * within ±5 ft. It used to be the closest lengths among the first 12 of the
 * listing — every boat at a marina linked the same three boats and the rest
 * of its fleet got no internal link. The API is asked for the ±5 ft window
 * only, and every page of it is read (usually 1–2 of 100): one page of the
 * whole marina, in the listing's order, left 973 boats of six big groups out
 * of every page's choice (review 7.10.2026; Sukošan 248, Alimos 428 + 268,
 * Lefkas 269, Kornati 219, ACI Split 141 boats of one type).
 * The undated pool is a cached read (10 min, one entry for all nine
 * locales, like the landings), so the extra pages do not reach the backend
 * on every view. The ±5 ft rule still decides who fits; the ring only
 * decides which of them this page shows.
 */

const M_PER_FT = 0.3048;
const TOLERANCE_FT = 5;

/**
 * One attempt, at most 2 s (review of audit 1.10.2026): the pool is a
 * /public/yachts listing, which the backend sheds with 503 + Retry-After when
 * its listing slots are busy (after up to 1.5 s in its queue). With the usual
 * retries that held every boat page ~9.5 s before rendering it without this
 * section anyway — an optional block never delays the page by more than 2 s.
 */
const RELATED_DEADLINE_MS = 2_000;

/** A fill-up request is only worth starting with this much of the deadline left. */
const MIN_FILL_MS = 400;

const RELATED_COUNT = 3;

/**
 * One page of the pool — the API's page cap (measured 7.10.2026: 0.23 s and
 * 100 KB for a page of 100). Every page of the ±5 ft window is read.
 */
const POOL_PAGE_SIZE = 100;

/**
 * At most this many pages of one window (500 boats). A ±5 ft window of one
 * type at one marina is 1–3 pages (7.10.2026: Sukošan sailing yachts 37–48 ft
 * 164 boats, Alimos 40–51 ft 280); the cap bounds a window without a length.
 */
const MAX_POOL_PAGES = 5;

/** The undated pool's Data Cache window (s): the landings' order of magnitude. */
const POOL_REVALIDATE_SECONDS = 600;

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

type Period = { startDate: string; endDate: string };

/**
 * The page's charter period when it carries a usable one: two plain
 * YYYY-MM-DD days, the end after the start, the start not in the past (a
 * repeated or malformed parameter, or a week gone by, leaves the pool undated
 * rather than sending it to the API).
 */
const pagePeriod = (startDate: unknown, endDate: unknown): Period | null =>
  typeof startDate === 'string' &&
  typeof endDate === 'string' &&
  ISO_DAY.test(startDate) &&
  ISO_DAY.test(endDate) &&
  endDate > startDate &&
  startDate >= new Date().toISOString().slice(0, 10)
    ? { startDate, endDate }
    : null;

/**
 * A boat's length in feet for the ±5 ft rule — from the metres first:
 * `length` is metres in every locale, `lengthInfo` feet for `en` and metres
 * otherwise, and the two can disagree (7.10.2026: Oceanis 461 Seagul 46.0 ft
 * in `en`, 14.0 m = 45.93 ft in `de` — two API windows, two cache entries,
 * possibly other boats). From the metres, the rule, the API window and its
 * cache entry are the same in all nine locales.
 */
const yachtLengthFt = (info: MeasurementInfo | null | undefined, metric: number | null | undefined): number | null => {
  if (typeof metric === 'number' && Number.isFinite(metric) && metric > 0) return metric / M_PER_FT;

  if (info && info.unit === MeasurementUnit.FEET && Number.isFinite(info.amount)) return info.amount;

  if (info && info.unit === MeasurementUnit.METRE && Number.isFinite(info.amount)) return info.amount / M_PER_FT;

  return null;
};

/**
 * The ±5 ft window as the API's `minLength` / `maxLength`. The API reads
 * them in the request language's unit — feet for `en`, metres for every
 * other locale (checked 7.10.2026: `hr` read 40–50 as metres) — so whole
 * units, rounded outwards; the exact ±5 ft rule is applied to the rows
 * afterwards (a boat without a length no longer fills a slot of a boat with
 * one). Null (no length filter) when the boat's own length is unknown.
 */
const apiLengthWindow = (lengthFt: number | null, inFeet: boolean): { minLength: number; maxLength: number } | null => {
  if (lengthFt == null) return null;

  const unit = inFeet ? 1 : M_PER_FT;

  return {
    minLength: Math.max(0, Math.floor((lengthFt - TOLERANCE_FT) * unit)),
    maxLength: Math.ceil((lengthFt + TOLERANCE_FT) * unit),
  };
};

interface RelatedBoatsProps {
  yacht: YachtModel;
  user: UserModel | null;
  locale: string;
  currency: Currency;
  /** The page's `?startDate=` / `?endDate=` (raw request values). */
  startDate?: unknown;
  endDate?: unknown;
}

const RelatedBoats = async ({ yacht, user, locale, currency, startDate, endDate }: RelatedBoatsProps) => {
  // Detail payloads ship `locations: []` — the usable did lives on
  // `location.id` ("l-2026"-style, marina-prefixed).
  const marinaDid = yacht.location?.id ?? yacht.locations?.[0]?.id;

  if (marinaDid == null) return null;

  const period = pagePeriod(startDate, endDate);
  const vesselType = isVesselType(yacht.vesselType) ? yacht.vesselType : null;
  const deadline = Date.now() + RELATED_DEADLINE_MS;
  const currentLenFt = yachtLengthFt(yacht.lengthInfo, yacht.length);

  // Dated page: the dated search's request (startDate/endDate, no
  // priceBasis), live (no-store) and one page — it mirrors partner state on
  // every view. Undated: weekly prices, like the landings (audit B16) — 44
  // of 145 similar-boat cards read "Price for 3 days 23 €" before — read
  // through the Data Cache, which asks the API in `en` (feet) for every
  // locale and turns the lengths back into metres (fetchYachts), and every
  // page of the window. null = the first request failed (503 shed, timeout);
  // a later page that fails only leaves its boats out.
  const fetchPool = async (
    poolPeriod: Period | null,
    boatTypes: VesselType[] | undefined,
    timeoutMs: number
  ): Promise<YachtModelShortInfo[] | null> => {
    const cached = !poolPeriod;
    const lengthWindow = apiLengthWindow(currentLenFt, cached || locale === 'en');
    const readPage = (page: number, singleAttemptMs: number) =>
      fetchYachts(
        {
          locations: [],
          did: [String(marinaDid)],
          size: POOL_PAGE_SIZE,
          page,
          ...(boatTypes ? { boatTypes } : {}),
          ...(lengthWindow ?? {}),
          ...(poolPeriod ?? { priceBasis: 'week' as const }),
        },
        currency,
        locale,
        { singleAttemptMs, ...(cached ? { revalidate: POOL_REVALIDATE_SECONDS } : {}) }
      );

    // `page` is 1-based here (createYachtQueryParams sends page - 1).
    const first = await readPage(1, timeoutMs).catch(() => null);

    if (!first) return null;

    const pages = cached ? Math.min(first.page?.totalPages ?? 1, MAX_POOL_PAGES) : 1;
    const remainingMs = deadline - Date.now();

    if (pages <= 1 || remainingMs <= 0) return first.content ?? [];

    const rest = await Promise.allSettled(
      Array.from({ length: pages - 1 }, (_, i) => readPage(i + 2, remainingMs))
    );

    return [
      ...(first.content ?? []),
      ...rest.flatMap(result => (result.status === 'fulfilled' ? (result.value.content ?? []) : [])),
    ];
  };

  // Other boats within ±5 ft (any length when either is unknown), the ones
  // after this boat on the ring; on a dated page the ones offered for exactly
  // that period before the closest-dates matches.
  const pick = (pool: YachtModelShortInfo[], exclude: Set<number>, dated: boolean): YachtModelShortInfo[] =>
    rotateCandidates(
      pool
        .filter(candidate => candidate.id !== yacht.id && !exclude.has(candidate.id))
        .filter(candidate => {
          if (currentLenFt == null) return true;

          const candidateLenFt = yachtLengthFt(candidate.lengthInfo, candidate.length);

          if (candidateLenFt == null) return true;

          return Math.abs(candidateLenFt - currentLenFt) <= TOLERANCE_FT;
        }),
      yacht.id,
      RELATED_COUNT,
      candidate => (dated && candidate.matchKind && candidate.matchKind !== MatchKind.EXACT ? 1 : 0)
    );

  // One request for the boat's own type; the marina's whole pool only when
  // that leaves fewer than three — all inside the one 2 s deadline, and no
  // further request after a failed one (the backend is shedding).
  // `failed` = a request failed, so no undated retry either.
  const findRelated = async (poolPeriod: Period | null): Promise<{ boats: YachtModelShortInfo[]; failed: boolean }> => {
    const sameTypePool = vesselType ? await fetchPool(poolPeriod, [vesselType], deadline - Date.now()) : [];

    if (!sameTypePool) return { boats: [], failed: true };

    const boats = pick(sameTypePool, new Set(), !!poolPeriod);
    const remainingMs = deadline - Date.now();

    if (boats.length >= RELATED_COUNT || remainingMs < MIN_FILL_MS) return { boats, failed: false };

    const othersPool = await fetchPool(poolPeriod, undefined, remainingMs);
    const others = pick(othersPool ?? [], new Set(boats.map(boat => boat.id)), !!poolPeriod);

    return { boats: [...boats, ...others].slice(0, RELATED_COUNT), failed: !othersPool };
  };

  const first = await findRelated(period);
  // Nothing offered around the page's dates (e.g. a week far ahead): the
  // undated pool, while the deadline allows, rather than no section at all.
  const related =
    period && first.boats.length === 0 && !first.failed && deadline - Date.now() >= MIN_FILL_MS
      ? (await findRelated(null)).boats
      : first.boats;

  if (related.length === 0) return null;

  const t = await getTranslations('yacht');

  return (
    <Container maxWidth="xl" component="section" sx={{ pt: { xs: 3, sm: 5 }, pb: { xs: 1, sm: 2 } }}>
      <Typography component="h2" variant="h3" fontWeight={700} sx={{ mb: { xs: 2, sm: 3 } }}>
        {t('relatedHeading')}
      </Typography>
      <Grid container spacing={3}>
        {related.map(boat => (
          <Grid key={boat.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box sx={{ height: '100%' }}>
              <BoatListingItemCard {...boat} isGridView user={user} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RelatedBoats;
