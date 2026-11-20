import { getTranslations } from 'next-intl/server';
import 'server-only';

import { GuletCountry } from '@/utils/server/guletCharter';
import { ModelsFaqEntry } from '@/views/Models/ModelsFaq';
import { FactsFormat, factsFormat, joinSentences } from '@/views/Search/CharterFacts/factsContent';

export interface GuletText {
  fmt: FactsFormat;
  /** Title body (the root layout adds " | Boat4You"); the H1 has the same words. */
  title: string;
  h1: string;
  description: string;
  /** The direct answer at the top. */
  answer: string;
  faq: ModelsFaqEntry[];
}

/**
 * The words of /gulet-charter. Sales copy stays in the messages; every count
 * and amount comes from the live data of the countries (guletCharter.ts),
 * and a sentence whose figure is missing is left out.
 */
export const buildGuletText = async (countries: GuletCountry[], locale: string): Promise<GuletText> => {
  const t = await getTranslations({ locale, namespace: 'guletCharter' });
  const fmt = factsFormat(locale);
  const list = (items: string[]) => new Intl.ListFormat(locale, { type: 'conjunction' }).format(items);
  const names = list(countries.map(c => c.name));
  const total = countries.reduce((sum, c) => sum + c.fleet, 0);

  const answer = total > 0 ? t('answer', { count: total, countries: names }) : t('answerNoCount', { countries: names });
  const description =
    total > 0
      ? t('meta.description', { count: total, countries: names })
      : t('meta.descriptionNoCount', { countries: names });

  const priced = countries.filter(c => c.table);
  const counted = countries.filter(c => c.fleet > 0);

  const faq: ModelsFaqEntry[] = [
    { question: t('faq.whatQ'), answer: t('faq.whatA') },
    { question: t('faq.crewQ'), answer: t('faq.crewA') },
    {
      question: t('faq.whereQ'),
      answer: joinSentences([
        t('faq.whereA'),
        counted.length
          ? t('faq.whereCount', {
              list: list(counted.map(c => t('faq.whereCountItem', { count: c.fleet, where: c.where }))),
            })
          : null,
      ]),
    },
    {
      question: t('faq.costQ'),
      answer: priced.length
        ? joinSentences([
            t('faq.costA', {
              list: list(
                priced.map(c =>
                  t('faq.costItem', { low: fmt.money(c.table!.low), high: fmt.money(c.table!.high), where: c.where })
                )
              ),
            }),
            t('faq.costMore'),
          ])
        : t('faq.costMore'),
    },
  ];

  return { fmt, title: t('meta.title'), h1: t('h1'), description, answer, faq };
};
