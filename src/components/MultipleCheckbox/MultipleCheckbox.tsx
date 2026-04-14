import { useCallback } from 'react';

import { Box, FormControl, FormLabel, Stack, Typography } from '@mui/material';

import Checkbox from '@/components/Checkbox';

export interface CheckboxOption {
  id: string;
  label: string;
}

export interface MultipleCheckboxProps {
  title: string;
  options: CheckboxOption[];
  selectedValues: string[];
  onSelectionChange: (selectedValues: string[]) => void;
}

const MultipleCheckbox = ({ title, options, selectedValues, onSelectionChange }: MultipleCheckboxProps) => {
  const handleCheckboxChange = useCallback(
    (optionId: string, checked: boolean) => {
      if (checked) {
        if (!selectedValues.includes(optionId)) {
          onSelectionChange([...selectedValues, optionId]);
        }
      } else {
        onSelectionChange(selectedValues.filter(id => id !== optionId));
      }
    },
    [selectedValues, onSelectionChange]
  );

  const isOptionSelected = useCallback((optionId: string) => selectedValues.includes(optionId), [selectedValues]);

  return (
    <FormControl fullWidth>
      <FormLabel sx={{ mb: 1 }}>
        <Typography variant="body1" fontWeight={600}>
          {title}
        </Typography>
      </FormLabel>
      <Stack spacing={1}>
        {options.map(option => (
          <Box key={option.id}>
            <Checkbox
              checked={isOptionSelected(option.id)}
              onChange={e => handleCheckboxChange(option.id, e.target.checked)}
              label={option.label}
            />
          </Box>
        ))}
      </Stack>
    </FormControl>
  );
};

export default MultipleCheckbox;
