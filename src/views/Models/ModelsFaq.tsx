import styles from './Models.module.scss';

export interface ModelsFaqEntry {
  question: string;
  answer: string;
}

interface ModelsFaqProps {
  heading: string;
  entries: ModelsFaqEntry[];
}

/**
 * FAQ block of the model pages and brand hubs. Built from the page's own
 * figures (price band, bases, layout, build years) plus the booking rule,
 * all visible — the FAQPage JSON-LD (modelsFaqSchema) repeats exactly these
 * entries, so the markup never claims what the page does not show.
 */
const ModelsFaq = ({ heading, entries }: ModelsFaqProps) =>
  entries.length ? (
    <section className={styles.section} aria-labelledby="models-faq">
      <h2 id="models-faq" className={styles.sectionTitle}>
        {heading}
      </h2>
      <div className={styles.faqList}>
        {entries.map(entry => (
          <div key={entry.question} className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>{entry.question}</h3>
            <p className={styles.faqAnswer}>{entry.answer}</p>
          </div>
        ))}
      </div>
    </section>
  ) : null;

/** FAQPage JSON-LD for the visible entries (none under two entries). */
export const modelsFaqSchema = (entries: ModelsFaqEntry[]) =>
  entries.length >= 2
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: entries.map(e => ({
          '@type': 'Question',
          name: e.question,
          acceptedAnswer: { '@type': 'Answer', text: e.answer },
        })),
      }
    : null;

export default ModelsFaq;
