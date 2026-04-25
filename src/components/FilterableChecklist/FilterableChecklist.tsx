import React from 'react';

import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, Stack } from '@mui/material';
import cx from 'clsx';
import { useTranslations } from 'next-intl';

import { AutocompleteOption } from '@/components/AutocompleteMultipleChip/AutocompleteMultipleChip';
import SearchWithChips from '@/components/SearchWithChips';
import Check from '@/components/SvgIcons/Check';
import colors from '@/styles/themes/colors';

import styles from './FilterableChecklist.module.scss';

interface FilterableChecklistProps {
  options: AutocompleteOption[];
  searchValue?: string;
  setSearchValue?: (value: string) => void;
  handleAdd?: (option: AutocompleteOption) => void;
  selectedOptions?: string[] | [];
  maxDisplayedChips?: number;
  onDeleteSingle?: (option: string, index: number) => void;
  hideSearch?: boolean;
  groupBy?: (option: AutocompleteOption) => string;
}

const FilterableChecklist = ({
  options,
  searchValue,
  setSearchValue,
  handleAdd,
  selectedOptions,
  maxDisplayedChips,
  onDeleteSingle,
  hideSearch = false,
  groupBy,
}: FilterableChecklistProps) => {
  const t = useTranslations('common');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes((searchValue || '').toLowerCase())
  );

  const isOptionActive = (option: AutocompleteOption) =>
    selectedOptions?.some(selected => selected === option.label) ?? false;

  const handleItemClick = (option: AutocompleteOption) => {
    if (handleAdd) {
      handleAdd(option);
    }
  };

  const getGroupedOptions = () => {
    const groupFunction = groupBy || ((option: AutocompleteOption) => option.group || '');

    const selectedOpts = filteredOptions.filter(option => isOptionActive(option));
    const unselectedOpts = filteredOptions.filter(option => !isOptionActive(option));

    const groupSelected = selectedOpts.reduce(
      (acc, option) => {
        const group = groupFunction(option);

        if (!acc[group]) {
          acc[group] = [];
        }

        acc[group].push(option);

        return acc;
      },
      {} as Record<string, AutocompleteOption[]>
    );

    const groupUnselected = unselectedOpts.reduce(
      (acc, option) => {
        const group = groupFunction(option);

        if (!acc[group]) {
          acc[group] = [];
        }

        acc[group].push(option);

        return acc;
      },
      {} as Record<string, AutocompleteOption[]>
    );

    return { selected: groupSelected, unselected: groupUnselected };
  };

  const { selected: selectedGroups, unselected: unselectedGroups } = getGroupedOptions();
  const selectedGroupKeys = Object.keys(selectedGroups);
  const unselectedGroupKeys = Object.keys(unselectedGroups);

  const renderOption = (option: AutocompleteOption) => {
    const isActive = isOptionActive(option);

    return (
      <ListItem
        key={option.id}
        className={cx(styles.item, { [styles.active]: isActive })}
        onClick={() => handleItemClick(option)}
        style={{ cursor: 'pointer' }}
      >
        <ListItemIcon>{option.icon && option.icon}</ListItemIcon>
        <ListItemText primary={option.label} />
        {/* Always-visible checkbox on the right — empty square when
            inactive, filled blue check when active. Matches competitor
            pattern so users see their selection state without guessing. */}
        <Box
          sx={{
            width: 22,
            height: 22,
            borderRadius: '4px',
            border: `1.5px solid ${isActive ? colors.blue500 : colors.black300}`,
            backgroundColor: isActive ? colors.blue500 : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {isActive && <Check size={16} fill={colors.white} />}
        </Box>
      </ListItem>
    );
  };

  const shouldGroup = groupBy || options.some(option => option.group);

  return (
    <Stack direction="column" spacing={1} height="fit-content" overflow="hidden" px={2}>
      {!hideSearch && (
        <SearchWithChips
          value={searchValue || ''}
          onChange={setSearchValue || (() => {})}
          placeholder={t('search')}
          values={selectedOptions!}
          maxDisplayedChips={maxDisplayedChips}
          onDeleteSingle={onDeleteSingle}
          fullWidth
        />
      )}
      <Stack direction="column" flex={1} overflow="auto">
        <List disablePadding dense classes={{ root: styles.root }} className={styles.list}>
          {shouldGroup ? (
            <>
              {selectedGroupKeys.map(groupName => (
                <React.Fragment key={`selected-${groupName}`}>
                  {selectedGroups[groupName].map(option => renderOption(option))}
                  {groupName && selectedGroupKeys.indexOf(groupName) < selectedGroupKeys.length - 1 && (
                    <Divider sx={{ margin: '8px 8px', color: colors.black100 }} />
                  )}
                </React.Fragment>
              ))}
              {selectedGroupKeys.length > 0 && unselectedGroupKeys.length > 0 && (
                <Divider sx={{ margin: '8px 8px', color: colors.black100 }} />
              )}
              {unselectedGroupKeys.map(groupName => (
                <React.Fragment key={`unselected-${groupName}`}>
                  {unselectedGroups[groupName].map(option => renderOption(option))}
                  {groupName && unselectedGroupKeys.indexOf(groupName) < unselectedGroupKeys.length - 1 && (
                    <Divider sx={{ margin: '8px 8px', color: colors.black100 }} />
                  )}
                </React.Fragment>
              ))}
            </>
          ) : (
            <>
              {filteredOptions.filter(option => isOptionActive(option)).map(option => renderOption(option))}
              {filteredOptions.some(option => isOptionActive(option)) &&
                filteredOptions.some(option => !isOptionActive(option)) && (
                  <Divider sx={{ margin: '8px 8px', color: colors.black100 }} />
                )}
              {filteredOptions.filter(option => !isOptionActive(option)).map(option => renderOption(option))}
            </>
          )}
        </List>
      </Stack>
    </Stack>
  );
};

export default FilterableChecklist;
