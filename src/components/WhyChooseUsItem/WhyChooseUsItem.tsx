import { ElementType } from 'react';

import { Grid, Typography, TypographyProps } from '@mui/material';
import cx from 'clsx';

import colors from '@/styles/themes/colors';

import styles from './WhyChooseUsItem.module.scss';

interface WhyChooseUsItemProps {
  icon: ElementType;
  title: string;
  description: string;
  translationKey: string;
  itemSize?: number;
  component?: TypographyProps['component'];
}

const WhyChooseUsItem = ({
  icon: Icon,
  title,
  description,
  translationKey,
  itemSize = 3,
  component = 'h3',
}: WhyChooseUsItemProps) => {
  const itemsPerRow = 12 / itemSize;
  const containerClasses = [styles.container, styles[`itemsPerRow${itemsPerRow}`]];

  return (
    <Grid key={translationKey} size={{ xs: 6, xl: itemSize }} className={cx(containerClasses)}>
      <Icon size={64} variant="secondary" />
      <Typography variant="h4" component={component} color={colors.blue500} textAlign="center" maxWidth={220}>
        {title}
      </Typography>
      <Typography variant="body2" color={colors.black350} textAlign="center" maxWidth={220}>
        {description}
      </Typography>
    </Grid>
  );
};

export default WhyChooseUsItem;
