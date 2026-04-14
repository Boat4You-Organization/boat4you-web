import { Box, CircularProgress } from '@mui/material';

interface LoadingSectionProps {
  size?: number;
}

const LoadingSection = ({ size = 40 }: LoadingSectionProps) => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    <CircularProgress size={size} />
  </Box>
);

export default LoadingSection;
