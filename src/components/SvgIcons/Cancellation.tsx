import { SVGProps } from 'react';

const Cancellation = ({
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
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.238 3.797a13.75 13.75 0 1 1 10.524 25.406A13.75 13.75 0 0 1 11.238 3.797ZM16.5 5.5a11 11 0 1 0 0 22 11 11 0 0 0 0-22Z"
      fill={variant === 'secondary' ? '#BDBDBD' : fill}
    />
    <path
      d="M12.778 12.778a1.375 1.375 0 0 1 1.944 0l1.778 1.777 1.778-1.777a1.375 1.375 0 0 1 1.944 1.944L18.445 16.5l1.777 1.778a1.375 1.375 0 0 1-1.944 1.944L16.5 18.445l-1.778 1.777a1.375 1.375 0 0 1-1.944-1.944l1.777-1.778-1.777-1.778a1.375 1.375 0 0 1 0-1.944Z"
      fill={variant === 'secondary' ? '#2856FF' : fill}
    />
  </svg>
);

export default Cancellation;
