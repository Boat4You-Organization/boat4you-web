import { Locale, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getCustomPaymentStatus } from '@/actions/pay.actions';
import { Link, redirect } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { isPaymentRef } from '@/models/pay.model';
import { isPayLinkKey } from '@/utils/server/payLinkKey';
import { minorToAmountInput } from '@/utils/static/payAmount';
import styles from '@/views/Pay/Pay.module.scss';
import PayMessage from '@/views/Pay/PayMessage';

/**
 * A payment that failed or was cancelled (the success page sends the payer
 * here). "Try again" reopens the form with the same booking confirmation
 * number and amount; the e-mail is typed again.
 */
export const dynamic = 'force-dynamic';

interface PayFailedPageProps {
  params: Promise<{ locale: Locale; key: string }>;
  searchParams: Promise<{ ref?: string | string[] }>;
}

const PayFailedPage = async ({ params, searchParams }: PayFailedPageProps) => {
  const { locale, key } = await params;

  if (!hasLocale(routing.locales, locale) || !isPayLinkKey(key)) notFound();

  setRequestLocale(locale);

  const { ref: rawRef } = await searchParams;
  const ref = Array.isArray(rawRef) ? rawRef[0] : rawRef;
  const t = await getTranslations({ locale, namespace: 'pay' });
  const result = isPaymentRef(ref) ? await getCustomPaymentStatus(ref) : null;

  // Paid after all (a late completion) or still open: never offer to pay twice.
  if (isPaymentRef(ref) && result?.ok && result.status !== 'FAILED' && result.status !== 'CANCELLED') {
    redirect({ href: `/pay/${key}/success?ref=${ref}`, locale });
  }

  const retry = result?.ok
    ? `?${new URLSearchParams({ ref: result.reference, amount: minorToAmountInput(result.amountMinor) })}`
    : '';

  return (
    <main className={styles.page}>
      <PayMessage title={t('failed.title')} text={t('failed.text')}>
        <Link href={`/pay/${key}${retry}`} prefetch={false} className={styles.button}>
          {t('failed.tryAgain')}
        </Link>
      </PayMessage>
    </main>
  );
};

export default PayFailedPage;
