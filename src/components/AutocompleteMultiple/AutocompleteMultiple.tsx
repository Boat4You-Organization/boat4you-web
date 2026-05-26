import { useCallback, useMemo } from 'react';

import { ExpandMoreRounded } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Stack,
  SxProps,
  TextField,
  Theme,
  Typography,
  createFilterOptions,
} from '@mui/material';

import Checkbox from '@/components/Checkbox';

export interface SelectOption {
  id: string;
  label: string;
}

export interface AutocompleteMultipleProps {
  value: SelectOption[];
  options: SelectOption[];
  onChange: (value: SelectOption[]) => void;
  onInputChange?: (value: string) => void;
  inputValue?: string;
  placeholder?: string;
  label?: string;
  error?: string | undefined;
  sx?: SxProps<Theme>;
  disabled?: boolean;
  /** Per-option disabled predicate. Greys out (and prevents toggle of)
   *  options for which it returns true — used by the search filter to
   *  disable manufacturer / model entries with 0 yachts in the current
   *  vessel-type / location / dates context. */
  getOptionDisabled?: (option: SelectOption) => boolean;
  /** Explicit stable DOM id. When omitted we derive a deterministic one from
   *  `label` / `placeholder` so SSR and client hydration produce matching
   *  attributes — MUI Autocomplete's internal `useId()` otherwise drifts
   *  under Next.js 16 + Turbopack and React drops the entire search subtree
   *  ("tree hydrated but some attributes… won't be patched up"). */
  id?: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const AutocompleteMultiple = ({
  id,
  value,
  options,
  onChange,
  onInputChange,
  inputValue,
  placeholder,
  label,
  error,
  sx,
  disabled,
  getOptionDisabled,
}: AutocompleteMultipleProps) => {
  const stableId = useMemo(
    () => id ?? `autocomplete-${slugify(label || placeholder || 'field') || 'field'}`,
    [id, label, placeholder]
  );
  const handleChange = useCallback(
    (_: React.SyntheticEvent, newValue: SelectOption[]) => {
      onChange(newValue);
    },
    [onChange]
  );

  const handleInputChange = useCallback(
    (_: React.SyntheticEvent, newInputValue: string) => {
      if (onInputChange) {
        onInputChange(newInputValue);
      }
    },
    [onInputChange]
  );

  const handleRemoveValue = useCallback(
    (optionToRemove: SelectOption) => {
      onChange(value.filter(item => item.id !== optionToRemove.id));
    },
    [onChange, value]
  );

  return (
    <FormControl fullWidth error={!!error}>
      {label && <FormLabel sx={{ mb: 1 }}>{label}</FormLabel>}
      <Autocomplete
        id={stableId}
        multiple
        value={value}
        options={options}
        inputValue={inputValue}
        disableCloseOnSelect
        openOnFocus
        // Default substring filter (case-insensitive). No `limit` cap —
        // post-cleanup the manufacturer list is ~240 entries which renders
        // in <100ms; a hard cap was hiding tail letters (S-Z).
        filterOptions={createFilterOptions({
          matchFrom: 'any',
          ignoreCase: true,
          stringify: (opt: SelectOption) => opt.label,
        })}
        popupIcon={<ExpandMoreRounded />}
        getOptionLabel={option => option.label}
        getOptionDisabled={getOptionDisabled}
        // ID is the only stable unique key — labels can collide (e.g. two
        // manufacturers named "Bluegame" from separate API sources, or any
        // future sync-ingest race). Defaulting to label as the key throws
        // React's "Encountered two children with the same key" warning.
        getOptionKey={option => option.id}
        isOptionEqualToValue={(option, selectedValue) => option.id === selectedValue.id}
        onChange={handleChange}
        onInputChange={handleInputChange}
        renderValue={() => null}
        disableClearable
        slotProps={{
          paper: {
            sx: {
              minWidth: '350px',
              maxWidth: '500px',
            },
          },
          // Force dropdown to always open downwards. Default Popper flips
          // upwards when there's not enough space below — Mario flagged
          // this kao "ne želim prema gore". Disable flip + forcePlacement.
          popper: {
            placement: 'bottom-start',
            modifiers: [
              { name: 'flip', enabled: false },
              { name: 'preventOverflow', options: { altAxis: false, padding: 0 } },
            ],
          },
          listbox: {
            sx: {
              padding: 0,
              '& .MuiAutocomplete-option': {
                minHeight: 'unset !important',
                paddingTop: '2px !important',
                paddingBottom: '2px !important',
              },
            },
          },
        }}
        renderOption={(props, option, { selected }) => {
          const { key, ...rest } = props;

          return (
            <MenuItem
              key={key}
              {...rest}
              sx={{
                py: '2px !important',
                minHeight: 'unset !important',
                '& .MuiCheckbox-root': { padding: '2px' },
                '& .MuiSvgIcon-root': { fontSize: 18 },
              }}
            >
              <Checkbox checked={selected} />
              <Typography variant="body2">{option.label}</Typography>
            </MenuItem>
          );
        }}
        renderInput={params => (
          // `id` override on TextField propagates down to the actual <input>,
          // which is what React hydration compares. MUI Autocomplete's own
          // `id` prop lives on the wrapper and still lets the internal input
          // fall back to `useId()` — so we force a deterministic one here too.
          <TextField
            {...params}
            id={`${stableId}-input`}
            placeholder={placeholder}
            error={!!error}
            sx={{
              '& .MuiInputBase-input': { fontSize: 13 },
              '& .MuiInputBase-input::placeholder': { fontSize: 13 },
            }}
          />
        )}
        sx={sx}
        disabled={disabled}
      />
      {value.length > 0 && (
        <Stack sx={{ mt: 1.5, gap: 1, width: 'fit-content' }}>
          {value.map(option => (
            <Box
              key={option.id}
              onMouseDown={e => e.preventDefault()}
              onClick={() => handleRemoveValue(option)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
              }}
            >
              <Checkbox checked />
              <Typography variant="body2">{option.label}</Typography>
            </Box>
          ))}
        </Stack>
      )}
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
};

export default AutocompleteMultiple;
