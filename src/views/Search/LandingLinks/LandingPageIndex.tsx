import { getTranslations } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { landingPageHref } from '@/utils/static/landingPagination';

import styles from './LandingPageIndex.module.scss';

interface LandingPageIndexProps {
  /** The landing's canonical path without locale (searchLanding.ts landingPagerPath). */
  path: string;
  /** The page on screen (1-based). */
  current: number;
  /** Pages the listing fills. */
  count: number;
  /** Display currency the request carries (kept in the links), or null. */
  currency: string | null;
  locale: string;
}

/**
 * Every page of a destination landing as a plain link (audit 7.10.2026),
 * collapsed under the listing's pager. The pager itself links the first, the
 * last and the neighbouring pages and folds the rest into "…"; this list makes
 * any page one link away from every other one, so page 30 of a 50-page landing
 * is not thirty "next" links deep for a crawler. Server-rendered: the links are
 * in the HTML whether or not the list is open.
 */
const LandingPageIndex = async ({ path, current, count, currency, locale }: LandingPageIndexProps) => {
  if (count < 2) return null;

  const t = await getTranslations({ locale, namespace: 'landing' });
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  const pages = Array.from({ length: count }, (_, index) => index + 1);

  return (
    <details className={styles.root}>
      <summary className={styles.summary}>{t('pageIndex.summary', { count: String(count) })}</summary>
      <nav aria-label={t('pageIndex.label')}>
        <ol className={styles.list}>
          {pages.map(page => (
            <li key={page}>
              {page === current ? (
                <span aria-current="page">{page}</span>
              ) : (
                <a href={`${prefix}${landingPageHref(path, page, currency)}`}>{page}</a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
};

export default LandingPageIndex;
