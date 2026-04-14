'use client';

import { useMemo, useState } from 'react';

import { Container, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import AccordionMenu from '@/components/AccordionMenu';
import ListEmptyState from '@/components/ListEmptyState';
import Search from '@/components/Search';
import { UserModel } from '@/models/user.model';
import colors from '@/styles/themes/colors';
import { Accordion } from '@/types/accordion.type';
import { FAQGroup } from '@/types/faq.type';

import styles from './QuestionsSection.module.scss';

interface QuestionsSectionProps {
  user: UserModel | null;
  faqGroups: FAQGroup[] | null;
}

const QuestionsSection = ({ user, faqGroups }: QuestionsSectionProps) => {
  const [searchValue, setSearchValue] = useState('');
  const t = useTranslations('common');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const safeFaqGroups = faqGroups ?? [];

  const filteredFAQGroups = useMemo(() => {
    if (!searchValue.trim()) {
      return safeFaqGroups;
    }

    const searchTerm = searchValue.toLowerCase();

    return safeFaqGroups
      .map(group => ({
        ...group,
        questions: (group?.questions ?? []).filter(
          question =>
            question?.title?.toLowerCase().includes(searchTerm) || question?.content?.toLowerCase().includes(searchTerm)
        ),
      }))
      .filter(group => group.questions.length > 0);
  }, [safeFaqGroups, searchValue]);

  const convertToAccordions = (questions: FAQGroup['questions']): Accordion[] =>
    (questions ?? []).map(question => ({
      title: question?.title ?? '',
      content: question?.content ?? '',
    }));

  return (
    <Container component="section" disableGutters className={styles.container}>
      <Stack gap={4} className={styles.titleWrapper}>
        <Typography
          variant="hero"
          component="h1"
          fontStyle="italic"
          color={colors.blue500}
          textAlign="center"
          sx={{
            typography: { xs: 'h1', md: 'hero' },
            '&': {
              fontWeight: 800,
            },
          }}
        >
          {t('howCanWeBeOfServiceToYou', { name: user?.name ? ` ${user.name}` : '' })}
        </Typography>
        <Search value={searchValue} onChange={setSearchValue} placeholder={t('search')} fullWidth />
      </Stack>
      {filteredFAQGroups.map((group, groupIndex) => (
        <Stack
          key={`faq-group-${groupIndex + 1}`}
          mt={{ xs: 8, md: groupIndex === 0 ? 15.5 : 10.5 }}
          gap={{ xs: 4, md: 6 }}
        >
          <Typography
            variant="h1"
            component="h2"
            fontWeight={700}
            sx={{
              typography: { xs: 'h2', md: 'h1' },
              '&': {
                fontWeight: 800,
              },
            }}
          >
            {group.title}
          </Typography>
          <AccordionMenu accordionList={convertToAccordions(group.questions)} />
        </Stack>
      ))}

      {filteredFAQGroups.length === 0 && searchValue.trim() && <ListEmptyState title={t('noExactMatches')} />}
    </Container>
  );
};

export default QuestionsSection;
