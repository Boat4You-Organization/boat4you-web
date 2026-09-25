import { Metadata } from 'next';
import { Locale, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { routing } from '@/i18n/routing';
import { ReviewFormContext } from '@/models/review.model';
import { isReviewToken } from '@/utils/static/reviewToken';
import ReviewPageView, { ReviewPageState } from '@/views/Review/ReviewPageView';

/**
 * Guest review form behind the magic link from the review request e-mail
 * (backend V9_62). The token is the credential: the page is rendered per
 * request (context fetched with no-store), never indexed, never in a
 * sitemap, robots-disallowed, and sent with `Referrer-Policy: no-referrer`
 * + `Cache-Control: private, no-store` (next.config.js).
 */
export const dynamic = 'force-dynamic';

interface ReviewPageProps {
  params: Promise<{ locale: Locale; token: string }>;
  searchParams: Promise<{ rating?: string | string[] }>;
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'review' });

  return {
    title: t('meta.title'),
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
    referrer: 'no-referrer',
    // The root layout's canonical / hreflang / og:url point at the homepage;
    // a private one-off page carries none of them.
    alternates: {},
    openGraph: null,
  };
}

const loadContext = async (token: string): Promise<ReviewPageState> => {
  if (!isReviewToken(token)) return { kind: 'expired' };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/reviews/request/${encodeURIComponent(token)}`,
      { cache: 'no-store', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000) }
    );

    if (response.status === 404) return { kind: 'expired' };

    if (!response.ok) return { kind: 'unavailable' };

    const context = (await response.json()) as ReviewFormContext;

    if (context.submitted && !context.editable) return { kind: 'done' };

    return { kind: 'form', context };
  } catch {
    return { kind: 'unavailable' };
  }
};

const ReviewPage = async ({ params, searchParams }: ReviewPageProps) => {
  const { locale, token } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const [state, query] = await Promise.all([loadContext(token), searchParams]);
  // The e-mail's star links carry ?rating=1..5 to preselect the overall rating.
  const rawRating = Number(Array.isArray(query.rating) ? query.rating[0] : query.rating);
  const initialRating = Number.isInteger(rawRating) && rawRating >= 1 && rawRating <= 5 ? rawRating : null;

  return <ReviewPageView state={state} token={token} locale={locale} initialRating={initialRating} />;
};

export default ReviewPage;
