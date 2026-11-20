import { getTranslations } from 'next-intl/server';

import BoatCardGrid from '@/components/BoatCardGrid';
import { StaticBoatListingItemCard } from '@/components/BoatListingItemCard';
import { GULET_COUNTRIES } from '@/config/guletCharter.config';
import { PRICE_GUIDE_HUB_PATH } from '@/config/priceGuides.config';
import { Link } from '@/i18n/navigation';
import { GuletCountry } from '@/utils/server/guletCharter';
import styles from '@/views/Models/Models.module.scss';
import ModelsBreadcrumb, { Crumb } from '@/views/Models/ModelsBreadcrumb';
import ModelsFaq from '@/views/Models/ModelsFaq';
import guideStyles from '@/views/PriceGuide/PriceGuide.module.scss';

import viewStyles from './GuletCharterView.module.scss';
import { GuletText } from './guletText';

interface GuletCharterViewProps {
  locale: string;
  countries: GuletCountry[];
  text: GuletText;
  breadcrumb: Crumb[];
}

/**
 * /gulet-charter: the answer, a short sales part (the week on board), one
 * block per country (live count, typical week, main bases, a row of real
 * gulets and the link to the country's gulet landing) and the FAQ. Server
 * rendered on the model pages' layout, so it reads the same on a phone.
 */
const GuletCharterView = async ({ locale, countries, text, breadcrumb }: GuletCharterViewProps) => {
  const t = await getTranslations({ locale, namespace: 'guletCharter' });
  const { fmt } = text;
  const listFormat = new Intl.ListFormat(locale, { type: 'conjunction' });
  // Copy exists for the configured countries (guletCharter.config.ts).
  const knownCountry = (code: string) => GULET_COUNTRIES.includes(code);

  return (
    <article className={styles.root}>
      <ModelsBreadcrumb items={breadcrumb} label={t('breadcrumbLabel')} />
      <h1 className={styles.title}>{text.h1}</h1>
      <p className={styles.lede}>{text.answer}</p>

      <section className={styles.section} aria-labelledby="gulet-week">
        <h2 id="gulet-week" className={styles.sectionTitle}>
          {t('experience.heading')}
        </h2>
        <div className={styles.prose}>
          <p className={styles.body}>{t('experience.p1')}</p>
          <p className={styles.body}>{t('experience.p2')}</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="gulet-countries">
        <h2 id="gulet-countries" className={styles.sectionTitle}>
          {t('countriesHeading')}
        </h2>
        {countries.map(country => (
          <div key={country.countryCode} className={viewStyles.country}>
            <h3 className={viewStyles.countryTitle}>{country.name}</h3>
            {knownCountry(country.countryCode) && (
              <p className={styles.body}>{t(`country.${country.countryCode as 'TR' | 'GR' | 'HR' | 'IT'}`)}</p>
            )}
            <p className={styles.note}>
              {country.table
                ? t('countryFacts', {
                    count: country.fleet,
                    low: fmt.money(country.table.low),
                    high: fmt.money(country.table.high),
                  })
                : t('countryFactsNoPrice', { count: country.fleet })}
              {country.bases.length > 0 && ` · ${t('countryBases', { bases: listFormat.format(country.bases) })}`}
            </p>
            {country.boats.length > 0 && (
              <div className={viewStyles.boats}>
                <BoatCardGrid>
                  {country.boats.map(yacht => (
                    <StaticBoatListingItemCard key={yacht.id} isGridView alignRows {...yacht} user={null} />
                  ))}
                </BoatCardGrid>
              </div>
            )}
            {country.href && (
              <p className={guideStyles.cta}>
                {/* Already locale-prefixed (hubFor), so a plain anchor. */}
                <a href={country.href} className={styles.tableLink}>
                  {`${t('seeAll', { where: country.where })} (${fmt.number(country.fleet)}) →`}
                </a>
              </p>
            )}
          </div>
        ))}
      </section>

      <ModelsFaq heading={t('faqHeading')} entries={text.faq} />
      <p className={guideStyles.cta}>
        <Link href={PRICE_GUIDE_HUB_PATH} prefetch={false} className={styles.tableLink}>
          {t('priceGuideLink')} →
        </Link>
      </p>
      <p className={guideStyles.cta}>
        <Link href="/contact-us" prefetch={false} className={styles.tableLink}>
          {t('quoteLink')} →
        </Link>
      </p>
    </article>
  );
};

export default GuletCharterView;
