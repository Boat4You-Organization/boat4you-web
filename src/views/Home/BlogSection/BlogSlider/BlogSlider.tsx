import { Swiper as SwiperType } from 'swiper';

import BlogCard from '@/components/BlogCard';
import HorizontalSlider from '@/components/HorizontalSlider';
import { BlogTeaser } from '@/types/blog.type';
import useBreakpoint from '@/utils/hooks/useBreakpoint';

interface BlogSliderProps {
  blogs: BlogTeaser[];
  handleSwiper: (swiper: SwiperType) => void;
}

const BlogSlider = ({ blogs, handleSwiper }: BlogSliderProps) => {
  const { isMobile } = useBreakpoint();

  return (
    <HorizontalSlider
      data={blogs}
      handleSwiper={handleSwiper}
      renderItem={blog => <BlogCard variant="home" {...blog} />}
      maxSlideWidth={isMobile ? 267 : 305}
    />
  );
};

export default BlogSlider;
