import { SVGProps } from 'react';

const Save = ({
  props,
  fill = 'currentColor',
  size = '1rem',
}: {
  props?: SVGProps<SVGSVGElement>;
  fill?: string;
  size?: string | number;
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      fill={fill}
      d="M3 18V6a3 3 0 0 1 3-3h10l.099.005a1 1 0 0 1 .608.288l4 4A1 1 0 0 1 21 8v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3Zm10-4a1 1 0 1 0-2 0 1 1 0 0 0 2 0ZM9 7h4V5H9v2Zm6 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM5 18l.005.099A1 1 0 0 0 6 19h12a1 1 0 0 0 1-1V8.414L15.586 5H15v3a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5H6a1 1 0 0 0-1 1v12Z"
    />
  </svg>
);

export default Save;
