import React from 'react';

import { Box, CardMedia, Divider, Grid, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import { Beam, Cabin, Dimensions, Engine, Fuel, Mainsail, People, SingleBed, Toilet, WaterTank } from '@/components/SvgIcons/BoatFeatures';
import Calendar from '@/components/SvgIcons/Calendar';
import Description from '@/components/SvgIcons/Description';
import Video from '@/components/SvgIcons/Video';
import { MeasurementInfo } from '@/models/yacht-feature.model';
import { MAIN_SAIL_TYPE_LABEL_MAP, MainSailType, VESSEL_TYPE_LABEL_MAP, YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { useBoatEquipmentDescription } from '@/utils/hooks/useBoatEquipmentDescription';
import getYouTubeEmbedUrl from '@/utils/static/getYoutubeEmbedUrlUtils';
import { toTitleCase } from '@/utils/static/toTitleCase';

import styles from './DetailsTab.module.scss';

interface DetailsTabProps {
  yacht: YachtModel;
}

interface FeatureRow {
  key: string;
  icon: React.ElementType;
  label: string;
  value: string;
  badge?: string;
}

const formatMeasure = (info: MeasurementInfo | null | undefined, fallback: number | null | undefined): string | null => {
  if (info && info.amount != null) {
    const unit = info.unit === 'METRE' ? 'm' : info.unit === 'FEET' ? 'ft' : '';
    return `${info.amount} ${unit}`.trim();
  }
  if (fallback != null) return `${fallback} m`;
  return null;
};

// Title-case helper lives in src/utils/static/toTitleCase.ts so every yacht
// name surface (search listing, hero, reservation, PDF) formats identically.

const DetailsTab = ({ yacht }: DetailsTabProps) => {
  const t = useTranslations();
  const locale = useLocale();

  const generateDescription = useBoatEquipmentDescription();
  const description = generateDescription(yacht);

  // Display-friendly name + "Marina Kaštela, Croatia" suffix. Country lookup
  // falls back gracefully when Intl.DisplayNames doesn't recognize the code
  // (or when location has no country code at all).
  const displayName = yacht.name ? toTitleCase(yacht.name) : yacht.name;
  const countryName = (() => {
    const code = yacht.location?.countryCode;
    if (!code) return null;
    try {
      return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? null;
    } catch {
      return null;
    }
  })();
  const locationLabel = yacht.location?.name
    ? countryName
      ? `${yacht.location.name}, ${countryName}`
      : yacht.location.name
    : null;
  const vesselTypeLabel = t(VESSEL_TYPE_LABEL_MAP[yacht.vesselType]).toLowerCase();

  const currentYear = new Date().getFullYear();
  const isNewYacht = Boolean(yacht.buildYear && yacht.buildYear >= currentYear - 1);

  const leftRowsRaw: (FeatureRow | null)[] = [
    yacht.buildYear
      ? {
          key: 'year',
          icon: Calendar,
          label: t('filters.year'),
          value: String(yacht.buildYear),
          badge: isNewYacht ? t('filters.newYacht') : undefined,
        }
      : null,
    yacht.cabins
      ? {
          key: 'cabins',
          icon: Cabin,
          label: t('filters.cabins'),
          value: String(yacht.cabins),
        }
      : null,
    yacht.berths
      ? {
          key: 'berths',
          icon: SingleBed,
          label: t('filters.berths'),
          value: String(yacht.berths),
        }
      : null,
    yacht.maxPersons
      ? {
          key: 'people',
          icon: People,
          label: t('filters.people'),
          value: String(yacht.maxPersons),
        }
      : null,
    yacht.wc
      ? {
          key: 'toilets',
          icon: Toilet,
          label: t('filters.toilets'),
          value: String(yacht.wc),
        }
      : null,
    yacht.mainSailType && yacht.mainSailType !== MainSailType.UNKNOWN
      ? {
          key: 'mainSail',
          icon: Mainsail,
          label: t('yacht.mainSailType'),
          value: t(MAIN_SAIL_TYPE_LABEL_MAP[yacht.mainSailType]),
        }
      : null,
  ];

  const beamValue = formatMeasure(yacht.beamInfo, yacht.beam);
  const lengthValue = formatMeasure(yacht.lengthInfo, yacht.length);

  const rightRowsRaw: (FeatureRow | null)[] = [
    lengthValue
      ? {
          key: 'length',
          icon: Dimensions,
          label: t('filters.length'),
          value: lengthValue,
        }
      : null,
    beamValue
      ? {
          key: 'beam',
          icon: Beam,
          label: t('filters.beam'),
          value: beamValue,
        }
      : null,
    yacht.fuelTank
      ? {
          key: 'fuelTank',
          icon: Fuel,
          label: t('filters.fuelTank'),
          value: `${yacht.fuelTank} l`,
        }
      : null,
    yacht.waterTank
      ? {
          key: 'waterTank',
          icon: WaterTank,
          label: t('filters.waterTank'),
          value: `${yacht.waterTank} l`,
        }
      : null,
    yacht.enginePower
      ? {
          key: 'engine',
          icon: Engine,
          label: t('filters.engine'),
          value: `${yacht.enginePower} kW`,
        }
      : null,
  ];

  const leftRows = leftRowsRaw.filter((r): r is FeatureRow => r !== null);
  const rightRows = rightRowsRaw.filter((r): r is FeatureRow => r !== null);

  const renderRow = ({ key, icon: Icon, label, value, badge }: FeatureRow, isLast: boolean) => (
    <Stack
      key={key}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      py={1.25}
      borderBottom={isLast ? 'none' : `1px solid ${colors.black200}`}
    >
      <Stack direction="row" alignItems="center" gap={1.25}>
        <Icon size={20} fill={colors.black500} />
        <Typography variant="body2" color={colors.black600}>
          {label}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" gap={1}>
        {badge && (
          <Box
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: 1,
              backgroundColor: colors.blue50,
              color: colors.blue500,
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {badge}
          </Box>
        )}
        <Typography variant="body2" fontWeight={700} color={colors.black950}>
          {value}
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <Stack component="section" direction="column">
      <Stack direction="column" spacing={3}>
        <Typography
          component="h2"
          variant="h3"
          fontWeight={700}
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={1}
        >
          <Description variant="secondary" size={32} /> {t('yacht.descriptionTitle')}
        </Typography>
        {!yacht.custom && (
          // SEO-rich description: scannable paragraphs (intro, accommodation,
          // toilets, equipment, specs, sailing region, CTA). More content
          // means stronger long-tail keyword coverage, and the "a/an … and"
          // output from the equipment hook reads as natural English. Each
          // paragraph is conditional on underlying data — missing specs or
          // location just collapses that block rather than rendering "null".
          //
          // Key SEO terms (yacht name, model, location, country, main stats)
          // are bolded so they stand out both to readers and search-engine
          // parsers. Translations use <b>…</b> markers and `t.rich()`
          // renders them through a <strong> handler to keep semantic HTML.
          <Stack direction="column" spacing={2}>
            <Typography variant="body1" color={colors.black500}>
              {yacht.cabins ? `${yacht.cabins}${t('yacht.lineCabin')} ${vesselTypeLabel}` : vesselTypeLabel}{' '}
              <strong>{yacht.model}</strong> – <strong>{displayName}</strong>
              {t('yacht.wasBuilt')} <strong>{yacht.buildYear}</strong>
              {locationLabel && (
                <>
                  {' '}
                  {t('yacht.andDockedIn')} <strong>{locationLabel}</strong>
                </>
              )}
              .
            </Typography>
            {(yacht.maxPersons || yacht.cabins) && (
              <Typography variant="body1" color={colors.black500}>
                <strong>{displayName}</strong> {t('yacht.canAccommodate')}
                <strong>{yacht.maxPersons}</strong> {t('yacht.peopleIn')}{' '}
                <strong>{yacht.cabins}</strong> {t('yacht.pillowIncluded')}
              </Typography>
            )}
            {yacht.wc && (
              <Typography variant="body1" color={colors.black500}>
                {t(VESSEL_TYPE_LABEL_MAP[yacht.vesselType])} <strong>{displayName}</strong>{' '}
                {t('yacht.offers')} <strong>{yacht.wc}</strong> {t('yacht.toiletsWithShower')}.
              </Typography>
            )}
            {description && (
              <Typography variant="body1" color={colors.black500}>
                {description}
              </Typography>
            )}
            {lengthValue && beamValue && (yacht.fuelTank || yacht.waterTank) && (
              <Typography variant="body1" color={colors.black500}>
                {t.rich(yacht.enginePower ? 'yacht.descSpecs' : 'yacht.descSpecsShort', {
                  name: displayName,
                  length: lengthValue,
                  beam: beamValue,
                  engine: String(yacht.enginePower ?? ''),
                  fuel: String(yacht.fuelTank ?? 0),
                  water: String(yacht.waterTank ?? 0),
                  b: chunks => <strong>{chunks}</strong>,
                })}
              </Typography>
            )}
            {yacht.location?.name && (
              <Typography variant="body1" color={colors.black500}>
                {t.rich(countryName ? 'yacht.descSailingRegion' : 'yacht.descSailingRegionNoCountry', {
                  location: yacht.location.name,
                  country: countryName ?? '',
                  b: chunks => <strong>{chunks}</strong>,
                })}
              </Typography>
            )}
            <Typography variant="body1" color={colors.black500}>
              {t.rich('yacht.descCTA', {
                name: displayName,
                b: chunks => <strong>{chunks}</strong>,
              })}
            </Typography>
          </Stack>
        )}
        {yacht.custom && yacht.description && (
          <Typography variant="body1" color={colors.black500}>
            {yacht.description}
          </Typography>
        )}
        {yacht.custom && yacht.customDetails.priceDescription && (
          <Typography variant="body1" color={colors.black500} whiteSpace="pre-line">
            {yacht.customDetails.priceDescription}
          </Typography>
        )}
        {(leftRows.length > 0 || rightRows.length > 0) && (
          <Grid container columnSpacing={{ xs: 0, md: 8 }} rowSpacing={0} pt={1}>
            <Grid size={{ xs: 12, md: 6 }}>
              {leftRows.map((row, idx) => renderRow(row, idx === leftRows.length - 1))}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {rightRows.map((row, idx) => renderRow(row, idx === rightRows.length - 1))}
            </Grid>
          </Grid>
        )}
      </Stack>
      {yacht.custom && yacht.customDetails && yacht.customDetails.videoUrl && (
        <>
          <Divider
            sx={{
              '&.MuiDivider-root': {
                borderColor: colors.black200,
                my: 4,
              },
            }}
          />
          <Stack direction="column" spacing={3}>
            <Typography
              component="h2"
              variant="h3"
              fontWeight={700}
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap={1}
            >
              <Video variant="secondary" size={32} /> {t('yacht.videoTitle')}
            </Typography>
            <Box className={styles.videoContainer}>
              <CardMedia
                component="iframe"
                src={getYouTubeEmbedUrl(yacht.customDetails.videoUrl)}
                title={`${yacht.name} video`}
                allowFullScreen
                className={styles.media}
                sandbox="allow-scripts allow-same-origin allow-presentation"
              />
            </Box>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default DetailsTab;
