export const POST_REQUEST_PARAMETERS = {
  method: 'POST',
  headers: {
    Accept: 'application/json, */*',
    'Content-Type': 'application/json',
  },
};

export const PUT_REQUEST_PARAMETERS = {
  method: 'PUT',
  headers: {
    Accept: 'application/json, */*',
    'Content-Type': 'application/json',
  },
};

export const PATCH_REQUEST_PARAMETERS = {
  method: 'PATCH',
  headers: {
    Accept: 'application/json, */*',
    'Content-Type': 'application/json',
  },
};

export const DELETE_REQUEST_PARAMETERS = {
  method: 'DELETE',
  headers: {
    Accept: '*/*',
  },
};

export const OFFSET = 100;

export const PAGE_NUMBER = 1;
export const PAGE_SIZE = 9;
export const BLOG_PAGE_SIZE = 12;

export const DEFAULT_IMAGE = '/images/yacht-banner.webp';

export const MANUFACTURERS_PAGE_SIZE = 1000;
export const MODELS_PAGE_SIZE = 1000;

export const TOTAL_PERIODS = 104;
export const INITIAL_ITEMS_TO_FETCH = 4;

export type SortDirection = 'asc' | 'desc';

export enum AuthKeys {
  ACCESS_TOKEN = 'BOAT4YOU_ACCESS_TOKEN',
  REFRESH_TOKEN = 'BOAT4YOU_REFRESH_TOKEN',
  USER_ID = 'BOAT4YOU_USER_ID',
}
