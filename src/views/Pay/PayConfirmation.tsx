import { useLocale, useTranslations } from 'next-intl';

import { formatEur } from '@/utils/static/payAmount';

import styles from './Pay.module.scss';

interface PayConfirmationProps {
  amountMinor: number;
  reference: string;
}

/** COMPLETED payment (server page and the client poller render the same view). */
const PayConfirmation = ({ amountMinor, reference }: PayConfirmationProps) => {
  const t = useTranslations('pay');
  const locale = useLocale();

  return (
    <section className={styles.message} role="status">
      <h1 className={styles.title}>{t('success.confirmed.title')}</h1>
      <p className={styles.text}>{t('success.confirmed.text')}</p>
      <dl className={styles.facts}>
        <div>
          <dt>{t('success.amount')}</dt>
          <dd>{formatEur(amountMinor, locale)}</dd>
        </div>
        <div>
          <dt>{t('form.labels.reference')}</dt>
          <dd>{reference}</dd>
        </div>
      </dl>
    </section>
  );
};

export default PayConfirmation;
