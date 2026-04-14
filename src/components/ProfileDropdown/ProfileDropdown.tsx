import { useState } from 'react';

import { Button, Divider, Menu, MenuItem, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { logout } from '@/actions/auth.actions';
import Avatar from '@/components/Avatar';
import List from '@/components/SvgIcons/ProfileDropdown/List';
import Logout from '@/components/SvgIcons/ProfileDropdown/Logout';
import Settings from '@/components/SvgIcons/ProfileDropdown/Settings';
import { useRouter } from '@/i18n/navigation';
import { UserModel } from '@/models/user.model';
import colors from '@/styles/themes/colors';
import { resetAuthModals } from '@/valtio/auth/auth.actions';
import { resetToast } from '@/valtio/global/global.actions';
import { clearUser } from '@/valtio/user/user.actions';

import styles from './ProfileDropdown.module.scss';

interface ProfileDropdownProps {
  user: UserModel | null;
}

const ProfileDropdown = ({ user }: ProfileDropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const t = useTranslations('common');
  const tNavigation = useTranslations('navigation');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setIsPending(true);
    handleClose();

    resetToast();
    resetAuthModals();
    clearUser();

    try {
      await logout();
      window.location.href = '/';
      router.refresh();
    } catch (error) {
      window.location.href = '/';
      router.refresh();
    }
  };

  return (
    <>
      <Button
        variant="outlinedSecondary"
        onClick={handleClick}
        classes={{ root: styles.buttonRoot }}
        className={styles.button}
      >
        <Avatar name={`${user?.name} ${user?.surname}`} />
        <Typography variant="body1" sx={{ display: { xs: 'none', md: 'block' } }}>
          {user?.name} {user?.surname}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        classes={{ root: styles.menuRoot, paper: styles.paper, list: styles.list }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Link href="/my-bookings">
          <MenuItem onClick={handleClose} className={styles.menuItem}>
            <List />
            <Typography variant="body2">{tNavigation('mainNavigation.myBookings')}</Typography>
          </MenuItem>
        </Link>
        <Link href="/my-profile">
          <MenuItem onClick={handleClose} className={styles.menuItem}>
            <Settings />
            <Typography variant="body2">{tNavigation('mainNavigation.profileSettings')}</Typography>
          </MenuItem>
        </Link>
        <Divider />
        <Button fullWidth color="error" onClick={handleLogout} disabled={isPending} className={styles.logoutButton}>
          <Logout fill={isPending ? colors.red200 : colors.red500} />
          {isPending ? t('loggingOut') : t('logOut')}
        </Button>
      </Menu>
    </>
  );
};

export default ProfileDropdown;
