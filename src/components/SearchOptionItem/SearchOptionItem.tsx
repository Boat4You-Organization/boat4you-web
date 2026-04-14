import { Box, Stack, Typography } from '@mui/material';
import cx from 'clsx';

import Check from '@/components/SvgIcons/Check';
import colors from '@/styles/themes/colors';

import styles from './SearchOptionItem.module.scss';

export interface SearchOptionTag {
  label: string;
  color: string;
}

interface SearchOptionItemProps {
  label: string;
  selected: boolean;
  icon?: React.ReactNode;
  tag?: SearchOptionTag;
  props?: React.HTMLAttributes<HTMLLIElement> & { key?: React.Key };
}

const SearchOptionItem = ({ label, selected, icon: Icon, tag, props }: SearchOptionItemProps) => {
  const { key, ...restProps } = props || {};

  return (
    <Box component="li" key={key} {...restProps} className={cx(styles.container, { [styles.active]: selected })}>
      <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0, flex: 1 }}>
        {Icon && Icon}
        <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}
        </Typography>
        {tag && (
          <Typography
            component="span"
            sx={{
              color: tag.color,
              fontSize: 12,
              fontWeight: 500,
              flexShrink: 0,
              lineHeight: 1.2,
            }}
          >
            {tag.label}
          </Typography>
        )}
      </Stack>
      {selected && <Check size={20} fill={colors.blue300} />}
    </Box>
  );
};

export default SearchOptionItem;
