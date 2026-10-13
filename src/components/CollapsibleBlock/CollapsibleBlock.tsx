'use client';

import { ReactNode, useId } from 'react';

import { ExpandMore } from '@mui/icons-material';
import { Box, ButtonBase, Collapse, Typography } from '@mui/material';
import cx from 'clsx';

import styles from './CollapsibleBlock.module.scss';

interface CollapsibleBlockProps {
  /** The heading as the section renders it: its icon and text. */
  title: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

/**
 * A boat-page section folded by default: the heading is the switch, a tap or
 * click opens the body (owner 13.10.2026: Amenities and Extras "hidden, open
 * on press" on every boat). The body stays in the DOM (MUI Collapse, never
 * unmounted), so search engines and the find-in-page still read it, and the
 * tabs bar can open it when its tab is chosen (BoatContentSection).
 */
const CollapsibleBlock = ({ title, open, onToggle, children }: CollapsibleBlockProps) => {
  const bodyId = useId();

  return (
    <Box component="section">
      <Typography component="h2" variant="h3" fontWeight={700}>
        <ButtonBase
          className={styles.header}
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={bodyId}
          focusRipple
        >
          <Box component="span" className={styles.title}>
            {title}
          </Box>
          <ExpandMore className={cx(styles.chevron, { [styles.open]: open })} aria-hidden="true" />
        </ButtonBase>
      </Typography>
      <Collapse in={open} timeout="auto">
        <Box id={bodyId} pt={3}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

export default CollapsibleBlock;
