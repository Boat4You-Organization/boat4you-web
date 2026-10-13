import { useTranslations } from 'next-intl';

import styles from './Pay.module.scss';

/** Who receives the money. Company identity as in FooterBottomBar (language-neutral, not translated). */
const PayLegal = () => {
  const t = useTranslations('pay');

  return (
    <div className={styles.legal}>
      <p>{t('legal.received')}</p>
      <p>Cusmanich d.o.o. · Vrboran 37, 21000 Split, Croatia · OIB 87394862517</p>
    </div>
  );
};

export default PayLegal;
