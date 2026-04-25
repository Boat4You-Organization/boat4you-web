import { VesselType } from '@/models/yacht.model';

// Config for the home "Our Fleet" slider. Curated to the 9 vessel types we
// actually broker. Trimaran, House boat and Rubber boat are intentionally
// omitted here — the OurFleetSectionSlider filters the backend `fleet` payload
// through this map's keys so those types never render as cards. The enum
// itself still carries all 12 values so existing yachts (cards, detail pages,
// reservations) with Trimaran/Houseboat/Rubber keep rendering correctly.
export const VESSEL_TYPE_CONFIG = {
  [VesselType.CATAMARAN]: {
    titleKey: 'fleet.catamarans',
    image: {
      src: '/images/ourFleet/catamaran.webp',
      alt: 'fleet.catamarans',
    },
    slug: VesselType.CATAMARAN,
  },
  [VesselType.SAILING_YACHT]: {
    titleKey: 'fleet.sailingYachts',
    image: {
      src: '/images/ourFleet/sailing-yacht.webp',
      alt: 'fleet.sailingYachts',
    },
    slug: VesselType.SAILING_YACHT,
  },
  [VesselType.POWER_CATAMARAN]: {
    titleKey: 'fleet.powerCatamarans',
    image: {
      src: '/images/ourFleet/power-catamaran.webp',
      alt: 'fleet.powerCatamarans',
    },
    slug: VesselType.POWER_CATAMARAN,
  },
  [VesselType.GULET]: {
    titleKey: 'fleet.gulets',
    image: {
      src: '/images/ourFleet/gulet.webp',
      alt: 'fleet.gulets',
    },
    slug: VesselType.GULET,
  },
  [VesselType.LUXURY_MOTOR_YACHT]: {
    titleKey: 'fleet.luxuryMotorYachts',
    image: {
      src: '/images/ourFleet/luxury-motor-yacht.webp',
      alt: 'fleet.luxuryMotorYachts',
    },
    slug: VesselType.LUXURY_MOTOR_YACHT,
  },
  [VesselType.MINI_CRUISER]: {
    titleKey: 'fleet.miniCruisers',
    image: {
      src: '/images/ourFleet/mini-cruiser.webp',
      alt: 'fleet.miniCruisers',
    },
    slug: VesselType.MINI_CRUISER,
  },
  [VesselType.MOTORBOAT]: {
    titleKey: 'fleet.motorboats',
    image: {
      src: '/images/ourFleet/motorboat.webp',
      alt: 'fleet.motorboats',
    },
    slug: VesselType.MOTORBOAT,
  },
  [VesselType.MOTOR_YACHT]: {
    titleKey: 'fleet.motorYachts',
    image: {
      src: '/images/ourFleet/motor-yacht.webp',
      alt: 'fleet.motorYachts',
    },
    slug: VesselType.MOTOR_YACHT,
  },
  [VesselType.MOTORSAILER]: {
    titleKey: 'fleet.motorSailors',
    image: {
      src: '/images/ourFleet/motor-sailor.webp',
      alt: 'fleet.motorSailors',
    },
    slug: VesselType.MOTORSAILER,
  },
} as const;
