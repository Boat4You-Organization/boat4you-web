import { List, ListItem, Stack, Typography } from '@mui/material';
import cx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { FooterSection } from '@/config/footerMenu';
import colors from '@/styles/themes/colors';
import { NavigationLink } from '@/types/navigation-link';

import styles from './FooterMenuItem.module.scss';

interface FooterMenuItemProps extends NavigationLink {
  isHorizontal?: boolean;
}

const FooterMenuItem = ({ title, links, isHorizontal = false }: FooterMenuItemProps) => {
  const t = useTranslations('navigation.footer');

  return (
    <Stack gap={2}>
      <Typography
        component="p"
        fontWeight={700}
        textTransform="uppercase"
        color={colors.blue500}
        sx={{
          fontSize: { xs: 12, md: 13 },
          letterSpacing: '0.08em',
        }}
      >
        {t(`${title}.title` as `${FooterSection}.title`)}
      </Typography>
      <List disablePadding className={cx(styles.container, { [styles.horizontal]: isHorizontal })} component="ul">
        {links.map(({ text, href, icon: Icon, target, displayName }, index) => {
          const isExternal = target === '_blank' || /^https?:\/\//.test(href);
          // Prefer the raw displayName (brand names) over the i18n key —
          // we don't translate proper nouns. Fall back to t() for the
          // standard menu items (company, legal) that use i18n keys.
          const label = displayName ?? (text ? t(`${title}.${text}` as `${FooterSection}.title`) : null);

          return (
            /* eslint-disable-next-line react/no-array-index-key */
            <ListItem key={index} disablePadding component="li">
              <Link
                href={href}
                className={styles.link}
                {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {label && (
                  <Typography
                    fontWeight={500}
                    sx={{
                      // No `nowrap` — long brand names (e.g. "Catamaran
                      // Charter Caribbean") need to wrap on narrow mobile
                      // columns; otherwise they'd cause horizontal scroll.
                      display: 'inline-block',
                      lineHeight: 1.5,
                      // Match the rest of the site's body copy size.
                      fontSize: { xs: 13, md: 14 },
                      // Inherit so the parent <a>:hover colour swap (in
                      // FooterMenuItem.module.scss) actually reaches us.
                      color: 'inherit',
                    }}
                  >
                    {label}
                  </Typography>
                )}
                {Icon && <Icon size={24} />}
              </Link>
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
};

export default FooterMenuItem;
