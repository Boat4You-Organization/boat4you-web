import React from 'react';

import { Button, Grid, List, ListItem, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import ModalRoot from '@/components/ModalRoot';
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
import useToggleState from '@/utils/hooks/useToggleState';

interface AmenitiesTabProps {
  yacht: YachtModel;
}

const AmenitiesTab = ({ yacht }: AmenitiesTabProps) => {
  const t = useTranslations('yacht');
  const amenitiesT = useTranslations('yacht.amenitiesList');
  const [isModalOpen, toggleModal] = useToggleState();

  const renderAmenitiesList = (category: YachtEquipmentCategoryType, limit?: number) => {
    const filtered =
      yacht.amenities?.filter((amenity: YachtAmenitiesModel) => amenity.equipment.category === category) || [];
    const limited = limit ? filtered.slice(0, limit) : filtered;

    if (limited.length === 0) return null;

    return (
      <Grid component="section" size={{ xs: 12, md: 'auto' }}>
        <Typography variant="h4" component="h3" pb={3}>
          {t(YACHT_EQUIPMENT_CATEGORY_TYPE_LABEL_MAP[category])}
        </Typography>
        <List dense disablePadding>
          {limited.map((amenity: YachtAmenitiesModel) => (
            <ListItem key={`${category}-${amenity.id}`}>
              <Check size={24} fill={colors.black300} />
              {amenitiesT(amenity.equipment.labelCode as YachtAmenitiesKey)}
            </ListItem>
          ))}
        </List>
      </Grid>
    );
  };

  const hasAmenities = yacht.amenities && yacht.amenities.length > 0;

  const hasMoreThanFourInAnyCategory = [
    YachtEquipmentCategoryType.NAVIGATION_AND_SAFETY,
    YachtEquipmentCategoryType.SALOON_AND_CABINS,
    YachtEquipmentCategoryType.ENTERTAINMENT,
  ].some(category => {
    const categoryAmenities =
      yacht.amenities?.filter((amenity: YachtAmenitiesModel) => amenity.equipment.category === category) || [];

    return categoryAmenities.length > 4;
  });

  if (!hasAmenities) return null;

  return (
    <>
      <ModalRoot
        title={t('amenities')}
        open={isModalOpen}
        onOpen={toggleModal}
        onClose={toggleModal}
        hideCancelButton
        hideConfirmButton
      >
        <Grid container spacing={10} alignItems="flex-start">
          {renderAmenitiesList(YachtEquipmentCategoryType.NAVIGATION_AND_SAFETY)}
          {renderAmenitiesList(YachtEquipmentCategoryType.SALOON_AND_CABINS)}
          {renderAmenitiesList(YachtEquipmentCategoryType.ENTERTAINMENT)}
        </Grid>
      </ModalRoot>

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

        <Grid container spacing={10} alignItems="flex-start">
          {renderAmenitiesList(YachtEquipmentCategoryType.NAVIGATION_AND_SAFETY, 4)}
          {renderAmenitiesList(YachtEquipmentCategoryType.SALOON_AND_CABINS, 4)}
          {renderAmenitiesList(YachtEquipmentCategoryType.ENTERTAINMENT, 4)}
        </Grid>

        {hasMoreThanFourInAnyCategory && (
          <Button color="secondary" onClick={toggleModal}>
            {t('showAllAmenities')}
          </Button>
        )}
      </Stack>
    </>
  );
};

export default AmenitiesTab;
