import { Stack, Typography } from '@mui/material';
import cs from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import navigation from '@/config/navigation';
import { usePathname } from '@/i18n/navigation';

import styles from './Navigation.module.scss';

const Navigation = () => {
  const pathname = usePathname();
  const t = useTranslations('navigation.mainNavigation');

  const isActive = (href: string) => pathname === href;

  return (
    <Stack component="nav" direction="row" alignItems="center" gap={2}>
      {navigation.map(({ text, href }) => (
        <Link key={text} href={href} className={cs(styles.link, { [styles.active]: isActive(href) })}>
          <Typography variant="body1">{t(text)}</Typography>
        </Link>
      ))}
    </Stack>
  );
};

export default Navigation;
