'use server';

import { getFAQByCategory } from '@/lib/page';
import { Accordion } from '@/types/accordion.type';

export async function getFAQByCategoryAction(
  _state: unknown,
  payload: { locale: string; category: string }
): Promise<Accordion[] | null> {
  return getFAQByCategory(payload.locale, 'static', 'faq', payload.category);
}
