import { useTranslations } from 'next-intl';
import Link from 'next/link';

import BlogCard from '@/components/BlogCard';
import { BlogTeaser } from '@/types/blog.type';

import styles from './BlogSection.module.scss';

interface BlogSectionProps {
  posts: BlogTeaser[];
}

/**
 * Home blog teaser — was a Swiper carousel (client + Swiper hydration, a heavy
 * mobile cost). Replaced (Jun-2026) with a static grid: 3 latest posts + a
 * "Show more" tile linking to /blog (Mario, mirrors the competitor layout).
 * Server component now, no Swiper JS.
 */
const BlogSection = ({ posts }: BlogSectionProps) => {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  const teasers = posts.slice(0, 3);

  if (!teasers.length) return null;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        {t('blogSection.readAboutYour')} <span className={styles.titleEmphasis}>{t('blogSection.nextHoliday')}</span>
      </h2>
      <p className={styles.subtitle}>{t('blogSection.discoverSecretSpots')}</p>

      <div className={styles.grid}>
        {teasers.map(post => (
          <BlogCard key={post.slug} variant="home" {...post} />
        ))}
        <Link href="/blog" className={styles.showMore}>
          <span>{tCommon('showMore')}</span>
        </Link>
      </div>
    </section>
  );
};

export default BlogSection;
