import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import { VESSEL_TYPE_CONFIG } from '@/config/ourFleet.config';
import { YachtFleet } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';

import styles from './OurFleetCard.module.scss';

const OurFleetCard = ({ vesselType, yachtCount }: YachtFleet) => {
  const t = useTranslations('home.ourFleetSection');

  const config = VESSEL_TYPE_CONFIG[vesselType as keyof typeof VESSEL_TYPE_CONFIG];

  return (
    <Link href={`/search?boatTypes=${config.slug}`}>
      <Card classes={{ root: styles.root }} className={styles.container} elevation={0}>
        <CardMedia className={styles.imageWrapper}>
          <Image
            src={config.image.src}
            alt={t(config.image.alt)}
            fill
            sizes="(max-width: 600px) 80vw, 305px"
            className={styles.image}
            quality={65}
          />
        </CardMedia>
        <CardContent className={styles.content}>
          <Typography variant="h2" component="h3" fontWeight={800} fontStyle="italic" color={colors.blue950}>
            {t(config.titleKey)}
          </Typography>
          <Typography variant="body2" color={colors.black350}>
            {yachtCount} {t('boat')}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default OurFleetCard;
