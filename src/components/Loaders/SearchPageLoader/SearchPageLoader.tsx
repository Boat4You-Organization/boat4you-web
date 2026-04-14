import { Container } from '@mui/material';

import BoatsSection from './BoatsSection';
import FiltersSection from './FiltersSection';
import styles from './SearchPageLoader.module.scss';

const SearchPageLoader = () => (
  <Container maxWidth="xl" disableGutters classes={{ root: styles.root }} className={styles.container}>
    <FiltersSection />
    <BoatsSection />
  </Container>
);

export default SearchPageLoader;
