import { SVGProps } from 'react';

/** A floor plan: the heading icon of the boat page's layout block (LayoutSection). */
const FloorPlan = ({
  props,
  variant = 'primary',
  fill = 'currentColor',
  size = '1rem',
}: {
  props?: SVGProps<SVGSVGElement>;
  variant?: 'primary' | 'secondary';
  fill?: string;
  size?: string | number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    {...props}
  >
    <path
      fill={variant === 'secondary' ? '#BDBDBD' : fill}
      fillRule="evenodd"
      d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 2v14h14V5H5Z"
      clipRule="evenodd"
    />
    <path fill={variant === 'secondary' ? '#2856FF' : fill} d="M11 5h2v6h6v2h-6v3h-2V5ZM5 14h4v2H5v-2Z" />
  </svg>
);

export default FloorPlan;
