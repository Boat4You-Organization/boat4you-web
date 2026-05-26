'use client';

import { VesselType } from '@/models/yacht.model';

interface YachtTypeIconProps {
  type: VesselType;
  size?: number;
}

/**
 * Compact line-art SVG icons for the yacht-type grid (24×24 by
 * default). Hand-tuned per design handoff so the silhouettes read
 * clearly at icon size — generic boat / yacht / catamaran shapes,
 * matching the JSX reference. `currentColor` everywhere so the parent
 * tile flips to white when selected.
 */
const YachtTypeIcon = ({ type, size = 22 }: YachtTypeIconProps) => {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 32 32',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (type) {
    case VesselType.CATAMARAN:
    case VesselType.POWER_CATAMARAN:
      return (
        <svg {...props}>
          <path d="M3 22 L11 22 L13 27 L5 27 Z" />
          <path d="M21 22 L29 22 L27 27 L19 27 Z" />
          <path d="M11 22 L21 22" />
          <path d="M16 22 L16 6 L23 18" />
          <path d="M16 8 L10 18 L16 18" />
        </svg>
      );
    case VesselType.MOTORBOAT:
    case VesselType.MOTOR_YACHT:
    case VesselType.LUXURY_MOTOR_YACHT:
      return (
        <svg {...props}>
          <path d="M3 22 L29 22 L25 27 L7 27 Z" />
          <path d="M8 22 L8 15 L24 15 L24 22" />
          <path d="M12 15 L12 11 L20 11 L20 15" />
        </svg>
      );
    case VesselType.GULET:
    case VesselType.MINI_CRUISER:
      return (
        <svg {...props}>
          <path d="M2 22 L30 22 L26 27 L6 27 Z" />
          <path d="M10 22 L10 8" />
          <path d="M22 22 L22 8" />
          <path d="M10 10 L22 10" />
        </svg>
      );
    case VesselType.HOUSE_BOAT:
    case VesselType.RUBBER_BOAT:
      return (
        <svg {...props}>
          <path d="M3 22 L29 22 L25 27 L7 27 Z" />
          <path d="M8 22 L8 15 L24 15 L24 22" />
          <path d="M12 15 L12 12 L20 12 L20 15" />
        </svg>
      );
    case VesselType.MOTORSAILER:
      return (
        <svg {...props}>
          <path d="M4 22 L28 22 L24 27 L8 27 Z" />
          <path d="M16 22 L16 8 L23 18 L16 18" />
          <path d="M16 22 L16 14" />
        </svg>
      );
    case VesselType.SAILING_YACHT:
    case VesselType.TRIMARAN:
    default:
      return (
        <svg {...props}>
          <path d="M4 22 L28 22 L24 27 L8 27 Z" />
          <path d="M16 22 L16 6 L24 18" />
          <path d="M16 8 L10 18 L16 18" />
        </svg>
      );
  }
};

export default YachtTypeIcon;
