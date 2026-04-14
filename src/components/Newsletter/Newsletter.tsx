'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { Button, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';

import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import { FormValidator } from '@/utils/static/FormValidator';

import ResponseMessage from './ResponseMessage';

type FormFields = {
  email: string;
};

const defaultValues: FormFields = {
  email: '',
};

const Newsletter = () => {
  const [status, setStatus] = useState<number | null>(null);
  const t = useTranslations('common');
  const validator = FormValidator.withTranslation(t);

  const handleSubmit = async (formValues: FormFields, methods: UseFormReturn<FormFields>) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    try {
      const response = await fetch(`${baseUrl}/api/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        throw new Error('Error sending email');
      }

      setStatus(response.status);

      if (response.status === 200) {
        methods.reset(defaultValues);
      }
    } catch (error) {
      setStatus(500);
    }
  };

  return (
    <Form defaultValues={defaultValues} onSubmit={handleSubmit} mode="onBlur">
      {status ? (
        <ResponseMessage status={status} />
      ) : (
        <Stack direction="row" gap={1.5}>
          <FormInput
            name="email"
            type="email"
            placeholder={t('newsletter.input-email')}
            validate={FormValidator.all(validator.isNotEmpty, validator.isValidEmail)}
          />
          <Button
            color="secondary"
            size="large"
            sx={{
              height: 'auto',
              maxHeight: '47px',
              minWidth: 'auto',
              width: '100%',
              maxWidth: '120px',
              whiteSpace: 'nowrap',
            }}
            type="submit"
          >
            {t('newsletter.subscribe')}
          </Button>
        </Stack>
      )}
    </Form>
  );
};

export default Newsletter;
