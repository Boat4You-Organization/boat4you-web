import { Divider, Grid, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

import Form from '@/components/Forms/Form';
import Availablity from '@/components/SvgIcons/Availablity';
import Bulp from '@/components/SvgIcons/Bulp';
import { BoatCalendarFormValues } from '@/config/form-models.config';
import { AVAILABILITY_TAB_FORM } from '@/config/form-names.config';
import { Status } from '@/models/yacht-offer.model';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import useQueryParams from '@/utils/hooks/useQueryParams';
import DateTime from '@/utils/static/DateTime';
import { generateGoogleMapsLink } from '@/utils/static/googleMapsUtils';
import { useYachtStore } from '@/valtio/yacht/yacht.store';
import GoodToKnowItem from '@/views/Boat/BoatContentSection/GoodToKnowItem';

import AvailabilityCard from './AvailabilityCard';
import AvailabilityDateSelector from './AvailabilityDateSelector';
import AvailabilityStandardOffers from './AvailabilityStandardOffers';

interface AvailabilityTabProps {
  yacht: YachtModel;
}

const defaultValues: BoatCalendarFormValues = {
  startDate: null,
  endDate: null,
};

const AvailabilityTab = ({ yacht }: AvailabilityTabProps) => {
  const { offersToDisplay, selectedOffer } = useYachtStore();
  const { params, setMultipleParams } = useQueryParams();
  const t = useTranslations('yacht');
  const tCommon = useTranslations('common');

  const availableOffers = offersToDisplay.filter(offer => offer.status !== Status.UNAVAILABLE);

  const initialValues =
    params.startDate && params.endDate
      ? {
          startDate: dayjs(params.startDate),
          endDate: dayjs(params.endDate),
        }
      : defaultValues;

  const displayAvailabilityDateSelector = initialValues.startDate && initialValues.endDate;

  const handleSubmit = (formValues: BoatCalendarFormValues) => {
    const updates: Partial<{
      startDate: string;
      endDate: string;
    }> = {};

    if (formValues.startDate) {
      updates.startDate = DateTime.formatFull(formValues.startDate);
    } else {
      updates.startDate = '';
    }

    if (formValues.endDate) {
      updates.endDate = DateTime.formatFull(formValues.endDate);
    } else {
      updates.endDate = '';
    }

    setMultipleParams(updates);
  };

  return (
    <Stack component="section">
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
          <Availablity variant="secondary" size={32} />
          {t('availability')}
        </Typography>
        <Stack direction="column" borderRadius={2.5} overflow="hidden" border={`1px solid ${colors.blue200}`}>
          {displayAvailabilityDateSelector && (
            <Form defaultValues={initialValues} onSubmit={handleSubmit} id={AVAILABILITY_TAB_FORM} resetDefaultValues>
              <AvailabilityDateSelector onSubmit={handleSubmit} yacht={yacht} />
            </Form>
          )}
          <AvailabilityStandardOffers yachtSlug={yacht.slug} />
        </Stack>
        {displayAvailabilityDateSelector &&
          availableOffers.map(offer => <AvailabilityCard key={offer.id} yacht={yacht} offer={offer} />)}
      </Stack>
      <Divider
        sx={{
          '&.MuiDivider-root': {
            borderColor: colors.black200,
            my: 4,
          },
        }}
      />
      <Stack direction="column" spacing={4}>
        <Typography
          component="h2"
          variant="h3"
          fontWeight={700}
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={1}
        >
          <Bulp variant="secondary" size={32} />
          {t('goodToKnow')}
        </Typography>

        <Grid container spacing={4}>
          <GoodToKnowItem title={tCommon('pickUpTime')} value={yacht.defaultCheckin || selectedOffer?.checkin || '-'} />
          <GoodToKnowItem
            title={tCommon('dropOffTime')}
            value={yacht.defaultCheckout || selectedOffer?.checkout || '-'}
          />
          <GoodToKnowItem title={tCommon('paymentMethod')} value={t('localCurrency')} />
          <GoodToKnowItem title={tCommon('sailingLicenceRequired')} value={t('standardSailingLicence')} />
          <GoodToKnowItem title={tCommon('cancellationPolicy')} value={t('cancellationPolicyDescription')} />
          <GoodToKnowItem
            title={tCommon('pickUpLocation')}
            value={yacht.location.name ?? ''}
            link={generateGoogleMapsLink(yacht.location.name ?? '')}
          />
        </Grid>
      </Stack>
    </Stack>
  );
};

export default AvailabilityTab;
