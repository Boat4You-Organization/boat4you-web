import React from 'react';

import { Box, Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

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

const DetailsTab = ({ reservationDetails }: DetailsTabProps) => {
  const t = useTranslations();

  const generateDescription = useBoatEquipmentDescription();
  const description = generateDescription(reservationDetails);

  const currentYear = new Date().getFullYear();
  const isNewYacht = Boolean(reservationDetails.buildYear && reservationDetails.buildYear >= currentYear - 1);

  const vesselKey = reservationDetails.vesselType as keyof typeof VESSEL_TYPE_LABEL_MAP;

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
      <Typography variant="body1" color={colors.black500}>
        {reservationDetails.cabins && `${reservationDetails.cabins}${t('yacht.lineCabin')} `}
        {reservationDetails.cabins
          ? t(VESSEL_TYPE_LABEL_MAP[vesselKey]).toLowerCase()
          : t(VESSEL_TYPE_LABEL_MAP[vesselKey])}{' '}
        {reservationDetails.modelName} – {reservationDetails.yachtName}
        {t('yacht.wasBuilt')} {reservationDetails.buildYear}
        {reservationDetails.locationFrom && ` ${t('yacht.andDockedIn')} ${reservationDetails.locationFrom}`}.{' '}
        {reservationDetails.yachtName} {t('yacht.canAccommodate')}
        {reservationDetails.maxPersons} {t('yacht.peopleIn')} {reservationDetails.cabins} {t('yacht.pillowIncluded')}{' '}
        {t(VESSEL_TYPE_LABEL_MAP[vesselKey])} {reservationDetails.yachtName} {t('yacht.offers')} {reservationDetails.wc}{' '}
        {t('yacht.toiletsWithShower')}. {description}
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
