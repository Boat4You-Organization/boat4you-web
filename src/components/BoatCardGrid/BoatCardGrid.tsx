import { ReactNode } from 'react';

import { Box } from '@mui/material';

import styles from './BoatCardGrid.module.scss';

/**
 * A grid of listing cards whose rows line up: one column on a phone, two on
 * a tablet, three from 900px up, and from 900px up every card is a six-row
 * subgrid (BoatListingItemCard `alignRows`), so photo, name, marina, specs,
 * highlights and price sit at the same height across a row whatever wraps
 * (owner 13.10.2026: "You might also like" cards must be the same size).
 * Render the cards with `isGridView alignRows`.
 */
const BoatCardGrid = ({ children }: { children: ReactNode }) => <Box className={styles.grid}>{children}</Box>;

export default BoatCardGrid;
