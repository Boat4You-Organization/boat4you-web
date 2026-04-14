import { Box, Typography } from '@mui/material';
import cx from 'clsx';

import TimelineCircleActive from '@/components/SvgIcons/TimelineCircleActive';
import TimelineCircleDefault from '@/components/SvgIcons/TimelineCircleDefault';
import colors from '@/styles/themes/colors';
import { CancellationTimelineItem } from '@/utils/static/cancellationUtils';

import styles from './HorizontalTimeline.module.scss';

interface HorizontalTimelineProps {
  items: CancellationTimelineItem[];
}

const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({ items }) => (
  <Box className={styles.container}>
    {items.map((item, idx) => {
      const isLastItem = idx === items.length - 1;
      const lineCount = 16;

      return (
        <Box key={item.date + String(idx)} className={styles.timelineItem}>
          <Box className={styles.timelineIconWrapper}>
            {item.active ? <TimelineCircleActive size={20} /> : <TimelineCircleDefault size={20} />}
            {!isLastItem && (
              <Box className={styles.connector}>
                {Array.from({ length: lineCount }, (_, lineIndex) => (
                  <Box key={lineIndex} className={cx(styles.line, { [styles.active]: item.active })} />
                ))}
              </Box>
            )}
          </Box>
          <Box className={styles.content}>
            <Typography variant="body1" color={colors.black500}>
              {item.date}
            </Typography>
            <Typography
              variant="body1"
              fontWeight={item.active ? 700 : 600}
              color={item.active ? 'success' : 'text.primary'}
              mt={1}
            >
              {item.text}
            </Typography>
          </Box>
        </Box>
      );
    })}
  </Box>
);

export default HorizontalTimeline;
