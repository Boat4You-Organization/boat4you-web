import { SVGProps } from 'react';

const Instagram = ({
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
      fillRule="evenodd"
      d="M8 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm-3.536-.536A5 5 0 0 1 8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 1.464-3.536ZM16.5 6.5a1 1 0 0 1 1 1v.01a1 1 0 1 1-2 0V7.5a1 1 0 0 1 1-1ZM9.172 9.172a4 4 0 1 1 5.656 5.656 4 4 0 0 1-5.656-5.656ZM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
      clipRule="evenodd"
    />
  </svg>
);

export default Instagram;
