import { Locale, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getPayConfig } from '@/actions/pay.actions';
import { routing } from '@/i18n/routing';
import { isPayReference } from '@/models/pay.model';
import { isPayLinkKey } from '@/utils/server/payLinkKey';
import { parseAmountToMinor } from '@/utils/static/payAmount';
import styles from '@/views/Pay/Pay.module.scss';
import PayForm from '@/views/Pay/PayForm';
import PayLegal from '@/views/Pay/PayLegal';
import PayMessage from '@/views/Pay/PayMessage';

/** Card payment form behind the secret contract link (see layout.tsx). Rendered per request. */
export const dynamic = 'force-dynamic';

interface PayPageProps {
  params: Promise<{ locale: Locale; key: string }>;
  searchParams: Promise<{ ref?: string | string[]; amount?: string | string[] }>;
}

const firstValue = (value: string | string[] | undefined): string =>
  ((Array.isArray(value) ? value[0] : value) ?? '').trim();

const PayPage = async ({ params, searchParams }: PayPageProps) => {
  const { locale, key } = await params;

  if (!hasLocale(routing.locales, locale) || !isPayLinkKey(key)) notFound();

  setRequestLocale(locale);

  const [config, query] = await Promise.all([getPayConfig(key), searchParams]);

  if (!config.ok && config.reason === 'notFound') notFound();

  if (!config.ok || !config.config.enabled) {
    const t = await getTranslations({ locale, namespace: 'pay' });

    return (
      <main className={styles.page}>
        <PayMessage title={t('unavailable.title')} text={t('unavailable.text')} />
      </main>
    );
  }

  // "Try again" (failed page) comes back with ?ref=&amount=; anything that
  // would not pass the form's own rules is dropped rather than prefilled.
  const reference = firstValue(query.ref);
  const amount = firstValue(query.amount);

  return (
    <main className={styles.page}>
      <PayForm
        linkKey={key}
        minAmountMinor={config.config.minAmountMinor}
        maxAmountMinor={config.config.maxAmountMinor}
        initialReference={isPayReference(reference) ? reference : ''}
        initialAmount={parseAmountToMinor(amount) === null ? '' : amount}
        klarna={config.config.klarna}
      />
      <PayLegal />
    </main>
  );
};

export default PayPage;
