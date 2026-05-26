'use client';

import { Box } from '@mui/material';

import { searchV2, searchV2Type } from '@/styles/themes/searchV2';

interface SearchInputV2Props {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

/**
 * Search-style input with magnifier icon left, per design handoff
 * `<SearchInput>` atom. Cream bg `#fafaf7` + line-strong border, 32px
 * left padding so text doesn't collide with the icon. When disabled
 * (e.g. Model field before Manufacturer is picked), bg darkens.
 */
const SearchInputV2 = ({ placeholder, value = '', onChange, disabled = false }: SearchInputV2Props) => (
  <Box sx={{ position: 'relative' }}>
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: 'absolute', left: 10, top: 9, color: searchV2.inkSoft, pointerEvents: 'none' }}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
    <Box
      component="input"
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
      sx={{
        width: '100%',
        padding: '9px 10px 9px 32px',
        fontSize: 12.5,
        border: `1px solid ${searchV2.lineStrong}`,
        borderRadius: '6px',
        background: disabled ? '#f0eee9' : '#fafaf7',
        color: searchV2.ink,
        outline: 'none',
        fontFamily: searchV2Type.fontFamily,
        '&:focus': { borderColor: searchV2.brand },
        '&::placeholder': { color: searchV2.inkSoft, opacity: 1 },
      }}
    />
  </Box>
);

export default SearchInputV2;
