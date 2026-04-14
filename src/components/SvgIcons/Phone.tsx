import { SVGProps } from 'react';

const Phone = ({
  props,
  fill = 'currentColor',
  size = '1rem',
}: {
  props?: SVGProps<SVGSVGElement>;
  fill?: string;
  size?: string | number;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 5a1 1 0 0 0-1 .974A15 15 0 0 0 18.026 20 1 1 0 0 0 19 19v-3.323l-3.58-1.432-1.063 1.77a1 1 0 0 1-1.3.382 12 12 0 0 1-5.454-5.455 1 1 0 0 1 .383-1.3l1.77-1.061L8.322 5H5ZM2.879 3.879A3 3 0 0 1 5 2.999h4a1 1 0 0 1 .928.63l2 5a1 1 0 0 1-.414 1.228l-1.673 1.005a10 10 0 0 0 3.297 3.297l1.005-1.674a1 1 0 0 1 1.228-.413l5 2A1 1 0 0 1 21 15v4a3 3 0 0 1-3.06 2.998A17 17 0 0 1 2 6a3 3 0 0 1 .879-2.121Z"
      fill={fill}
    />
  </svg>
);

export default Phone;
