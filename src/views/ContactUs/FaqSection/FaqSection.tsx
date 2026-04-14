'use client';

import { startTransition, useActionState, useEffect } from 'react';

import { Container, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import { getFAQByCategoryAction } from '@/actions/faq.actions';
import AccordionMenu from '@/components/AccordionMenu';
import FAQ from '@/components/SvgIcons/FAQ';

import styles from './FaqSection.module.scss';

const FaqSection = () => {
  const [faqAction, getFAQAction] = useActionState(getFAQByCategoryAction, undefined);
  const t = useTranslations('howWeWork.faq');
  const locale = useLocale();

  const categoryMap: Record<string, string> = {
    de: 'Check-in, Check-out & Charter-Logistik',
    en: 'Check-In, Check-Out & Charter Logistics',
    es: 'Check-In, Check-Out y Logística del Chárter',
    fr: 'Enregistrement (Check-In), Départ (Check-Out) et Logistique de Location',
    hr: 'Check-In, Check-Out & Čarterska logistika',
    it: 'Check-In, Check-Out e Logistica del Charter',
    pt: 'Check-In, Check-Out e Logística do Charter',
  };

  const category = categoryMap[locale] || 'Check-In, Check-Out & Charter Logistics';

  useEffect(() => {
    startTransition(() => {
      getFAQAction({ locale, category });
    });
  }, [category, locale]);

  return (
    <Container
      component="section"
      maxWidth="xl"
      disableGutters
      classes={{ root: styles.root }}
      className={styles.container}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <FAQ variant="secondary" size={32} />
        <Typography component="h2" variant="h3" fontWeight={700}>
          {t('title')}
        </Typography>
      </Stack>
      {faqAction && <AccordionMenu accordionList={faqAction} />}
    </Container>
  );
};

export default FaqSection;
