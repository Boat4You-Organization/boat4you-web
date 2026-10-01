import { getTranslations } from 'next-intl/server';

import { HOME_HUB_VISIBLE_LINKS } from '@/config/homeHub.config';
import { Link } from '@/i18n/navigation';
import { homeHubTabs } from '@/utils/server/homeHubLinks';

import styles from './HomeLinkHub.module.scss';

/**
 * Keyword link hub, the last section of the home page (homeHub.config.ts).
 * Server component, no client JS of its own: the tabs are visually hidden radios with
 * <label>s and each tab's "Show more" is a checkbox, so every link of every
 * tab is in the server HTML (only CSS hides the inactive tabs and the links
 * past HOME_HUB_VISIBLE_LINKS). Keyboard: Tab reaches the checked radio,
 * the arrow keys switch tabs, Space toggles "Show more".
 *
 * prefetch={false}: up to 140 links at the bottom of the most visited page
 * must not fire /search prefetches at the server.
 */

const ID = 'home-hub';

interface HomeLinkHubProps {
  locale: string;
}

const HomeLinkHub = async ({ locale }: HomeLinkHubProps) => {
  const [tabs, t] = await Promise.all([homeHubTabs(locale), getTranslations({ locale, namespace: 'homeHub' })]);

  // A locale without its homeHub messages (not translated yet) shows no hub.
  if (!t.has('title')) return null;

  const shown = tabs
    .map(tab => ({ ...tab, links: tab.links.filter(link => t.has(`links.${link.id}`)) }))
    .filter(tab => tab.links.length > 0);

  if (!shown.length) return null;

  return (
    <nav className={styles.hub} aria-labelledby={`${ID}-title`}>
      <h2 id={`${ID}-title`} className={styles.title}>
        {t('title')}
      </h2>
      {shown.map((tab, i) => (
        <input
          key={tab.key}
          type="radio"
          name={`${ID}-tab`}
          id={`${ID}-tab-${tab.key}`}
          className={styles.radio}
          defaultChecked={i === 0}
          aria-controls={`${ID}-panel-${tab.key}`}
        />
      ))}
      <div className={styles.tabList}>
        {shown.map(tab => (
          <label key={tab.key} id={`${ID}-label-${tab.key}`} htmlFor={`${ID}-tab-${tab.key}`} className={styles.tab}>
            {t(`tabs.${tab.key}`)}
          </label>
        ))}
      </div>
      <div className={styles.panels}>
        {shown.map(tab => {
          const hasMore = tab.links.length > HOME_HUB_VISIBLE_LINKS;

          return (
            <div key={tab.key} id={`${ID}-panel-${tab.key}`} className={styles.panel}>
              <ul className={styles.list} aria-labelledby={`${ID}-label-${tab.key}`}>
                {tab.links.map((link, i) => (
                  <li key={link.id} className={i >= HOME_HUB_VISIBLE_LINKS ? styles.extra : undefined}>
                    <Link href={link.href} prefetch={false} className={styles.link}>
                      {t(`links.${link.id}`)}
                    </Link>
                  </li>
                ))}
              </ul>
              {/* After the list, so keyboard focus reaches the visible links first. */}
              {hasMore && (
                <label className={styles.more}>
                  <input type="checkbox" className={styles.moreToggle} />
                  <span className={styles.moreText}>{t('showMore')}</span>
                  <span className={styles.lessText}>{t('showLess')}</span>
                </label>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default HomeLinkHub;
