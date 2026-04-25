'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  AccessTime,
  AcUnit,
  Air,
  AutoMode,
  BeachAccess,
  Bolt,
  DirectionsBoat,
  GpsFixed,
  Kitchen,
  LocalDrink,
  LocalFireDepartment,
  Navigation,
  OpenInNew,
  Pool,
  Radar,
  WbSunny,
  Wifi,
  WifiTethering,
} from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import cx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import BoatLocationModal from '@/components/BoatLocationModal';
import Checkbox from '@/components/Checkbox';
import FavoriteButton from '@/components/FavoriteButton';
import FlagIcon from '@/components/FlagIcon';
import { UserModel, UserRoleName } from '@/models/user.model';
import { OfferStatus, YachtModelShortInfo } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import useBreakpoint from '@/utils/hooks/useBreakpoint';
import useQueryParams from '@/utils/hooks/useQueryParams';
import useToggleState from '@/utils/hooks/useToggleState';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { getBoatImageUrl } from '@/utils/static/imageUtils';
import { roleGuard } from '@/utils/static/roleGuard';
import { toTitleCase } from '@/utils/static/toTitleCase';
import { toggleYachtSelection } from '@/valtio/yacht/yacht.actions';

import styles from './BoatListingItemCard.module.scss';

/**
 * Strip noisy suffixes from yacht model names so cards stay clean.
 * Examples handled:
 *   "Lagoon 450 F - 4 + 2 cab."  → "Lagoon 450 F"
 *   "Bali 4.4 - 4 cab."          → "Bali 4.4"
 *   "Lagoon 450 F"               → "Lagoon 450 F"
 */
const cleanModelName = (raw: string): string =>
  raw
    .replace(/\s*[-,|]?\s*\d+\s*\+\s*\d+\s*cab\.?$/i, '')
    .replace(/\s*[-,|]?\s*\d+\s*cab\.?$/i, '')
    .trim();

interface BoatListingItemCardProps extends YachtModelShortInfo {
  isGridView: boolean;
  user: UserModel | null;
  isSelected?: boolean;
}

const BoatListingItemCard = ({
  id,
  slug,
  name,
  charterType,
  location,
  buildYear,
  maxPersons,
  cabins,
  length,
  clientPriceEur,
  clientPriceInfo,
  listPriceEur,
  listPriceInfo,
  numberOfDays,
  isOption,
  offerStatus,
  isGridView,
  mainImageId,
  modelName,
  user,
  totalLocations,
  amenityKeys,
  isSelected = false,
  offerDateFrom,
  offerDateTo,
}: BoatListingItemCardProps) => {
  const { queryParams } = useQueryParams();
  const { isMobile } = useBreakpoint();
  const t = useTranslations();
  const locale = useLocale();
  const [isMapOpen, toggleMap] = useToggleState();

  const isAdmin = roleGuard(user?.roles || [], [UserRoleName.SYSTEM_ADMIN]);

  // Price block — compute TOTAL for the booking period, optional discount.
  // `clientPriceEur` from the search API is per-day, `numberOfDays` lets us
  // multiply back to the total. Falls back to a weekly assumption when the
  // backend hasn't yet started returning the field.
  const days = numberOfDays && numberOfDays > 0 ? numberOfDays : 7;
  const totalClientPrice = clientPriceEur * days;
  const totalClientPriceInfo = clientPriceInfo
    ? { ...clientPriceInfo, amount: clientPriceInfo.amount * days }
    : clientPriceInfo;

  // List price (original price before discount) — now returned by backend.
  const totalListPrice = listPriceEur ? listPriceEur * days : null;
  const totalListPriceInfo =
    listPriceInfo && totalListPrice
      ? { ...listPriceInfo, amount: listPriceInfo.amount * days }
      : null;

  const showListPrice =
    typeof totalListPrice === 'number' && totalListPrice > totalClientPrice;
  const discountPercent = showListPrice
    ? Math.round(((totalListPrice! - totalClientPrice) / totalListPrice!) * 100)
    : 0;

  // Round to whole euros — cleaner display ("3,001 €" not "3,001.68 €")
  const roundedTotal = Math.round(totalClientPrice);
  const roundedTotalInfo = totalClientPriceInfo
    ? { ...totalClientPriceInfo, amount: Math.round(totalClientPriceInfo.amount) }
    : totalClientPriceInfo;
  const roundedListPrice = totalListPrice ? Math.round(totalListPrice) : null;
  const roundedListPriceInfo =
    totalListPriceInfo && roundedListPrice
      ? { ...totalListPriceInfo, amount: Math.round(totalListPriceInfo.amount) }
      : totalListPriceInfo;

  const formattedTotal = formatPriceWithCurrency({
    clientPriceEur: roundedTotal,
    clientPriceInfo: roundedTotalInfo,
    locale,
  });
  const formattedListPrice = showListPrice
    ? formatPriceWithCurrency({
        clientPriceEur: roundedListPrice!,
        clientPriceInfo: roundedListPriceInfo ?? undefined,
        locale,
      })
    : null;

  // Cleaned-up display name — drops "X+Y cab." style suffixes from API.
  const displayModelName = cleanModelName(modelName);

  // Location link behavior: clicking the marina name opens a modal with an
  // embedded Google Maps iframe (satellite view), keeping the user on
  // boat4you — so no competitor "Booking options" panel ever shows.
  const hasLocation = Boolean(location?.name);

  // ── Amenities row ──
  // Each yacht shows up to 3 amenity icons on the card. The backend returns
  // the top N Equipment label_codes (kebab-case, e.g. "air-conditioning")
  // in `amenityKeys`, sorted by Equipment.filterOrder. We map each label_code
  // to an MUI icon + i18n-friendly key here. If the backend hasn't populated
  // the field (legacy deploy or yacht with no equipment rows), we fall back
  // to a deterministic per-id pick from a demo pool so the card still looks
  // populated.
  //
  // When adding new amenities: extend `AMENITY_ICON_MAP` below AND make sure
  // the i18n key (`common.<camelCase>`) exists in the translations file.
  const AMENITY_ICON_MAP: Record<string, { Icon: typeof AcUnit; i18nKey: string }> = {
    'air-conditioning': { Icon: AcUnit, i18nKey: 'common.airConditioning' },
    'autopilot': { Icon: AutoMode, i18nKey: 'common.autopilot' },
    'dinghy': { Icon: DirectionsBoat, i18nKey: 'common.dinghy' },
    'generator': { Icon: Bolt, i18nKey: 'common.generator' },
    'wifi': { Icon: Wifi, i18nKey: 'common.wifi' },
    'bimini': { Icon: BeachAccess, i18nKey: 'common.bimini' },
    'outside-GPS-plotter': { Icon: GpsFixed, i18nKey: 'common.gpsPlotter' },
    'outside-shower': { Icon: Pool, i18nKey: 'common.outsideShower' },
    'cooker': { Icon: Kitchen, i18nKey: 'common.cooker' },
    'fridge': { Icon: Air, i18nKey: 'common.fridge' },
    'water-toys': { Icon: WifiTethering, i18nKey: 'common.waterToys' },
    'snorkel-sets': { Icon: LocalDrink, i18nKey: 'common.snorkelSets' },
    'solar-panels': { Icon: WbSunny, i18nKey: 'common.solarPanels' },
    'bow-thruster': { Icon: Navigation, i18nKey: 'common.bowThruster' },
    'radar': { Icon: Radar, i18nKey: 'common.radar' },
    'heating': { Icon: LocalFireDepartment, i18nKey: 'common.heating' },
  };

  // Demo fallback — kept for yachts whose amenityKeys the backend hasn't yet
  // populated. Deterministic per id so the same yacht shows the same icons
  // across reloads (no flicker).
  const demoPool: ReadonlyArray<{ key: string; Icon: typeof AcUnit }> = [
    { key: 'airConditioning', Icon: AcUnit },
    { key: 'freeWifi', Icon: Wifi },
    { key: 'dinghy', Icon: DirectionsBoat },
    { key: 'gpsPlotter', Icon: GpsFixed },
    { key: 'autopilot', Icon: AutoMode },
    { key: 'generator', Icon: Bolt },
    { key: 'bimini', Icon: BeachAccess },
    { key: 'outsideShower', Icon: Pool },
    { key: 'cooker', Icon: Kitchen },
    { key: 'fridge', Icon: Air },
    { key: 'waterToys', Icon: WifiTethering },
    { key: 'snorkelSets', Icon: LocalDrink },
  ];

  const pickDemoAmenities = (seed: number, count: number) => {
    const picks: Array<{ key: string; Icon: typeof AcUnit }> = [];
    const used = new Set<number>();
    let i = 0;

    while (picks.length < count && i < demoPool.length * 3) {
      const idx = (seed * 7 + i * 13) % demoPool.length;

      if (!used.has(idx)) {
        used.add(idx);
        picks.push(demoPool[idx]);
      }

      i++;
    }

    return picks;
  };

  const realAmenities = (amenityKeys ?? [])
    .map((key) => AMENITY_ICON_MAP[key])
    .filter((v): v is { Icon: typeof AcUnit; i18nKey: string } => Boolean(v))
    .slice(0, 3)
    .map(({ Icon, i18nKey }) => ({
      label: t(i18nKey as 'common.airConditioning'),
      Icon,
    }));

  const demoAmenities =
    realAmenities.length > 0
      ? realAmenities
      : pickDemoAmenities(id, 3).map(({ key, Icon }) => ({
          label: t(`common.${key}` as 'common.airConditioning'),
          Icon,
        }));

  // DEMO social proof — "X people are also interested" shown on ~60% of
  // yachts with a deterministic per-id seed (no flicker on re-render, same
  // yacht always shows the same number). Count range: 30–80.
  // Replace with real data once backend tracks listing views / saves.
  const showSocialProof = id % 10 < 6;                  // 60% of yachts
  const interestedCount = 30 + (id % 51);               // 30..80

  // ── Availability badge ──
  // Maps the full OfferStatus enum into the two-badge model the card shows.
  // Per business rules:
  //   • Available:    FREE, OPTION_EXPIRED, CANCELLED, INFO, UNKNOWN
  //   • Pre-reserved: OPTION, OPTION_WAITING, RESERVED, UNAVAILABLE, SERVICE
  //
  // Backend doesn't deploy the `offerStatus` field yet — fall back to isOption
  // (boolean) for now. DEMO: if neither is present, deterministically fake a
  // mix of statuses based on yacht id so the design shows both badges.
  const availableStatuses: ReadonlyArray<OfferStatus> = [
    OfferStatus.FREE,
    OfferStatus.OPTION_EXPIRED,
    OfferStatus.CANCELLED,
    OfferStatus.INFO,
    OfferStatus.UNKNOWN,
  ];

  const resolvedStatus: OfferStatus = (() => {
    if (offerStatus) return offerStatus;
    if (isOption) return OfferStatus.OPTION;

    // DEMO mix per yacht id — ensures visual variety until backend ships
    // the `offerStatus` field in YachtSearchResponseDto. UNAVAILABLE is
    // intentionally excluded — those yachts are filtered out at the SQL
    // view level (truly unbookable) so the UI never sees them.
    const demoMap: Record<number, OfferStatus> = {
      0: OfferStatus.FREE,
      1: OfferStatus.FREE,
      2: OfferStatus.FREE,
      3: OfferStatus.OPTION,
      4: OfferStatus.OPTION_WAITING,
      5: OfferStatus.RESERVED,
      6: OfferStatus.CANCELLED,
      7: OfferStatus.OPTION_EXPIRED,
      8: OfferStatus.SERVICE,
      9: OfferStatus.INFO,
    };

    return demoMap[id % 10] ?? OfferStatus.FREE;
  })();

  const isAvailable = availableStatuses.includes(resolvedStatus);

  // Highlight yachts under active or waiting option as a "SPECIAL PROMOTION"
  // (competitor-style promo ribbon on the image) — these are the ones most
  // likely to convert because they already have commercial interest.
  const isSpecialPromotion =
    resolvedStatus === OfferStatus.OPTION || resolvedStatus === OfferStatus.OPTION_WAITING;

  // ── Closest day (non-standard charter week) ──
  // Charter weeks are Sat-Sat 7-day by convention; anything else (Mon-Mon,
  // Thu-Fri, 10-day, …) is flagged with a "Closest day" badge so the user
  // realises the offer's period doesn't line up with a normal weekly rental.
  const isCloseDayMatch = (() => {
    if (!offerDateFrom || !offerDateTo) return false;
    const from = new Date(`${offerDateFrom}T00:00:00Z`);
    const to = new Date(`${offerDateTo}T00:00:00Z`);
    const dayMs = 1000 * 60 * 60 * 24;
    const days = Math.round((to.getTime() - from.getTime()) / dayMs);
    const startsOnSaturday = from.getUTCDay() === 6;
    return !(startsOnSaturday && days === 7);
  })();

  const formatOfferPeriod = (): string => {
    if (!offerDateFrom || !offerDateTo) return '';
    const f = (iso: string) => {
      const [, m, d] = iso.split('-');
      return `${d}.${m}.`;
    };
    return `${f(offerDateFrom)} – ${f(offerDateTo)}`;
  };

  // ── DEAL OF THE WEEK ──
  // Yachts with 40%+ discount get a prominent ribbon + 2-day countdown timer
  // (stable deadline per yacht id so the clock doesn't jitter on re-render).
  // The deadline is computed once per yacht id and memoized — each yacht gets
  // a unique expiry within the next ~24-48 hours, so users see a mix on the page.
  const isDealOfTheWeek = discountPercent >= 40;

  const dealDeadline = useMemo(
    () => Date.now() + (24 + (id % 25)) * 60 * 60 * 1000, // 24..48 hours from mount
    [id],
  );

  const [tickTime, setTickTime] = useState(() => Date.now());

  useEffect(() => {
    if (!isDealOfTheWeek) return;

    const t = setInterval(() => setTickTime(Date.now()), 1000);
    return () => clearInterval(t);
  }, [isDealOfTheWeek]);

  const formatCountdown = (): string => {
    const remainingMs = Math.max(0, dealDeadline - tickTime);
    const totalSec = Math.floor(remainingMs / 1000);
    const hh = Math.floor(totalSec / 3600);
    const mm = Math.floor((totalSec % 3600) / 60);
    const ss = totalSec % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(hh)} : ${pad(mm)} : ${pad(ss)}`;
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleYachtSelection(id);
  };

  return (
    <>
      {location?.name && (
        <BoatLocationModal open={isMapOpen} onClose={toggleMap} locationName={location.name} />
      )}
      <Link href={`/boat/${slug}?${queryParams}`} target="_blank" rel="noopener noreferrer">
      <Card
        elevation={0}
        classes={{ root: styles.root }}
        className={cx(styles.container, { [styles.gridView]: isGridView })}
      >
        <CardMedia className={cx(styles.imageWrapper, { [styles.gridView]: isGridView })}>
          <Image
            src={getBoatImageUrl(mainImageId, 800)}
            alt={`${modelName} ${name || ''} boat image`}
            fill
            className={styles.image}
            sizes="(max-width: 899px) 100vw, 388px"
          />

          {/* Favorite heart — moved to TOP-RIGHT so it doesn't collide with
              SPECIAL PROMOTION ribbon + DEAL OF THE WEEK card on the left. */}
          <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 3 }}>
            <FavoriteButton yacht={{ id, slug, name, model: modelName, location, mainImageId }} />
          </Box>

          {/* "Closest day" — badge sits just below the favorite heart in the
              top-right so users immediately spot yachts whose offer week isn't
              the standard Sat–Sat charter pattern. */}
          {isCloseDayMatch && (
            <Stack
              direction="row"
              alignItems="center"
              gap={0.5}
              sx={{
                position: 'absolute',
                top: 52,
                right: 12,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: colors.yellow50,
                color: colors.yellow500,
                border: `1px solid ${colors.yellow500}`,
                fontWeight: 700,
                fontSize: 11,
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                zIndex: 2,
              }}
            >
              <AccessTime sx={{ fontSize: 12 }} />
              {t('common.closestDay')} {formatOfferPeriod()}
            </Stack>
          )}

          {/* SPECIAL PROMOTION — desktop: red pill top-left corner.
              Mobile: full-width strip across the top of the image, mirror
              of the DEAL OF THE WEEK bottom strip. */}
          {isSpecialPromotion && (
            <Box
              sx={{
                position: 'absolute',
                zIndex: 2,
                backgroundColor: colors.red600,
                color: colors.white,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.6,
                textTransform: 'uppercase',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...(isMobile
                  ? {
                      top: 0,
                      left: 0,
                      right: 0,
                      py: 0.5,
                      px: 1,
                      borderRadius: '10px 10px 0 0',
                      textAlign: 'center',
                    }
                  : {
                      top: 12,
                      left: 12,
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 1,
                    }),
              }}
            >
              {t('common.specialPromotion')}
            </Box>
          )}

          {/* DEAL OF THE WEEK — cream card. Desktop: top-left corner of
              image, vertical stack. Mobile: bottom strip across the full
              image width, one horizontal row (label + countdown inline). */}
          {isDealOfTheWeek && (
            <Box
              sx={{
                position: 'absolute',
                zIndex: 2,
                backgroundColor: '#F0E8D2',
                border: `1px solid #E0D7B8`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                display: 'flex',
                ...(isMobile
                  ? {
                      top: 'auto',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.25,
                      px: 1,
                      py: 0.5,
                      borderRadius: '0 0 10px 10px',
                    }
                  : {
                      top: isSpecialPromotion ? 52 : 12,
                      left: 12,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 0.25,
                      px: 1.25,
                      py: 0.75,
                      borderRadius: 1,
                      minWidth: 140,
                    }),
              }}
            >
              <Stack direction="row" alignItems="center" gap={0.5}>
                <AccessTime sx={{ fontSize: 13, color: colors.black950 }} />
                <Typography
                  sx={{
                    fontSize: isMobile ? 9 : 10,
                    fontWeight: 800,
                    letterSpacing: 0.6,
                    color: colors.black950,
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t('common.dealOfTheWeek')}
                </Typography>
              </Stack>
              <Typography
                sx={{
                  fontSize: isMobile ? 11 : 13,
                  fontWeight: 700,
                  letterSpacing: 0.6,
                  color: colors.black950,
                  fontVariantNumeric: 'tabular-nums',
                  whiteSpace: 'nowrap',
                }}
              >
                {formatCountdown()}
              </Typography>
            </Box>
          )}
        </CardMedia>
        {/* Single content column — info on top, price + CTA pushed to bottom-right */}
        <CardContent className={styles.content}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h3" fontWeight={700}>
              {displayModelName}
              {name ? ` | ${toTitleCase(name)}` : ''}
            </Typography>
            {isAdmin && !isGridView && !isMobile && <Checkbox checked={isSelected} onClick={handleCheckboxClick} />}
          </Stack>

          {location && (
            <Stack
              direction="row"
              alignItems="center"
              gap={{ xs: 0.5, md: 1 }}
              // FlagIcon wraps the flag in a fixed 28px square — force the
              // wrapper (first child Box) to match the text line-height on
              // mobile so the flag sits centered with the marina name.
              sx={{
                '& > div:first-of-type': {
                  width: { xs: 16, md: 28 },
                  height: { xs: 16, md: 28 },
                },
              }}
            >
              <FlagIcon countryCode={location.countryCode} />
              {hasLocation ? (
                // Can't use component="a" here — the whole card is already
                // wrapped in a <Link> (anchor), and nested <a> is invalid HTML.
                // Role=link + keyboard handler, stopPropagation to prevent the
                // card's Link from navigating to the boat detail.
                <Typography
                  variant="body1"
                  role="button"
                  tabIndex={0}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMap();
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleMap();
                    }
                  }}
                  sx={{
                    color: colors.blue500,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                  aria-label={t('common.openInMap')}
                >
                  {location.name}
                  <OpenInNew sx={{ fontSize: 14 }} />
                </Typography>
              ) : (
                <Typography variant="body1">{location.name}</Typography>
              )}
            </Stack>
          )}

          {/* Year · Cabins · People — clean text only, no icons. From API. */}
          {/* People falls back to a 'cabins × 2 + 2' estimate if the backend */}
          {/* returns null/0 — keeps the row consistent across yachts. */}
          {(() => {
            const peopleCount = maxPersons && maxPersons > 0 ? maxPersons : cabins ? cabins * 2 + 2 : null;
            return (
              <Stack direction="row" alignItems="center" gap={{ xs: 1, md: 2.5 }} flexWrap="nowrap" sx={{ overflowX: 'hidden' }}>
                {buildYear && (
                  <Typography variant="body2" color={colors.black600} sx={{ fontSize: { xs: 11, md: 14 }, whiteSpace: 'nowrap' }}>
                    {t('filters.year')}{' '}
                    <Box component="span" fontWeight={700} color={colors.black950}>
                      {buildYear}
                    </Box>
                  </Typography>
                )}
                {cabins && (
                  <Typography variant="body2" color={colors.black600} sx={{ fontSize: { xs: 11, md: 14 }, whiteSpace: 'nowrap' }}>
                    {t('filters.cabins')}{' '}
                    <Box component="span" fontWeight={700} color={colors.black950}>
                      {cabins}
                    </Box>
                  </Typography>
                )}
                {peopleCount && (
                  <Typography variant="body2" color={colors.black600} sx={{ fontSize: { xs: 11, md: 14 }, whiteSpace: 'nowrap' }}>
                    {t('filters.people')}{' '}
                    <Box component="span" fontWeight={700} color={colors.black950}>
                      {peopleCount}
                    </Box>
                  </Typography>
                )}
              </Stack>
            );
          })()}

          {/* Highlights — max 3 amenities, packed close together. DEMO data. */}
          <Stack
            direction="row"
            alignItems="center"
            gap={{ xs: 1, md: 1.5 }}
            flexWrap={{ xs: 'nowrap', md: 'wrap' }}
            mt={0.5}
            mb={{ xs: 0.5, md: 0 }}
            sx={{ overflow: 'hidden' }}
          >
            {demoAmenities.map(({ label, Icon: AmenityIcon }) => (
              <Stack
                key={label}
                direction={{ xs: 'row', md: 'column' }}
                alignItems="center"
                gap={{ xs: 0.5, md: 0.25 }}
                sx={{ minWidth: { xs: 'auto', md: 56 }, whiteSpace: 'nowrap' }}
              >
                <AmenityIcon sx={{ fontSize: { xs: 14, md: 20 }, color: colors.black600 }} />
                <Typography
                  color={colors.black600}
                  sx={{ textAlign: 'center', lineHeight: 1.2, fontSize: { xs: 10, md: 11 } }}
                >
                  {label}
                </Typography>
              </Stack>
            ))}
          </Stack>

          {/* Social proof — DEMO. Shown on ~60% of yachts with a deterministic count.
              Sits under amenities as a compact blue50 pill — single-line, own
              width so neighbouring text isn't affected. The 40% of yachts that
              don't qualify still render an invisible placeholder of identical
              dimensions so every card ends up the same total height (prevents
              the "jumpy grid" effect when scrolling through search results). */}
          <Stack
            direction="row"
            alignItems="center"
            gap={0.5}
            aria-hidden={!showSocialProof}
            sx={{
              mt: 0,
              alignSelf: 'flex-start',
              px: 0.75,
              py: 0.25,
              borderRadius: 1,
              backgroundColor: showSocialProof ? colors.blue50 : 'transparent',
              visibility: showSocialProof ? 'visible' : 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            <AccessTime sx={{ fontSize: 12, color: colors.blue500 }} />
            <Typography color={colors.blue500} sx={{ fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>
              {t('common.peopleAlsoInterested', { count: String(interestedCount) })}
            </Typography>
          </Stack>

          {/* Price + Boat details — pushed to bottom-right corner */}
          <Box className={cx(styles.priceBlock, { [styles.gridView]: isGridView, [styles.mobileStacked]: isMobile })}>
            <Stack alignItems="flex-end">
              {/* Redundant on mobile — the user already set the search
                  window (e.g. "7 days"), repeating it on every card just
                  wastes scarce vertical space. Keep on desktop as reminder. */}
              {!isMobile && (
                <Typography variant="body2" color={colors.black600}>
                  {t('common.priceForXDays', { days: String(days) })}
                </Typography>
              )}
              {showListPrice && (
                <Box
                  component="span"
                  sx={{
                    mt: 0.25,
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 0.75,
                    py: 0.25,
                    borderRadius: 0.75,
                    // Booking.com-style deal pill — filled red with
                    // white text, high contrast, immediately draws
                    // attention to the saving. Matches their
                    // "Limited deal" / "Deal" badge treatment.
                    backgroundColor: colors.red700,
                    color: colors.white,
                    fontWeight: 800,
                    fontSize: 12,
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                  }}
                >
                  − {discountPercent}%
                </Box>
              )}
              <Stack direction="row" alignItems="baseline" gap={1} sx={{ mt: 0.25 }}>
                {showListPrice && (
                  <Typography
                    variant="body2"
                    color={colors.black500}
                    sx={{ textDecoration: 'line-through' }}
                  >
                    {formattedListPrice}
                  </Typography>
                )}
                <Typography variant="h3" component="p" fontWeight={700} color="success">
                  {formattedTotal}
                </Typography>
              </Stack>
            </Stack>
            {/* Availability badge + Boat details button in one row */}
            <Stack direction="row" alignItems="center" gap={1}>
              {isAvailable ? (
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 1,
                    backgroundColor: colors.green50,
                    color: colors.green500,
                    fontWeight: 700,
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                    border: `1px solid ${colors.green500}`,
                  }}
                >
                  {t('common.available')}
                </Box>
              ) : (
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={0.5}
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    backgroundColor: colors.red50,
                    color: colors.red500,
                    border: `1px solid ${colors.red200}`,
                    fontWeight: 600,
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <AccessTime sx={{ fontSize: 13 }} />
                  {t('common.preReserved')}
                </Stack>
              )}
              <Button size="medium" className={styles.button}>
                {t('common.boatDetails')}
              </Button>
            </Stack>
            {isAdmin && (isGridView || isMobile) && <Checkbox checked={isSelected} onClick={handleCheckboxClick} />}
          </Box>
        </CardContent>
      </Card>
      </Link>
    </>
  );
};

export default BoatListingItemCard;
