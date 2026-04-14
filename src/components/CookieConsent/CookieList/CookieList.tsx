import { Box, Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import colors from '@/styles/themes/colors';
import { Cookie } from '@/types/cookie.type';

import styles from './CookieList.module.scss';

interface CookieListProps {
  cookies?: Cookie[];
  description: string;
}

const CookieList = ({ cookies, description }: CookieListProps) => {
  const t = useTranslations('cookieConsent.cookieList');

  if (!cookies || cookies.length === 0) {
    return (
      <Typography variant="body2" color={colors.black950}>
        {description}
      </Typography>
    );
  }

  return (
    <Stack gap={2}>
      <Typography variant="body2" fontWeight={500} color={colors.black950}>
        {description}
      </Typography>
      <Stack>
        {cookies.map((cookie, index) => (
          <Box key={`${index + 1}`} className={styles.cookieItem}>
            <Stack gap={3}>
              <Grid container>
                <Grid size={{ xs: 6, md: 4 }}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body2" fontWeight={700} color={colors.black950}>
                      {t('name')}
                    </Typography>
                    <Typography variant="body2" color={colors.black800}>
                      {cookie.name}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body2" fontWeight={700} color={colors.black950}>
                      {t('domain')}
                    </Typography>
                    <Typography variant="body2" color={colors.black800}>
                      {cookie.domain}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body2" fontWeight={700} color={colors.black950}>
                      {t('duration')}
                    </Typography>
                    <Typography variant="body2" color={colors.black800}>
                      {cookie.duration}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body2" fontWeight={700} color={colors.black950}>
                  {t('description')}
                </Typography>
                <Typography variant="body2" color={colors.black800}>
                  {cookie.description}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};

export default CookieList;
