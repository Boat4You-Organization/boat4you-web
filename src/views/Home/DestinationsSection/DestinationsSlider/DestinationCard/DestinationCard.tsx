import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import {
  getImageByCountryCode,
  getTranslationKeyByCountryCode,
  getTranslationKeyByDestinationName,
} from '@/config/destinations.config';
import { CountryCountModel } from '@/models/locations.model';
import { Currency } from '@/models/user.model';
import useQueryParams from '@/utils/hooks/useQueryParams';

import styles from './DestinationCard.module.scss';

interface DestinationCardProps extends CountryCountModel {
  priority?: boolean;
}

const DestinationCard = ({ id, name, countryCode, yachtCount, priority = false }: DestinationCardProps) => {
  const t = useTranslations('home');
  const image = getImageByCountryCode(countryCode);
  const alt = getTranslationKeyByCountryCode(countryCode);
  const { params } = useQueryParams();

  const currencyParam = params.currency && params.currency !== Currency.EUR ? `&currency=${params.currency}` : '';

  const translationKey = getTranslationKeyByCountryCode(countryCode) || getTranslationKeyByDestinationName(name);
  const localizedName = translationKey ? t(translationKey) : name;

  return (
    <Link href={`/search?destinations=${name}&did=${id}${currencyParam}`}>
      <Card classes={{ root: styles.root }} className={styles.container}>
        <CardMedia className={styles.imageWrapper}>
          <Image
            src={image.src}
            alt={alt}
            fill
            sizes="(max-width: 600px) 80vw, 305px"
            className={styles.image}
            priority={priority}
            fetchPriority={priority ? 'high' : undefined}
          />
        </CardMedia>
        <CardContent className={styles.content}>
          <Typography variant="h2" component="h3" fontWeight={800} fontStyle="italic">
            {localizedName}
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {yachtCount} {t('destinationsSection.yachts')}
          </Typography>
        </CardContent>
        <Box className={styles.overlay} />
      </Card>
    </Link>
  );
};

export default DestinationCard;
