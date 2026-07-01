import { SVGProps } from 'react';

/**
 * Visa + Mastercard acceptance marks shown next to the "Online payments /
 * Credit card" option — a visual trust cue stronger than the "Powered by
 * Stripe" caption alone. Simplified brand marks (VISA wordmark, Mastercard
 * interlocking circles) drawn inline so no external asset request is needed.
 */
const CardBrands = ({ props, height = 20 }: { props?: SVGProps<SVGSVGElement>; height?: number }) => (
  <svg
    width={height * 3.4}
    height={height}
    viewBox="0 0 102 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Visa and Mastercard accepted"
    role="img"
    {...props}
  >
    {/* Visa badge */}
    <rect x="0.5" y="0.5" width="47" height="29" rx="4.5" fill="#fff" stroke="#E2E8F0" />
    <text
      x="24"
      y="20.5"
      textAnchor="middle"
      fontFamily="Helvetica, Arial, sans-serif"
      fontSize="13"
      fontWeight="bold"
      fontStyle="italic"
      fill="#1A1F71"
      letterSpacing="0.5"
    >
      VISA
    </text>
    {/* Mastercard badge */}
    <rect x="54.5" y="0.5" width="47" height="29" rx="4.5" fill="#fff" stroke="#E2E8F0" />
    <circle cx="72.5" cy="15" r="9" fill="#EB001B" />
    <circle cx="83.5" cy="15" r="9" fill="#F79E1B" fillOpacity="0.9" />
    <path d="M78 8.2a9 9 0 0 1 0 13.6 9 9 0 0 1 0-13.6Z" fill="#FF5F00" />
  </svg>
);

export default CardBrands;
