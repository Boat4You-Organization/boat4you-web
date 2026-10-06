import { Fragment } from 'react';

import type { Segment } from '@/utils/static/yachtCapacity';

interface CapacityTextProps {
  segments: Segment[];
}

/**
 * One capacity value as the formatter split it (capacityRows): a piece in
 * another language than the page — an MMK note no reviewed translation
 * covers, or the partner's engine label — is marked with its `lang`, so a
 * screen reader and a translator read "(5+1 for the crew)" as English on a
 * German page.
 */
const CapacityText = ({ segments }: CapacityTextProps) => (
  <>
    {segments.map(({ text, lang }) =>
      lang ? (
        <span key={`${lang}:${text}`} lang={lang}>
          {text}
        </span>
      ) : (
        <Fragment key={`:${text}`}>{text}</Fragment>
      )
    )}
  </>
);

export default CapacityText;
