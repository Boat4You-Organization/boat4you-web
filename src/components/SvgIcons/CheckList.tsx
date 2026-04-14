import { SVGProps } from 'react';

const CheckList = ({
  props,
  fill = 'currentColor',
  size = '1rem',
}: {
  props?: SVGProps<SVGSVGElement>;
  fill?: string;
  size?: string | number;
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
    <path
      fill={fill || '#fff'}
      fillRule="evenodd"
      d="M5.66 3.16a.833.833 0 0 1 1.18 1.18L4.755 6.422a.833.833 0 0 1-1.179 0l-1.25-1.25a.833.833 0 1 1 1.179-1.179l.66.66 1.495-1.493ZM8.334 5c0-.46.373-.833.834-.833h7.5a.833.833 0 0 1 0 1.666h-7.5A.833.833 0 0 1 8.333 5ZM6.84 8.16a.833.833 0 0 1 0 1.18l-2.083 2.082a.833.833 0 0 1-1.179 0l-1.25-1.25a.833.833 0 1 1 1.179-1.178l.66.66 1.495-1.493a.833.833 0 0 1 1.178 0ZM8.333 10c0-.46.373-.833.834-.833h7.5a.833.833 0 0 1 0 1.666h-7.5A.833.833 0 0 1 8.333 10ZM6.84 13.16a.833.833 0 0 1 0 1.18l-2.083 2.082a.833.833 0 0 1-1.179 0l-1.25-1.25a.833.833 0 1 1 1.179-1.178l.66.66 1.495-1.493a.833.833 0 0 1 1.178 0ZM8.333 15c0-.46.373-.833.834-.833h7.5a.833.833 0 0 1 0 1.666h-7.5A.833.833 0 0 1 8.333 15Z"
      clipRule="evenodd"
    />
  </svg>
);

export default CheckList;
