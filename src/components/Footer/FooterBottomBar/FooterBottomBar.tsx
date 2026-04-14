import { Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import WorkspaceLogo from '@/components/SvgIcons/WorkspaceLogo';
import colors from '@/styles/themes/colors';

import styles from './FooterBottomBar.module.scss';

const FooterBottomBar = () => {
  const t = useTranslations('common');

  return (
    <Grid container spacing={2} rowGap={6} className={styles.footerBottomBar}>
      <Grid container size={6}>
        <Stack spacing={1}>
          <Typography variant="body2" color={colors.black600}>
            © {new Date().getFullYear()} boat4you. {t('allRightsReserved')}
          </Typography>
        </Stack>
      </Grid>
      <Grid container size={6} justifyContent="end">
      </Grid>
    </Grid>
  );
};

export default FooterBottomBar;
