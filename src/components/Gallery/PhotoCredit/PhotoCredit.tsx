import React from 'react';

import cx from 'clsx';

import { MarinaCaption } from '@/utils/static/yachtLayout';

import styles from './PhotoCredit.module.scss';

interface PhotoCreditProps {
  credit: MarinaCaption;
  /** On a gallery tile (top left) or on the lightbox photo (centred, near its bottom). */
  placement: 'tile' | 'lightbox';
}

// A click on the source link opens it, not the lightbox behind it.
const stopPropagation = (event: React.MouseEvent) => event.stopPropagation();

/**
 * A marina photo's caption line, "ACI Marina Split · Foto: ACI Marina Split":
 * small, over the photo, the credit linking to the page the photo comes from
 * (yachtLayout.ts, marinaCaption). Absolutely placed, so the gallery and
 * the lightbox keep their layout.
 */
const PhotoCredit = ({ credit: { caption, credit, href }, placement }: PhotoCreditProps) => (
  <span className={cx(styles.credit, styles[placement])}>
    {caption}
    {caption && credit ? ' · ' : null}
    {credit && href ? (
      // No `noreferrer`: the marina sees boat4you as the referrer (the browser
      // sends the origin only); `noopener` keeps its page away from ours.
      // eslint-disable-next-line react/jsx-no-target-blank
      <a href={href} target="_blank" rel="nofollow noopener" className={styles.link} onClick={stopPropagation}>
        {credit}
      </a>
    ) : (
      credit
    )}
  </span>
);

export default PhotoCredit;
