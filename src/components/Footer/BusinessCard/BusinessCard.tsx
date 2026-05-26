import React from 'react';

import { List, ListItem, Stack, Typography } from '@mui/material';
import Link from 'next/link';

import Logo from '@/components/SvgIcons/Logo';
import socials from '@/config/socials.config';
import colors from '@/styles/themes/colors';

import styles from './BusinessCard.module.scss';

// Hero tagline directly under the logo. Two-line composition: navy
// "Endless blue." + primary-blue italic "Boat4you." — matches the
// brand mark used on the homepage hero.
//
// History: launched with gold italic on 28.4.2026 → flipped to primary
// blue on 3.5.2026 (Mario: footer was reading too colourful with gold
// + green trust icons; aligned everything to the navy/primary palette).
const TAGLINE_FONT_STACK = '"Playfair Display", Georgia, "Times New Roman", serif';

const BusinessCard = () => (
  <Stack className={styles.container}>
    <Stack spacing={2}>
      <Logo />
      <Stack spacing={0}>
        <Typography
          sx={{
            fontFamily: TAGLINE_FONT_STACK,
            fontSize: { xs: 30, md: 38 },
            fontWeight: 600,
            lineHeight: 1.1,
            color: colors.blue950,
            letterSpacing: '-0.01em',
          }}
        >
          Endless blue
        </Typography>
        <Typography
          sx={{
            fontFamily: TAGLINE_FONT_STACK,
            fontSize: { xs: 30, md: 38 },
            fontWeight: 600,
            fontStyle: 'italic',
            lineHeight: 1.1,
            color: colors.blue500,
            letterSpacing: '-0.01em',
          }}
        >
          Boat4you
        </Typography>
      </Stack>
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

export default BusinessCard;
