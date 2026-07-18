import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import styles from './SeoTextSection.module.scss';

const SEARCH_LINKS = [
  { key: 'sailing', href: '/search?boatTypes=SAILING_YACHT' },
  { key: 'catamaran', href: '/search?boatTypes=CATAMARAN' },
  { key: 'motor', href: '/search?boatTypes=MOTOR_YACHT' },
  { key: 'motorsailer', href: '/search?boatTypes=MOTORSAILER' },
] as const;

/**
 * Closing SEO copy block targeting the "yacht charter" head term. Pure
 * server component like FAQSection — plain HTML, zero hydration cost.
 * Copy lives under home.seoSection and is UNIQUE to boat4you — never
 * reuse the wording on the sister sites.
 */
const SeoTextSection = async () => {
  const t = await getTranslations('home');
  const blocks = t.raw('seoSection.blocks') as Array<{ heading: string; body: string }>;
  const links = t.raw('seoSection.links') as Record<string, string>;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        {t('seoSection.preTitle')} <span className={styles.titleEmphasis}>{t('seoSection.emphasizedTitle')}</span>
      </h2>
      <p className={styles.paragraph}>{t('seoSection.intro')}</p>
      {blocks.map(block => (
        <div key={block.heading}>
          <h3 className={styles.heading}>{block.heading}</h3>
          <p className={styles.paragraph}>{block.body}</p>
        </div>
      ))}
      <p className={styles.paragraph}>{t('seoSection.closing')}</p>
      <p className={styles.linksLabel}>{t('seoSection.linksLabel')}</p>
      <ul className={styles.links}>
        {SEARCH_LINKS.map(link => (
          <li key={link.key}>
            <Link href={link.href} className={styles.link}>
              {links[link.key]}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SeoTextSection;
