'use client';

import { ReactNode, useState } from 'react';

import { Box, ButtonBase, Collapse } from '@mui/material';

import { searchV2, searchV2Type } from '@/styles/themes/searchV2';

interface FilterGroupProps {
  title: string;
  /** Number badge after the title — e.g. how many options the user has
   *  selected inside the group. Shown as a filled-ink pill. Pass
   *  `undefined` (default) when no badge is wanted. */
  count?: number;
  /** Collapsed by default? Sections deep in the sidebar (Manufacturer,
   *  Amenities, Mainsail, Engine) start closed; everything above is
   *  open. */
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * Collapsible filter section per design handoff `<Group>` atom.
 *
 * Header is a single click-target row: title + optional count badge
 * left, chevron right. Chevron rotates 180° when open. Content slides
 * in/out via MUI Collapse. Hairline border-bottom separates groups —
 * matches the sidebar's section-stack rhythm.
 */
const FilterGroup = ({ title, count, defaultOpen = true, children }: FilterGroupProps) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Box sx={{ py: '16px', borderBottom: `1px solid ${searchV2.line}` }}>
      <ButtonBase
        onClick={() => setOpen(o => !o)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          color: searchV2.ink,
          fontFamily: searchV2Type.fontFamily,
        }}
        aria-expanded={open}
      >
        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Box component="span" sx={searchV2Type.groupTitle}>
            {title}
          </Box>
          {count != null && count > 0 && (
            <Box
              component="span"
              sx={{
                background: searchV2.ink,
                color: '#fff',
                ...searchV2Type.countBadge,
                padding: '2px 6px',
                borderRadius: '10px',
                minWidth: 16,
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              {count}
            </Box>
          )}
        </Box>
        {/* Chevron — flips when expanded. SVG so it inherits color
            without dragging in MUI icons. */}
        <Box
          component="svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          sx={{
            color: searchV2.inkSoft,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform .15s ease',
          }}
        >
          <path d="m6 9 6 6 6-6" />
        </Box>
      </ButtonBase>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ mt: '12px' }}>{children}</Box>
      </Collapse>
    </Box>
  );
};

export default FilterGroup;
