import { Swiper as SwiperType } from 'swiper';

import HorizontalSlider from '@/components/HorizontalSlider';
import { YachtFleet } from '@/models/yacht.model';

import OurFleetCard from './OurFleetCard';

interface OurFleetSectionSliderProps {
  handleSwiper: (swiper: SwiperType) => void;
  fleet: YachtFleet[];
}

const OurFleetSectionSlider = ({ handleSwiper, fleet }: OurFleetSectionSliderProps) => (
  <HorizontalSlider data={fleet} handleSwiper={handleSwiper} renderItem={boat => <OurFleetCard {...boat} />} />
);

export default OurFleetSectionSlider;
