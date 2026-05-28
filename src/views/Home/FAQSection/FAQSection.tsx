import { getTranslations } from 'next-intl/server';

import styles from './FAQSection.module.scss';

/**
 * Home-page FAQ block. Native <details>/<summary> instead of MUI Accordion —
 * the browser handles expand/collapse with zero JS, so this is a pure server
 * component (no hydration cost on mobile, where Accordion's hydration was part
 * of the main-thread blocking). Accessible by default (summary is a button,
 * keyboard + screen-reader work out of the box).
 *
 * Matching FAQPage JSON-LD is server-rendered in app/[locale]/(root)/page.tsx;
 * question text must stay verbatim with the schema or Google drops the rich
 * result.
 */
const FAQSection = async () => {
  const t = await getTranslations('home');
  const questions = t.raw('faqSection.questions') as Array<{ q: string; a: string }>;

  if (!Array.isArray(questions) || questions.length === 0) return null;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        {t('faqSection.preTitle')} <span className={styles.titleEmphasis}>{t('faqSection.emphasizedTitle')}</span>
      </h2>
      <p className={styles.subtitle}>{t('faqSection.subtitle')}</p>

      <div className={styles.list}>
        {questions.map((qa, i) => (
          <details key={`faq-${i + 1}`} className={styles.item}>
            <summary className={styles.summary}>
              <h3 className={styles.question}>{qa.q}</h3>
              <span className={styles.chevron} aria-hidden />
            </summary>
            <p className={styles.answer}>{qa.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
