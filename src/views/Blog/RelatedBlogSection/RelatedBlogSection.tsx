'use client';

import { useTranslations } from 'next-intl';
import { Swiper as SwiperType } from 'swiper';

import SliderSection from '@/components/SliderSection';
import { BlogTeaser } from '@/types/blog.type';
import BlogSlider from '@/views/Home/BlogSection/BlogSlider';

import styles from './RelatedBlogSection.module.scss';

interface RelatedBlogSectionProps {
  posts: BlogTeaser[];
}

const BlogSliderWrapper = ({
  handleSwiper,
  blogs,
}: {
  handleSwiper: (swiper: SwiperType) => void;
  blogs: BlogTeaser[];
}) => <BlogSlider blogs={blogs} handleSwiper={handleSwiper} />;

const RelatedBlogSection = ({ posts }: RelatedBlogSectionProps) => {
  const t = useTranslations('home');

  return (
    <SliderSection
      title={t('blogSection.readAboutYour')}
      emphasizedTitle={t('blogSection.nextHoliday')}
      subtitle={t('chooseFromFiveHundredLocations')}
      // eslint-disable-next-line react/no-unstable-nested-components
      SliderComponent={props => <BlogSliderWrapper {...props} blogs={posts} />}
      customStyles={{ container: styles.container, overlay: styles.overlay }}
    />
  );
};

export default RelatedBlogSection;
