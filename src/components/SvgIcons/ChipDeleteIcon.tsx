import { SVGProps } from 'react';

const ChipDeleteIcon = ({
  variant = 'primary',
  fill = 'currentColor',
  size = '1rem',
  ...props
}: {
  props?: SVGProps<SVGSVGElement>;
  variant?: 'primary' | 'secondary';
  fill?: string;
  size?: string | number;
}) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M11.333 2.227a6.667 6.667 0 1 1-9.997 5.989L1.333 8l.003-.216a6.667 6.667 0 0 1 9.997-5.557ZM7.007 6.093a.667.667 0 0 0-.812 1.045L7.056 8l-.861.862-.055.063a.667.667 0 0 0 .998.88L8 8.943l.862.862.062.055a.666.666 0 0 0 .88-.998L8.943 8l.861-.862.056-.063a.667.667 0 0 0-.998-.88L8 7.057l-.862-.862-.063-.055-.068-.047Z"
      fill={variant === 'secondary' ? '#989898' : fill}
    />
  </svg>
);

export default ChipDeleteIcon;
