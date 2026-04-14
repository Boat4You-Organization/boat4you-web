import { VesselType } from '@/models/yacht.model';

export const VESSEL_TYPE_CONFIG = {
  [VesselType.CATAMARAN]: {
    titleKey: 'fleet.catamarans',
    image: {
      src: '/images/ourFleet/catamaran.webp',
      alt: 'fleet.catamarans',
    },
    slug: VesselType.CATAMARAN,
  },
  [VesselType.GULET]: {
    titleKey: 'fleet.gulets',
    image: {
      src: '/images/ourFleet/gulet.webp',
      alt: 'fleet.gulets',
    },
    slug: VesselType.GULET,
  },
  [VesselType.HOUSE_BOAT]: {
    titleKey: 'fleet.houseBoats',
    image: {
      src: '/images/ourFleet/houseBoat.webp',
      alt: 'fleet.houseBoats',
    },
    slug: VesselType.HOUSE_BOAT,
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
  [VesselType.POWER_CATAMARAN]: {
    titleKey: 'fleet.powerCatamarans',
    image: {
      src: '/images/ourFleet/power-catamaran.webp',
      alt: 'fleet.powerCatamarans',
    },
    slug: VesselType.POWER_CATAMARAN,
  },
  [VesselType.SAILING_YACHT]: {
    titleKey: 'fleet.sailingYachts',
    image: {
      src: '/images/ourFleet/sailing-yacht.webp',
      alt: 'fleet.sailingYachts',
    },
    slug: VesselType.SAILING_YACHT,
  },
  [VesselType.TRIMARAN]: {
    titleKey: 'fleet.trimarans',
    image: {
      src: '/images/ourFleet/trimaran.webp',
      alt: 'fleet.trimarans',
    },
    slug: VesselType.TRIMARAN,
  },
  [VesselType.RUBBER_BOAT]: {
    titleKey: 'fleet.rubberBoats',
    image: {
      src: '/images/ourFleet/rubber-boat.webp',
      alt: 'fleet.rubberBoats',
    },
    slug: VesselType.RUBBER_BOAT,
  },
} as const;
