import { Box, Container, Grid, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';

import BoatListingItemCard from '@/components/BoatListingItemCard';
import { Currency, UserModel } from '@/models/user.model';
import { MeasurementInfo, MeasurementUnit } from '@/models/yacht-feature.model';
import { MatchKind, VesselType, YachtModel, YachtModelShortInfo, isVesselType } from '@/models/yacht.model';
import { fetchYachts } from '@/services/yacht.service';

/**
 * "You might also like" — up to 3 boats from the SAME marina, sized like
 * the current one. Pool comes from the regular /public/yachts listing
 * filtered by the marina's did; the ±5 ft closest-length pick mirrors the
 * sister-site RelatedYachts rule (Mario 12.5.2026). Renders nothing when
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
 * for 17.–24.10.). Undated pages keep the weekly-priced undated pool.
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

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * The page's charter period when it carries a usable one: two plain
 * YYYY-MM-DD days, the end after the start (a repeated or malformed
 * parameter leaves the pool undated rather than sending it to the API).
 */
const pagePeriod = (startDate: unknown, endDate: unknown): { startDate: string; endDate: string } | null =>
  typeof startDate === 'string' &&
  typeof endDate === 'string' &&
  ISO_DAY.test(startDate) &&
  ISO_DAY.test(endDate) &&
  endDate > startDate
    ? { startDate, endDate }
    : null;

const yachtLengthFt = (info: MeasurementInfo | null | undefined, metric: number | null | undefined): number | null => {
  if (info && info.unit === MeasurementUnit.FEET && Number.isFinite(info.amount)) return info.amount;

  if (info && info.unit === MeasurementUnit.METRE && Number.isFinite(info.amount)) return info.amount / M_PER_FT;

  if (typeof metric === 'number' && Number.isFinite(metric)) return metric / M_PER_FT;

  return null;
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

  // Dated page: the dated search's request (startDate/endDate, no
  // priceBasis). Undated: weekly prices, like the landings (audit B16) — 44
  // of 145 similar-boat cards read "Price for 3 days 23 €" before.
  // null = the request failed (503 shed, timeout).
  const fetchPool = (boatTypes: VesselType[] | undefined, timeoutMs: number): Promise<YachtModelShortInfo[] | null> =>
    fetchYachts(
      {
        locations: [],
        did: [String(marinaDid)],
        size: 12,
        ...(boatTypes ? { boatTypes } : {}),
        ...(period ?? { priceBasis: 'week' as const }),
      },
      currency,
      locale,
      { singleAttemptMs: timeoutMs }
    )
      .then(response => response.content ?? [])
      .catch(() => null);

  const currentLenFt = yachtLengthFt(yacht.lengthInfo, yacht.length);

  // Other boats within ±5 ft (any length when either is unknown), closest
  // first; on a dated page the ones offered for exactly that period before
  // the closest-dates matches.
  const pick = (pool: YachtModelShortInfo[], exclude: Set<number>): YachtModelShortInfo[] =>
    pool
      .filter(candidate => candidate.id !== yacht.id && !exclude.has(candidate.id))
      .filter(candidate => {
        if (currentLenFt == null) return true;

        const candidateLenFt = yachtLengthFt(candidate.lengthInfo, candidate.length);

        if (candidateLenFt == null) return true;

        return Math.abs(candidateLenFt - currentLenFt) <= TOLERANCE_FT;
      })
      .sort((a, b) => {
        if (period) {
          const exact = (boat: YachtModelShortInfo) => (boat.matchKind && boat.matchKind !== MatchKind.EXACT ? 1 : 0);
          const byPeriod = exact(a) - exact(b);

          if (byPeriod !== 0) return byPeriod;
        }

        if (currentLenFt == null) return 0;

        const aFt = yachtLengthFt(a.lengthInfo, a.length);
        const bFt = yachtLengthFt(b.lengthInfo, b.length);

        if (aFt == null) return 1;

        if (bFt == null) return -1;

        return Math.abs(aFt - currentLenFt) - Math.abs(bFt - currentLenFt);
      });

  // One request for the boat's own type; the marina's whole pool only when
  // that leaves fewer than three — both inside the one 2 s deadline, and no
  // second request after a failed first one (the backend is shedding).
  const sameTypePool = vesselType ? await fetchPool([vesselType], RELATED_DEADLINE_MS) : [];
  let related = pick(sameTypePool ?? [], new Set()).slice(0, RELATED_COUNT);
  const remainingMs = deadline - Date.now();

  if (sameTypePool && related.length < RELATED_COUNT && remainingMs >= MIN_FILL_MS) {
    const taken = new Set(related.map(boat => boat.id));
    const others = pick((await fetchPool(undefined, remainingMs)) ?? [], taken);

    related = [...related, ...others].slice(0, RELATED_COUNT);
  }

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
