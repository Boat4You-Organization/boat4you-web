/**
 * The boat's layout drawing on its own (owner, 9.10.2026: "sliku od layouta
 * svakog plovila ako ga ima stavi poviše amenities … i izbaci ga iz slika"):
 *
 *   - isLayoutImage reads the backend's flag: `layout: true`, or `kind` /
 *     `type` "LAYOUT" in any case (the field name is not final);
 *   - splitLayoutImages / withLayoutImagesApart: no flag leaves the images
 *     (and the yacht) exactly as they came; one or more layouts leave the
 *     photos; a main image that is a layout hands "main" to the first photo;
 *     a boat with layouts only keeps them as its photos too;
 *   - the layout block (LayoutSection): heading, alt "<boat> — <heading>",
 *     the gallery's image URL; nothing at all without a layout; above
 *     Amenities on the boat page;
 *   - the gallery shows no layout and counts one photo less;
 *   - the PDF: the layout on a page of its own, never in the photo grid.
 *
 *   yarn test:layout
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { NextIntlClientProvider } from 'next-intl';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import './tsLoader.mjs';

// next/image and next/dynamic are CommonJS (their default export does not
// survive an ESM import outside Next): stand-ins render a plain <img> and
// nothing (the lightboxes mount on the first click, never on the server).
registerHooks({
  resolve: (specifier, context, nextResolve) => {
    if (specifier === 'next/image') {
      return { url: new URL('./stubs/next-image.mjs', import.meta.url).href, shortCircuit: true };
    }

    if (specifier === 'next/dynamic') {
      return { url: new URL('./stubs/next-dynamic.mjs', import.meta.url).href, shortCircuit: true };
    }

    return nextResolve(specifier, context);
  },
});

// The image origin is read at import (imageUtils.ts).
process.env.NEXT_PUBLIC_IMAGE_CDN_URL = 'https://boat4you.b-cdn.net';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const readJson = path => JSON.parse(readFileSync(`${ROOT}${path}`, 'utf8'));
const readSrc = path => readFileSync(`${ROOT}${path}`, 'utf8');
const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr'];

const { isLayoutImage, splitLayoutImages, withLayoutImagesApart } = await import('@/utils/static/yachtLayout');
const { default: LayoutSection } = await import('@/views/Boat/BoatContentSection/LayoutSection');
const { default: Gallery } = await import('@/components/Gallery');
const { default: YachtPDF } = await import('@/components/YachtPDF/YachtPDF');

const render = (element, locale = 'en') =>
  renderToStaticMarkup(
    createElement(
      NextIntlClientProvider,
      { locale, messages: { common: readJson(`messages/${locale}/common.json`) }, timeZone: 'UTC' },
      element
    )
  );

// Boat 12663 (Lagoon 55 The Moon - First Class) as the API sends it: every
// position 0, the main image fourth, the layout (218650, L55_layout_5.jpg) 30th.
const IDS = [218666, 218641, 218642, 218647, 218634, 218656, 218637, 218659, 218639, 218653, 218650, 218663];
const image = (id, extra = {}) => ({ id, url: null, position: 0, mainImage: id === 218647, ...extra });
const imagesToday = () => IDS.map(id => image(id));
const withLayoutFlag = (ids, flag = { layout: true }) => IDS.map(id => image(id, ids.includes(id) ? flag : {}));
const yacht = yachtImages => ({
  id: 12663,
  slug: 'lagoon-55-the-moon-first-class-12663',
  name: 'The Moon - FIRST CLASS',
  model: 'Lagoon 55',
  modelName: 'Lagoon 55',
  manufacturerName: 'Lagoon',
  yachtImages,
});
const imgTags = html => html.match(/<img [^>]*>/g) ?? [];
const srcIds = html => imgTags(html).map(tag => Number(/\/public\/image\/(\d+)/.exec(tag)?.[1]));

describe('isLayoutImage: the backend flag, whatever it ends up being called', () => {
  test('`layout: true` is a layout; false, null, missing or a truthy non-boolean is not', () => {
    assert.equal(isLayoutImage({ layout: true }), true);
    assert.equal(isLayoutImage({ layout: false }), false);
    assert.equal(isLayoutImage({ layout: null }), false);
    assert.equal(isLayoutImage({}), false);
    assert.equal(isLayoutImage({ layout: 'true' }), false);
    assert.equal(isLayoutImage({ layout: 1 }), false);
    assert.equal(isLayoutImage(null), false);
    assert.equal(isLayoutImage(undefined), false);
  });

  test('`kind` or `type` "LAYOUT" in any case is a layout; another kind is not', () => {
    ['LAYOUT', 'layout', 'Layout', ' layout '].forEach(tag => {
      assert.equal(isLayoutImage({ kind: tag }), true, `kind ${tag}`);
      assert.equal(isLayoutImage({ type: tag }), true, `type ${tag}`);
    });
    ['PHOTO', 'EXTERIOR', '', 'LAYOUTS', 'deck layout'].forEach(tag => {
      assert.equal(isLayoutImage({ kind: tag }), false, `kind ${tag}`);
      assert.equal(isLayoutImage({ type: tag }), false, `type ${tag}`);
    });
  });
});

describe('splitLayoutImages / withLayoutImagesApart', () => {
  test('no flag (the API today): the images and the yacht come back as they were', () => {
    const images = imagesToday();
    const split = splitLayoutImages(images);

    assert.equal(split.photos, images);
    assert.deepEqual(split.layouts, []);

    const boat = yacht(images);
    const apart = withLayoutImagesApart(boat);

    assert.equal(apart.yacht, boat);
    assert.equal(apart.yacht.yachtImages, images);
    assert.deepEqual(apart.layoutImages, []);
    assert.deepEqual(splitLayoutImages(null), { photos: [], layouts: [] });
    assert.deepEqual(splitLayoutImages(undefined), { photos: [], layouts: [] });
  });

  test('one layout: out of the photos (one fewer), the main image unchanged', () => {
    const images = withLayoutFlag([218650]);
    const { photos, layouts } = splitLayoutImages(images);

    assert.deepEqual(
      layouts.map(i => i.id),
      [218650]
    );
    assert.equal(photos.length, images.length - 1);
    assert.ok(!photos.some(i => i.id === 218650));
    assert.deepEqual(
      photos.filter(i => i.mainImage).map(i => i.id),
      [218647]
    );
    // Untouched objects, in the partner's order.
    assert.deepEqual(
      photos.map(i => i.id),
      IDS.filter(id => id !== 218650)
    );
    assert.ok(photos.every(p => images.includes(p)));
  });

  test('two layouts (layout + bunk-bed variant): both out, listed by position', () => {
    const images = [
      { id: 1, position: 0, mainImage: true },
      { id: 2, position: 1, mainImage: false },
      { id: 3, position: 5, mainImage: false, kind: 'LAYOUT' },
      { id: 4, position: 2, mainImage: false, layout: true },
      { id: 5, position: 3, mainImage: false },
    ];
    const { photos, layouts } = splitLayoutImages(images);

    assert.deepEqual(
      layouts.map(i => i.id),
      [4, 3]
    );
    assert.deepEqual(
      photos.map(i => i.id),
      [1, 2, 5]
    );
  });

  test('the main image is a layout: the first photo in gallery order becomes the main image', () => {
    const images = [
      { id: 10, position: 0, mainImage: true, layout: true },
      { id: 11, position: 3, mainImage: false },
      { id: 12, position: 1, mainImage: false },
      { id: 13, position: 1, mainImage: false },
    ];
    const snapshot = structuredClone(images);
    const { photos, layouts } = splitLayoutImages(images);

    assert.deepEqual(
      layouts.map(i => i.id),
      [10]
    );
    assert.deepEqual(
      photos.map(i => [i.id, i.mainImage]),
      [
        [11, false],
        [12, true],
        [13, false],
      ]
    );
    // The API objects are not changed (the server keeps them for the JSON-LD).
    assert.deepEqual(images, snapshot);

    const apart = withLayoutImagesApart(yacht(images));

    assert.equal(apart.yacht.yachtImages.find(i => i.mainImage)?.id, 12);
  });

  test('only layouts: the hero keeps showing them (no photo to show), the block lists them', () => {
    const images = [
      { id: 20, position: 1, mainImage: false, layout: true },
      { id: 21, position: 0, mainImage: true, type: 'layout' },
    ];
    const { photos, layouts } = splitLayoutImages(images);

    assert.equal(photos, images);
    assert.deepEqual(
      layouts.map(i => i.id),
      [21, 20]
    );

    const boat = yacht(images);

    assert.equal(withLayoutImagesApart(boat).yacht, boat);
    assert.equal(withLayoutImagesApart(boat).layoutImages.length, 2);
  });
});

describe('the layout block (LayoutSection)', () => {
  const titles = {
    en: 'Layout',
    de: 'Grundriss',
    fr: 'Plan du bateau',
    it: 'Pianta della barca',
    es: 'Plano del barco',
    pt: 'Planta do barco',
    nl: 'Indeling',
    pl: 'Układ jachtu',
    hr: 'Tlocrt plovila',
  };

  test('every locale has the heading and the enlarge label (with the {name} placeholder)', () => {
    LOCALES.forEach(locale => {
      const common = readJson(`messages/${locale}/common.json`);

      assert.equal(common.layoutTitle, titles[locale], locale);
      assert.match(common.layoutEnlarge, /\{name\}/u, locale);
    });
  });

  test('with the flag: the heading, the drawing from the gallery URL, alt "<boat> — <heading>"', () => {
    const { layoutImages } = withLayoutImagesApart(yacht(withLayoutFlag([218650])));

    LOCALES.forEach(locale => {
      const html = render(
        createElement(LayoutSection, { images: layoutImages, photoName: 'Lagoon 55 The Moon' }),
        locale
      );
      const tags = imgTags(html);

      assert.match(html, /<section[^>]*aria-labelledby="boat-layout-title"/u, locale);
      assert.match(html, new RegExp(`<h2[^>]*id="boat-layout-title"[^>]*>.*${titles[locale]}</h2>`, 'u'), locale);
      assert.equal(tags.length, 1, locale);
      assert.match(tags[0], /src="https:\/\/boat4you\.b-cdn\.net\/public\/image\/218650\?width=1200"/u, locale);
      assert.ok(tags[0].includes(`alt="Lagoon 55 The Moon — ${titles[locale]}"`), `${locale}: ${tags[0]}`);
      assert.match(html, /<button[^>]*aria-label="[^"]*Lagoon 55 The Moon — /u, locale);
    });
  });

  test('two layouts: numbered alt text', () => {
    const { layoutImages } = withLayoutImagesApart(yacht(withLayoutFlag([218650, 218663])));
    const html = render(createElement(LayoutSection, { images: layoutImages, photoName: 'Lagoon 55 The Moon' }));

    assert.deepEqual(srcIds(html), [218650, 218663]);
    assert.ok(html.includes('alt="Lagoon 55 The Moon — Layout 1"'));
    assert.ok(html.includes('alt="Lagoon 55 The Moon — Layout 2"'));
  });

  test('without the flag: nothing at all (no empty heading)', () => {
    const { layoutImages } = withLayoutImagesApart(yacht(imagesToday()));

    assert.equal(render(createElement(LayoutSection, { images: layoutImages, photoName: 'Lagoon 55 The Moon' })), '');
  });

  test('the boat page renders it right above Amenities, from the server-side split', () => {
    const content = readSrc('src/views/Boat/BoatContentSection/BoatContentSection.tsx');

    assert.match(
      content,
      /tabName === 'ammenities' && layoutImages\.length > 0 && \([\s\S]*?<LayoutSection images=\{layoutImages\}[\s\S]*?<\/>\s*\)\}\s*<Stack\s+id=\{`section-\$\{index\}`\}/u
    );

    const page = readSrc('src/app/[locale]/(search)/boat/[slug]/page.tsx');

    assert.match(
      page,
      /const \{ yacht: clientYacht, layoutImages \} = withLayoutImagesApart\(withResolvedNotes\(yacht, capacity\)\)/u
    );
    assert.match(page, /<BoatHeroSection yacht=\{clientYacht\} layoutImages=\{layoutImages\} \/>/u);
    assert.match(page, /layoutImages=\{layoutImages\}\s*\/>/u);
    // og:image and the Product image: a photo, like the hero.
    assert.match(page, /const images = splitLayoutImages\(yacht\.yachtImages\)\.photos;/u);
  });
});

describe('the photo gallery leaves the layout out', () => {
  test('no flag: the gallery is as today (the layout is a photo like any other)', () => {
    const images = [218647, 218666, 218650, 218641, 218642, 218634].map(id => image(id, { mainImage: id === 218647 }));
    const html = render(createElement(Gallery, { yacht: withLayoutImagesApart(yacht(images)).yacht }));

    assert.deepEqual(srcIds(html), [218647, 218666, 218650, 218641, 218642]);
    // Six photos, five tiles: "Show all photos".
    assert.match(html, /Show all photos/u);
  });

  test('with the flag: not in the tiles, and one photo fewer (five photos, no "Show all photos")', () => {
    const images = [218647, 218666, 218650, 218641, 218642, 218634].map(id =>
      image(id, { mainImage: id === 218647, layout: id === 218650 })
    );
    const html = render(createElement(Gallery, { yacht: withLayoutImagesApart(yacht(images)).yacht }));

    assert.deepEqual(srcIds(html), [218647, 218666, 218641, 218642, 218634]);
    assert.doesNotMatch(html, /Show all photos/u);
  });

  test('the main image is the layout: the hero tile is the first photo', () => {
    const images = [218650, 218666, 218641].map((id, position) =>
      image(id, { position, mainImage: id === 218650, layout: id === 218650 })
    );
    const html = render(createElement(Gallery, { yacht: withLayoutImagesApart(yacht(images)).yacht }));

    assert.deepEqual(srcIds(html), [218666, 218641]);
    assert.match(imgTags(html)[0], /alt="Lagoon 55 The Moon - First Class — photo 1"/u);
  });
});

describe('the PDF brochure: the layout on a page of its own', () => {
  const pdfProps = layoutSrcs => ({
    yacht: { ...yacht(imagesToday()), amenities: [], offers: [], location: { name: 'Split', countryCode: 'HR' } },
    offer: null,
    pageUrl: 'https://www.boat4you.com/boat/lagoon-55-the-moon-first-class-12663',
    heroSrc: 'data:image/jpeg;base64,hero',
    gallerySrcs: ['data:image/jpeg;base64,photo-1', 'data:image/jpeg;base64,photo-2'],
    ...(layoutSrcs ? { layoutSrcs } : {}),
    qrDataUrl: 'data:image/png;base64,qr',
    baseUrl: 'https://www.boat4you.com',
    generatedDate: '9 October 2026',
    locale: 'en',
    capacityFmt: () => '',
    amenityLabels: {},
  });
  const children = element => [element?.props?.children].flat(Infinity).filter(Boolean);
  const walk = (element, out = []) => {
    if (!element || typeof element !== 'object') return out;

    out.push(element);
    children(element).forEach(child => walk(child, out));

    return out;
  };
  const pagesOf = doc => children(doc);
  const imageSrcs = element =>
    walk(element)
      .map(node => node.props?.src)
      .filter(src => typeof src === 'string' && src.startsWith('data:image/jpeg'));
  const texts = element =>
    walk(element)
      .flatMap(node => [node.props?.children].flat())
      .filter(child => typeof child === 'string' || typeof child === 'number')
      .join('|');

  test('without a layout: two pages, as before', () => {
    const pages = pagesOf(YachtPDF(pdfProps()));

    assert.equal(pages.length, 2);
    assert.match(texts(pages[0]), /Page 1 \/ \|2/u);
  });

  test('with a layout: a third page holds only the layout, the photo grid stays photos', () => {
    const pages = pagesOf(YachtPDF(pdfProps(['data:image/jpeg;base64,layout-1'])));

    assert.equal(pages.length, 3);
    assert.match(texts(pages[0]), /Page 1 \/ \|3/u);
    assert.deepEqual(imageSrcs(pages[1]), ['data:image/jpeg;base64,photo-1', 'data:image/jpeg;base64,photo-2']);
    assert.deepEqual(imageSrcs(pages[2]), ['data:image/jpeg;base64,layout-1']);
    assert.match(texts(pages[2]), /LAYOUT/u);
    assert.match(texts(pages[2]), /Page 3 \/ 3/u);
  });

  test('two layouts share the page, each whole (contain)', () => {
    const pages = pagesOf(YachtPDF(pdfProps(['data:image/jpeg;base64,layout-1', 'data:image/jpeg;base64,layout-2'])));
    const layoutImages = walk(pages[2]).filter(node => node.props?.src?.startsWith?.('data:image/jpeg'));

    assert.equal(layoutImages.length, 2);
    layoutImages.forEach(node => {
      const style = Object.assign({}, ...[node.props.style].flat());

      assert.equal(style.objectFit, 'contain');
      assert.equal(style.height, (640 - 12) / 2);
    });
  });

  test('the brochure hook fetches the layouts apart and never fails on one', () => {
    const hook = readSrc('src/utils/hooks/useYachtPdfDownload.tsx');

    assert.match(hook, /Promise\.allSettled\(\s*\(layoutImages \?\? \[\]\)/u);
    assert.match(hook, /layoutSrcs=\{layoutSrcs\}/u);
  });
});
