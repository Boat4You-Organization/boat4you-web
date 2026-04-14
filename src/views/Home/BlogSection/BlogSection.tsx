'use client';

import { useTranslations } from 'next-intl';
import { Swiper as SwiperType } from 'swiper';

import SliderSection from '@/components/SliderSection';
import { BlogTeaser } from '@/types/blog.type';

import styles from './BlogSection.module.scss';
import BlogSlider from './BlogSlider';

interface BlogSectionProps {
  posts: BlogTeaser[];
}

const BlogSliderWrapper = ({
  handleSwiper,
  blogs,
}: {
  handleSwiper: (swiper: SwiperType) => void;
  blogs: BlogTeaser[];
}) => <BlogSlider blogs={blogs} handleSwiper={handleSwiper} />;

const BlogSection = ({ posts }: BlogSectionProps) => {
  const t = useTranslations('home');

  return (
    <SliderSection
      title={t('blogSection.readAboutYour')}
      emphasizedTitle={t('blogSection.nextHoliday')}
      subtitle={t('blogSection.discoverSecretSpots')}
      // eslint-disable-next-line react/no-unstable-nested-components
      SliderComponent={props => <BlogSliderWrapper {...props} blogs={posts} />}
      customStyles={{ container: styles.container, overlay: styles.overlay }}
    />
  );
};

export default BlogSection;
