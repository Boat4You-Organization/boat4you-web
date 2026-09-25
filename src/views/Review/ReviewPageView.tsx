import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import { Link } from '@/i18n/navigation';
import { ReviewFormContext } from '@/models/review.model';
import { getBoatImageUrl } from '@/utils/static/imageUtils';

import styles from './Review.module.scss';
import ReviewForm from './ReviewForm';

export type ReviewPageState =
  | { kind: 'form'; context: ReviewFormContext }
  | { kind: 'done' }
  | { kind: 'expired' }
  | { kind: 'unavailable' };

interface ReviewPageViewProps {
  state: ReviewPageState;
  token: string;
  locale: string;
  initialRating: number | null;
}

const formatDate = (iso: string | null, locale: string): string | null => {
  if (!iso) return null;

  const date = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);

  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
};

const formatDateTime = (iso: string | null, locale: string): string | null => {
  if (!iso) return null;

  const date = new Date(iso);

  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Zagreb',
        timeZoneName: 'short',
      }).format(date);
};

/** Message-only states (expired link, already reviewed, API down). */
const Message = async ({ title, body, locale }: { title: string; body: string; locale: string }) => {
  const t = await getTranslations({ locale, namespace: 'review' });

  return (
    <div className={styles.message} role="status">
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.text}>{body}</p>
      <Link href="/" className={styles.homeLink}>
        {t('backHome')}
      </Link>
    </div>
  );
};

const ReviewPageView = async ({ state, token, locale, initialRating }: ReviewPageViewProps) => {
  const t = await getTranslations({ locale, namespace: 'review' });

  if (state.kind !== 'form') {
    return (
      <main className={styles.page}>
        <Message locale={locale} title={t(`${state.kind}.title`)} body={t(`${state.kind}.body`)} />
      </main>
    );
  }

  const { context } = state;
  const isYacht = context.kind === 'YACHT';
  const from = formatDate(context.dateFrom, locale);
  const to = formatDate(context.dateTo, locale);
  const base = [context.baseName, context.baseCountry].filter(Boolean).join(', ');

  return (
    <main className={styles.page}>
      <p className={styles.greeting}>
        {context.customerFirstName ? t('greeting', { name: context.customerFirstName }) : t('greetingNoName')}
      </p>
      <h1 className={styles.title}>{isYacht ? t('heading.YACHT') : t('heading.BOOKING')}</h1>
      <p className={styles.text}>
        {isYacht
          ? t('intro.YACHT', { yacht: context.yachtFullLabel })
          : t('intro.BOOKING', { yacht: context.yachtFullLabel })}
      </p>

      <section className={styles.card} aria-label={t('detailsLabel')}>
        {context.yachtMainImageId ? (
          <div className={styles.cardImage}>
            <Image
              src={getBoatImageUrl(context.yachtMainImageId, 256)}
              alt={context.yachtFullLabel}
              width={96}
              height={96}
            />
          </div>
        ) : null}
        <dl className={styles.cardFacts}>
          <div>
            <dt className={styles.visuallyHidden}>{t('yacht')}</dt>
            <dd className={styles.cardTitle}>{context.yachtFullLabel}</dd>
          </div>
          {from && to && (
            <div>
              <dt>{t('dates')}</dt>
              <dd>{`${from} – ${to}`}</dd>
            </div>
          )}
          {base && (
            <div>
              <dt>{t('base')}</dt>
              <dd>{base}</dd>
            </div>
          )}
          {context.reservationNumber && (
            <div>
              <dt>{t('reservation')}</dt>
              <dd>{context.reservationNumber}</dd>
            </div>
          )}
        </dl>
      </section>

      {context.submitted && context.editable && context.editableUntil && (
        <p className={styles.notice}>{t('editNote', { date: formatDateTime(context.editableUntil, locale) ?? '' })}</p>
      )}

      <ReviewForm
        token={token}
        locale={locale}
        kind={context.kind}
        scoreKeys={context.scoreKeys}
        initial={context.review}
        initialRating={initialRating}
        isEdit={context.submitted}
      />
    </main>
  );
};

export default ReviewPageView;
