import React from 'react';

import { List, ListItem, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import Logo from '@/components/SvgIcons/Logo';
import socials from '@/config/socials.config';
import colors from '@/styles/themes/colors';

import styles from './BusinessCard.module.scss';

const BusinessCard = () => {
  const t = useTranslations('common');

  return (
    <Stack className={styles.container}>
      <Stack spacing={2}>
        <Logo />
        <Typography variant="body2" color={colors.black950}>
          {t('shortDescription')}
        </Typography>
      </Stack>
      <List disablePadding classes={{ root: styles.socials }} className={styles.socialList}>
        {socials.map(({ href, icon: SocialIcon }, index) => (
          <ListItem disableGutters disablePadding key={`${href}-${index + 1}`} sx={{ width: 'auto' }}>
            <Link href={href} className={styles.icon} target="_blank" aria-label="Social link">
              {SocialIcon && <SocialIcon size={24} fill={colors.black400} />}
            </Link>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

export default BusinessCard;
