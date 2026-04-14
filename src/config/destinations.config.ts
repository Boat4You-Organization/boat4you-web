import Image from '@/types/image.type';

type DestinationTranslationKey =
  | 'destinationsSection.destinations.bahamas'
  | 'destinationsSection.destinations.caribbean'
  | 'destinationsSection.destinations.croatia'
  | 'destinationsSection.destinations.france'
  | 'destinationsSection.destinations.greece'
  | 'destinationsSection.destinations.italy'
  | 'destinationsSection.destinations.martinique'
  | 'destinationsSection.destinations.montenegro'
  | 'destinationsSection.destinations.seychelles'
  | 'destinationsSection.destinations.spain'
  | 'destinationsSection.destinations.türkiye'
  | 'destinationsSection.destinations.virginIslandsBritish'
  | 'destinationsSection.destinations.grenada';

interface CountryImageMap {
  [countryCode: string]: {
    image: Image;
    translationKey: DestinationTranslationKey;
  };
}

export const countryImages: CountryImageMap = {
  BS: {
    image: {
      src: '/images/destinations/bahamas.webp',
      alt: 'destinations.bahamas',
    },
    translationKey: 'destinationsSection.destinations.bahamas',
  },
  ES: {
    image: {
      src: '/images/destinations/spain.webp',
      alt: 'destinations.spain',
    },
    translationKey: 'destinationsSection.destinations.spain',
  },
  FR: {
    image: {
      src: '/images/destinations/france.webp',
      alt: 'destinations.france',
    },
    translationKey: 'destinationsSection.destinations.france',
  },
  GR: {
    image: {
      src: '/images/destinations/greece.webp',
      alt: 'destinations.greece',
    },
    translationKey: 'destinationsSection.destinations.greece',
  },
  HR: {
    image: {
      src: '/images/destinations/croatia.webp',
      alt: 'destinations.croatia',
    },
    translationKey: 'destinationsSection.destinations.croatia',
  },
  IT: {
    image: {
      src: '/images/destinations/italy.webp',
      alt: 'destinations.italy',
    },
    translationKey: 'destinationsSection.destinations.italy',
  },
  ME: {
    image: {
      src: '/images/destinations/montenegro.webp',
      alt: 'destinations.montenegro',
    },
    translationKey: 'destinationsSection.destinations.montenegro',
  },
  MQ: {
    image: {
      src: '/images/destinations/martinique.webp',
      alt: 'destinations.martinique',
    },
    translationKey: 'destinationsSection.destinations.martinique',
  },
  SC: {
    image: {
      src: '/images/destinations/seychelles.webp',
      alt: 'destinations.seychelles',
    },
    translationKey: 'destinationsSection.destinations.seychelles',
  },
  TR: {
    image: {
      src: '/images/destinations/turkey.webp',
      alt: 'destinations.türkiye',
    },
    translationKey: 'destinationsSection.destinations.türkiye',
  },
  VG: {
    image: {
      src: '/images/destinations/british-virgin-islands.webp',
      alt: 'destinations.virginIslandsBritish',
    },
    translationKey: 'destinationsSection.destinations.virginIslandsBritish',
  },
  GD: {
    image: {
      src: '/images/destinations/grenada.webp',
      alt: 'destinations.grenada',
    },
    translationKey: 'destinationsSection.destinations.grenada',
  },
};

export const getImageByCountryCode = (countryCode: string) =>
  countryImages[countryCode]?.image || {
    src: '/images/destinations/default.webp',
    alt: 'destinations.default',
  };

export const getTranslationKeyByCountryCode = (countryCode: string): DestinationTranslationKey =>
  countryImages[countryCode]?.translationKey;

const destinationNameToTranslationKey: Record<string, DestinationTranslationKey> = {
  Bahamas: 'destinationsSection.destinations.bahamas',
  Croatia: 'destinationsSection.destinations.croatia',
  France: 'destinationsSection.destinations.france',
  Greece: 'destinationsSection.destinations.greece',
  Italy: 'destinationsSection.destinations.italy',
  Martinique: 'destinationsSection.destinations.martinique',
  Montenegro: 'destinationsSection.destinations.montenegro',
  Seychelles: 'destinationsSection.destinations.seychelles',
  Spain: 'destinationsSection.destinations.spain',
  Turkey: 'destinationsSection.destinations.türkiye',
  Türkiye: 'destinationsSection.destinations.türkiye',
  'Virgin Islands (British)': 'destinationsSection.destinations.virginIslandsBritish',
  Grenada: 'destinationsSection.destinations.grenada',
};

export const getTranslationKeyByDestinationName = (destinationName: string): DestinationTranslationKey | null =>
  destinationNameToTranslationKey[destinationName] || null;
