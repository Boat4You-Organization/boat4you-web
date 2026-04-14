import { ListItem, ListItemButton, ListItemText, Stack } from '@mui/material';
import cx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import Avatar from '@/components/Avatar/Avatar';
import Badge from '@/components/Badge';
import ChevronRight from '@/components/SvgIcons/ChevronRight';
import { NavigationMobileItemLink, NavigationMobileItemTitle } from '@/config/navigationMobile.config';
import { usePathname } from '@/i18n/navigation';

import styles from './NavigationMobileItem.module.scss';

interface NavigationMobileItemProps extends NavigationMobileItemLink {
  onNavigationToggle: () => void;
  badgeCount?: number;
}

const NavigationMobileItem = ({
  text,
  href,
  icon: Icon,
  onClick,
  badgeCount,
  onNavigationToggle,
}: NavigationMobileItemProps) => {
  const pathname = usePathname();
  const t = useTranslations('navigation.navigationMobile');
  const isActive = pathname === href;
  const isMyProfileLink = href === '/my-profile';

  const handleLinkClick = () => {
    onNavigationToggle();
  };

  const renderIcon = () => {
    if (isMyProfileLink) return <Avatar name={text} />;

    if (!Icon) return null;

    const iconElement = <Icon size={24} variant="secondary" />;

    if (badgeCount !== undefined && badgeCount > 0) {
      return (
        <Badge badgeContent={badgeCount} color="primary">
          {iconElement}
        </Badge>
      );
    }

    return iconElement;
  };

  const renderListItemContent = () => (
    <ListItem
      classes={{ root: styles.root }}
      className={cx(styles.container, { [styles.active]: isActive })}
      onClick={href ? handleLinkClick : onClick}
    >
      <ListItemButton disableGutters className={styles.button}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          {renderIcon()}
          <ListItemText primary={isMyProfileLink ? text : t(text as NavigationMobileItemTitle)} sx={{ margin: 0 }} />
        </Stack>
        {href && <ChevronRight size={24} variant={isActive ? 'primary' : 'secondary'} />}
      </ListItemButton>
    </ListItem>
  );

  return href ? <Link href={href}>{renderListItemContent()}</Link> : renderListItemContent();
};

export default NavigationMobileItem;
