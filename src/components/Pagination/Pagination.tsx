import React from 'react';

import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { PaginationItem, Stack } from '@mui/material';
import MuiPagination, { PaginationProps as MuiPaginationProps } from '@mui/material/Pagination';
import { useTranslations } from 'next-intl';

interface PaginationProps {
  page: number;
  onChange: (page: number) => void;
  count: number;
  /**
   * The URL of a page, when the pages are real pages (a destination landing,
   * landingPagination.ts): each page, previous and next item is then an
   * `<a href>` in the HTML, so crawlers can follow it. A plain click still
   * pages in place through `onChange`; a modified click (new tab, new window)
   * or a middle click is left to the browser.
   */
  getItemHref?: (page: number) => string;
}

const isPlainLeftClick = (event: React.MouseEvent) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

const Pagination = ({ page, onChange, count, getItemHref }: PaginationProps) => {
  const t = useTranslations('common');

  // MUI's built-in labels are English ("Go to next page") on every locale;
  // screen readers read them, and on a landing they name the page links.
  const getItemAriaLabel: MuiPaginationProps['getItemAriaLabel'] = (type, itemPage, selected) => {
    switch (type) {
      case 'page':
        return t(selected ? 'pagination.current' : 'pagination.goTo', { page: String(itemPage) });
      case 'previous':
        return t('pagination.previous');
      case 'next':
        return t('pagination.next');
      case 'first':
        return t('pagination.first');
      case 'last':
        return t('pagination.last');
      default:
        return ''; // the ellipses render no label
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, selectedPage: number) => {
    onChange(selectedPage);
  };

  return (
    <Stack direction="row" justifyContent={{ xs: 'center', md: 'flex-end' }} mt={2}>
      <MuiPagination
        aria-label={t('pagination.label')}
        getItemAriaLabel={getItemAriaLabel}
        shape="rounded"
        count={count}
        onChange={handlePageChange}
        page={page}
        boundaryCount={1}
        siblingCount={1}
        renderItem={item => {
          const slots = { previous: ChevronLeft, next: ChevronRight };
          // The page on screen and a disabled previous / next stay buttons.
          const linked =
            !!getItemHref &&
            item.page != null &&
            !item.selected &&
            !item.disabled &&
            item.type !== 'start-ellipsis' &&
            item.type !== 'end-ellipsis';

          if (!linked) return <PaginationItem {...item} slots={slots} />;

          return (
            <PaginationItem
              {...item}
              slots={slots}
              component="a"
              href={getItemHref(item.page as number)}
              onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                if (!isPlainLeftClick(event)) return;

                event.preventDefault();
                item.onClick(event);
              }}
            />
          );
        }}
      />
    </Stack>
  );
};

export default Pagination;
