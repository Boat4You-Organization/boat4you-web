'use client';

import { MouseEvent, useState } from 'react';

import { IconButton, Menu, MenuItem } from '@mui/material';
import { useTranslations } from 'next-intl';

import Badge from '@/components/Badge';
import Favorite from '@/components/SvgIcons/Favorite';
import WishlistItem from '@/components/WishlistItem';
import { YachtModelLocalStorage } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { useLocalStorage } from '@/utils/hooks/useLocalStorage';

import styles from './Favorites.module.scss';

const Favorites = () => {
  const [favorites] = useLocalStorage<YachtModelLocalStorage[]>('favorites', []);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const t = useTranslations('common');

  const favoritesArray = favorites || [];

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="favorites"
        classes={{ root: styles.iconButtonRoot }}
        className={styles.iconButton}
        onClick={handleClick}
      >
        <Badge badgeContent={favoritesArray.length} color="primary">
          <Favorite size={24} fill={colors.black950} />
        </Badge>
      </IconButton>
      <Menu
        id="favorites-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        classes={{ root: styles.menuRoot, paper: styles.paper, list: styles.list }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {favoritesArray.length === 0 ? (
          <MenuItem disabled className={styles.emptyItem}>
            {t('emptyWishlist')}
          </MenuItem>
        ) : (
          favoritesArray.map(yacht => (
            <MenuItem key={yacht.id} className={styles.menuItem} onClick={handleClose}>
              <WishlistItem yacht={yacht} />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default Favorites;
