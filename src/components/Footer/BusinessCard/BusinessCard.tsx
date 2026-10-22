import React from 'react';

import { List, ListItem, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import Logo from '@/components/SvgIcons/Logo';
import socials from '@/config/socials.config';
import colors from '@/styles/themes/colors';

import styles from './BusinessCard.module.scss';

// Hero tagline directly under the logo. Two-line composition: navy
// "Endless blue." + gold italic "Boat4you." — the one warm accent in an
// otherwise navy/blue footer.
//
// History: launched with gold italic on 28.4.2026 → flipped to primary
// blue on 3.5.2026 (Mario: footer was reading too colourful with gold
// + green trust icons; aligned everything to the navy/primary palette)
// → back to gold on 22.10.2026 (Mario: "previše jednolično" — logo,
// tagline and wordmark were three blues; the trust icons are grey now).
// mandalay700 is the gold the site already uses for text accents
// (yellow500 badge, mandalay800/900 reservation notes): 4.6:1 on white.
const TAGLINE_FONT_STACK = '"Playfair Display", Georgia, "Times New Roman", serif';

// Brand claim under the tagline, on every page (owner decision 16.10.2026).
// Approved wording, also in the About hero (about.hero.description); never soften it.
const BrandClaim = () => {
  const t = useTranslations('navigation.footer');

  return (
    <Typography variant="body2" color={colors.black600} sx={{ maxWidth: 420, lineHeight: 1.6 }}>
      {t('brandClaim')}
    </Typography>
  );
};

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
            color: colors.mandalay700,
            letterSpacing: '-0.01em',
          }}
        >
          Boat4you
        </Typography>
      </Stack>
      <BrandClaim />
    </Stack>
    <List disablePadding classes={{ root: styles.socials }} className={styles.socialList}>
      {socials.map(({ href, icon: SocialIcon, name }, index) => (
        <ListItem disableGutters disablePadding key={`${href}-${index + 1}`} sx={{ width: 'auto' }}>
          {/* Each icon link is named by its network — all five read "Social link" (audit B50). */}
          <Link
            href={href}
            className={styles.icon}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Boat4You · ${name}`}
          >
            {SocialIcon && <SocialIcon size={24} fill={colors.black400} />}
          </Link>
        </ListItem>
      ))}
    </List>
  </Stack>
);

export default BusinessCard;
