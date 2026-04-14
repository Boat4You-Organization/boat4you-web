import { useCallback } from 'react';

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
}

const AutocompleteMultiple = ({
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
}: AutocompleteMultipleProps) => {
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
        multiple
        value={value}
        options={options}
        inputValue={inputValue}
        disableCloseOnSelect
        popupIcon={<ExpandMoreRounded />}
        getOptionLabel={option => option.label}
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
        }}
        renderOption={(props, option, { selected }) => {
          const { key, ...rest } = props;

          return (
            <MenuItem key={key} {...rest}>
              <Checkbox checked={selected} />
              <Typography variant="body2">{option.label}</Typography>
            </MenuItem>
          );
        }}
        renderInput={params => <TextField {...params} placeholder={placeholder} error={!!error} />}
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
