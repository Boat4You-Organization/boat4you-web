/**
 * `next/navigation` for `node --test` renders: no app router is mounted
 * outside Next, so the real `useRouter` throws. The search params are what
 * the test last set with `setTestSearch` (a query string), empty by default.
 */
const noop = () => {};
let search = '';

export const setTestSearch = query => {
  search = query;
};

export const useRouter = () => ({
  push: noop,
  replace: noop,
  prefetch: noop,
  back: noop,
  forward: noop,
  refresh: noop,
});
export const usePathname = () => '/';
export const useSearchParams = () => new URLSearchParams(search);
export const useParams = () => ({});
export const notFound = () => {
  throw new Error('notFound');
};
export const redirect = url => {
  throw new Error(`redirect ${url}`);
};
