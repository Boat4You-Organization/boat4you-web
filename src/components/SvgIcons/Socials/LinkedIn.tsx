import { SVGProps } from 'react';

// Outline mark in the same 24px frame as the Instagram / YouTube icons.
const LinkedIn = ({
  props,
  fill = 'currentColor',
  size = '1rem',
}: {
  props?: SVGProps<SVGSVGElement>;
  fill?: string;
  size?: string | number;
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="4" stroke={fill} strokeWidth="2" />
    <circle cx="8" cy="8" r="1.1" fill={fill} />
    <path
      d="M8 11v5M11.5 16v-5M11.5 13.5a2.5 2.5 0 0 1 5 0V16"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LinkedIn;
