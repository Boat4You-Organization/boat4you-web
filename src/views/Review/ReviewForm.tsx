'use client';

import { FormEvent, useRef, useState, useTransition } from 'react';

import { Button, Checkbox, FormControlLabel, Rating, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';

import { ReviewSubmitResult, submitReview } from '@/actions/review.actions';
import { Link } from '@/i18n/navigation';
import { REVIEW_TEXT_MAX, REVIEW_TITLE_MAX, ReviewKind, ReviewValues } from '@/models/review.model';

import styles from './Review.module.scss';

interface ReviewFormProps {
  token: string;
  locale: string;
  kind: ReviewKind;
  /** Sub-score keys of this kind, as the backend lists them. */
  scoreKeys: string[];
  /** Existing review while it can still be edited. */
  initial: ReviewValues | null;
  /** Preselected overall rating from the e-mail's star links. */
  initialRating: number | null;
  isEdit: boolean;
}

/** Sub-score keys with copy in the `review.score` namespace (anything else is skipped). */
const KNOWN_SCORES = new Set([
  'easeOfBooking',
  'communication',
  'valueTransparency',
  'boatCondition',
  'cleanliness',
  'checkInOut',
  'charterCompany',
  'value',
]);

type FieldErrors = Partial<Record<'rating' | 'title' | 'text' | 'scores' | 'form', string>>;

const ReviewForm = ({ token, locale, kind, scoreKeys, initial, initialRating, isEdit }: ReviewFormProps) => {
  const t = useTranslations('review');
  const [rating, setRating] = useState<number | null>(initial?.rating ?? initialRating);
  const [scores, setScores] = useState<Record<string, number | null>>(initial?.scores ?? {});
  const [title, setTitle] = useState(initial?.title ?? '');
  const [text, setText] = useState(initial?.text ?? '');
  const [consent, setConsent] = useState(initial?.publishConsent ?? false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<ReviewSubmitResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const ratingRef = useRef<HTMLFieldSetElement>(null);
  const shownScores = scoreKeys.filter(key => KNOWN_SCORES.has(key));

  const starsLabel = (value: number) => t('stars', { count: value });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!rating) {
      setErrors({ rating: t('errors.rating') });
      ratingRef.current?.querySelector('input')?.focus();

      return;
    }

    setErrors({});
    startTransition(async () => {
      const response = await submitReview(token, {
        rating,
        scores: Object.fromEntries(
          Object.entries(scores).filter((entry): entry is [string, number] => typeof entry[1] === 'number')
        ),
        title,
        text,
        publishConsent: consent,
        locale,
      });

      if (response.ok) {
        setResult(response);

        return;
      }

      if (response.reason === 'validation') {
        const fields = response.fields ?? [];
        const next: FieldErrors = {};

        if (fields.includes('rating')) next.rating = t('errors.rating');

        if (fields.includes('title')) next.title = t('errors.title');

        if (fields.includes('text')) next.text = t('errors.text');

        if (fields.some(f => f.startsWith('scores.'))) next.scores = t('errors.score');

        if (!Object.keys(next).length) next.form = t('errors.generic');

        setErrors(next);

        return;
      }

      setResult(response);
    });
  };

  if (result?.ok) {
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <h2 className={styles.subtitle}>{t('success.title')}</h2>
        <p className={styles.text}>{result.edited ? t('success.edited') : t('success.body')}</p>
        {consent && <p className={styles.text}>{t('success.published')}</p>}
        <Link href="/" className={styles.homeLink}>
          {t('backHome')}
        </Link>
      </div>
    );
  }

  if (result && !result.ok && result.reason === 'expired') {
    return (
      <div className={styles.message} role="alert">
        <h2 className={styles.subtitle}>{t('expired.title')}</h2>
        <p className={styles.text}>{t('expired.body')}</p>
      </div>
    );
  }

  let formError = errors.form ?? null;

  if (result && !result.ok) {
    if (result.reason === 'editClosed') formError = t('errors.editClosed');
    else if (result.reason === 'rateLimited') formError = t('errors.rateLimited');
    else if (result.reason === 'error') formError = t('errors.generic');
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <fieldset
        ref={ratingRef}
        className={styles.fieldset}
        aria-describedby={errors.rating ? 'review-rating-error' : undefined}
      >
        <legend className={styles.legend}>
          {t('overall')} <span className={styles.required}>{t('required')}</span>
        </legend>
        <Rating
          name="rating"
          value={rating}
          onChange={(_, value) => {
            setRating(value);
            setErrors(prev => ({ ...prev, rating: undefined }));
          }}
          size="large"
          getLabelText={starsLabel}
          emptyLabelText={t('noRating')}
          className={styles.rating}
        />
        {errors.rating && (
          <p id="review-rating-error" className={styles.error} role="alert">
            {errors.rating}
          </p>
        )}
      </fieldset>

      {shownScores.length > 0 && (
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>
            {t(kind === 'YACHT' ? 'scoresHeading.YACHT' : 'scoresHeading.BOOKING')}
          </legend>
          <div className={styles.scores}>
            {shownScores.map(key => {
              const label = t(`score.${key}` as never);

              return (
                <fieldset key={key} className={styles.scoreRow}>
                  <legend className={styles.scoreLabel}>{label}</legend>
                  <Rating
                    name={`score-${key}`}
                    value={scores[key] ?? null}
                    onChange={(_, value) => setScores(prev => ({ ...prev, [key]: value }))}
                    getLabelText={starsLabel}
                    emptyLabelText={t('noRating')}
                  />
                </fieldset>
              );
            })}
          </div>
          {errors.scores && (
            <p className={styles.error} role="alert">
              {errors.scores}
            </p>
          )}
        </fieldset>
      )}

      <TextField
        label={t('titleLabel')}
        value={title}
        onChange={event => setTitle(event.target.value.slice(0, REVIEW_TITLE_MAX))}
        fullWidth
        slotProps={{ htmlInput: { maxLength: REVIEW_TITLE_MAX } }}
        error={!!errors.title}
        helperText={errors.title}
      />

      <TextField
        label={t('textLabel')}
        value={text}
        onChange={event => setText(event.target.value.slice(0, REVIEW_TEXT_MAX))}
        fullWidth
        multiline
        minRows={5}
        slotProps={{ htmlInput: { maxLength: REVIEW_TEXT_MAX } }}
        error={!!errors.text}
        helperText={
          errors.text ??
          t('counter', { count: text.length.toLocaleString(locale), max: REVIEW_TEXT_MAX.toLocaleString(locale) })
        }
      />

      <div className={styles.consent}>
        <FormControlLabel
          control={
            <Checkbox
              checked={consent}
              onChange={event => setConsent(event.target.checked)}
              slotProps={{ input: { 'aria-describedby': 'review-consent-help' } }}
            />
          }
          label={t('consentLabel')}
        />
        <p id="review-consent-help" className={styles.help}>
          {t('consentHelp')}
        </p>
      </div>

      {formError && (
        <p className={styles.formError} role="alert">
          {formError}
        </p>
      )}

      <Button type="submit" variant="contained" size="large" fullWidth disabled={isPending}>
        {isPending ? t('submitting') : t(isEdit ? 'submitEdit' : 'submit')}
      </Button>
    </form>
  );
};

export default ReviewForm;
