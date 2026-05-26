import React from 'react';

import { Box, Divider, Grid, ListItem, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import Amenities from '@/components/SvgIcons/Amenities';
import Check from '@/components/SvgIcons/Check';
import { ReservationDetails } from '@/models/reservation.model';
import {
  YACHT_EQUIPMENT_CATEGORY_TYPE_ARRAY,
  YACHT_EQUIPMENT_CATEGORY_TYPE_LABEL_MAP,
  YachtAmenitiesKey,
  YachtAmenitiesModel,
  YachtEquipmentCategoryType,
} from '@/models/yacht-amenities.model';
import colors from '@/styles/themes/colors';

interface AmenitiesTabProps {
  reservationDetails: ReservationDetails;
}

const AmenitiesTab = ({ reservationDetails }: AmenitiesTabProps) => {
  const t = useTranslations('yacht');
  const amenitiesT = useTranslations('yacht.amenitiesList');

  const renderAmenityLabel = (amenity: YachtAmenitiesModel): string => {
    if (amenity.equipment?.labelCode) {
      const translated = amenitiesT(amenity.equipment.labelCode as YachtAmenitiesKey);

      if (translated && translated !== amenity.equipment.labelCode) return translated;
    }

    return amenity.name || amenity.equipment?.labelCode || '';
  };

  const bucketCategory = (amenity: YachtAmenitiesModel): YachtEquipmentCategoryType => {
    const cat = amenity.equipment?.category;

    if (cat === YachtEquipmentCategoryType.SALOON_AND_CABINS) return YachtEquipmentCategoryType.INTERIOR;

    if (cat === YachtEquipmentCategoryType.NAVIGATION_AND_SAFETY) return YachtEquipmentCategoryType.NAVIGATION;

    if (cat && cat in YACHT_EQUIPMENT_CATEGORY_TYPE_LABEL_MAP) return cat as YachtEquipmentCategoryType;

    return YachtEquipmentCategoryType.DECK;
  };

  const renderCategoryRow = (
    category: YachtEquipmentCategoryType,
    items: YachtAmenitiesModel[],
    showDivider: boolean
  ) => {
    if (items.length === 0) return null;

    const sorted = [...items].sort((a, b) =>
      renderAmenityLabel(a).localeCompare(renderAmenityLabel(b), undefined, { sensitivity: 'base' })
    );

    return (
      <React.Fragment key={category}>
        {showDivider && <Divider sx={{ borderColor: colors.black100 }} />}
        <Grid container component="section" spacing={{ xs: 1.5, md: 3 }} py={2.5} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="body1" fontWeight={700} color={colors.black950}>
              {t(YACHT_EQUIPMENT_CATEGORY_TYPE_LABEL_MAP[category])}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <Grid container columnSpacing={{ xs: 2, md: 4 }}>
              {sorted.map(amenity => {
                const qty = amenity.quantity ? Number(amenity.quantity) : null;
                const qtyPrefix = qty && qty > 1 ? `${qty} x ` : '';
                const label = qtyPrefix + renderAmenityLabel(amenity);
                const comment = amenity.comment?.trim();

                return (
                  <Grid key={`${category}-${amenity.id}`} size={{ xs: 12, sm: 6 }}>
                    <ListItem
                      sx={{
                        px: amenity.highlight ? 1 : 0,
                        py: 0.5,
                        gap: 1,
                        alignItems: 'flex-start',
                        backgroundColor: amenity.highlight ? colors.yellow50 : 'transparent',
                        borderRadius: amenity.highlight ? 1 : 0,
                      }}
                    >
                      <Box pt="2px" flexShrink={0}>
                        <Check size={18} fill={colors.black400} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color={colors.black700} fontWeight={amenity.highlight ? 600 : 400}>
                          {label}
                        </Typography>
                        {comment && (
                          <Typography variant="caption" color={colors.black500} fontStyle="italic">
                            {comment}
                          </Typography>
                        )}
                      </Box>
                    </ListItem>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };

  const amenities = reservationDetails.amenities || [];

  if (amenities.length === 0) return null;

  const buckets: Record<string, YachtAmenitiesModel[]> = {};

  amenities.forEach(amenity => {
    const cat = bucketCategory(amenity);

    if (!buckets[cat]) buckets[cat] = [];

    buckets[cat].push(amenity);
  });

  const populatedRows = YACHT_EQUIPMENT_CATEGORY_TYPE_ARRAY.filter(({ type }) => (buckets[type] || []).length > 0);

  if (populatedRows.length === 0) return null;

  return (
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
        <Amenities variant="secondary" size={32} />
        {t('amenities')}
      </Typography>

      <Box
        sx={{
          px: { xs: 0, md: 1 },
          py: { xs: 1, md: 2 },
        }}
      >
        {populatedRows.map(({ type }, idx) => renderCategoryRow(type, buckets[type] || [], idx > 0))}
      </Box>
    </Stack>
  );
};

export default AmenitiesTab;
