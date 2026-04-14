import { SVGProps } from 'react';

const YouTube = ({
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
      d="M21 8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8Zm-11.493.13a1.001 1.001 0 0 1 1.008.013l5 3 .107.074a1 1 0 0 1 0 1.566l-.107.074-5 3A1.001 1.001 0 0 1 9 15V9a1 1 0 0 1 .507-.87ZM11 13.233 13.056 12 11 10.766v2.467ZM23 16a5 5 0 0 1-5 5H6a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5h12a5 5 0 0 1 5 5v8Z"
    />
  </svg>
);

export default YouTube;
