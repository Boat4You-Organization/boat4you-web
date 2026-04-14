import { Divider, Grid, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { bankDetails } from '@/config/bank-details.config';

const BankTransfer = () => {
  const t = useTranslations('common');

  return (
    <>
      <Divider
        sx={{
          '&.MuiDivider-root': {
            marginBlock: 4,
          },
        }}
      />
      <Typography variant="h2" component="h2" mb={3}>
        {t('bankTransferInfo')}
      </Typography>
      <Grid container>
        {bankDetails.map(({ title, value }) => (
          <Grid key={title} size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" component="p">
              {title}
            </Typography>
            <Typography variant="body1">{value}</Typography>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default BankTransfer;
