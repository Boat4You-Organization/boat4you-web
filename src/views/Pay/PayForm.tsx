'use client';

import { useState, useTransition } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';

import { Alert, Button } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import { CreateCustomPaymentResult, PayFormField, createCustomPayment } from '@/actions/pay.actions';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import { Link } from '@/i18n/navigation';
import { PAY_CHECKOUT_ORIGINS, isPayReference } from '@/models/pay.model';
import { FormValidator } from '@/utils/static/FormValidator';
import { formatEur, isAmountAmbiguous, parseAmountToMinor } from '@/utils/static/payAmount';
import { showToast } from '@/valtio/global/global.actions';

import styles from './Pay.module.scss';

interface PayFormValues {
  email: string;
  reference: string;
  amount: string;
}

interface PayFormProps {
  linkKey: string;
  minAmountMinor: number;
  maxAmountMinor: number;
  /** Prefill from ?ref=&amount= (already checked against the field rules). */
  initialReference: string;
  initialAmount: string;
}

const isCheckoutUrl = (url: string): boolean => {
  try {
    return PAY_CHECKOUT_ORIGINS.includes(new URL(url).origin);
  } catch {
    return false;
  }
};

/** Live "You will pay EUR 1,109.00" under the amount field. */
const AmountPreview = () => {
  const t = useTranslations('pay');
  const locale = useLocale();
  const amount = useWatch<PayFormValues, 'amount'>({ name: 'amount' });
  const minor = parseAmountToMinor(amount ?? '');

  return <p className={styles.preview}>{minor ? t('form.youWillPay', { amount: formatEur(minor, locale) }) : null}</p>;
};

/**
 * Card payment for a contract made outside the booking flow, as on the old
 * Stripe payment link: e-mail, booking confirmation number, amount, Pay. The
 * backend creates a Revolut order and the browser goes to Revolut's hosted
 * checkout. No terms checkbox and no second step (Mario): the legal line above
 * the button states the acceptance and the request carries acceptTerms.
 */
const PayForm = ({ linkKey, minAmountMinor, maxAmountMinor, initialReference, initialAmount }: PayFormProps) => {
  const t = useTranslations('pay');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const validator = FormValidator.withTranslation(tCommon);
  const [failure, setFailure] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const busy = isPending || isRedirecting;

  const fieldErrors: Record<PayFormField, string> = {
    email: tCommon('validation.invalidEmail'),
    reference: t('errors.reference'),
    amount: t('errors.amountInvalid'),
  };

  const validateReference = (value?: string) => isPayReference(value ?? '') || fieldErrors.reference;

  const validateAmount = (value?: string) => {
    const input = (value ?? '').trim();

    if (!input) return tCommon('validation.required');

    if (isAmountAmbiguous(input)) return t('errors.amountAmbiguous');

    const minor = parseAmountToMinor(input);

    if (minor === null) return fieldErrors.amount;

    if (minor < minAmountMinor) return t('errors.amountTooLow', { min: formatEur(minAmountMinor, locale) });

    if (minor > maxAmountMinor) return t('errors.amountTooHigh', { max: formatEur(maxAmountMinor, locale) });

    return true;
  };

  const fail = (message: string) => {
    setFailure(message);
    showToast({ status: 'error', text: message });
  };

  const handleSubmit = (values: PayFormValues, methods: UseFormReturn<PayFormValues>) => {
    const amountMinor = parseAmountToMinor(values.amount);

    if (amountMinor === null || busy) return;

    setFailure(null);
    startTransition(async () => {
      const result = await createCustomPayment({
        linkKey,
        reference: values.reference.trim(),
        amountMinor,
        email: values.email.trim(),
        locale,
      }).catch((): CreateCustomPaymentResult => ({ ok: false, reason: 'error' }));

      if (result.ok) {
        if (!isCheckoutUrl(result.redirectUrl)) {
          fail(t('errors.provider'));

          return;
        }

        setIsRedirecting(true);
        window.location.assign(result.redirectUrl);

        return;
      }

      result.fields?.forEach(field => methods.setError(field, { message: fieldErrors[field] }, { shouldFocus: true }));
      fail(t(`errors.${result.reason}`));
    });
  };

  return (
    <>
      <h1 className={styles.title}>{t('form.title')}</h1>
      <p className={styles.text}>{t('form.instruction')}</p>
      <Form<PayFormValues>
        defaultValues={{ email: '', reference: initialReference, amount: initialAmount }}
        onSubmit={handleSubmit}
        className={styles.form}
        noValidate
      >
        <FormInput
          name="email"
          type="email"
          formLabel={t('form.labels.email')}
          helperText={t('form.hints.email')}
          validate={FormValidator.all(validator.isNotEmpty, validator.isValidEmail)}
          slotProps={{ htmlInput: { autoComplete: 'email', inputMode: 'email', maxLength: 254 } }}
        />
        <FormInput
          name="reference"
          formLabel={t('form.labels.reference')}
          helperText={t('form.hints.reference')}
          validate={FormValidator.all(validator.isNotEmpty, validateReference)}
          slotProps={{ htmlInput: { autoComplete: 'off', maxLength: 64 } }}
        />
        <FormInput
          name="amount"
          type="text"
          formLabel={t('form.labels.amount')}
          helperText={t('form.hints.amount')}
          validate={validateAmount}
          slotProps={{ htmlInput: { autoComplete: 'off', inputMode: 'decimal', maxLength: 10 } }}
        />
        <AmountPreview />
        {failure && (
          <Alert severity="error" role="alert">
            {failure}
          </Alert>
        )}
        <p className={styles.terms}>
          {t('legal.byPaying')}{' '}
          <Link href="/terms-and-conditions" prefetch={false} target="_blank" rel="noopener noreferrer">
            {t('legal.terms')}
          </Link>
          {' · '}
          <Link href="/privacy-policy" prefetch={false} target="_blank" rel="noopener noreferrer">
            {t('legal.privacy')}
          </Link>
        </p>
        <Button type="submit" variant="contained" size="large" fullWidth disabled={busy}>
          {busy ? tCommon('processing') : t('form.pay')}
        </Button>
        <p className={styles.trust}>{t('form.securedBy')}</p>
      </Form>
    </>
  );
};

export default PayForm;
