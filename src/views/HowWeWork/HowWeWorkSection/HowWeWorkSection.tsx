import { Container } from '@mui/material';

import { howWeWorkConfig } from '@/config/howWeWork.config';

import styles from './HowWeWorkSection.module.scss';
import HowWeWorkStep from './HowWeWorkStep';

const HowWeWorkSection = () => (
  <Container
    component="section"
    maxWidth="xl"
    disableGutters
    classes={{ root: styles.root }}
    className={styles.container}
  >
    {howWeWorkConfig.map(item => (
      <HowWeWorkStep key={item.step} {...item} />
    ))}
  </Container>
);

export default HowWeWorkSection;
