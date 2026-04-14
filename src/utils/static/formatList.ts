export const formatList = (
  items: string[] | null | undefined,
  conjunction: string = 'and',
  emptyText: string = ''
): string => {
  if (!items || items.length === 0) {
    return emptyText;
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} ${conjunction} ${items[1]}`;
  }

  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);

  return `${otherItems.join(', ')} ${conjunction} ${lastItem}`;
};

export const formatListWithTranslation = (
  items: string[] | null | undefined,
  getTranslation: () => string,
  emptyText: string = ''
): string => {
  const conjunction = getTranslation();

  return formatList(items, conjunction, emptyText);
};

export const formatListWithItemTranslation = (
  items: string[] | null | undefined,
  getConjunctionTranslation: () => string,
  getItemTranslation: (item: string) => string,
  emptyText: string = ''
): string => {
  if (!items || items.length === 0) {
    return emptyText;
  }

  const conjunction = getConjunctionTranslation();
  const translatedItems = items.map(getItemTranslation);

  if (translatedItems.length === 1) {
    return translatedItems[0];
  }

  if (translatedItems.length === 2) {
    return `${translatedItems[0]} ${conjunction} ${translatedItems[1]}`;
  }

  const lastItem = translatedItems[translatedItems.length - 1];
  const otherItems = translatedItems.slice(0, -1);

  return `${otherItems.join(', ')} ${conjunction} ${lastItem}`;
};
