'use client';

import React, { useMemo } from 'react';

import { Button, Icon, IconButton } from '@mui/material';
import cx from 'clsx';
import { useTranslations } from 'next-intl';

import FavoriteEmpty from '@/components/SvgIcons/FavoriteEmpty';
import FavoriteFilled from '@/components/SvgIcons/FavoriteFilled';
import { YachtModelLocalStorage } from '@/models/yacht.model';
import { useLocalStorage } from '@/utils/hooks/useLocalStorage';

import styles from './FavoriteButton.module.scss';

interface FavoriteButtonProps {
  yacht: YachtModelLocalStorage;
  color?: string;
  buttonText?: string;
}

const FavoriteButton = ({ yacht, color, buttonText }: FavoriteButtonProps) => {
  const t = useTranslations('common');
  const [favorites, setFavorites] = useLocalStorage<YachtModelLocalStorage[]>('favorites', []);

  const isFavorite = useMemo(() => {
    if (!favorites || !Array.isArray(favorites)) return false;

    return favorites.some(fav => fav.id === yacht.id);
  }, [favorites, yacht.id]);

  if (!yacht?.id) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setFavorites(prev => {
      const current = Array.isArray(prev) ? prev : [];

      const existingIndex = current.findIndex(fav => fav.id === yacht.id);

      if (existingIndex !== -1) {
        return current.filter(fav => fav.id !== yacht.id);
      }

      return [
        ...current,
        {
          id: yacht.id,
          name: yacht.name,
          slug: yacht.slug,
          location: yacht.location,
          model: yacht.model,
          mainImageId: yacht.mainImageId,
        },
      ];
    });
  };

  const ariaLabel = isFavorite
    ? t('removeFromFavorites', { yachtName: yacht.name })
    : t('addToFavorites', { yachtName: yacht.name });

  const favoriteIcon = isFavorite ? <FavoriteFilled size={20} /> : <FavoriteEmpty size={20} fill={color} />;

  if (buttonText) {
    return (
      <Button
        variant="containedInfo"
        onClick={handleClick}
        aria-label={ariaLabel}
        startIcon={
          <Icon
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              borderRadius: '50%',
            }}
            classes={{ root: styles.root }}
            className={cx(styles.buttonWithText, styles.container, {
              [styles.active]: isFavorite,
            })}
          >
            {favoriteIcon}
          </Icon>
        }
      >
        {buttonText}
      </Button>
    );
  }

  return (
    <IconButton
      onClick={handleClick}
      classes={{ root: styles.root }}
      className={cx(styles.container, {
        [styles.active]: isFavorite,
      })}
      aria-label={ariaLabel}
    >
      <Icon component="div">{favoriteIcon}</Icon>
    </IconButton>
  );
};

export default FavoriteButton;
