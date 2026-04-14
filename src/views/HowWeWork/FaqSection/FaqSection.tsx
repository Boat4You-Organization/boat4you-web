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
    de: 'Zahlungen, Kautionen & Versicherung',
    en: 'Payments, Deposits & Insurance',
    es: 'Pagos, Depósitos y Seguros',
    fr: 'Paiements, Dépôts et Assurance',
    hr: 'Plaćanja, Akontacije & Osiguranje',
    it: 'Pagamenti, Depositi e Assicurazioni',
    pt: 'Pagamentos, Depósitos e Seguros',
  };

  const category = categoryMap[locale] || 'Payments, Deposits & Insurance';

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
        <Typography variant="h3" fontWeight={700}>
          {t('title')}
        </Typography>
      </Stack>
      {faqAction && <AccordionMenu accordionList={faqAction} />}
    </Container>
  );
};

export default FaqSection;
