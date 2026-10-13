'use client';

import { useEffect, useState } from 'react';

import { CircularProgress } from '@mui/material';
import { useTranslations } from 'next-intl';

import { getCustomPaymentStatus } from '@/actions/pay.actions';
import { useRouter } from '@/i18n/navigation';
import { PaymentStatusInfo } from '@/models/pay.model';

import styles from './Pay.module.scss';
import PayConfirmation from './PayConfirmation';
import PayMessage from './PayMessage';

interface PayStatusPollerProps {
  linkKey: string;
  paymentRef: string;
}

/** Waits between the checks: 3 s, 5 s, 8 s (16 s in all), then "we will e-mail you". */
const DELAYS_MS = [3000, 5000, 8000];

type PollState = { kind: 'pending' } | { kind: 'settled'; info: PaymentStatusInfo } | { kind: 'timedOut' };

/**
 * Revolut sends the payer back right after a successful payment, usually
 * before its webhook has reached the backend, so the first status read can
 * still be PENDING. Every check asks the backend, which looks the order up
 * at Revolut itself (at most every 10 s per payment).
 */
const PayStatusPoller = ({ linkKey, paymentRef }: PayStatusPollerProps) => {
  const t = useTranslations('pay');
  const router = useRouter();
  const [state, setState] = useState<PollState>({ kind: 'pending' });

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const check = (attempt: number) => {
      timer = setTimeout(async () => {
        const result = await getCustomPaymentStatus(paymentRef).catch(() => null);

        if (cancelled) return;

        if (result?.ok && (result.status === 'FAILED' || result.status === 'CANCELLED')) {
          router.replace(`/pay/${linkKey}/failed?ref=${paymentRef}`);

          return;
        }

        if (result?.ok && (result.status === 'COMPLETED' || result.status === 'NEEDS_REVIEW')) {
          setState({ kind: 'settled', info: result });

          return;
        }

        if (attempt + 1 < DELAYS_MS.length) check(attempt + 1);
        else setState({ kind: 'timedOut' });
      }, DELAYS_MS[attempt]);
    };

    check(0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [linkKey, paymentRef, router]);

  if (state.kind === 'settled' && state.info.status === 'COMPLETED') {
    return <PayConfirmation amountMinor={state.info.amountMinor} reference={state.info.reference} />;
  }

  if (state.kind === 'settled') {
    return <PayMessage title={t('success.review.title')} text={t('success.review.text')} />;
  }

  if (state.kind === 'timedOut') {
    return <PayMessage title={t('success.weWillEmail.title')} text={t('success.weWillEmail.text')} />;
  }

  return (
    <PayMessage title={t('success.confirming.title')} text={t('success.confirming.text')}>
      <CircularProgress className={styles.spinner} aria-hidden />
    </PayMessage>
  );
};

export default PayStatusPoller;
