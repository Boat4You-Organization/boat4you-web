'use client';

import { Box } from '@mui/material';

import { T } from './tokens';

interface ArrowBtnProps {
  dir: '<' | '>';
  onClick: () => void;
  disabled?: boolean;
  /** Desktop = 12px radius rectangle; mobile = 22px radius pill. */
  size?: 'desktop' | 'mobile';
}

/** Single chevron navigation button — visually identical between modes,
 *  only the border radius shifts (square-ish on desktop, full pill on mobile). */
const ArrowBtn = ({ dir, onClick, disabled = false, size = 'desktop' }: ArrowBtnProps) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    disabled={disabled}
    sx={{
      width: size === 'desktop' ? '32px' : '44px',
      height: size === 'desktop' ? undefined : '44px',
      alignSelf: 'stretch',
      border: `1px solid ${T.hair}`,
      background: T.card,
      borderRadius: size === 'desktop' ? '10px' : '22px',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.35 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: T.navy,
      fontSize: '22px',
      fontWeight: 700,
      flexShrink: 0,
      fontFamily: 'inherit',
      padding: 0,
    }}
  >
    {dir === '<' ? '‹' : '›'}
  </Box>
);

export default ArrowBtn;
