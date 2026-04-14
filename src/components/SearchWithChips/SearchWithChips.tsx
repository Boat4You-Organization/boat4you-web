import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

import { Chip, Icon, Stack, TextField } from '@mui/material';
import cx from 'clsx';
import debounce from 'lodash.debounce';

import SearchIcon from '@/components/SvgIcons/Search';
import colors from '@/styles/themes/colors';
import useToggleState from '@/utils/hooks/useToggleState';

import styles from './SearchWithChips.module.scss';

interface SearchWithChipsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disableDebounce?: boolean;
  fullWidth?: boolean;
  values: string[];
  maxDisplayedChips?: number;
  onDeleteSingle?: (option: string, index: number) => void;
}

const SearchWithChips = ({
  value,
  onChange,
  placeholder,
  disableDebounce,
  fullWidth,
  values,
  maxDisplayedChips = 10,
  onDeleteSingle,
}: SearchWithChipsProps) => {
  const [searchValue, setSearchValue] = useState<string>(value);
  const [isFocused, toggleIsFocus] = useToggleState();
  const textFieldRef = useRef<HTMLInputElement>(null);

  const [debouncedChangeHandler] = useState(() => debounce(onChange, 500));

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const displayedValues = values.slice(0, maxDisplayedChips);
  const remainingCount = values.length - (maxDisplayedChips ?? values.length);
  const hasRemaining = remainingCount > 0;

  const handleSingleDelete = (option: string, index: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (onDeleteSingle) {
      onDeleteSingle(option, index);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setSearchValue(newValue);

    if (disableDebounce) {
      onChange(newValue);
    } else {
      debouncedChangeHandler(newValue);
    }
  };

  const handleSearchClick = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
      textFieldRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Stack
      className={cx(styles.container, { [styles.active]: isFocused })}
      direction="row"
      alignItems="center"
      width="100%"
      onClick={handleSearchClick}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          overflowX: 'auto',
          scrollbarWidth: 'none',
          cursor: 'pointer',
          width: '100%',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <Stack direction="row" spacing={1} pl={1.5}>
          {displayedValues.map((val, index) => (
            <Chip
              key={`${val}-${index + 1}`}
              label={val}
              onDelete={onDeleteSingle ? handleSingleDelete(val, index) : undefined}
              sx={{
                color: colors.black500,
                borderRadius: '44px',
              }}
            />
          ))}
          {hasRemaining && (
            <Chip
              label={`+${remainingCount}`}
              sx={{
                minWidth: '40px',
                color: colors.black500,
                borderRadius: '44px',
              }}
            />
          )}
        </Stack>
        <TextField
          ref={textFieldRef}
          value={searchValue}
          placeholder={placeholder}
          onChange={handleChange}
          onFocus={toggleIsFocus}
          onBlur={toggleIsFocus}
          fullWidth={fullWidth}
          slotProps={{
            input: {
              notched: false,
              sx: {
                '& .MuiOutlinedInput-input': {
                  height: '100%',
                  border: 'none',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              },
            },
          }}
          sx={{ minWidth: '160px' }}
        />
      </Stack>
      <Icon sx={{ marginLeft: 'auto' }}>
        <SearchIcon size={24} />
      </Icon>
    </Stack>
  );
};

export default SearchWithChips;
