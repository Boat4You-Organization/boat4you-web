/* eslint-disable no-nested-ternary, react/no-unstable-nested-components */
import React from 'react';

import { Box, Grid, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import CapacityText from '@/components/CapacityText';
import { ACCOMMODATION_ROW_KEYS, CAPACITY_ROW_ICONS } from '@/components/CapacityText/capacityRowIcons';
import { Beam, Dimensions, Fuel, WaterTank } from '@/components/SvgIcons/BoatFeatures';
import Calendar from '@/components/SvgIcons/Calendar';
import Description from '@/components/SvgIcons/Description';
import { MeasurementInfo } from '@/models/yacht-feature.model';
import { VESSEL_TYPE_LABEL_MAP, YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { useBoatEquipmentDescription } from '@/utils/hooks/useBoatEquipmentDescription';
import useCapacityFmt from '@/utils/hooks/useCapacityFmt';
import { accommodationProse } from '@/utils/static/capacityProse';
import { isInquiryOnlyBoat } from '@/utils/static/inquiryOnlyBoat';
import { toTitleCase } from '@/utils/static/toTitleCase';
import { Capacity, capacityFacts, capacityRows, fromYacht } from '@/utils/static/yachtCapacity';
import { yachtVariant } from '@/utils/static/yachtFaq';

interface DetailsTabProps {
  yacht: YachtModel;
  /** The boat's capacity resolved on the server for the page locale (note
   *  translations included); without it the tab resolves the API fields itself. */
  capacity?: Capacity;
}

interface FeatureRow {
  key: string;
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
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

const DetailsTab = ({ yacht, capacity: resolvedCapacity }: DetailsTabProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const capacityT = useCapacityFmt();
  // The partner's cabins / berths / WC / people / rig (capacity contract v1):
  // its own figures and notes, crew cabins and WC as figures of their own,
  // nothing estimated. On an older backend only the flat numbers.
  const capacity = resolvedCapacity ?? fromYacht(yacht, { locale });
  const facts = capacityFacts(capacity);
  const capacityRowList = capacityRows(capacity, capacityT);

  const generateDescription = useBoatEquipmentDescription();

  // Smart description template (Mario 29.8.2026): every paragraph exists in
  // five genuinely different phrasings and each yacht picks its combination
  // deterministically from its id — 5^5 combinations across the catalogue
  // instead of one identical text on every page (thin-content signal that
  // kept boat pages in Google's "Crawled — currently not indexed" bucket).
  // Deterministic => SSR and client always agree (no hydration mismatch).
  const DESC_VARIANTS = 5;
  const descVariant = (salt: number): number =>
    (((yacht.id ?? 0) % 100003) * (2 * salt + 1) + salt * 31) % DESC_VARIANTS;
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
  // German capitalises nouns ("Katamaran mit 4 Kabinen"); every other
  // locale reads the type mid-sentence in lower case. Templates that open
  // with the type use the capitalised form.
  const vesselTypeRaw = t(VESSEL_TYPE_LABEL_MAP[yacht.vesselType]);
  const vesselTypeLabel = locale === 'de' ? vesselTypeRaw : vesselTypeRaw.toLowerCase();
  const vesselTypeCap = vesselTypeLabel.charAt(0).toUpperCase() + vesselTypeLabel.slice(1);
  // Accommodation paragraph (capacityProse.ts): berths from berths, "on
  // board" from max. people, a shower only when the partner sends showers,
  // and no promise that bedding is included. The old sentences gave max.
  // persons as sleeping places and a shower per toilet (capacity contract C4).
  const { cabins } = facts;
  const bold = (chunks: React.ReactNode) => <strong>{chunks}</strong>;
  const accommodation = accommodationProse(facts, (salt, count) => yachtVariant(yacht.id, salt, count));
  // Engine clause from the partner's rig ("2 × 115 hp", MMK's own "2x60HP"),
  // never the engine-filter figure (it read "880 hp" for "Volvo MD 22 40 h.p.").
  const engineRow = capacityRowList.find(row => row.key === 'engine');
  const engineLang = engineRow?.segments.find(segment => segment.lang)?.lang;

  const currentYear = new Date().getFullYear();
  const isNewYacht = Boolean(yacht.buildYear && yacht.buildYear >= currentYear - 1);

  const beamValue = formatMeasure(yacht.beamInfo, yacht.beam);
  const lengthValue = formatMeasure(yacht.lengthInfo, yacht.length);

  // External (partner-synced) yachts render the original 2-column feature
  // grid below the description block — no "Guests" or "Specifications"
  // sub-headers, just every populated spec interleaved across two columns.
  // Custom yachts get a labelled "Specifications" grid instead so the
  // accommodation column reads as a clean summary. Cabins … crew, sails,
  // engine and draught come from capacityRows (yachtCapacity.ts): each row
  // only when the partner sends it, notes verbatim or from the reviewed
  // translation table, the custom engine text ahead of its power.
  const toFeatureRow = (row: (typeof capacityRowList)[number]): FeatureRow => ({
    key: row.key,
    icon: CAPACITY_ROW_ICONS[row.key],
    label: row.label,
    value: <CapacityText segments={row.segments} />,
  });
  const accommodationRows = capacityRowList.filter(row => ACCOMMODATION_ROW_KEYS.includes(row.key)).map(toFeatureRow);
  const rowByKey = (key: string): FeatureRow | null => {
    const row = capacityRowList.find(r => r.key === key);

    return row ? toFeatureRow(row) : null;
  };
  const yearRow: FeatureRow | null = yacht.buildYear
    ? {
        key: 'year',
        icon: Calendar,
        label: t('filters.year'),
        value: String(yacht.buildYear),
        badge: isNewYacht ? t('filters.newYacht') : undefined,
      }
    : null;
  const lengthRow: FeatureRow | null = lengthValue
    ? { key: 'length', icon: Dimensions, label: t('filters.length'), value: lengthValue }
    : null;
  const beamRow: FeatureRow | null = beamValue
    ? { key: 'beam', icon: Beam, label: t('filters.beam'), value: beamValue }
    : null;
  const fuelRow: FeatureRow | null = yacht.fuelTank
    ? { key: 'fuelTank', icon: Fuel, label: t('filters.fuelTank'), value: `${yacht.fuelTank} l` }
    : null;
  const waterRow: FeatureRow | null = yacht.waterTank
    ? { key: 'waterTank', icon: WaterTank, label: t('filters.waterTank'), value: `${yacht.waterTank} l` }
    : null;

  const leftRowsRaw: (FeatureRow | null)[] = yacht.custom ? accommodationRows : [yearRow, ...accommodationRows];

  const rightRowsRaw: (FeatureRow | null)[] = yacht.custom
    ? [
        yearRow,
        lengthRow,
        beamRow,
        rowByKey('draught'),
        rowByKey('engine'),
        fuelRow,
        waterRow,
        rowByKey('mainsail'),
        rowByKey('headsail'),
      ]
    : [
        lengthRow,
        beamRow,
        rowByKey('draught'),
        fuelRow,
        waterRow,
        rowByKey('mainsail'),
        rowByKey('headsail'),
        rowByKey('engine'),
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
        {/* The "Description" heading is desktop-only (Mario 20.7.2026) — on
            phones the text starts right away, pulled up without the header. */}
        <Typography
          component="h2"
          variant="h3"
          fontWeight={700}
          flexDirection="row"
          alignItems="center"
          gap={1}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
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
            {cabins && yacht.buildYear && locationLabel && yacht.model ? (
              <Typography variant="body1" color={colors.black500}>
                {t.rich(
                  `yacht.descIntroV${descVariant(1)}` as never,
                  {
                    cabins,
                    vesselType: vesselTypeLabel,
                    vesselTypeCap,
                    model: yacht.model,
                    name: displayName,
                    year: String(yacht.buildYear),
                    location: locationLabel,
                    b: bold,
                  } as never
                )}
              </Typography>
            ) : (
              // Short intro that survives missing model / year / base — each
              // part is an ICU select on the sentinel 'none', so a missing
              // value drops its clause instead of printing "built in ." .
              <Typography variant="body1" color={colors.black500}>
                {t.rich(
                  'yacht.descIntroShort' as never,
                  {
                    name: displayName,
                    vesselType: vesselTypeLabel,
                    model: yacht.model || 'none',
                    year: yacht.buildYear ? String(yacht.buildYear) : 'none',
                    location: locationLabel || 'none',
                    b: bold,
                  } as never
                )}
              </Typography>
            )}
            {accommodation.length > 0 && (
              <Typography variant="body1" color={colors.black500}>
                {accommodation.map((part, index) => (
                  <React.Fragment key={part.key}>
                    {index > 0 && ' '}
                    {t.rich(`yacht.${part.key}` as never, { ...part.values, name: displayName, b: bold } as never)}
                  </React.Fragment>
                ))}
              </Typography>
            )}
            {description && (
              <Typography variant="body1" color={colors.black500}>
                {description}
              </Typography>
            )}
            {lengthValue && beamValue && (yacht.fuelTank || yacht.waterTank) && (
              <Typography variant="body1" color={colors.black500}>
                {t.rich(
                  (engineRow ? `yacht.descSpecsV${descVariant(3)}` : `yacht.descSpecsShortV${descVariant(3)}`) as never,
                  {
                    name: displayName,
                    length: lengthValue,
                    beam: beamValue,
                    engine: engineRow?.value ?? '',
                    fuel: String(yacht.fuelTank ?? 0),
                    water: String(yacht.waterTank ?? 0),
                    b: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
                    // The partner's own engine label stays English (lang="en").
                    engineLabel: (chunks: React.ReactNode) =>
                      engineLang ? <span lang={engineLang}>{chunks}</span> : chunks,
                  } as never
                )}
              </Typography>
            )}
            {yacht.location?.name && (
              <Typography variant="body1" color={colors.black500}>
                {t.rich(
                  (countryName ? `yacht.descRegionV${descVariant(4)}` : 'yacht.descSailingRegionNoCountry') as never,
                  {
                    location: yacht.location.name,
                    country: countryName ?? '',
                    b: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
                  } as never
                )}
              </Typography>
            )}
            <Typography variant="body1" color={colors.black500}>
              {t.rich(
                // Booking copy ("book online", "real-time prices") would be
                // wrong for a boat without bookable offers — ask for dates.
                (isInquiryOnlyBoat(yacht) ? 'yacht.descCtaInquiry' : `yacht.descCtaV${descVariant(5)}`) as never,
                {
                  name: displayName,
                  b: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
                } as never
              )}
            </Typography>
          </Stack>
        )}
        {yacht.custom && yacht.description && (
          <Typography variant="body1" color={colors.black500}>
            {yacht.description}
          </Typography>
        )}
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
