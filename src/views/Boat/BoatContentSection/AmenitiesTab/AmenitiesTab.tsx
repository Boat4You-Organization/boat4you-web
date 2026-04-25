import React from 'react';

import { Grid, List, ListItem, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import Amenities from '@/components/SvgIcons/Amenities';
import Check from '@/components/SvgIcons/Check';
import {
  YACHT_EQUIPMENT_CATEGORY_TYPE_LABEL_MAP,
  YachtAmenitiesKey,
  YachtAmenitiesModel,
  YachtEquipmentCategoryType,
} from '@/models/yacht-amenities.model';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';

interface AmenitiesTabProps {
  yacht: YachtModel;
}

const AmenitiesTab = ({ yacht }: AmenitiesTabProps) => {
  const t = useTranslations('yacht');
  const amenitiesT = useTranslations('yacht.amenitiesList');

  const renderAmenitiesList = (category: YachtEquipmentCategoryType) => {
    const filtered =
      yacht.amenities?.filter((amenity: YachtAmenitiesModel) => amenity.equipment.category === category) || [];

    if (filtered.length === 0) return null;

    return (
      <Grid component="section" size={{ xs: 12, md: 4 }}>
        <Typography variant="body1" fontWeight={700} color={colors.black950} pb={1.5}>
          {t(YACHT_EQUIPMENT_CATEGORY_TYPE_LABEL_MAP[category])}
        </Typography>
        <List dense disablePadding>
          {filtered.map((amenity: YachtAmenitiesModel) => (
            <ListItem
              key={`${category}-${amenity.id}`}
              sx={{
                px: 0,
                py: 0.4,
                gap: 1,
              }}
            >
              <Check size={18} fill={colors.black400} />
              <Typography variant="body2" color={colors.black700}>
                {amenitiesT(amenity.equipment.labelCode as YachtAmenitiesKey)}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Grid>
    );
  };

  const hasAmenities = yacht.amenities && yacht.amenities.length > 0;

  if (!hasAmenities) return null;

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

      <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start">
        {renderAmenitiesList(YachtEquipmentCategoryType.NAVIGATION_AND_SAFETY)}
        {renderAmenitiesList(YachtEquipmentCategoryType.SALOON_AND_CABINS)}
        {renderAmenitiesList(YachtEquipmentCategoryType.ENTERTAINMENT)}
      </Grid>
    </Stack>
  );
};

export default AmenitiesTab;
