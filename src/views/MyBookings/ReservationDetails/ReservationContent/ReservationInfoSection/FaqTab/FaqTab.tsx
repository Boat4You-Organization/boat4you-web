import React, { startTransition, useActionState, useEffect } from 'react';

import { Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import { getFAQByCategoryAction } from '@/actions/faq.actions';
import AccordionMenu from '@/components/AccordionMenu';
import FAQ from '@/components/SvgIcons/FAQ';

const FaqTab = () => {
  const [faqAction, getFAQAction] = useActionState(getFAQByCategoryAction, undefined);
  const t = useTranslations('yacht');
  const locale = useLocale();

  const categoryMap: Record<string, string> = {
    de: 'Lizenzen & Segelanforderungen',
    en: 'Licenses & Sailing Requirements',
    es: 'Licencias y Requisitos de Navegación',
    fr: 'Licences et Exigences de Navigation',
    hr: 'Dozvole & Uvjeti Jedrenja',
    it: 'Licenze e Requisiti di Navigazione',
    pt: 'Licenças e Requisitos de Navegação à Vela',
  };

  const category = categoryMap[locale] || 'Licenses & Sailing Requirements';

  useEffect(() => {
    startTransition(() => {
      getFAQAction({ locale, category });
    });
  }, [category, locale]);

  return (
    <Stack component="section" direction="column" spacing={3} pt={4}>
      <Typography variant="h3" fontWeight={700} display="flex" flexDirection="row" alignItems="center" gap={1}>
        <FAQ variant="secondary" size={32} />
        {t('FAQTitle')}
      </Typography>
      {faqAction && <AccordionMenu accordionList={faqAction} />}
    </Stack>
  );
};

export default FaqTab;
