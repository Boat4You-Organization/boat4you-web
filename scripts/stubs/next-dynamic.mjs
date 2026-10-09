/**
 * `next/dynamic` for `node --test` renders. The components loaded this way on
 * the boat page (the gallery and layout lightboxes) mount on the first click,
 * never in a server render, so a component that renders nothing stands in.
 * next/dynamic is CommonJS, whose default export does not survive the ESM
 * import of a TSX component outside Next.
 */
const dynamic = () => () => null;

export default dynamic;
