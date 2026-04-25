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
  /**
   * Force the dropdown to stay open regardless of focus state. Useful when
   * the autocomplete is rendered inside a full-screen picker modal on
   * mobile — the list of suggestions (recent / popular / search results)
   * should be visible immediately without requiring a tap on the input.
   */
  alwaysOpen?: boolean;
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
  alwaysOpen = false,
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
        // In full-screen mobile picker mode: kill every nested container
        // that MUI Autocomplete adds (popper, paper, listbox). Targeting
        // via descendant selectors so we win over both the default classes
        // and any styles.paper class still wrapping the paper.
        ...(alwaysOpen && {
          '& .MuiAutocomplete-popper': {
            position: 'static !important',
            transform: 'none !important',
            inset: 'unset !important',
            width: '100% !important',
            zIndex: 'auto !important',
          },
          '& .MuiAutocomplete-paper, & .MuiPaper-root': {
            boxShadow: 'none !important',
            borderRadius: '0 !important',
            background: 'transparent !important',
            margin: '0 !important',
            border: 'none !important',
            maxHeight: 'none !important',
            overflow: 'visible !important',
          },
          '& .MuiAutocomplete-listbox': {
            maxHeight: 'none !important',
            overflow: 'visible !important',
            padding: '0 !important',
            background: 'transparent !important',
          },
        }),
      }}
    >
      <InputAdornment
        position="start"
        sx={{
          position: 'absolute',
          left: 12,
          top: alwaysOpen ? '30px' : '50%',
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
            top: alwaysOpen ? '30px' : '50%',
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
            // `top: 50%` is centered on the FormControl. In alwaysOpen
            // mode the popper renders inline so the container expands
            // beyond just the input row, which would drop the placeholder
            // over the suggestion list. Pin to half the input row height.
            top: alwaysOpen ? '30px' : '50%',
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
        {...(alwaysOpen
          ? {
              open: true,
              disablePortal: true,
              slotProps: {
                // Full-screen mobile picker mode. Render the popper as a
                // plain inline block — no floating positioning, no paper
                // card, no independent listbox scroll. Items flow directly
                // in the modal body so the whole screen scrolls as one.
                popper: {
                  sx: {
                    position: 'static !important',
                    width: '100% !important',
                    transform: 'none !important',
                    inset: 'unset !important',
                    // Popper injects `will-change: transform` inline; that
                    // alone creates a new stacking/scroll context in some
                    // browsers. Neutralize it so the Paper flows inline.
                    willChange: 'auto !important',
                  },
                },
                paper: {
                  sx: {
                    boxShadow: 'none !important',
                    borderRadius: '0 !important',
                    margin: '0 !important',
                    background: 'transparent !important',
                    maxHeight: 'none !important',
                    overflow: 'visible !important',
                  },
                },
                // This is the UL that actually carries MUI's default
                // `max-height: 40vh` + `overflow-y: auto`. Without these
                // overrides the list sits in its own scroll inside the
                // modal — exactly the nested-container bug we're fixing.
                listbox: {
                  sx: {
                    maxHeight: 'none !important',
                    overflow: 'visible !important',
                    padding: '0 !important',
                  },
                },
              },
            }
          : {})}
        limitTags={variant === 'compact' ? 0 : 2}
        groupBy={groupBy}
        forcePopupIcon={false}
        value={internalValue}
        options={optionsWithSelection}
        inputValue={inputValue}
        classes={{ root: styles.root, paper: alwaysOpen ? undefined : styles.paper }}
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
                // MUI Autocomplete + Next.js 16 Turbopack generate different
                // React useId() values SSR vs CSR, triggering a harmless
                // hydration warning on the input's `id`. The DOM is otherwise
                // correct on the client, so we just silence the noise.
                suppressHydrationWarning: true,
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
                    px: 1,
                    pt: 1,
                    pb: 0.25,
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
              padding: 0.75,
              // Let the dropdown grow with content — no inner scroll. Mirrors
              // Boataround UX where recent + popular lists expand the popper
              // instead of introducing a nested scrollbar.
              maxHeight: 'none',
              overflow: 'visible',
            },
          },
          popper: {
            sx: {
              '& .MuiPaper-root': {
                marginTop: '12px',
                minWidth: '348px',
                marginLeft: '-44px',
                // Paper also carries a default max-height; match the listbox
                // override so the whole popper can grow.
                maxHeight: 'none',
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
