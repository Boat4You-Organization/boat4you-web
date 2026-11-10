import { SVGProps } from 'react';

import { LOGO_WORDMARK_PATH } from './Logo';

/**
 * The logo's "boat4you" lettering, drawn huge at the foot of the footer (design "Footer 1a", 10.11.2026). The
 * viewBox keeps the design's crop: a gap of 0.1 em above the ascenders and a cut 0.12 em above the baseline, so the
 * letters run off the bottom edge (1 em = 25.1 units here, from the ascender height). Being an SVG it scales with
 * its width and needs no font size off the type scale. Decorative: hidden from screen readers.
 */
const LogoWordmark = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    viewBox="34.98 5.84 102.95 17.93"
    preserveAspectRatio="xMidYMin meet"
    {...props}
  >
    <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d={LOGO_WORDMARK_PATH} />
  </svg>
);

export default LogoWordmark;
