'use client';

import { ReactNode, useEffect, useId, useRef, useState } from 'react';

import { ExpandMore } from '@mui/icons-material';
import { Box, ButtonBase } from '@mui/material';
import cx from 'clsx';
import { useTranslations } from 'next-intl';

import styles from './ReadMorePanel.module.scss';

interface ReadMorePanelProps {
  children: ReactNode;
  /** Fold long content behind "Read more" (default); false = the panel only. */
  collapsible?: boolean;
  /** Height shown while folded, in px (about seven lines of body text). */
  collapsedHeight?: number;
}

/**
 * The light panel the boat page puts its prose in — the description and
 * "Good to know" (owner 13.10.2026, after the competitor's boat page). With
 * `collapsible` the panel shows the first lines and a "Read more" / "Read
 * less" switch; the whole text stays in the DOM, so search engines read it
 * all. Content that fits shows no switch and no fade.
 */
const ReadMorePanel = ({ children, collapsible = true, collapsedHeight = 176 }: ReadMorePanelProps) => {
  const t = useTranslations('common');
  const bodyId = useId();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);

  // Only fold what really overflows; re-check when the text reflows.
  useEffect(() => {
    if (!collapsible) return undefined;

    const el = bodyRef.current;

    if (!el) return undefined;

    const check = () => setOverflows(el.scrollHeight > collapsedHeight + 8);

    check();

    const observer = new ResizeObserver(check);

    observer.observe(el);

    return () => observer.disconnect();
  }, [collapsible, collapsedHeight]);

  const folded = collapsible && overflows && !open;

  return (
    <Box className={styles.panel}>
      <Box
        id={bodyId}
        ref={bodyRef}
        className={cx(styles.body, { [styles.folded]: folded })}
        style={folded ? { maxHeight: collapsedHeight } : undefined}
      >
        {children}
      </Box>
      {collapsible && overflows && (
        <ButtonBase
          className={styles.toggle}
          onClick={() => setOpen(value => !value)}
          aria-expanded={open}
          aria-controls={bodyId}
          focusRipple
        >
          {open ? t('readLess') : t('readMore')}
          <ExpandMore className={cx(styles.chevron, { [styles.open]: open })} aria-hidden="true" />
        </ButtonBase>
      )}
    </Box>
  );
};

export default ReadMorePanel;
