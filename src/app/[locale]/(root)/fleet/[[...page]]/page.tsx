/* eslint-disable react/no-danger */
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Layout from '@/components/Layout';
import { LocaleType } from '@/config/locales.config';
import { buildBreadcrumbJsonLd } from '@/utils/static/buildItineraryJsonLd';
import { buildMetadata } from '@/utils/static/buildMetadata';
import { MAX_FLEET_PAGES, fleetPagePath, getFleetPage } from '@/utils/static/fleetIndex';
import { serializeJsonLd } from '@/utils/static/serializeJsonLd';
import FleetDirectory from '@/views/Fleet/FleetDirectory';

/**
 * Crawlable fleet directory.
 *
 * Every promoted boat gets a plain server-rendered `<a>` here, so Googlebot
 * can walk the catalogue by links instead of relying on the XML sitemap
 * alone. /search stays exactly as it is — it renders no boats on a
 * parameter-free request by design (that is the request Googlebot always
 * makes), which left the catalogue with a sitemap entry and no inbound
 * internal link at all.
 *
 * ISR at 6 h. Each directory page maps straight onto the backend's own
 * pagination (see `getFleetPage`), so rendering one costs three cached
 * requests rather than a walk of the whole catalogue — and locale plus
 * currency are pinned, so all nine languages share those cache entries.
 */
export const revalidate = 21600;

interface FleetDirectoryPageProps {
  params: Promise<{ locale: Locale; page?: string[] }>;
}

/** `/fleet` → 1, `/fleet/3` → 3, anything else → NaN (renders a 404). */
const parsePageSegment = (segments?: string[]): number => {
  if (!segments || segments.length === 0) return 1;

  if (segments.length > 1) return NaN;

  return /^[1-9][0-9]*$/.test(segments[0]) ? Number(segments[0]) : NaN;
};

export async function generateMetadata({ params }: FleetDirectoryPageProps): Promise<Metadata> {
  const { locale, page } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('metadata.metadata.fleet');
  const pageNumber = parsePageSegment(page);
  const safePage = Number.isNaN(pageNumber) ? 1 : pageNumber;
  const title = safePage > 1 ? `${t('title')} — ${safePage}` : t('title');

  // No `titleAbsolute` — the "%s | Boat4You" template from the root layout
  // applies, so page 2 reads "… — 2 | Boat4You" rather than losing the brand.
  return buildMetadata({
    locale: locale as LocaleType,
    title,
    description: t('description'),
    path: fleetPagePath(safePage),
  });
}

const FleetDirectoryPage = async ({ params }: FleetDirectoryPageProps) => {
  const { locale, page } = await params;

  setRequestLocale(locale);

  const pageNumber = parsePageSegment(page);

  if (Number.isNaN(pageNumber)) notFound();

  // Reject an absurd page number before touching the backend — otherwise
  // /fleet/<any big number> mints a separate ISR entry per number for the
  // same 404.
  if (pageNumber > MAX_FLEET_PAGES) notFound();

  const slice = await getFleetPage(pageNumber);

  if (!slice) notFound();

  const [tCommon, tFleet] = await Promise.all([getTranslations('common'), getTranslations('metadata.fleet')]);

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: tCommon('home'), url: '/' },
    { name: tFleet('heading'), url: '/fleet' },
  ]);

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbLd) }} />
      <FleetDirectory slice={slice} />
    </Layout>
  );
};

export default FleetDirectoryPage;
