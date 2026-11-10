import React from 'react';

import styles from './Pay.module.scss';

interface PayMessageProps {
  title: string;
  text: string;
  children?: React.ReactNode;
}

/** Message-only state of the /pay pages (unavailable, failed, being confirmed). */
const PayMessage = ({ title, text, children }: PayMessageProps) => (
  <section className={styles.message} role="status">
    <h1 className={styles.title}>{title}</h1>
    <p className={styles.text}>{text}</p>
    {children}
  </section>
);

export default PayMessage;
