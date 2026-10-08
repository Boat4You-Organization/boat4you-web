/**
 * `next/image` for `node --test` renders: a plain <img> with the props a page
 * would see (src, alt, …). next/image is CommonJS, whose default export does
 * not survive the ESM import of a TSX component outside Next.
 */
import { createElement } from 'react';

const NEXT_ONLY = new Set(['fill', 'sizes', 'priority', 'preload', 'quality']);

const Image = props =>
  createElement('img', Object.fromEntries(Object.entries(props).filter(([key]) => !NEXT_ONLY.has(key))));

export default Image;
