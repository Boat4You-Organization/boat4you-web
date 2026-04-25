import React from 'react';

import { CheckCircleOutline } from '@mui/icons-material';
import { Box, Grid, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import BoatLocationModal from '@/components/BoatLocationModal';
import FlagIcon from '@/components/FlagIcon';
import { VESSEL_TYPE_LABEL_MAP } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { ReservationData } from '@/types/reservation.type';
import useToggleState from '@/utils/hooks/useToggleState';
import DateTime from '@/utils/static/DateTime';
import { getBoatImageUrl } from '@/utils/static/imageUtils';
import { toTitleCase } from '@/utils/static/toTitleCase';

import styles from './BookingHero.module.scss';

interface BookingHeroProps {
  reservationData: ReservationData;
}

/**
 * Full-width booking page hero banner — large yacht photo + thumbnail strip on
 * the left, identity/stats/benefits block on the right. Replaces the old
 * "booking summary" sidebar card and makes the yacht the visual anchor of the
 * page (inspired by Boataround's layout but executed with our design tokens
 * and benefit messaging — "Best price", "No booking/card fees").
 */
const BookingHero = ({ reservationData }: BookingHeroProps) => {
  const {
    name,
    model,
    locationFrom,
    mainImage,
    yachtImages = [],
    vesselType,
    buildYear,
    maxPersons,
    berths,
    cabins,
    dateTo,
  } = reservationData;

  const t = useTranslations('common');
  const tFilters = useTranslations('filters');
  const locale = useLocale();

  const charterEndDate = dateTo ? DateTime.formatLong(dayjs(dateTo), locale) : '';
  // Top-level `t` used because VESSEL_TYPE_LABEL_MAP values already include the
  // 'common.' namespace prefix (e.g. 'common.catamaran'). Using the scoped
  // common-namespace `t` here would resolve to 'common.common.catamaran'.
  const tRoot = useTranslations();

  const currentYear = new Date().getFullYear();
  const isNewYacht = Boolean(buildYear && buildYear >= currentYear - 1);

  const [isMapOpen, toggleMap] = useToggleState();

  // Thumbnail strip: up to 3 non-main images from the gallery.
  const thumbnails = (yachtImages ?? [])
    .filter(img => img && img.id !== mainImage?.id)
    .slice(0, 3);

  // Stats row — only show values we actually have.
  const stats = [
    buildYear ? { value: String(buildYear), label: tFilters('year') } : null,
    maxPersons ? { value: String(maxPersons), label: tFilters('people') } : null,
    berths ? { value: String(berths), label: tFilters('berths') } : null,
    cabins ? { value: String(cabins), label: tFilters('cabins') } : null,
  ].filter((s): s is { value: string; label: string } => s !== null);

  return (
    <>
      {locationFrom?.name && (
        <BoatLocationModal open={isMapOpen} onClose={toggleMap} locationName={locationFrom.name} />
      )}
      <Box className={styles.hero}>
      <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center">
        {/* Gallery — main image + thumbnail column */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack direction="row" gap={1.5}>
            {mainImage && (
              <Box className={styles.mainImageWrapper}>
                <Image
                  src={getBoatImageUrl(mainImage.id, 800)}
                  alt={`${model} ${name || ''}`}
                  fill
                  sizes="(max-width: 900px) 100vw, 450px"
                  className={styles.mainImage}
                  priority
                />
              </Box>
            )}
            {thumbnails.length > 0 && (
              <Stack gap={1.5} className={styles.thumbColumn}>
                {thumbnails.map(img => (
                  <Box key={img.id} className={styles.thumbWrapper}>
                    <Image
                      src={getBoatImageUrl(img.id, 256)}
                      alt={`${model} ${name || ''}`}
                      fill
                      sizes="120px"
                      className={styles.thumbImage}
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </Grid>

        {/* Info block */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack gap={2.5}>
            {vesselType && (
              <Typography
                variant="body2"
                color={colors.black600}
                sx={{ letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700 }}
              >
                {tRoot(VESSEL_TYPE_LABEL_MAP[vesselType])}
              </Typography>
            )}

            <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
              <Typography component="h1" variant="h2" fontWeight={700} color={colors.black950}>
                {model} {name ? `| ${toTitleCase(name)}` : ''}
              </Typography>
              {isNewYacht && (
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 1,
                    backgroundColor: colors.blue50,
                    color: colors.blue500,
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {tFilters('newYacht')}
                </Box>
              )}
            </Stack>

            {locationFrom?.name && (
              <Stack direction="row" alignItems="center" gap={1}>
                {locationFrom.countryCode && <FlagIcon countryCode={locationFrom.countryCode} />}
                <Typography
                  component="button"
                  type="button"
                  variant="body1"
                  onClick={toggleMap}
                  sx={{
                    color: colors.black700,
                    background: 'none',
                    border: 0,
                    p: 0,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    font: 'inherit',
                    '&:hover': { color: colors.blue500 },
                  }}
                >
                  {locationFrom.name}
                </Typography>
              </Stack>
            )}

            {stats.length > 0 && (
              <Stack
                direction="row"
                gap={{ xs: 3, md: 5 }}
                flexWrap="wrap"
                sx={{ pt: 1 }}
              >
                {stats.map(({ value, label }) => (
                  <Stack key={label} gap={0.25}>
                    <Typography variant="h3" fontWeight={700} color={colors.black950}>
                      {value}
                    </Typography>
                    <Typography variant="body2" color={colors.black600}>
                      {label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}

            <Stack gap={0.75} sx={{ pt: 1 }}>
              <Stack direction="row" alignItems="center" gap={0.75}>
                <CheckCircleOutline sx={{ fontSize: 18, color: colors.green500 }} />
                <Typography variant="body1" color={colors.green500} fontWeight={600}>
                  {t('bestPriceOnTheMarket')}
                </Typography>
              </Stack>
              {charterEndDate && (
                <Stack direction="row" alignItems="center" gap={0.75}>
                  <CheckCircleOutline sx={{ fontSize: 18, color: colors.green500 }} />
                  <Typography variant="body1" color={colors.green500} fontWeight={600}>
                    {t('supportFromStartTo', { date: charterEndDate })}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
    </>
  );
};

export default BookingHero;
