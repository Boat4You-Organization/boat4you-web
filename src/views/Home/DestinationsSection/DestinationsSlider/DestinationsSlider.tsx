import { Swiper as SwiperType } from 'swiper';

import HorizontalSlider from '@/components/HorizontalSlider';
import { CountryCountModel } from '@/models/locations.model';

import DestinationCard from './DestinationCard';

interface DestinationsSliderProps {
  data: CountryCountModel[];
  handleSwiper: (swiper: SwiperType) => void;
}

const DestinationsSlider = ({ data, handleSwiper }: DestinationsSliderProps) => (
  <HorizontalSlider
    data={data}
    handleSwiper={handleSwiper}
    renderItem={(item, index) => <DestinationCard {...item} priority={index < 3} />}
  />
);

export default DestinationsSlider;
