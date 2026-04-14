import { Box, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';

import Checkbox from '@/components/Checkbox';
import YachtCard from '@/components/YachtCard';
import { YachtModelShortInfo } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import useQueryParams from '@/utils/hooks/useQueryParams';
import DateTime from '@/utils/static/DateTime';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { toggleYachtSelection } from '@/valtio/yacht/yacht.actions';
import { useYachtStore } from '@/valtio/yacht/yacht.store';

import styles from './InquiryYachtCard.module.scss';

interface InquiryYachtCardProps {
  yacht: YachtModelShortInfo;
}

const InquiryYachtCard = ({ yacht }: InquiryYachtCardProps) => {
  const t = useTranslations('common');
  const { params } = useQueryParams();
  const { selectedYachtIds } = useYachtStore();
  const startDate = dayjs(params.startDate);
  const endDate = dayjs(params.endDate);
  const { clientPriceEur, clientPriceInfo } = yacht;
  const locale = useLocale();

  const isSelected = selectedYachtIds.includes(yacht.id);
  const showDates = startDate.isValid() && endDate.isValid();

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleYachtSelection(yacht.id);
  };

  return (
    <Box className={styles.container}>
      <Checkbox checked={isSelected} onClick={handleCheckboxClick} className={styles.checkbox} />
      <Stack direction={{ xs: 'column', sm: 'row' }} rowGap={3} justifyContent="space-between" width="100%">
        <Stack direction="row" width={{ xs: '100%', sm: '75%' }}>
          <YachtCard
            mainImageId={yacht.mainImageId}
            model={yacht.modelName}
            name={yacht.name}
            locationCountryCode={yacht.location.countryCode}
            locationName={yacht.location.name}
            imgSize={85}
          >
            <Stack mt={1}>
              <Typography variant="body1">
                {showDates
                  ? `${DateTime.formatWithMonthName(startDate)} - ${DateTime.formatWithMonthName(endDate)}`
                  : ''}
              </Typography>
            </Stack>
          </YachtCard>
        </Stack>
        <Stack alignSelf="flex-end" className={styles.priceContainer}>
          <Typography variant="h3" component="p" fontWeight={700}>
            {formatPriceWithCurrency({ clientPriceEur, clientPriceInfo, locale })}
          </Typography>
          <Typography variant="body2" color={colors.black600} textAlign="end">
            {t('perDay').toLowerCase()}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default InquiryYachtCard;
