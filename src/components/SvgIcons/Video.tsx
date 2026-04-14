import { SVGProps } from 'react';

const Video = ({
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
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      fill={variant === 'secondary' ? '#BDBDBD' : fill}
      d="m20 8.618-4 2v2.764l4 2V8.618ZM14 8a1 1 0 0 0-.901-.995L13 7H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8Zm2 .382 3.105-1.552h.001a2 2 0 0 1 2.575.705l.065.11.059.113a2 2 0 0 1 .195.86v6.765a2.002 2.002 0 0 1-2.894 1.788L16 15.618V16a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v.382Z"
    />
    <path
      fill={variant === 'secondary' ? '#2856FF' : fill}
      d="M8 14v-1H7a1 1 0 1 1 0-2h1v-1a1 1 0 0 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0Z"
    />
  </svg>
);

export default Video;
