import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

import Form from '@/components/Forms/Form';
import InquiryOnlyPanel from '@/components/InquiryOnlyPanel';
import Availablity from '@/components/SvgIcons/Availablity';
import { BoatCalendarFormValues } from '@/config/form-models.config';
import { AVAILABILITY_TAB_FORM } from '@/config/form-names.config';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import useQueryParams from '@/utils/hooks/useQueryParams';
import DateTime from '@/utils/static/DateTime';
import { isInquiryOnlyBoat, showsAllBookedCalendar } from '@/utils/static/inquiryOnlyBoat';
import { isHardBlocked } from '@/utils/static/offerStatusGate';
import { useYachtStore } from '@/valtio/yacht/yacht.store';

import AvailabilityCard from './AvailabilityCard';
import AvailabilityDateSelector from './AvailabilityDateSelector';
import LiveCalendar from './LiveCalendar';
import type { InitialCalendar } from './LiveCalendar/AvailabilitySlider';

interface AvailabilityTabProps {
  yacht: YachtModel;
  /** The calendar's weeks looked up on the server (boat page); null: the browser loads them. */
  initialCalendar?: InitialCalendar | null;
}

const defaultValues: BoatCalendarFormValues = {
  startDate: null,
  endDate: null,
};

const AvailabilityTab = ({ yacht, initialCalendar = null }: AvailabilityTabProps) => {
  const { offersToDisplay } = useYachtStore();
  const { params, setMultipleParams } = useQueryParams();
  const t = useTranslations('yacht');

  // Show booking cards only for offers that aren't hard-blocked. With the
  // honest 4-state status the block is RESERVATION/SERVICE (and the legacy
  // UNAVAILABLE fallback) — FREE + OPTION offers stay (OPTION routes to inquiry).
  const availableOffers = offersToDisplay.filter(offer => !isHardBlocked(offer.status));

  const initialValues =
    params.startDate && params.endDate
      ? {
          startDate: dayjs(params.startDate),
          endDate: dayjs(params.endDate),
        }
      : defaultValues;

  // No bookable future offer: no date selector and no offer card. The
  // calendar stays while the partner publishes weeks, every one reserved
  // (owner rule 16.10.2026, showsAllBookedCalendar); with none published the
  // inquiry takes its place.
  const inquiryOnly = isInquiryOnlyBoat(yacht);
  const allBooked = showsAllBookedCalendar(yacht);
  const displayAvailabilityDateSelector = !inquiryOnly && initialValues.startDate && initialValues.endDate;

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
          fontWeight={600}
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
          <Stack sx={{ p: { xs: 2, md: 3 } }}>
            {inquiryOnly && !allBooked ? (
              <InquiryOnlyPanel variant="inline" />
            ) : (
              <LiveCalendar yacht={yacht} allBooked={allBooked} initial={initialCalendar} />
            )}
          </Stack>
        </Stack>
        {displayAvailabilityDateSelector &&
          availableOffers.map(offer => <AvailabilityCard key={offer.id} yacht={yacht} offer={offer} />)}
      </Stack>
    </Stack>
  );
};

export default AvailabilityTab;
