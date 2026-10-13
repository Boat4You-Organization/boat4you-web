import { Box, Container, Stack, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import { Link } from '@/i18n/navigation';
import { SameModelPhotos as SameModelPhotosData } from '@/utils/server/sameModelPhotos';
import { getBoatImageUrl } from '@/utils/static/imageUtils';

import styles from './SameModelPhotos.module.scss';

interface SameModelPhotosProps {
  data: SameModelPhotosData;
  /** The model as the boat page names it ("Lagoon 43"). */
  modelName: string;
  locale: string;
}

/**
 * "Photos of the same model" under the hero — only for a boat without a
 * photo of its own (sameModelPhotos.ts): another boat's photos, said so in
 * the note, each tile and the link opening that boat's page. Never mixed
 * into the boat's own gallery, so nothing pretends to show this very boat.
 */
const SameModelPhotos = async ({ data, modelName, locale }: SameModelPhotosProps) => {
  const t = await getTranslations({ locale, namespace: 'common' });
  const title = t('sameModelTitle');
  const linkLabel = t('sameModelLink', { name: data.photoName });

  return (
    <Container component="section" maxWidth="xl" aria-labelledby="same-model-title" className={styles.container}>
      <Stack spacing={1.5}>
        <Typography id="same-model-title" component="h2" variant="h3" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('sameModelNote', { model: modelName, name: data.photoName })}
        </Typography>
        <Box className={styles.grid}>
          {data.images.map((image, index) => (
            <Link
              key={image.id}
              href={`/boat/${data.slug}`}
              prefetch={false}
              className={styles.tile}
              aria-label={linkLabel}
            >
              <Image
                src={getBoatImageUrl(image.id, 800)}
                alt={`${data.photoName} — ${title} ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1200px) 25vw, 320px"
                className={styles.image}
              />
            </Link>
          ))}
        </Box>
        <Link href={`/boat/${data.slug}`} prefetch={false} className={styles.link}>
          {linkLabel}
          <span aria-hidden="true" className={styles.arrow}>
            →
          </span>
        </Link>
      </Stack>
    </Container>
  );
};

export default SameModelPhotos;
