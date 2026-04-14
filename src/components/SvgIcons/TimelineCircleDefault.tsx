import { SVGProps } from 'react';

const TimelineCircleDefault = ({ props, size = 20 }: { props?: SVGProps<SVGSVGElement>; size?: string | number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ minWidth: size, minHeight: size }}
    {...props}
  >
    <circle cx="10" cy="10" r="8.5" fill="#fff" stroke="#DCDCDC" strokeWidth="3" />
  </svg>
);

export default TimelineCircleDefault;
