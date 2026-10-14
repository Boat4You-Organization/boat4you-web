import type { CSSProperties, ReactNode } from 'react';

/**
 * Inline stroke icons that replace supplementary-plane emoji (U+1F300+) in UI copy.
 * Devices without an emoji font render those as hex "tofu" boxes; these SVGs render
 * everywhere. They inherit the text colour (currentColor) and scale with the font (em).
 * Decorative by default (aria-hidden); pass `label` when the icon carries meaning.
 */
interface UiIconProps {
  size?: string | number;
  label?: string;
  style?: CSSProperties;
}

const UiIcon = ({ size = '1.2em', label, style, children }: UiIconProps & { children: ReactNode }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    focusable="false"
    style={{ display: 'inline-block', verticalAlign: '-0.22em', flexShrink: 0, ...style }}
    {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
  >
    {label && <title>{label}</title>}
    {children}
  </svg>
);

/* Cloud occupying the upper part of the box (x 3–21, y 3–16), used by the weather set. */
const CLOUD_TOP = 'M7 16a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 8.5a3.75 3.75 0 0 1 .5 7.5Z';

/* ------------------------------- Weather ------------------------------- */

export const IconSun = (p: UiIconProps) => (
  <UiIcon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </UiIcon>
);

export const IconSunCloud = (p: UiIconProps) => (
  <UiIcon {...p}>
    <circle cx="9" cy="9" r="3.5" />
    <path d="M9 2v1.5M2 9h1.5M4.05 4.05l1.06 1.06M13.95 4.05l-1.06 1.06M4.05 13.95l1.06-1.06" />
    <path d="M12 21a3 3 0 0 1 0-6 4 4 0 0 1 7.5 1 2.5 2.5 0 0 1 .5 5Z" />
  </UiIcon>
);

export const IconPartlyCloudy = (p: UiIconProps) => (
  <UiIcon {...p}>
    <path d="M4.6 10.2A3.6 3.6 0 0 1 11.4 7" />
    <path d="M8 1.8v1.4M2 7.6h1.4M3.6 3.4l1 1M12.4 3.4l-1 1" />
    <g transform="translate(1 6)">
      <path d={CLOUD_TOP} />
    </g>
  </UiIcon>
);

export const IconCloud = (p: UiIconProps) => (
  <UiIcon {...p}>
    <g transform="translate(0 3)">
      <path d={CLOUD_TOP} />
    </g>
  </UiIcon>
);

export const IconFog = (p: UiIconProps) => (
  <UiIcon {...p}>
    <path d={CLOUD_TOP} />
    <path d="M4 19h16M7 22h10" />
  </UiIcon>
);

export const IconDrizzle = (p: UiIconProps) => (
  <UiIcon {...p}>
    <path d={CLOUD_TOP} />
    <path d="M8 19.5h.01M12 19.5h.01M16 19.5h.01M10 22.5h.01M14 22.5h.01" />
  </UiIcon>
);

export const IconRain = (p: UiIconProps) => (
  <UiIcon {...p}>
    <path d={CLOUD_TOP} />
    <path d="M8 18.5l-1 3M12 18.5l-1 3M16 18.5l-1 3" />
  </UiIcon>
);

export const IconShowers = (p: UiIconProps) => (
  <UiIcon {...p}>
    <path d={CLOUD_TOP} />
    <path d="M9.5 18.5l-1 3M14.5 18.5l-1 3" />
    <path d="M20.5 1.5v1M22.5 5h-1M22 2.5l-.7.7" />
  </UiIcon>
);

export const IconSnow = (p: UiIconProps) => (
  <UiIcon {...p}>
    <path d={CLOUD_TOP} />
    <path d="M8 18.5v4M6.27 19.5l3.46 2M6.27 21.5l3.46-2M16 18.5v4M14.27 19.5l3.46 2M14.27 21.5l3.46-2" />
  </UiIcon>
);

export const IconThunder = (p: UiIconProps) => (
  <UiIcon {...p}>
    <path d={CLOUD_TOP} />
    <path d="M13 15.5l-2.5 3.5h3.5l-2.5 3.5" />
  </UiIcon>
);

/* -------------------------------- Trip UI -------------------------------- */

export const IconMap = (p: UiIconProps) => (
  <UiIcon {...p}>
    <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
    <path d="M9 4v14M15 6v14" />
  </UiIcon>
);

export const IconCrown = (p: UiIconProps) => (
  <UiIcon {...p}>
    <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8Z" />
  </UiIcon>
);

export const IconCompass = (p: UiIconProps) => (
  <UiIcon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5 5-2Z" />
  </UiIcon>
);

export const IconShareOut = (p: UiIconProps) => (
  <UiIcon {...p}>
    <path d="M12 15V3M7.5 7.5 12 3l4.5 4.5" />
    <path d="M4 13v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
  </UiIcon>
);

export const IconGift = (p: UiIconProps) => (
  <UiIcon {...p}>
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M12 8v13" />
    <path d="M12 8C10.5 4.5 7 4 7 6.5S10 8 12 8Zm0 0c1.5-3.5 5-4 5-1.5S14 8 12 8Z" />
  </UiIcon>
);

export const IconBook = (p: UiIconProps) => (
  <UiIcon {...p}>
    <path d="M2 5.5c2.5-1 6-1 10 1 4-2 7.5-2 10-1V19c-2.5-1-6-1-10 1-4-2-7.5-2-10-1V5.5Z" />
    <path d="M12 6.5V20" />
  </UiIcon>
);

export const IconPhone = (p: UiIconProps) => (
  <UiIcon {...p}>
    <path d="M5 3h3.5L10 7.5 8 9a11 11 0 0 0 7 7l1.5-2 4.5 1.5V19a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" />
  </UiIcon>
);

export const IconBell = (p: UiIconProps) => (
  <UiIcon {...p}>
    <path d="M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" />
    <path d="M10 20.5a2 2 0 0 0 4 0" />
  </UiIcon>
);

export const IconCamera = (p: UiIconProps) => (
  <UiIcon {...p}>
    <path d="M4 7h3l1.5-2.5h7L17 7h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13" r="3.5" />
  </UiIcon>
);

export const IconCalendar = (p: UiIconProps) => (
  <UiIcon {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </UiIcon>
);

export const IconDocument = (p: UiIconProps) => (
  <UiIcon {...p}>
    <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5Z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </UiIcon>
);

export const IconChat = (p: UiIconProps) => (
  <UiIcon {...p}>
    <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
  </UiIcon>
);

export const IconInstallPhone = (p: UiIconProps) => (
  <UiIcon {...p}>
    <rect x="6.5" y="2" width="11" height="20" rx="2" />
    <path d="M12 6.5v7M9 10.5l3 3 3-3M11 18.5h2" />
  </UiIcon>
);

export const IconWaves = (p: UiIconProps) => (
  <UiIcon {...p}>
    <path d="M2 9c1.7 0 2.3-1.5 4-1.5S8.3 9 10 9s2.3-1.5 4-1.5S16.3 9 18 9s2.3-1.5 4-1.5" />
    <path d="M2 15c1.7 0 2.3-1.5 4-1.5S8.3 15 10 15s2.3-1.5 4-1.5 2.3 1.5 4 1.5 2.3-1.5 4-1.5" />
  </UiIcon>
);
