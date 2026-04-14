import { Chip, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import Description from '@/components/SvgIcons/Description';
import { yachtFeatureDescriptors } from '@/config/yachtFeatureDescriptor.config';
import { ReservationDetails } from '@/models/reservation.model';
import { MAIN_SAIL_TYPE_LABEL_MAP, MainSailType, VESSEL_TYPE_LABEL_MAP } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { useBoatEquipmentDescription } from '@/utils/hooks/useBoatEquipmentDescription';

interface DetailsTabProps {
  reservationDetails: ReservationDetails;
}

const DetailsTab = ({ reservationDetails }: DetailsTabProps) => {
  const t = useTranslations();

  const generateDescription = useBoatEquipmentDescription();
  const description = generateDescription(reservationDetails);

  return (
    <Stack component="section">
      <Stack direction="row" alignItems="center" gap={1}>
        <Description size={32} variant="secondary" />
        <Typography variant="h3" component="h2" fontWeight={700}>
          {t('common.reservationTabs.details')}
        </Typography>
      </Stack>
      <Typography variant="body1" color={colors.black500} mt={3}>
        {reservationDetails.cabins && `${reservationDetails.cabins}${t('yacht.lineCabin')} `}
        {reservationDetails.cabins
          ? t(VESSEL_TYPE_LABEL_MAP[reservationDetails.vesselType as keyof typeof VESSEL_TYPE_LABEL_MAP]).toLowerCase()
          : t(VESSEL_TYPE_LABEL_MAP[reservationDetails.vesselType as keyof typeof VESSEL_TYPE_LABEL_MAP])}{' '}
        {reservationDetails.modelName} – {reservationDetails.yachtName}
        {t('yacht.wasBuilt')} {reservationDetails.buildYear} {t('yacht.andDockedIn')} {reservationDetails.locationFrom}.{' '}
        {reservationDetails.yachtName} {t('yacht.canAccommodate')}
        {reservationDetails.maxPersons} {t('yacht.peopleIn')} {reservationDetails.cabins} {t('yacht.pillowIncluded')}{' '}
        {t(VESSEL_TYPE_LABEL_MAP[reservationDetails.vesselType as keyof typeof VESSEL_TYPE_LABEL_MAP])}{' '}
        {reservationDetails.yachtName} {t('yacht.offers')} {reservationDetails.wc} {t('yacht.toiletsWithShower')}.{' '}
        {description}
      </Typography>
      <Stack direction="row" gap={2} flexWrap="wrap" mt={3}>
        {yachtFeatureDescriptors.map(({ key, label, icon: Icon }) => {
          const value = reservationDetails[key as keyof ReservationDetails];

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
  );
};

export default DetailsTab;
