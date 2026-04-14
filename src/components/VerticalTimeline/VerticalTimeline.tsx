import { Box, Typography } from '@mui/material';
import cx from 'clsx';

import TimelineCircleActive from '@/components/SvgIcons/TimelineCircleActive';
import TimelineCircleDefault from '@/components/SvgIcons/TimelineCircleDefault';
import colors from '@/styles/themes/colors';
import { CancellationTimelineItem } from '@/utils/static/cancellationUtils';

import styles from './VerticalTimeline.module.scss';

interface VerticalTimelineProps {
  items: CancellationTimelineItem[];
}

const VerticalTimeline = ({ items }: VerticalTimelineProps) => (
  <Box className={styles.container}>
    {items.map((item, idx) => {
      const isLastItem = idx === items.length - 1;

      return (
        <Box key={item.date + String(idx)} className={styles.timelineItem}>
          <Box className={styles.timelineIconWrapper}>
            {item.active ? <TimelineCircleActive /> : <TimelineCircleDefault />}
            {!isLastItem && (
              <Box className={styles.connector}>
                <Box className={cx(styles.line, { [styles.active]: item.active })} />
                <Box className={cx(styles.line, { [styles.active]: item.active })} />
                <Box className={cx(styles.line, { [styles.active]: item.active })} />
                <Box className={cx(styles.line, { [styles.active]: item.active })} />
              </Box>
            )}
          </Box>
          <Box className={cx(styles.content, { [styles.lastItem]: isLastItem })}>
            <Typography variant="body1" color={colors.black500}>
              {item.date}
            </Typography>
            <Typography
              variant="body1"
              fontWeight={item.active ? 700 : 600}
              color={item.active ? 'success' : 'text.primary'}
              sx={{ alignSelf: 'center' }}
              mt={isLastItem ? 0 : 1}
            >
              {item.text}
            </Typography>
          </Box>
        </Box>
      );
    })}
  </Box>
);

export default VerticalTimeline;
