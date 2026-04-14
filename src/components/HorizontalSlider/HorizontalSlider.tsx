import cx from 'clsx';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { Keyboard, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import styles from './HorizontalSlider.module.scss';

interface HorizontalSliderProps<T> {
  data: T[];
  handleSwiper?: (swiper: SwiperType) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  customStyles?: {
    container?: string;
    slide?: string;
  };
  maxSlideWidth?: number;
  slidesPerView?: number | 'auto';
  enableKeyboard?: boolean;
}

const HorizontalSlider = <T,>({
  data,
  handleSwiper,
  renderItem,
  customStyles,
  maxSlideWidth,
  slidesPerView = 'auto',
  enableKeyboard = false,
}: HorizontalSliderProps<T>) => (
  <Swiper
    slidesPerView={slidesPerView}
    modules={[Mousewheel, Keyboard]}
    onSwiper={handleSwiper}
    mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
    keyboard={{ enabled: enableKeyboard }}
    className={cx(styles.container, customStyles?.container, { [styles.containerAuto]: slidesPerView === 'auto' })}
  >
    {data.map((item, index) => (
      <SwiperSlide
        key={`${index + 1}`}
        className={cx(styles.slide, customStyles?.slide)}
        style={{ maxWidth: maxSlideWidth }}
      >
        {renderItem(item, index)}
      </SwiperSlide>
    ))}
  </Swiper>
);

export default HorizontalSlider;
