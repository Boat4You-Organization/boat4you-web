import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import Layout from '@/components/Layout';
import { meta } from '@/config/meta';
import { getBlog, getBlogWithSEO } from '@/lib/api';
import { buildMetadata } from '@/utils/static/buildMetadata';
import RelatedBlogSection from '@/views/Blog/RelatedBlogSection';

const SingleBlogContent = dynamic(() => import('@/views/Blog/SingleBlogContent'));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  const blog = await getBlogWithSEO(slug);

  if (!blog?.post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  const { post } = blog;
  const { seo } = post;

  const title = seo?.title || post.title;
  const description = seo?.description || '';
  const path = `/blog/${post.slug}`;
  const image = {
    src: seo?.og_image || post.featuredImage?.sourceUrl,
    alt: post.featuredImage?.altText || post.title,
  };

  const baseMetadata = buildMetadata({
    title,
    description,
    path,
    image,
  });

  return {
    ...baseMetadata,
    alternates: {
      canonical: seo?.canonical || `${meta.url}/blog/${post.slug}`,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      type: 'article',
      publishedTime: post.date,
      title: seo?.og_title || seo?.title || post.title,
      description: seo?.og_description || seo?.description || description,
    },
    twitter: {
      ...baseMetadata.twitter,
      title: seo?.twitter_title || seo?.og_title || seo?.title || post.title,
      description: seo?.twitter_description || seo?.og_description || seo?.description || description,
      images: seo?.twitter_image ? [seo.twitter_image] : baseMetadata.twitter?.images,
    },
    robots: seo?.robots && !seo.robots.includes('noindex') ? seo.robots : { index: true, follow: true },
  };
}

const SingleBlogPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const blog = await getBlog(slug, 10);

  if (!blog) {
    return notFound();
  }

  return (
    <Layout>
      <SingleBlogContent {...blog.post} />
      <RelatedBlogSection posts={blog.posts} />
    </Layout>
  );
};

export default SingleBlogPage;
