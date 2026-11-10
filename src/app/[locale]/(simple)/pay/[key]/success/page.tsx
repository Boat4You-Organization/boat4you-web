import { Locale, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getCustomPaymentStatus } from '@/actions/pay.actions';
import { redirect } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { isPaymentRef } from '@/models/pay.model';
import { isPayLinkKey } from '@/utils/server/payLinkKey';
import styles from '@/views/Pay/Pay.module.scss';
import PayConfirmation from '@/views/Pay/PayConfirmation';
import PayMessage from '@/views/Pay/PayMessage';
import PayStatusPoller from '@/views/Pay/PayStatusPoller';

/**
 * Where Mollie's hosted checkout sends the payer back (after a payment — or without one: the status decides)
 * (?ref=<payment token>). The page shows what the backend has recorded — it
 * never assumes success from the redirect alone — and tracks nothing (no
 * purchase event: these are contract payments, not web bookings).
 */
export const dynamic = 'force-dynamic';

interface PaySuccessPageProps {
  params: Promise<{ locale: Locale; key: string }>;
  searchParams: Promise<{ ref?: string | string[] }>;
}

const PaySuccessPage = async ({ params, searchParams }: PaySuccessPageProps) => {
  const { locale, key } = await params;

  if (!hasLocale(routing.locales, locale) || !isPayLinkKey(key)) notFound();

  setRequestLocale(locale);

  const { ref: rawRef } = await searchParams;
  const ref = Array.isArray(rawRef) ? rawRef[0] : rawRef;
  const t = await getTranslations({ locale, namespace: 'pay' });
  const result = isPaymentRef(ref) ? await getCustomPaymentStatus(ref) : null;

  if (!isPaymentRef(ref) || !result || (!result.ok && result.reason === 'notFound')) {
    return (
      <main className={styles.page}>
        <PayMessage title={t('unavailable.title')} text={t('unavailable.text')} />
      </main>
    );
  }

  if (result.ok && (result.status === 'FAILED' || result.status === 'CANCELLED')) {
    redirect({ href: `/pay/${key}/failed?ref=${ref}`, locale });
  }

  let content = <PayStatusPoller linkKey={key} paymentRef={ref} />;

  if (result.ok && result.status === 'COMPLETED') {
    content = <PayConfirmation amountMinor={result.amountMinor} reference={result.reference} />;
  } else if (result.ok && result.status === 'NEEDS_REVIEW') {
    content = <PayMessage title={t('success.review.title')} text={t('success.review.text')} />;
  }

  // PENDING, or the status could not be read: the poller asks again.
  return <main className={styles.page}>{content}</main>;
};

export default PaySuccessPage;
