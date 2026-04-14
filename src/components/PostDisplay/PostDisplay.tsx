/* eslint-disable react/no-danger */
import { Container } from '@mui/material';

import styles from './PostDisplay.module.scss';

interface PostDisplayProps {
  content: string;
}

const PostDisplay = ({ content }: PostDisplayProps) => (
  <Container component="section" maxWidth="lg" className={styles.container}>
    <div dangerouslySetInnerHTML={{ __html: content }} className={styles.body} />
  </Container>
);

export default PostDisplay;
