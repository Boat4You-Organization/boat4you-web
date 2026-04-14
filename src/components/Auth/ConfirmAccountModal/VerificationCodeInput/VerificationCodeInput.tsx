import React, { useRef } from 'react';

import { Box, Stack, TextField } from '@mui/material';

import colors from '@/styles/themes/colors';

interface VerificationCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onComplete?: (code: string) => void;
}

const VerificationCodeInput = ({ value, onChange, error, onComplete }: VerificationCodeInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, inputValue: string) => {
    if (inputValue && !/^[0-9]$/.test(inputValue)) {
      return;
    }

    const newValue = value.split('');

    newValue[index] = inputValue;

    const combinedValue = newValue.join('');

    onChange(combinedValue);

    if (combinedValue.length === 6) {
      onComplete?.(combinedValue);
    }

    if (inputValue && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    onChange(pastedData);

    if (pastedData.length === 6) {
      onComplete?.(pastedData);
    }

    const nextEmptyIndex = Math.min(pastedData.length, 5);

    inputRefs.current[nextEmptyIndex]?.focus();
  };

  const isInputDisabled = (index: number) => index > 0 && !value[index - 1];

  const handleFocus = (index: number) => (e: React.FocusEvent<HTMLInputElement>) => {
    if (isInputDisabled(index)) {
      e.target.blur();

      const firstEmptyIndex = value.indexOf('');

      if (firstEmptyIndex !== -1) {
        inputRefs.current[firstEmptyIndex]?.focus();
      }
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Stack direction="row" spacing={1.5}>
        {Array(6)
          .fill(0)
          .map((_, index) => {
            const inputRef = (el: HTMLInputElement | null) => {
              inputRefs.current[index] = el;
            };

            return (
              <TextField
                // eslint-disable-next-line react/no-array-index-key
                key={`verification-input-${index}`}
                inputRef={inputRef}
                value={value[index] || ''}
                onChange={e => handleChange(index, e.target.value.slice(-1))}
                onKeyDown={e => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={handleFocus(index)}
                slotProps={{
                  input: {
                    inputProps: {
                      maxLength: 1,
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '55px',
                    width: '58px',
                    position: 'relative',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    backgroundColor: isInputDisabled(index) ? colors.black100 : colors.white,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: isInputDisabled(index) ? colors.black200 : 'primary.main',
                      borderWidth: isInputDisabled(index) ? 1 : 2,
                    },
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isInputDisabled(index) ? colors.black200 : 'primary.main',
                        borderWidth: isInputDisabled(index) ? 1 : 2,
                      },
                    },
                    '&.Mui-error': {
                      backgroundColor: colors.red50,
                      color: colors.red500,
                    },
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'error.main',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isInputDisabled(index) ? colors.black200 : undefined,
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    textAlign: 'center',
                    fontSize: '36px',
                    color: 'text.primary',
                  },
                }}
                error={!!error}
              />
            );
          })}
      </Stack>
    </Box>
  );
};

export default VerificationCodeInput;
