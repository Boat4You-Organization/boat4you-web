/* eslint-disable no-nested-ternary */
import React from 'react';

import { Box, Grid, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import CapacityText from '@/components/CapacityText';
import { ACCOMMODATION_ROW_KEYS, CAPACITY_ROW_ICONS } from '@/components/CapacityText/capacityRowIcons';
import { Beam, Dimensions, Fuel, WaterTank } from '@/components/SvgIcons/BoatFeatures';
import Calendar from '@/components/SvgIcons/Calendar';
import Description from '@/components/SvgIcons/Description';
import { DimensionInfo, ReservationDetails } from '@/models/reservation.model';
import { VESSEL_TYPE_LABEL_MAP } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { useBoatEquipmentDescription } from '@/utils/hooks/useBoatEquipmentDescription';
import useCapacityFmt from '@/utils/hooks/useCapacityFmt';
import useCapacityNotes from '@/utils/hooks/useCapacityNotes';
import { accommodationProse } from '@/utils/static/capacityProse';
import { capacityFacts, capacityRows, fromYacht } from '@/utils/static/yachtCapacity';

interface DetailsTabProps {
  reservationDetails: ReservationDetails;
}

interface FeatureRow {
  key: string;
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
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
  const locale = useLocale();

  const generateDescription = useBoatEquipmentDescription();
  const description = generateDescription(reservationDetails);

  const currentYear = new Date().getFullYear();
  const isNewYacht = Boolean(reservationDetails.buildYear && reservationDetails.buildYear >= currentYear - 1);

  const vesselKey = reservationDetails.vesselType as keyof typeof VESSEL_TYPE_LABEL_MAP;
  const vesselTypeRaw = VESSEL_TYPE_LABEL_MAP[vesselKey] ? t(VESSEL_TYPE_LABEL_MAP[vesselKey]) : '';
  const vesselTypeLabel = locale === 'de' ? vesselTypeRaw : vesselTypeRaw.toLowerCase();
  // The booked boat's capacity as the partner sends it (yachtCapacity.ts):
  // the same rows and sentences as the boat page, the crew count only for
  // a crewed charter (the reservation's own charter type).
  const capacityT = useCapacityFmt();
  const noteOptions = useCapacityNotes(locale, reservationDetails);
  const capacity = fromYacht(reservationDetails, { locale, ...noteOptions });
  const capacityRowList = capacityRows(capacity, capacityT);
  const bold = (chunks: React.ReactNode) => <strong>{chunks}</strong>;
  const accommodation = accommodationProse(capacityFacts(capacity), () => 0);
  const toFeatureRow = (row: (typeof capacityRowList)[number]): FeatureRow => ({
    key: row.key,
    icon: CAPACITY_ROW_ICONS[row.key],
    label: row.label,
    value: <CapacityText segments={row.segments} />,
  });
  const rowByKey = (key: string): FeatureRow | null => {
    const row = capacityRowList.find(r => r.key === key);

    return row ? toFeatureRow(row) : null;
  };

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
    ...capacityRowList.filter(row => ACCOMMODATION_ROW_KEYS.includes(row.key)).map(toFeatureRow),
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
    rowByKey('draught'),
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
        )}
        {accommodation.map(part => (
          <React.Fragment key={part.key}>
            {' '}
            {t.rich(
              `yacht.${part.key}` as never,
              { ...part.values, name: reservationDetails.yachtName, b: bold } as never
            )}
          </React.Fragment>
        ))}{' '}
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
