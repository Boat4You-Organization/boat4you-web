'use client';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Icon,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import cx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import Checkbox from '@/components/Checkbox';
import FavoriteButton from '@/components/FavoriteButton';
import FlagIcon from '@/components/FlagIcon';
import StatusChip from '@/components/StatusChip';
import Cabin from '@/components/SvgIcons/BoatFeatures/Cabin';
import Dimensions from '@/components/SvgIcons/BoatFeatures/Dimensions';
import People from '@/components/SvgIcons/BoatFeatures/People';
import Calendar from '@/components/SvgIcons/Calendar';
import Information from '@/components/SvgIcons/Information';
import { UserModel, UserRoleName } from '@/models/user.model';
import {
  CHARTER_DESCRIPTION_LABEL_MAP,
  CHARTER_TYPE_COLOR_MAP,
  CHARTER_TYPE_LABEL_MAP,
  YachtModelShortInfo,
} from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import useBreakpoint from '@/utils/hooks/useBreakpoint';
import useQueryParams from '@/utils/hooks/useQueryParams';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { getBoatImageUrl } from '@/utils/static/imageUtils';
import { roleGuard } from '@/utils/static/roleGuard';
import { toggleYachtSelection } from '@/valtio/yacht/yacht.actions';

import styles from './BoatListingItemCard.module.scss';

interface BoatListingItemCardProps extends YachtModelShortInfo {
  isGridView: boolean;
  user: UserModel | null;
  isSelected?: boolean;
}

const BoatListingItemCard = ({
  id,
  slug,
  name,
  charterType,
  location,
  buildYear,
  maxPersons,
  cabins,
  length,
  clientPriceEur,
  clientPriceInfo,
  isGridView,
  mainImageId,
  modelName,
  user,
  totalLocations,
  isSelected = false,
}: BoatListingItemCardProps) => {
  const { queryParams } = useQueryParams();
  const { isMobile } = useBreakpoint();
  const t = useTranslations();
  const locale = useLocale();

  const isAdmin = roleGuard(user?.roles || [], [UserRoleName.SYSTEM_ADMIN]);
  const formattedPrice = formatPriceWithCurrency({ clientPriceEur, clientPriceInfo, locale });

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleYachtSelection(id);
  };

  return (
    <Link href={`/boat/${slug}?${queryParams}`}>
      <Card
        elevation={0}
        classes={{ root: styles.root }}
        className={cx(styles.container, { [styles.gridView]: isGridView })}
      >
        <CardMedia className={cx(styles.imageWrapper, { [styles.gridView]: isGridView })}>
          <Image
            src={getBoatImageUrl(mainImageId, 800)}
            alt={`${modelName} ${name || ''} boat image`}
            fill
            className={styles.image}
            sizes="(max-width: 899px) 100vw, 388px"
          />
          <Box className={styles.favoriteButton}>
            <FavoriteButton yacht={{ id, slug, name, model: modelName, location, mainImageId }} />
          </Box>
        </CardMedia>
        <CardContent className={styles.content}>
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              {name && (
                <Typography variant="h3" fontWeight={700}>
                  {modelName} | {name}
                </Typography>
              )}
              {isAdmin && !isGridView && !isMobile && <Checkbox checked={isSelected} onClick={handleCheckboxClick} />}
            </Stack>
            {location && (
              <Stack direction="row" alignItems="center" gap={1} mt={1}>
                <FlagIcon countryCode={location.countryCode} />
                <Typography variant="body1">{location.name}</Typography>
              </Stack>
            )}
            <Stack direction="row" alignItems="center" gap={2} mt={1.5}>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <StatusChip
                  label={t(CHARTER_TYPE_LABEL_MAP[charterType])}
                  color={CHARTER_TYPE_COLOR_MAP[charterType]}
                />
                <Tooltip
                  title={t(CHARTER_DESCRIPTION_LABEL_MAP[charterType])}
                  placement="bottom"
                  slotProps={{
                    transition: { timeout: 0 },
                  }}
                >
                  <Icon className={styles.icon}>
                    <Information size={20} />
                  </Icon>
                </Tooltip>
              </Stack>
              {totalLocations > 1 && (
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <StatusChip label={t('common.multiLocation')} color="success" />
                  <Tooltip
                    title={t('common.multiLocationDescription')}
                    placement="bottom"
                    slotProps={{
                      transition: { timeout: 0 },
                    }}
                  >
                    <Icon className={styles.icon}>
                      <Information size={20} />
                    </Icon>
                  </Tooltip>
                </Stack>
              )}
            </Stack>
            {!isGridView && (
              <Stack direction="row" alignItems="center" gap={{ xs: 2.5, md: 3 }} mt={3}>
                {buildYear && (
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Calendar />
                    <Typography variant="body1" fontWeight={600}>
                      {buildYear}
                    </Typography>
                  </Stack>
                )}
                {maxPersons && (
                  <Stack direction="row" alignItems="center" gap={1}>
                    <People />
                    <Typography variant="body1" fontWeight={600}>
                      {maxPersons} {t('filters.people')}
                    </Typography>
                  </Stack>
                )}
                {cabins && (
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Cabin />
                    <Typography variant="body1" fontWeight={600}>
                      {cabins} {t('filters.cabins')}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            )}
            {!isGridView && length && (
              <Stack direction="row" alignItems="center" gap={{ xs: 2.5, md: 3 }} mt={3}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Dimensions />
                  <Typography variant="body1" fontWeight={600}>
                    {length} m
                  </Typography>
                </Stack>
              </Stack>
            )}
          </Box>
          <CardActions className={cx(styles.actions, { [styles.gridView]: isGridView })}>
            <Stack>
              <Typography variant="h2" component="p" fontWeight={700} color="success">
                {formattedPrice}
              </Typography>
              <Typography
                variant="body2"
                textAlign={{ sx: 'start', md: isGridView ? 'start' : 'end' }}
                color={colors.black600}
              >
                {t('common.perDay')}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" width={isGridView ? '100%' : 'auto'} gap={1}>
              <Button
                size={isGridView || isMobile ? 'medium' : 'large'}
                sx={{ ml: 0 }}
                className={cx(styles.button, { [styles.fullwidth]: isGridView })}
              >
                {t('common.bookNow')}
              </Button>
              {isAdmin && (isGridView || isMobile) && <Checkbox checked={isSelected} onClick={handleCheckboxClick} />}
            </Stack>
          </CardActions>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BoatListingItemCard;
