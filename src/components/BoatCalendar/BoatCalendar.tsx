'use client';

import React, { useMemo } from 'react';

import { Button, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

import Form from '@/components/Forms/Form';
import { BoatCalendarFormValues } from '@/config/form-models.config';
import { BOAT_CALENDAR_FORM } from '@/config/form-names.config';
import { YachtModel } from '@/models/yacht.model';
import useQueryParams from '@/utils/hooks/useQueryParams';
import DateTime from '@/utils/static/DateTime';
import { toggleBoatInquiryModalOpen } from '@/valtio/yacht/yacht.actions';

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
  const t = useTranslations('yacht');
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

  return (
    <Stack direction="column" className={styles.container}>
      <Stack pb={3}>
        <Form defaultValues={initialValues} onSubmit={handleSubmit} id={BOAT_CALENDAR_FORM} resetDefaultValues>
          <BoatCalendarForm yacht={yacht} variant={variant} />
        </Form>
      </Stack>
      <Stack spacing={2} className={styles.reachOutContent}>
        <Typography component="h3" variant="h4" fontWeight={700}>
          {t('anyQuestions')}
        </Typography>
        <Button size="medium" color="secondary" fullWidth onClick={toggleBoatInquiryModalOpen}>
          {t('reachOut')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default BoatCalendar;
