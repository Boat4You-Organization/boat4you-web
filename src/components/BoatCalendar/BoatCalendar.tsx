'use client';

import React, { useMemo } from 'react';

import { Stack } from '@mui/material';
import dayjs from 'dayjs';

import Form from '@/components/Forms/Form';
import InquiryOnlyPanel from '@/components/InquiryOnlyPanel';
import { BoatCalendarFormValues } from '@/config/form-models.config';
import { BOAT_CALENDAR_FORM } from '@/config/form-names.config';
import { YachtModel } from '@/models/yacht.model';
import useQueryParams from '@/utils/hooks/useQueryParams';
import DateTime from '@/utils/static/DateTime';
import { isInquiryOnlyBoat } from '@/utils/static/inquiryOnlyBoat';

import styles from './BoatCalendar.module.scss';
import BoatCalendarForm from './BoatCalendarForm';

interface BoatCalendarProps {
  yacht: YachtModel;
  variant?: 'inner' | 'crewed';
}

const defaultValues: BoatCalendarFormValues = {
  startDate: null,
  endDate: null,
};

const BoatCalendar = ({ yacht, variant = 'inner' }: BoatCalendarProps) => {
  const { params, setMultipleParams } = useQueryParams();

  const initialValues = useMemo(
    () =>
      params
        ? {
            startDate: params.startDate ? dayjs(params.startDate) : null,
            endDate: params.endDate ? dayjs(params.endDate) : null,
          }
        : defaultValues,
    [params]
  );

  const handleSubmit = (formValues: BoatCalendarFormValues) => {
    const updates: Partial<{
      startDate: string;
      endDate: string;
    }> = {};

    if (formValues.startDate) {
      updates.startDate = DateTime.formatFull(formValues.startDate);
    }

    if (formValues.endDate) {
      updates.endDate = DateTime.formatFull(formValues.endDate);
    }

    setMultipleParams(updates);
  };

  // No bookable future offer: no dates, prices or Reserve here — only the
  // inquiry, where the visitor picks any dates.
  if (isInquiryOnlyBoat(yacht)) {
    return (
      <Stack direction="column" className={styles.container}>
        <InquiryOnlyPanel variant="sidebar" />
      </Stack>
    );
  }

  return (
    <Stack direction="column" className={styles.container}>
      <Form defaultValues={initialValues} onSubmit={handleSubmit} id={BOAT_CALENDAR_FORM} resetDefaultValues>
        <BoatCalendarForm yacht={yacht} variant={variant} />
      </Form>
    </Stack>
  );
};

export default BoatCalendar;
