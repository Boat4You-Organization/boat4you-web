import cx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';

import CookieSettingsButton from '@/components/Footer/CookieSettingsButton';
import Logo from '@/components/SvgIcons/Logo';
import LogoWordmark from '@/components/SvgIcons/LogoWordmark';
import footerMenu, { FooterSection, footerNetwork, footerPaymentMethods } from '@/config/footerMenu';
import socials from '@/config/socials.config';
import { TRIPADVISOR_RATING, TRIPADVISOR_REVIEW_COUNT, TRIPADVISOR_URL } from '@/config/tripadvisor';
import { Link } from '@/i18n/navigation';
import { GOOGLE_PREFERRED_SOURCE_URL } from '@/utils/static/googlePreferredSource';
import { NETWORK_REL } from '@/utils/static/networkLinks';

import styles from './Footer.module.scss';

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' } as const;
// Sister sites are nofollow since 28.10.2026 (utils/static/networkLinks).
const NETWORK_LINK = { target: '_blank', rel: NETWORK_REL } as const;

/**
 * Site footer, Mario's design "Footer 1a" (10.11.2026): trust strip, brand column with the claim and the
 * social links, Explore / Company / Legal columns, the network row, the company line and the logo lettering.
 * Sizes are on the site type scale (src/styles/mixins/_type.scss), the face is the site font.
 */
const Footer = () => {
  const t = useTranslations('navigation.footer');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  // The group's TripAdvisor profile; the hero and the Organization JSON-LD read the same config.
  const reviews = Number(TRIPADVISOR_REVIEW_COUNT);
  const rating = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
    Number(TRIPADVISOR_RATING)
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.trust}>
        <div className={cx(styles.inner, styles.trustRow)}>
          <a href={TRIPADVISOR_URL} {...EXTERNAL} aria-label={tCommon('tripadvisorAria', { rating, count: reviews })}>
            <strong>{rating} / 5</strong> · {tCommon('tripadvisorReviews', { count: reviews })}
          </a>
          <span>{tCommon('assuranceSSL')}</span>
          <span>{tCommon('assurance247')}</span>
          <span>{tCommon('assuranceVerified')}</span>
          <span>{tCommon('assuranceNoHidden')}</span>
        </div>
      </div>

      <div className={cx(styles.inner, styles.main)}>
        <div className={styles.brand}>
          <Logo />
          {/* Brand claim, approved wording (owner decision 16.10.2026, also in the About hero); never soften it. */}
          <p className={styles.claim}>{t('brandClaim')}</p>
          {/* Keep the profiles in step with `sameAs` in utils/static/buildMetadata.ts (socials.config.ts). */}
          <ul className={styles.socials}>
            {socials.map(({ href, name }) => (
              <li key={href}>
                <a href={href} {...EXTERNAL}>
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {footerMenu.map(({ title, links }) => (
          <div key={title} className={styles.column}>
            <p className={styles.label}>{t(`${title}.title` as `${FooterSection}.title`)}</p>
            <ul className={styles.links}>
              {links.map(({ text, href }) => (
                <li key={href}>
                  <Link href={href}>{t(`${title}.${text}` as `${FooterSection}.title`)}</Link>
                </li>
              ))}
              {/* Cookie-consent withdrawal (audit C4) — re-opens the consent UI; GDPR Art. 7(3). */}
              {title === 'legal' && (
                <li>
                  <CookieSettingsButton className={styles.linkButton} />
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Card payments go through Mollie (live 10.11.2026); the logos are the methods the checkout offers. Same
          "Secure payment by Mollie" line as the payment steps (common.securePaymentByMollie). */}
      <div className={cx(styles.inner, styles.payments)}>
        <p className={styles.label}>{tCommon('securePaymentByMollie')}</p>
        <ul className={styles.paymentLogos} aria-label={t('payments.methods')}>
          {footerPaymentMethods.map(({ name, src }) => (
            <li key={src}>
              {/* A 3 KB static SVG tile: next/image adds nothing here. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={name} width={40} height={30} loading="lazy" decoding="async" />
            </li>
          ))}
        </ul>
      </div>

      <div className={cx(styles.inner, styles.network)}>
        <p className={styles.label}>{t('network.title')}</p>
        <ul className={styles.networkLinks}>
          {footerNetwork.map(({ name, href }) => (
            <li key={href}>
              <a href={href} {...NETWORK_LINK}>
                {name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* One dark block for the company line and the lettering, so no seam shows between them. */}
      <div className={styles.bar}>
        <div className={cx(styles.inner, styles.barRow)}>
          {/* Impressum / company identity (audit C2): the legal entity behind the Boat4you brand, on every page.
              Language-neutral registration data, so it isn't run through i18n. */}
          <p>
            © {new Date().getFullYear()} boat4you · Cusmanich d.o.o. · Vrboran 37, 21000 Split, Croatia · OIB
            87394862517
          </p>
          <ul className={styles.barLinks}>
            {/* Google "preferred source" deeplink: a signed-in reader can mark boat4you as a preferred source.
                Plain link, no script; the domain comes from NEXT_PUBLIC_BASE_URL at build time. */}
            <li>
              <a href={GOOGLE_PREFERRED_SOURCE_URL} {...EXTERNAL}>
                {tCommon('googlePreferredSource')}
              </a>
            </li>
            {/* Storyset free-licence attribution — REQUIRED while the promo-banner
                character illustration is live (storyset.com licence terms). */}
            <li>
              <a href="https://storyset.com" {...EXTERNAL}>
                Illustrations by Storyset
              </a>
            </li>
            {/* Agency credit (Mario 13.8.2026), brand credit, not localized. */}
            <li>
              <a href="https://adriapixel.com" {...EXTERNAL}>
                Made by AdriaPixel
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.wordmark}>
          <LogoWordmark className={styles.wordmarkSvg} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
