/* eslint-disable no-nested-ternary */
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
import { DimensionInfo, ReservationDetails } from '@/models/reservation.model';
import { MAIN_SAIL_TYPE_LABEL_MAP, MainSailType, VESSEL_TYPE_LABEL_MAP, VesselType } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { useBoatEquipmentDescription } from '@/utils/hooks/useBoatEquipmentDescription';

interface DetailsTabProps {
  reservationDetails: ReservationDetails;
}

interface FeatureRow {
  key: string;
  icon: React.ElementType;
  label: string;
  value: string;
  badge?: string;
}

const formatMeasure = (info: DimensionInfo | null | undefined, fallback: number | null | undefined): string | null => {
  if (info && info.amount != null) {
    const unit = info.unit === 'METRE' ? 'm' : info.unit === 'FEET' ? 'ft' : '';

    return `${info.amount} ${unit}`.trim();
  }

  if (fallback != null) return `${fallback} m`;

  return null;
};

/** A positive count, else null (partner data sends null, 0 and negatives). */
const positiveOrNull = (value: number | null | undefined): number | null =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null;

const DetailsTab = ({ reservationDetails }: DetailsTabProps) => {
  const t = useTranslations();
  const locale = useLocale();

  const generateDescription = useBoatEquipmentDescription();
  const description = generateDescription(reservationDetails);

  const currentYear = new Date().getFullYear();
  const isNewYacht = Boolean(reservationDetails.buildYear && reservationDetails.buildYear >= currentYear - 1);

  const vesselKey = reservationDetails.vesselType as keyof typeof VESSEL_TYPE_LABEL_MAP;
  const vesselTypeRaw = VESSEL_TYPE_LABEL_MAP[vesselKey] ? t(VESSEL_TYPE_LABEL_MAP[vesselKey]) : '';
  const vesselTypeLabel = locale === 'de' ? vesselTypeRaw : vesselTypeRaw.toLowerCase();
  const guests = positiveOrNull(reservationDetails.maxPersons) ?? positiveOrNull(reservationDetails.berths);
  const cabins = positiveOrNull(reservationDetails.cabins);
  const wc = positiveOrNull(reservationDetails.wc);
  const bold = (chunks: React.ReactNode) => <strong>{chunks}</strong>;
  let accommodationKey: string | null = null;

  if (guests && cabins && wc) accommodationKey = 'yacht.descAccomV0';
  else if (guests && cabins) accommodationKey = 'yacht.descAccomNoWc';
  else if (cabins) accommodationKey = 'yacht.descCabinsOnly';
  else if (guests) accommodationKey = 'yacht.descGuestsOnly';

  const leftRowsRaw: (FeatureRow | null)[] = [
    reservationDetails.buildYear
      ? {
          key: 'year',
          icon: Calendar,
          label: t('filters.year'),
          value: String(reservationDetails.buildYear),
          badge: isNewYacht ? t('filters.newYacht') : undefined,
        }
      : null,
    reservationDetails.cabins
      ? {
          key: 'cabins',
          icon: Cabin,
          label: t('filters.cabins'),
          value: String(reservationDetails.cabins),
        }
      : null,
    reservationDetails.berths
      ? {
          key: 'berths',
          icon: SingleBed,
          label: t('filters.berths'),
          value: String(reservationDetails.berths),
        }
      : null,
    reservationDetails.maxPersons
      ? {
          key: 'people',
          icon: People,
          label: t('filters.people'),
          value: String(reservationDetails.maxPersons),
        }
      : null,
    reservationDetails.wc
      ? {
          key: 'toilets',
          icon: Toilet,
          label: t('filters.toilets'),
          value: String(reservationDetails.wc),
        }
      : null,
    reservationDetails.mainSailType && reservationDetails.mainSailType !== MainSailType.UNKNOWN
      ? {
          key: 'mainSail',
          icon: Mainsail,
          label: t('yacht.mainSailType'),
          value: t(MAIN_SAIL_TYPE_LABEL_MAP[reservationDetails.mainSailType]),
        }
      : null,
  ];

  const beamValue = formatMeasure(reservationDetails.beamInfo, reservationDetails.beam);
  const lengthValue = formatMeasure(reservationDetails.lengthInfo, reservationDetails.length);

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
    reservationDetails.fuelTank
      ? {
          key: 'fuelTank',
          icon: Fuel,
          label: t('filters.fuelTank'),
          value: `${reservationDetails.fuelTank} l`,
        }
      : null,
    reservationDetails.waterTank
      ? {
          key: 'waterTank',
          icon: WaterTank,
          label: t('filters.waterTank'),
          value: `${reservationDetails.waterTank} l`,
        }
      : null,
    reservationDetails.enginePower
      ? {
          key: 'engine',
          icon: Engine,
          label: t('filters.engine'),
          value: `${reservationDetails.enginePower} kW`,
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
    <Stack component="section" direction="column" spacing={3}>
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
      {/* Same sentences as the public boat page (DetailsTab): ICU plurals,
          no clause for a missing value ("up to  people", "1 toilets" and
          "was built in ." were printed before). */}
      <Typography variant="body1" color={colors.black500}>
        {t.rich(
          'yacht.descIntroShort' as never,
          {
            name: reservationDetails.yachtName,
            vesselType: vesselTypeLabel,
            model: reservationDetails.modelName || 'none',
            year: reservationDetails.buildYear ? String(reservationDetails.buildYear) : 'none',
            location: reservationDetails.locationFrom || 'none',
            b: bold,
          } as never
        )}{' '}
        {accommodationKey &&
          t.rich(accommodationKey as never, { name: reservationDetails.yachtName, maxPersons: guests, cabins, wc, b: bold } as never)}{' '}
        {wc &&
          accommodationKey !== 'yacht.descAccomV0' &&
          t.rich('yacht.descWcOnly' as never, { name: reservationDetails.yachtName, wc, b: bold } as never)}{' '}
        {description}
      </Typography>
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
  );
};

export default DetailsTab;
