import type { Swiper as SwiperType } from 'swiper';

import HorizontalSlider from '@/components/HorizontalSlider';
import { VESSEL_TYPE_CONFIG } from '@/config/ourFleet.config';
import { YachtFleet } from '@/models/yacht.model';

import OurFleetCard from './OurFleetCard';

interface OurFleetSectionSliderProps {
  handleSwiper: (swiper: SwiperType) => void;
  fleet: YachtFleet[];
}

// Vessel types we actually broker. Backend may still return legacy Trimaran /
// House boat / Rubber boat buckets — skip those so they never render as cards
// (product requirement) and so OurFleetCard doesn't dereference a missing
// config. Kept in sync with VESSEL_TYPE_CONFIG keys.
const ALLOWED_FLEET_TYPES = new Set(Object.keys(VESSEL_TYPE_CONFIG));

const OurFleetSectionSlider = ({ handleSwiper, fleet }: OurFleetSectionSliderProps) => {
  const visibleFleet = fleet.filter(entry => ALLOWED_FLEET_TYPES.has(entry.vesselType));

  return (
    <HorizontalSlider data={visibleFleet} handleSwiper={handleSwiper} renderItem={boat => <OurFleetCard {...boat} />} />
  );
};

export default OurFleetSectionSlider;
