/* eslint-disable no-nested-ternary, react/no-unstable-nested-components */
import React from 'react';

import { Box, Grid, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import {
  Beam,
  Cabin,
  Dimensions,
  Engine,
  Fuel,
  Mainsail,
  People,
  SingleBed,
  Toilet,
  WaterTank,
} from '@/components/SvgIcons/BoatFeatures';
import Calendar from '@/components/SvgIcons/Calendar';
import Description from '@/components/SvgIcons/Description';
import { MeasurementInfo } from '@/models/yacht-feature.model';
import { MAIN_SAIL_TYPE_LABEL_MAP, MainSailType, VESSEL_TYPE_LABEL_MAP, YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { useBoatEquipmentDescription } from '@/utils/hooks/useBoatEquipmentDescription';
import { toTitleCase } from '@/utils/static/toTitleCase';

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

const formatMeasure = (
  info: MeasurementInfo | null | undefined,
  fallback: number | null | undefined
): string | null => {
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

  const beamValue = formatMeasure(yacht.beamInfo, yacht.beam);
  const lengthValue = formatMeasure(yacht.lengthInfo, yacht.length);

  // External (partner-synced) yachts render the original 2-column feature
  // grid below the description block — no "Guests" or "Specifications"
  // sub-headers, just every populated spec interleaved across two columns.
  // Custom yachts get a labelled 4+4 "Specifications" grid instead so the
  // Cabins/Berths/Guests/Crew column reads as a clean accommodation
  // summary; the right column carries the boat-itself specs and prefers
  // customDetails.engineText over the kW numeric.
  const leftRowsRaw: (FeatureRow | null)[] = yacht.custom
    ? [
        yacht.cabins ? { key: 'cabins', icon: Cabin, label: t('filters.cabins'), value: String(yacht.cabins) } : null,
        yacht.berths
          ? { key: 'berths', icon: SingleBed, label: t('filters.berths'), value: String(yacht.berths) }
          : null,
        yacht.maxPersons
          ? { key: 'guests', icon: People, label: t('yacht.maxPassengers'), value: String(yacht.maxPersons) }
          : null,
        yacht.crewNumber && yacht.crewNumber > 0
          ? { key: 'crew', icon: People, label: t('yacht.crew'), value: String(yacht.crewNumber) }
          : null,
      ]
    : [
        yacht.buildYear
          ? {
              key: 'year',
              icon: Calendar,
              label: t('filters.year'),
              value: String(yacht.buildYear),
              badge: isNewYacht ? t('filters.newYacht') : undefined,
            }
          : null,
        yacht.cabins ? { key: 'cabins', icon: Cabin, label: t('filters.cabins'), value: String(yacht.cabins) } : null,
        yacht.berths
          ? { key: 'berths', icon: SingleBed, label: t('filters.berths'), value: String(yacht.berths) }
          : null,
        yacht.maxPersons
          ? { key: 'people', icon: People, label: t('yacht.maxPassengers'), value: String(yacht.maxPersons) }
          : null,
        yacht.wc ? { key: 'toilets', icon: Toilet, label: t('filters.toilets'), value: String(yacht.wc) } : null,
        yacht.mainSailType && yacht.mainSailType !== MainSailType.UNKNOWN
          ? {
              key: 'mainSail',
              icon: Mainsail,
              label: t('yacht.mainSailType'),
              value: t(MAIN_SAIL_TYPE_LABEL_MAP[yacht.mainSailType]),
            }
          : null,
      ];

  const rightRowsRaw: (FeatureRow | null)[] = yacht.custom
    ? [
        yacht.buildYear
          ? {
              key: 'year',
              icon: Calendar,
              label: t('filters.year'),
              value: String(yacht.buildYear),
              badge: isNewYacht ? t('filters.newYacht') : undefined,
            }
          : null,
        lengthValue ? { key: 'length', icon: Dimensions, label: t('filters.length'), value: lengthValue } : null,
        beamValue ? { key: 'beam', icon: Beam, label: t('filters.beam'), value: beamValue } : null,
        yacht.customDetails?.engineText
          ? { key: 'engine', icon: Engine, label: t('filters.engine'), value: yacht.customDetails.engineText }
          : yacht.enginePower
            ? { key: 'engine', icon: Engine, label: t('filters.engine'), value: `${yacht.enginePower} kW` }
            : null,
        yacht.fuelTank
          ? { key: 'fuelTank', icon: Fuel, label: t('filters.fuelTank'), value: `${yacht.fuelTank} l` }
          : null,
        yacht.waterTank
          ? { key: 'waterTank', icon: WaterTank, label: t('filters.waterTank'), value: `${yacht.waterTank} l` }
          : null,
        yacht.wc ? { key: 'toilets', icon: Toilet, label: t('filters.toilets'), value: String(yacht.wc) } : null,
        yacht.mainSailType && yacht.mainSailType !== MainSailType.UNKNOWN
          ? {
              key: 'mainSail',
              icon: Mainsail,
              label: t('yacht.mainSailType'),
              value: t(MAIN_SAIL_TYPE_LABEL_MAP[yacht.mainSailType]),
            }
          : null,
      ]
    : [
        lengthValue ? { key: 'length', icon: Dimensions, label: t('filters.length'), value: lengthValue } : null,
        beamValue ? { key: 'beam', icon: Beam, label: t('filters.beam'), value: beamValue } : null,
        yacht.fuelTank
          ? { key: 'fuelTank', icon: Fuel, label: t('filters.fuelTank'), value: `${yacht.fuelTank} l` }
          : null,
        yacht.waterTank
          ? { key: 'waterTank', icon: WaterTank, label: t('filters.waterTank'), value: `${yacht.waterTank} l` }
          : null,
        yacht.enginePower
          ? { key: 'engine', icon: Engine, label: t('filters.engine'), value: `${yacht.enginePower} kW` }
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
        {/* Description is desktop-only — on phones it pushed the key facts far
            below the fold (Mario 20.7.2026). display:none keeps the SEO-rich
            text in the DOM for crawlers. */}
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
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
                    <strong>{yacht.maxPersons}</strong> {t('yacht.peopleIn')} <strong>{yacht.cabins}</strong>{' '}
                    {t('yacht.pillowIncluded')}
                  </Typography>
                )}
                {yacht.wc && (
                  <Typography variant="body1" color={colors.black500}>
                    {t(VESSEL_TYPE_LABEL_MAP[yacht.vesselType])} <strong>{displayName}</strong> {t('yacht.offers')}{' '}
                    <strong>{yacht.wc}</strong> {t('yacht.toiletsWithShower')}.
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
          </Stack>
        </Box>
        {/* priceDescription was here previously — moved to AmenitiesTab so
            the High/Mid/Low season pricing block sits below the amenities
            grid where users expect price-related details. */}
        {/* Guests rows previously had their own header here — folded into
            the Specifications grid below as the LEFT column (Cabins,
            Berths, Guests, Crew). RIGHT carries the boat-itself specs
            (Year, Length, Beam, Engine + remaining). */}
        {(leftRows.length > 0 || rightRows.length > 0) &&
          (yacht.custom ? (
            // Custom yachts get a labelled "Specifications" header — the
            // 4+4 grid is grouped semantically (accommodation vs boat-self)
            // so the header tells users what they're looking at.
            <Stack direction="column" spacing={2} pt={1}>
              <Typography component="h3" variant="h4" fontWeight={700}>
                {t('yacht.specifications')}
              </Typography>
              <Grid container columnSpacing={{ xs: 0, md: 8 }} rowSpacing={0}>
                <Grid size={{ xs: 12, md: 6 }}>
                  {leftRows.map((row, idx) => renderRow(row, idx === leftRows.length - 1))}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  {rightRows.map((row, idx) => renderRow(row, idx === rightRows.length - 1))}
                </Grid>
              </Grid>
            </Stack>
          ) : (
            // External (synced) yachts keep the original layout — flat
            // 2-column feature grid below the description, no sub-header.
            // Mario reverted this for non-custom listings after the
            // labelled regroup made the partner-data view feel clunky.
            <Grid container columnSpacing={{ xs: 0, md: 8 }} rowSpacing={0} pt={1}>
              <Grid size={{ xs: 12, md: 6 }}>
                {leftRows.map((row, idx) => renderRow(row, idx === leftRows.length - 1))}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                {rightRows.map((row, idx) => renderRow(row, idx === rightRows.length - 1))}
              </Grid>
            </Grid>
          ))}
      </Stack>
      {/* Video block previously rendered here for custom yachts —
          extracted to its own tab (VideoTab) between Good to know and FAQ
          so users can jump straight to it from the tab bar. */}
    </Stack>
  );
};

export default DetailsTab;
