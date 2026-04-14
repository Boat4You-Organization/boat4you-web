import React from 'react';

import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { PaginationItem, Stack } from '@mui/material';
import MuiPagination from '@mui/material/Pagination';

interface PaginationProps {
  page: number;
  onChange: (page: number) => void;
  count: number;
}

const Pagination = ({ page, onChange, count }: PaginationProps) => {
  const handlePageChange = (event: React.ChangeEvent<unknown>, selectedPage: number) => {
    onChange(selectedPage);
  };

  return (
    <Stack direction="row" justifyContent={{ xs: 'center', md: 'flex-end' }} mt={2}>
      <MuiPagination
        shape="rounded"
        count={count}
        onChange={handlePageChange}
        page={page}
        boundaryCount={1}
        siblingCount={1}
        renderItem={item => (
          <PaginationItem
            {...item}
            slots={{
              previous: ChevronLeft,
              next: ChevronRight,
            }}
          />
        )}
      />
    </Stack>
  );
};

export default Pagination;
