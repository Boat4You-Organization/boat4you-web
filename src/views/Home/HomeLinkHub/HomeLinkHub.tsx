import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { HOME_HUB_VISIBLE_LINKS } from '@/config/homeHub.config';
import { getPathname } from '@/i18n/navigation';
import { homeHubTabs } from '@/utils/server/homeHubLinks';

import styles from './HomeLinkHub.module.scss';

/**
 * Keyword link hub, the last section of the home page (homeHub.config.ts).
 * Server component, no client JS: the tabs are visually hidden radios with
 * <label>s and each tab's "Show more" is a checkbox, so every link of every
 * tab is in the server HTML (only CSS hides the inactive tabs and the links
 * past HOME_HUB_VISIBLE_LINKS). Keyboard: Tab reaches the checked radio,
 * the arrow keys switch tabs, Space toggles "Show more".
 *
 * Plain <a> with the locale-prefixed href (getPathname), not the next-intl
 * Link: that one is a client component, and 140 of them put ~67 KB of
 * hydration data into the home (review 1.10.2026). A click is a full page
 * load, which is fine for the closing link block, and nothing is prefetched.
 *
 * "Show more" sits between the first links and the rest: the rest opens
 * below it and "Show less" never moves out of view (on a phone it used to
 * end up above the screen after collapsing a 25-link tab).
 */

const ID = 'home-hub';

interface HomeLinkHubProps {
  locale: Locale;
}

const HomeLinkHub = async ({ locale }: HomeLinkHubProps) => {
  const [tabs, t] = await Promise.all([homeHubTabs(locale), getTranslations({ locale, namespace: 'homeHub' })]);

  // A locale without its homeHub messages (not translated yet) shows no hub.
  if (!t.has('title')) return null;

  const shown = tabs
    .map(tab => ({ ...tab, links: tab.links.filter(link => t.has(`links.${link.id}`)) }))
    .filter(tab => tab.links.length > 0);

  if (!shown.length) return null;

  const list = (links: (typeof shown)[number]['links'], labelId: string, className: string) => (
    <ul className={className} aria-labelledby={labelId}>
      {links.map(link => (
        <li key={link.id}>
          <a href={getPathname({ href: link.href, locale })} className={styles.link}>
            {t(`links.${link.id}`)}
          </a>
        </li>
      ))}
    </ul>
  );

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
          const labelId = `${ID}-label-${tab.key}`;
          const rest = tab.links.slice(HOME_HUB_VISIBLE_LINKS);

          return (
            <div key={tab.key} id={`${ID}-panel-${tab.key}`} className={styles.panel}>
              {list(tab.links.slice(0, HOME_HUB_VISIBLE_LINKS), labelId, styles.list)}
              {rest.length > 0 && (
                <>
                  <label className={styles.more}>
                    <input type="checkbox" className={styles.moreToggle} />
                    <span className={styles.moreText}>{t('showMore')}</span>
                    <span className={styles.lessText}>{t('showLess')}</span>
                  </label>
                  {list(rest, labelId, `${styles.list} ${styles.extraList}`)}
                </>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default HomeLinkHub;
