import React, { ElementType, useEffect, useMemo, useState } from 'react';

import { Close } from '@mui/icons-material';
import {
  AutocompleteRenderOptionState,
  Box,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  Autocomplete as MuiAutocomplete,
  OutlinedInputProps,
  TextField,
  TextFieldProps as TextFieldPropsType,
  Typography,
} from '@mui/material';
import cx from 'clsx';

import SearchOptionItem from '@/components/SearchOptionItem';
import { SearchOptionTag } from '@/components/SearchOptionItem/SearchOptionItem';
import colors from '@/styles/themes/colors';

import styles from './AutocompleteMultipleChip.module.scss';

export interface AutocompleteOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  group?: string;
  tag?: SearchOptionTag;
}

export interface AutocompleteMultipleChipProps {
  inputValue?: string;
  value: string[];
  options: AutocompleteOption[];
  groupBy?: (option: AutocompleteOption) => string;
  onChange: (value: string[]) => void;
  placeholder: string | string[];
  icon: ElementType;
  onInputChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
  renderOption?: (option: AutocompleteOption, state: AutocompleteRenderOptionState) => React.ReactNode;
  filteredOptions?: AutocompleteOption[];
  TextFieldProps?: TextFieldPropsType;
  variant?: 'expanded' | 'compact';
  valueField?: 'id' | 'label';
}

const AutocompleteMultipleChip = ({
  inputValue,
  value,
  options,
  groupBy,
  onChange,
  placeholder,
  icon: Icon,
  onInputChange,
  label,
  disabled,
  filteredOptions,
  variant = 'expanded',
  valueField = 'id',
}: AutocompleteMultipleChipProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState<AutocompleteOption[]>([]);

  useEffect(() => {
    const selectedValues = options.filter(option => value.includes(option[valueField]));

    setInternalValue(selectedValues);
  }, [value, options, valueField]);

  const optionsWithSelection = useMemo(() => {
    const selectedSet = new Set(value);

    const uniqueOptions = options.reduce((acc, option) => {
      if (!acc.find(existing => existing.id === option.id)) {
        acc.push(option);
      }

      return acc;
    }, [] as AutocompleteOption[]);

    const selected = uniqueOptions.filter(option => selectedSet.has(option[valueField]));
    const nonSelected = uniqueOptions.filter(option => !selectedSet.has(option[valueField]));

    return [...selected, ...nonSelected];
  }, [options, value, valueField]);

  const handleIsOptionEqualToValue = (option: AutocompleteOption, inputValues: AutocompleteOption) =>
    option.id === inputValues.id;

  const getOptionDisabled = (option: AutocompleteOption) =>
    filteredOptions?.every(filteredOption => filteredOption.id !== option.id) || false;

  const handleChange = (_: React.SyntheticEvent, newValue: AutocompleteOption[]) => {
    onChange(newValue.map(option => option[valueField]));
  };

  const handleClearValues = () => {
    onChange([]);

    if (onInputChange) {
      onInputChange('');
    }
  };

  const handleInputChange = (_: React.SyntheticEvent, newInputValue: string, reason: string) => {
    if (onInputChange && reason === 'input') {
      onInputChange(newInputValue);
    }
  };

  const iconSize = variant === 'compact' ? 18 : 24;
  const containerPaddingLeft = 12 + iconSize + 8;

  const shouldShowCustomPlaceholder =
    internalValue.length === 0 && !inputValue && !isFocused && Array.isArray(placeholder);
  const placeholderText = Array.isArray(placeholder) ? '' : placeholder;

  return (
    <FormControl
      fullWidth
      sx={{
        cursor: 'pointer',
        flex: 1,
        minHeight: variant === 'compact' ? 'auto' : '61px',
        height: 'auto',
        position: 'relative',
        borderRadius: '12px',
        transition: 'background-color 300ms ease-in-out',
        backgroundColor: isFocused && internalValue.length === 0 ? colors.blue100 : 'transparent',
        '&:hover': {
          backgroundColor: internalValue.length === 0 ? colors.blue50 : 'transparent',
        },
      }}
    >
      <InputAdornment
        position="start"
        sx={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <Icon
          variant="secondary"
          size={iconSize}
          sx={{
            fontSize: iconSize,
            width: 16,
            height: 16,
          }}
        />
      </InputAdornment>
      {variant === 'expanded' && internalValue.length > 0 && (
        <InputAdornment
          position="end"
          sx={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            cursor: 'pointer',
          }}
        >
          <IconButton onClick={handleClearValues} sx={{ background: 'transparent', color: colors.black950 }}>
            <Close fontSize="small" />
          </IconButton>
        </InputAdornment>
      )}
      {shouldShowCustomPlaceholder && (
        <Box
          sx={{
            position: 'absolute',
            left: `${containerPaddingLeft + 8}px`,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            cursor: 'pointer',
          }}
        >
          {placeholder.map((line, index) => (
            <Typography
              key={`${line}-${index + 1}`}
              variant={index === 0 ? 'body1' : 'body2'}
              sx={{
                color: index === 0 ? colors.black950 : colors.black400,
                fontWeight: index === 0 ? 600 : 500,
              }}
            >
              {line}
            </Typography>
          ))}
        </Box>
      )}
      <MuiAutocomplete
        multiple
        disableClearable
        disableCloseOnSelect
        limitTags={variant === 'compact' ? 0 : 2}
        groupBy={groupBy}
        forcePopupIcon={false}
        value={internalValue}
        options={optionsWithSelection}
        inputValue={inputValue}
        classes={{ root: styles.root, paper: styles.paper }}
        onChange={handleChange}
        onInputChange={handleInputChange}
        isOptionEqualToValue={handleIsOptionEqualToValue}
        getOptionDisabled={getOptionDisabled}
        getOptionLabel={option => option.label}
        noOptionsText="No matches"
        disabled={disabled}
        filterOptions={opts => opts}
        sx={{
          flex: 1,

          '& .MuiFormControl-root': {
            position: 'relative',
            height: '100%',
            minHeight: '62px',
            paddingInline: 0,
            flex: 1,
            cursor: 'pointer',
          },
          '& .MuiOutlinedInput-root': {
            position: 'relative',
            height: '100%',
            flexWrap: 'nowrap',
            padding: 0,
            paddingLeft: variant === 'compact' ? '0' : '4px',
            transition: 'padding-block 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            background: 'transparent',
            flex: 1,
            cursor: 'pointer',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '& .MuiAutocomplete-tag': {
              fontSize: variant === 'compact' ? 14 : 16,
              maxWidth: 'fit-content',
            },
            '& .MuiAutocomplete-input': {
              height: '100%',
              cursor: 'pointer',
              '&::placeholder': {
                fontSize: variant === 'compact' ? '14px' : '16px',
                transition: 'font-size 300ms ease',
              },
            },
          },
          paddingLeft: `${containerPaddingLeft}px`,
          paddingRight: variant === 'compact' ? 0 : `${containerPaddingLeft}px`,
          transition: 'padding-left 300ms ease',
        }}
        renderInput={params => {
          const ariaLabel = label || (Array.isArray(placeholder) ? placeholder.join(' - ') : placeholder);

          return (
            <TextField
              {...params}
              label={label}
              className={cx(styles.input, { [styles.compact]: variant === 'compact' })}
              placeholder={internalValue.length === 0 && !Array.isArray(placeholder) ? placeholderText : ''}
              onFocus={e => {
                setIsFocused(true);

                if (params.InputProps && 'onFocus' in params.InputProps) {
                  const inputProps = params.InputProps as OutlinedInputProps;

                  inputProps.onFocus?.(e);
                }
              }}
              onBlur={e => {
                setIsFocused(false);

                if (params.InputProps && 'onBlur' in params.InputProps) {
                  const inputProps = params.InputProps as OutlinedInputProps;

                  inputProps.onBlur?.(e);
                }
              }}
              slotProps={{
                input: {
                  ...params.InputProps,
                  startAdornment: params.InputProps.startAdornment,
                },
              }}
              inputProps={{
                ...params.inputProps,
                'aria-label': !label ? ariaLabel : undefined,
              }}
            />
          );
        }}
        renderOption={(props, option, { selected }) => {
          const { ...otherProps } = props;

          return (
            <SearchOptionItem
              key={option.id}
              label={option.label}
              icon={option.icon}
              tag={option.tag}
              selected={selected}
              props={otherProps}
            />
          );
        }}
        renderGroup={params => {
          const isSelectedGroup = params.group === 'Selected';
          const isFirstGroup = params.key === 0;
          // Groups whose name is blank (e.g. "Around current location" which sits
          // group-less at the top) get no header — just render the children flat.
          const hasHeader = Boolean(params.group) && !isSelectedGroup;

          if (isSelectedGroup) {
            return <Box key={params.key}>{params.children}</Box>;
          }

          return (
            <Box key={params.key}>
              {!isFirstGroup && <Divider sx={{ color: colors.black100 }} />}
              {hasHeader && (
                <Typography
                  component="div"
                  sx={{
                    px: 1.5,
                    pt: 1.5,
                    pb: 0.5,
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: 0.2,
                    color: colors.black500,
                    textTransform: 'none',
                  }}
                >
                  {params.group}
                </Typography>
              )}
              {params.children}
            </Box>
          );
        }}
        slotProps={{
          clearIndicator: {
            sx: {
              display: 'none',
            },
          },
          listbox: {
            sx: {
              padding: 2,
            },
          },
          popper: {
            sx: {
              '& .MuiPaper-root': {
                marginTop: '12px',
                minWidth: '348px',
                marginLeft: '-44px',
              },
            },
            placement: 'bottom-start',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 8],
                },
              },
            ],
          },
        }}
      />
    </FormControl>
  );
};

export default AutocompleteMultipleChip;
