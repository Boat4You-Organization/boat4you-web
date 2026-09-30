import { ReactNode } from 'react';

import styles from './PromoBanner.module.scss';
import { SAILOR_ORIGIN, SAILOR_PARTS, SAILOR_PIVOTS, SAILOR_VIEWBOX, SHIRT_SOURCE_COLOR } from './sailorPaths';

type Point = readonly [number, number];

interface JointProps {
  at: Point;
  className: string;
  children?: ReactNode;
  html?: string;
}

/**
 * Rotates its content around `at`: the translate pair moves the pivot to the
 * local origin, so the animated middle group only needs `transform-origin: 0 0`.
 */
const Joint = ({ at: [x, y], className, children, html }: JointProps) => (
  <g transform={`translate(${x} ${y})`}>
    <g className={className}>
      {html ? (
        // Static bundled artwork (sailorPaths.ts), never user input.
        // eslint-disable-next-line react/no-danger
        <g transform={`translate(${-x} ${-y})`} dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <g transform={`translate(${-x} ${-y})`}>{children}</g>
      )}
    </g>
  </g>
);

/** The campaign character, rigged for the walk cycle in PromoBanner.module.scss. */
const Sailor = ({ shirt }: { shirt: string }) => {
  const paint = (part: string) => part.replaceAll(SHIRT_SOURCE_COLOR, shirt);

  return (
    <svg className={styles.dude} viewBox={SAILOR_VIEWBOX} aria-hidden>
      <g className={styles.hurry}>
        <g transform={`translate(${-SAILOR_ORIGIN.x} ${-SAILOR_ORIGIN.y})`}>
          <g className={styles.walker}>
            <Joint at={SAILOR_PIVOTS.hip} className={styles.legBack} html={paint(SAILOR_PARTS.backLeg)} />
            <Joint at={SAILOR_PIVOTS.shoulder} className={styles.arm}>
              <Joint at={SAILOR_PIVOTS.hand} className={styles.suitcase} html={paint(SAILOR_PARTS.suitcase)} />
              {/* eslint-disable-next-line react/no-danger */}
              <g dangerouslySetInnerHTML={{ __html: paint(SAILOR_PARTS.bagArm) }} />
            </Joint>
            {/* eslint-disable-next-line react/no-danger */}
            <g dangerouslySetInnerHTML={{ __html: paint(SAILOR_PARTS.torso) }} />
            <Joint at={SAILOR_PIVOTS.hip} className={styles.legFront} html={paint(SAILOR_PARTS.frontLeg)} />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Sailor;
