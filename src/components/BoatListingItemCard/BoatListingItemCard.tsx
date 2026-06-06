'use client';

/* eslint-disable @typescript-eslint/no-shadow, consistent-return, no-nested-ternary */
import {
  AcUnit,
  AccessTime,
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
import { useSearchParams } from 'next/navigation';

import BoatLocationModal from '@/components/BoatLocationModal';
import Checkbox from '@/components/Checkbox';
import FavoriteButton from '@/components/FavoriteButton';
import FlagIcon from '@/components/FlagIcon';
import { UserModel, UserRoleName } from '@/models/user.model';
import { MatchKind, OfferStatus, YachtModelShortInfo } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import useBreakpoint from '@/utils/hooks/useBreakpoint';
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
  custom,
  isGridView,
  mainImageId,
  modelName,
  user,
  totalLocations,
  amenityKeys,
  isSelected = false,
  offerDateFrom,
  offerDateTo,
  matchKind,
}: BoatListingItemCardProps) => {
  // Boat detail's canonical ignores query params, so forwarding the live
  // search filter (?destinations=/&did=) only spawns crawlable duplicate URLs
  // (17.9K "alternate" + 1.96K "duplicate" in GSC). Forward ONLY the sailing
  // dates: useful for the client, and absent when Googlebot crawls
  // /search?destinations=X — so the bot follows a clean /boat/<slug>.
  const searchParams = useSearchParams();
  const boatDetailHref = (() => {
    const q = new URLSearchParams();
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (startDate) q.set('startDate', startDate);

    if (endDate) q.set('endDate', endDate);

    const qs = q.toString();

    return qs ? `/boat/${slug}?${qs}` : `/boat/${slug}`;
  })();
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
    listPriceInfo && totalListPrice ? { ...listPriceInfo, amount: listPriceInfo.amount * days } : null;

  const showListPrice = typeof totalListPrice === 'number' && totalListPrice > totalClientPrice;
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
  // to an MUI icon + i18n-friendly key here. When the backend has no equipment
  // rows for a yacht the row is simply empty (no demo placeholder).
  //
  // When adding new amenities: extend `AMENITY_ICON_MAP` below AND make sure
  // the i18n key (`common.<camelCase>`) exists in the translations file.
  const AMENITY_ICON_MAP: Record<string, { Icon: typeof AcUnit; i18nKey: string }> = {
    'air-conditioning': { Icon: AcUnit, i18nKey: 'common.airConditioning' },
    autopilot: { Icon: AutoMode, i18nKey: 'common.autopilot' },
    dinghy: { Icon: DirectionsBoat, i18nKey: 'common.dinghy' },
    generator: { Icon: Bolt, i18nKey: 'common.generator' },
    wifi: { Icon: Wifi, i18nKey: 'common.wifi' },
    bimini: { Icon: BeachAccess, i18nKey: 'common.bimini' },
    'outside-GPS-plotter': { Icon: GpsFixed, i18nKey: 'common.gpsPlotter' },
    'outside-shower': { Icon: Pool, i18nKey: 'common.outsideShower' },
    cooker: { Icon: Kitchen, i18nKey: 'common.cooker' },
    fridge: { Icon: Air, i18nKey: 'common.fridge' },
    'water-toys': { Icon: WifiTethering, i18nKey: 'common.waterToys' },
    'snorkel-sets': { Icon: LocalDrink, i18nKey: 'common.snorkelSets' },
    'solar-panels': { Icon: WbSunny, i18nKey: 'common.solarPanels' },
    'bow-thruster': { Icon: Navigation, i18nKey: 'common.bowThruster' },
    radar: { Icon: Radar, i18nKey: 'common.radar' },
    heating: { Icon: LocalFireDepartment, i18nKey: 'common.heating' },
  };

  const realAmenities = (amenityKeys ?? [])
    .map(key => AMENITY_ICON_MAP[key])
    .filter((v): v is { Icon: typeof AcUnit; i18nKey: string } => Boolean(v))
    .slice(0, 3)
    .map(({ Icon, i18nKey }) => ({
      label: t(i18nKey as 'common.airConditioning'),
      Icon,
    }));

  // ── Availability badge ──
  // Maps the full OfferStatus enum into the two-badge model the card shows.
  // Per business rules:
  //   • Available:    FREE, OPTION_EXPIRED, CANCELLED, INFO, UNKNOWN
  //   • Pre-reserved: OPTION, OPTION_WAITING, RESERVED, UNAVAILABLE, SERVICE
  //
  // Uses the REAL backend `offerStatus`; falls back to `isOption` when only the
  // boolean is present (older payloads), else FREE. No demo mix.
  const availableStatuses: ReadonlyArray<OfferStatus> = [
    OfferStatus.FREE,
    OfferStatus.OPTION_EXPIRED,
    OfferStatus.CANCELLED,
    OfferStatus.INFO,
    OfferStatus.UNKNOWN,
  ];

  const resolvedStatus: OfferStatus = offerStatus ?? (isOption ? OfferStatus.OPTION : OfferStatus.FREE);

  const isAvailable = availableStatuses.includes(resolvedStatus);

  // Highlight yachts under active or waiting option as a "SPECIAL PROMOTION"
  // (competitor-style promo ribbon on the image) — these are the ones most
  // likely to convert because they already have commercial interest.
  const isSpecialPromotion = resolvedStatus === OfferStatus.OPTION || resolvedStatus === OfferStatus.OPTION_WAITING;

  // ── Closest dates (offer window != requested dates) ──
  // Honest availability (Deploy 4): the backend tells us via `matchKind` how the
  // returned offer relates to the searched dates. Anything other than EXACT
  // means the user is looking at the closest available window, so we surface a
  // "closest dates: DD.MM - DD.MM" badge with the REAL matched period
  // (offerDateFrom/offerDateTo). No more client-side Sat-Sat guessing.
  const isCloseDayMatch = Boolean(matchKind) && matchKind !== MatchKind.EXACT && Boolean(offerDateFrom && offerDateTo);

  const formatOfferPeriod = (): string => {
    if (!offerDateFrom || !offerDateTo) return '';

    const f = (iso: string) => {
      const [, m, d] = iso.split('-');

      return `${d}.${m}.`;
    };

    return `${f(offerDateFrom)} – ${f(offerDateTo)}`;
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleYachtSelection(id);
  };

  return (
    <>
      {location?.name && <BoatLocationModal open={isMapOpen} onClose={toggleMap} locationName={location.name} />}
      <Link href={boatDetailHref} target="_blank" rel="noopener noreferrer">
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
          </CardMedia>
          {/* Single content column — info on top, price + CTA pushed to bottom-right */}
          <CardContent className={styles.content}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography
                variant="h3"
                fontWeight={700}
                sx={isGridView ? { lineHeight: 1.3, minHeight: '2.6em' } : undefined}
              >
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
                  ...(isGridView ? { minHeight: '3em' } : {}),
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
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={{ xs: 1, md: 2.5 }}
                  flexWrap="nowrap"
                  sx={{ overflowX: 'hidden' }}
                >
                  {buildYear && (
                    <Typography
                      variant="body2"
                      color={colors.black600}
                      sx={{ fontSize: { xs: 11, md: 14 }, whiteSpace: 'nowrap' }}
                    >
                      {t('filters.year')}{' '}
                      <Box component="span" fontWeight={700} color={colors.black950}>
                        {buildYear}
                      </Box>
                    </Typography>
                  )}
                  {cabins && (
                    <Typography
                      variant="body2"
                      color={colors.black600}
                      sx={{ fontSize: { xs: 11, md: 14 }, whiteSpace: 'nowrap' }}
                    >
                      {t('filters.cabins')}{' '}
                      <Box component="span" fontWeight={700} color={colors.black950}>
                        {cabins}
                      </Box>
                    </Typography>
                  )}
                  {peopleCount && (
                    <Typography
                      variant="body2"
                      color={colors.black600}
                      sx={{ fontSize: { xs: 11, md: 14 }, whiteSpace: 'nowrap' }}
                    >
                      {t('filters.people')}{' '}
                      <Box component="span" fontWeight={700} color={colors.black950}>
                        {peopleCount}
                      </Box>
                    </Typography>
                  )}
                </Stack>
              );
            })()}

            {/* Highlights — up to 3 real amenities from the backend (empty when
              the yacht has no equipment rows). */}
            <Stack
              direction="row"
              alignItems="center"
              gap={{ xs: 1, md: 1.5 }}
              flexWrap={{ xs: 'nowrap', md: 'wrap' }}
              mt={0.5}
              mb={{ xs: 0.5, md: 0 }}
              sx={{ overflow: 'hidden' }}
            >
              {realAmenities.map(({ label, Icon: AmenityIcon }) => (
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
                    <Typography variant="body2" color={colors.black500} sx={{ textDecoration: 'line-through' }}>
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
                {custom ? (
                  // Custom (admin-managed) yacht — no offer rows, only a
                  // lowPrice placeholder. Inquiry-only flow, so swap the
                  // green Available badge for a blue "On request" cue.
                  <Box
                    sx={{
                      px: 1.25,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: colors.blue50,
                      color: colors.blue500,
                      fontWeight: 700,
                      fontSize: 12,
                      whiteSpace: 'nowrap',
                      border: `1px solid ${colors.blue500}`,
                    }}
                  >
                    {t('common.onRequest')}
                  </Box>
                ) : isAvailable ? (
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
