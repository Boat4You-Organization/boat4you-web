import React, { useEffect } from 'react';

import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import ExtrasCard from '@/components/ExtrasCard';
import Extras from '@/components/SvgIcons/Extras';
import { YachtModel } from '@/models/yacht.model';
import { sortByObligatoryExtras } from '@/utils/static/sortUtils';
import { setObligatoryExtras } from '@/valtio/yacht/yacht.actions';
import { useYachtStore } from '@/valtio/yacht/yacht.store';

interface ExtrasTabProps {
  yacht: YachtModel;
}

const ExtrasTab = ({ yacht }: ExtrasTabProps) => {
  const { selectedOffer } = useYachtStore();
  const t = useTranslations('yacht');

  useEffect(() => {
    if (selectedOffer?.obligatoryExtrasKeys !== undefined) {
      setObligatoryExtras(selectedOffer.obligatoryExtrasKeys);
    }
  }, [selectedOffer?.obligatoryExtrasKeys, yacht.slug]);

  const sortedServices = yacht.services.sort(sortByObligatoryExtras(selectedOffer?.obligatoryExtrasKeys || []));

  return (
    <Stack component="section" direction="column">
      <Typography
        component="h2"
        variant="h3"
        fontWeight={700}
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap={1}
      >
        <Extras variant="secondary" size={32} />
        {t('extrasTitle')}
      </Typography>
      <Stack spacing={2} pt={3}>
        {sortedServices.map(extra => {
          const { key, ...extraProps } = extra;

          return <ExtrasCard key={extra.id} {...extraProps} yachtSlug={yacht.slug} extraKey={key} />;
        })}
      </Stack>
    </Stack>
  );
};

export default ExtrasTab;
