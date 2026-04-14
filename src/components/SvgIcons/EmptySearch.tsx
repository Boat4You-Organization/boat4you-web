import { SVGProps } from 'react';

const EmptySearch = ({
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
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" {...props}>
    <path
      fill={variant === 'secondary' ? '#2856FF' : fill}
      d="M6.112 6.115a2.67 2.67 0 0 1 3.774 0l48 48a2.668 2.668 0 0 1-3.774 3.77L39.745 43.518a21.327 21.327 0 0 1-29.93-29.93L6.112 9.886a2.668 2.668 0 0 1 0-3.77Zm7.51 11.28a16 16 0 0 0-1.762 3.18 16.003 16.003 0 0 0 14.807 22.11 15.994 15.994 0 0 0 9.268-2.977L13.623 17.396Zm5.41-10.655A21.332 21.332 0 0 1 46.576 34.34a2.667 2.667 0 0 1-4.977-1.922 15.999 15.999 0 0 0-20.659-20.7 2.668 2.668 0 0 1-3.445-1.534 2.668 2.668 0 0 1 1.537-3.445Z"
    />
  </svg>
);

export default EmptySearch;
