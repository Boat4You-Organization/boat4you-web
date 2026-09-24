'use client';

import { ReactNode } from 'react';

import { Theme, useMediaQuery } from '@mui/material';

interface HeaderSearchSwitchProps {
  /** Server-side guess from the user agent — only seeds the first paint. */
  initialIsMobile: boolean;
  mobile: ReactNode;
  desktop: ReactNode;
}

/**
 * Picks the /search header by viewport WIDTH, not by user agent.
 *
 * The layout used to branch on the UA in a server component, so the choice
 * was baked into the page: an iPhone Duo unfolded to an 890px screen still
 * got the phone header (back arrow + pill + filter icon, no logo, no
 * sign-in), and folding or unfolding never re-evaluated it. The UA is still
 * the best guess for the very first paint — it seeds `defaultMatches` so the
 * server HTML and hydration agree — after which a live media query takes
 * over and follows every resize, rotation and fold.
 *
 * `lg` is the site's own phone/desktop line: below it the filter sidebar is
 * hidden and the phone header's filter icon is the only way to filter.
 */
const HeaderSearchSwitch = ({ initialIsMobile, mobile, desktop }: HeaderSearchSwitchProps) => {
  const isBelowLg = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'), {
    defaultMatches: initialIsMobile,
  });

  return isBelowLg ? mobile : desktop;
};

export default HeaderSearchSwitch;
