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
    <Stack gap={3}>
      <Typography component="p" variant="h4" fontWeight={700} textTransform="uppercase" color={colors.blue500}>
        {t(`${title}.title` as `${FooterSection}.title`)}
      </Typography>
      <List disablePadding className={cx(styles.container, { [styles.horizontal]: isHorizontal })} component="ul">
        {links.map(({ text, href, icon: Icon }, index) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <ListItem key={index} disablePadding component="li">
            <Link href={href} className={styles.link}>
              {text && (
                <Typography
                  variant="body1"
                  fontWeight={500}
                  color={colors.black950}
                  sx={{
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                  }}
                >
                  {t(`${title}.${text}` as `${FooterSection}.title`)}
                </Typography>
              )}
              {Icon && <Icon size={24} />}
            </Link>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

export default FooterMenuItem;
