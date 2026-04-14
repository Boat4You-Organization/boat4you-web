import React from 'react';

import { Box, CardMedia, Chip, Divider, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { Cabin } from '@/components/SvgIcons/BoatFeatures';
import Description from '@/components/SvgIcons/Description';
import Video from '@/components/SvgIcons/Video';
import { cabinFeaturesDescriptors, yachtFeatureDescriptors } from '@/config/yachtFeatureDescriptor.config';
import { MAIN_SAIL_TYPE_LABEL_MAP, MainSailType, VESSEL_TYPE_LABEL_MAP, YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { useBoatEquipmentDescription } from '@/utils/hooks/useBoatEquipmentDescription';
import getYouTubeEmbedUrl from '@/utils/static/getYoutubeEmbedUrlUtils';

import CabinInformationChip from './CabinInformationChip';
import styles from './DetailsTab.module.scss';

interface DetailsTabProps {
  yacht: YachtModel;
}

const DetailsTab = ({ yacht }: DetailsTabProps) => {
  const t = useTranslations();

  const generateDescription = useBoatEquipmentDescription();
  const description = generateDescription(yacht);

  const visibleCabinFeatures = cabinFeaturesDescriptors.filter(({ key }) => {
    const value = yacht[key];

    return value !== undefined && value !== null && value !== 0;
  });

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
          <Typography variant="body1" color={colors.black500}>
            {yacht.cabins && `${yacht.cabins}${t('yacht.lineCabin')} `}
            {yacht.cabins
              ? t(VESSEL_TYPE_LABEL_MAP[yacht.vesselType]).toLowerCase()
              : t(VESSEL_TYPE_LABEL_MAP[yacht.vesselType])}{' '}
            {yacht.model} – {yacht.name}
            {t('yacht.wasBuilt')} {yacht.buildYear} {t('yacht.andDockedIn')} {yacht.location.name}. {yacht.name}{' '}
            {t('yacht.canAccommodate')}
            {yacht.maxPersons} {t('yacht.peopleIn')} {yacht.cabins} {t('yacht.pillowIncluded')}{' '}
            {t(VESSEL_TYPE_LABEL_MAP[yacht.vesselType])} {yacht.name} {t('yacht.offers')} {yacht.wc}{' '}
            {t('yacht.toiletsWithShower')}. {description}
          </Typography>
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
        <Stack direction="row" gap={2} flexWrap="wrap">
          {yachtFeatureDescriptors
            .filter(({ key }) => key !== 'crewNumber')
            .map(({ key, label, icon: Icon }) => {
              const value = yacht[key];

              if (value === undefined || value === null || value === 0) return null;

              const displayValue = key === 'mainSailType' ? t(MAIN_SAIL_TYPE_LABEL_MAP[value as MainSailType]) : value;

              return (
                <Chip
                  key={key}
                  variant="outlined"
                  sx={{
                    color: colors.black950,
                    borderColor: colors.blue200,
                    borderRadius: '40px',
                    paddingInline: '12px 4px',
                    alignItems: 'center',

                    '.MuiChip-label': {
                      paddingBlock: '1px',
                      fontWeight: 600,
                    },
                  }}
                  icon={<Icon fill={colors.blue500} size={24} />}
                  label={`${displayValue} ${(label && t(`yacht.${label}`)) || ''}`}
                />
              );
            })}
        </Stack>
      </Stack>
      {visibleCabinFeatures.length > 0 && (
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
              <Cabin variant="secondary" size={32} /> {t('yacht.cabinInformation')}
            </Typography>
            <Stack direction="row" gap={8} alignItems="center" flexWrap="wrap">
              {cabinFeaturesDescriptors.map(({ key, label, icon: Icon }) => {
                const value = yacht[key];

                if (value === undefined || value === null || value === 0) return null;

                return (
                  <CabinInformationChip
                    key={key}
                    icon={Icon}
                    label={`${(label && t(`yacht.${label}`)) || ''}`}
                    value={value as number}
                  />
                );
              })}
            </Stack>
          </Stack>
        </>
      )}
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
