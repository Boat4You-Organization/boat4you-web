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
 *   - the PDF: the layout on a page of its own, never in the photo grid;
 *   - the kinds (YachtImageDto.kind, backend 16.10.2026): PARTNER (or none),
 *     LAYOUT, MODEL_SAMPLE (another boat of the same model, for a boat without
 *     a photo), MARINA (the departure marina, with caption, credit and
 *     source). The hero, og:image, the Product image, the share card, the
 *     favourite and the booking picture are the boat's own photo, else its
 *     model's — never a layout or a marina photo; the gallery shows the boat's
 *     photos, the model's, the marina's last (caption · credit linked to the
 *     source); a model photo's alt names the model only, a marina photo's the
 *     marina; the PDF and its "all N photos" leave the marina out.
 *
 *   yarn test:layout
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { NextIntlClientProvider } from 'next-intl';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import './tsLoader.mjs';

// next/image and next/dynamic are CommonJS (their default export does not
// survive an ESM import outside Next): stand-ins render a plain <img> and
// nothing (the lightboxes mount on the first click, never on the server).
// `next/navigation` and `dayjs/locale/de` (the booking hero) are extensionless
// deep imports of packages without an `exports` map.
registerHooks({
  resolve: (specifier, context, nextResolve) => {
    if (specifier === 'next/image') {
      return { url: new URL('./stubs/next-image.mjs', import.meta.url).href, shortCircuit: true };
    }

    if (specifier === 'next/dynamic') {
      return { url: new URL('./stubs/next-dynamic.mjs', import.meta.url).href, shortCircuit: true };
    }

    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (error?.code === 'ERR_MODULE_NOT_FOUND' && /^(?:next|dayjs)\//u.test(specifier)) {
        return nextResolve(`${specifier}.js`, context);
      }

      throw error;
    }
  },
});

// The image origin is read at import (imageUtils.ts).
process.env.NEXT_PUBLIC_IMAGE_CDN_URL = 'https://boat4you.b-cdn.net';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const readJson = path => JSON.parse(readFileSync(`${ROOT}${path}`, 'utf8'));
const readSrc = path => readFileSync(`${ROOT}${path}`, 'utf8');
const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr'];

const {
  countGalleryPhotos,
  heroImage,
  imageKind,
  isLayoutImage,
  isMarinaImage,
  isModelSampleImage,
  marinaCaption,
  sortGalleryImages,
  splitLayoutImages,
  withLayoutImagesApart,
  withoutMainImage,
} = await import('@/utils/static/yachtLayout');
const { yachtModelPhotoName } = await import('@/utils/static/yachtPhotoName');
const { default: LayoutSection } = await import('@/views/Boat/BoatContentSection/LayoutSection');
const { default: Gallery } = await import('@/components/Gallery');
const { default: PhotoCredit } = await import('@/components/Gallery/PhotoCredit');
const { default: YachtPDF } = await import('@/components/YachtPDF/YachtPDF');
const { default: BookingHero } = await import('@/views/Booking/BookingHero');

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

  test('only layouts: the gallery keeps showing them (no photo to show), none main, no block (owner 13.10.2026)', () => {
    const images = [
      { id: 20, position: 1, mainImage: false, layout: true },
      { id: 21, position: 0, mainImage: true, type: 'layout' },
    ];
    const snapshot = structuredClone(images);
    const { photos, layouts } = splitLayoutImages(images);

    // The same drawings, in the same order; the main flag goes (a layout is
    // never the share card, the favourite or the og:image — heroImage is none).
    assert.deepEqual(
      photos.map(i => [i.id, i.mainImage]),
      [
        [20, false],
        [21, false],
      ]
    );
    assert.equal(photos[0], images[0]);
    assert.deepEqual(images, snapshot);
    assert.deepEqual(
      layouts.map(i => i.id),
      [21, 20]
    );
    assert.equal(heroImage(photos), undefined);

    const boat = yacht(images);
    const apart = withLayoutImagesApart(boat);

    assert.deepEqual(
      apart.yacht.yachtImages.map(i => i.id),
      [20, 21]
    );
    // The gallery already shows the drawing; a block would repeat the boat's
    // only image (owner 13.10.2026, Lagoon 43 FIND US II).
    assert.equal(apart.layoutImages.length, 0);

    // Without a main flag to drop: the yacht exactly as it came.
    const plain = yacht([{ id: 22, position: 0, mainImage: false, layout: true }]);

    assert.equal(withLayoutImagesApart(plain).yacht, plain);
    assert.equal(withLayoutImagesApart(plain).layoutImages.length, 0);
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

  test('the lightbox opens the drawing clicked: its order is the block order, even with a main layout', () => {
    // The lightbox's own order (Lightbox.tsx): the main image first, then by position.
    const lightboxOrder = images =>
      [...images]
        .sort((a, b) => (a.mainImage !== b.mainImage ? (a.mainImage ? -1 : 1) : a.position - b.position))
        .map(i => i.id);
    const blockOrder = images =>
      srcIds(render(createElement(LayoutSection, { images, photoName: 'Lagoon 55 The Moon' })));

    // Every position 0 like boat 12663; the second layout is the main image.
    const mixed = splitLayoutImages([
      { id: 1, position: 0, mainImage: false },
      { id: 2, position: 0, mainImage: false, layout: true },
      { id: 3, position: 0, mainImage: true, layout: true },
      { id: 4, position: 0, mainImage: false },
    ]).layouts;
    // Only layouts, the later one by position is the main image.
    const only = splitLayoutImages([
      { id: 5, position: 0, mainImage: false, layout: true },
      { id: 6, position: 1, mainImage: true, layout: true },
    ]).layouts;

    [
      [mixed, [2, 3]],
      [only, [5, 6]],
    ].forEach(([layouts, ids]) => {
      assert.deepEqual(blockOrder(layouts), ids);
      // Handed over as they are, the lightbox would open the other drawing.
      assert.notDeepEqual(lightboxOrder(layouts), ids);
      assert.deepEqual(lightboxOrder(withoutMainImage(layouts)), ids);
    });

    // The API objects stay as they were; a list without a main layout is passed through.
    assert.equal(only[1].mainImage, true);

    const plain = mixed.slice(0, 1);

    assert.equal(withoutMainImage(plain), plain);

    const section = readSrc('src/views/Boat/BoatContentSection/LayoutSection/LayoutSection.tsx');

    assert.match(section, /const lightboxImages = useMemo\(\(\) => withoutMainImage\(images\), \[images\]\);/u);
    assert.match(section, /<Lightbox[\s\S]*?images=\{lightboxImages\}/u);
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
    // og:image and the Product image: the boat's hero photo (never a layout or a marina photo).
    assert.match(page, /const imageId = heroImage\(yacht\.yachtImages\)\?\.id;/u);
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

// The gallery's extra pictures (backend 16.10.2026): photos of another boat of
// the same model (MODEL_SAMPLE, positions 1000+, the first main when the boat
// has no photo of its own) and of the departure marina (MARINA, 2000+, never
// main, with caption, credit and source page).
const MARINA_URL = 'https://www.aci-marinas.com/en/marina/aci-marina-split/';
const own = (id, position, mainImage = false) => ({ id, url: null, position, mainImage });
const model = (id, position, mainImage = false) => ({ id, url: null, position, mainImage, kind: 'MODEL_SAMPLE' });
const layoutImage = (id, position, mainImage = false) => ({ id, url: null, position, mainImage, layout: true });
const marina = (id, position, extra = {}) => ({
  id,
  url: null,
  position,
  mainImage: false,
  kind: 'MARINA',
  caption: 'ACI Marina Split',
  credit: 'Foto: ACI Marina Split',
  sourceUrl: MARINA_URL,
  ...extra,
});
const ids = images => images.map(i => i.id);
// May the picture stand for the boat (hero, og:image, share card, favourite, booking)?
const canBeHero = image => heroImage([{ id: 1, url: null, position: 0, mainImage: false, ...image }]) !== undefined;

describe('image kinds: imageKind and its predicates', () => {
  test('no kind, PARTNER or an unknown kind is the boat’s own photo', () => {
    [{}, { kind: null }, { kind: 'PARTNER' }, { kind: 'partner' }, { kind: 'EXTERIOR' }, { type: 'PHOTO' }].forEach(
      image => {
        assert.equal(imageKind(image), 'PARTNER', JSON.stringify(image));
        assert.equal(canBeHero(image), true, JSON.stringify(image));
      }
    );
  });

  test('MODEL_SAMPLE and MARINA in any case, under `kind` or `type`', () => {
    ['MODEL_SAMPLE', 'model_sample', ' Model_Sample '].forEach(tag => {
      assert.equal(imageKind({ kind: tag }), 'MODEL_SAMPLE', tag);
      assert.equal(imageKind({ type: tag }), 'MODEL_SAMPLE', tag);
      assert.equal(isModelSampleImage({ kind: tag }), true, tag);
      assert.equal(canBeHero({ kind: tag }), true, tag);
    });
    ['MARINA', 'marina', ' Marina '].forEach(tag => {
      assert.equal(imageKind({ kind: tag }), 'MARINA', tag);
      assert.equal(imageKind({ type: tag }), 'MARINA', tag);
      assert.equal(isMarinaImage({ kind: tag }), true, tag);
      assert.equal(canBeHero({ kind: tag }), false, tag);
    });
    ['MODEL', 'MARINAS', 'MODEL SAMPLE'].forEach(tag => assert.equal(imageKind({ kind: tag }), 'PARTNER', tag));
  });

  test('a layout is a layout whatever else it says; null is nothing', () => {
    assert.equal(imageKind({ layout: true }), 'LAYOUT');
    assert.equal(imageKind({ kind: 'LAYOUT' }), 'LAYOUT');
    assert.equal(imageKind({ layout: true, kind: 'MARINA' }), 'LAYOUT');
    assert.equal(canBeHero({ layout: true }), false);
    [null, undefined].forEach(image => {
      assert.equal(isMarinaImage(image), false);
      assert.equal(isModelSampleImage(image), false);
    });
  });
});

describe('image kinds: the gallery order and the hero', () => {
  test('without kinds: the order the gallery has always had (main first, then position, ties as sent)', () => {
    const images = [own(1, 2), own(2, 0), own(3, 1, true), own(4, 0), own(5, 2)];
    const legacy = [...images].sort((a, b) =>
      a.mainImage !== b.mainImage ? (a.mainImage ? -1 : 1) : a.position - b.position
    );

    assert.deepEqual(ids(sortGalleryImages(images)), ids(legacy));
    assert.deepEqual(ids(sortGalleryImages(images)), [3, 2, 4, 1, 5]);
    // A copy: the list is not changed.
    assert.notEqual(sortGalleryImages(images), images);
    assert.deepEqual(ids(images), [1, 2, 3, 4, 5]);
    assert.deepEqual(sortGalleryImages(null), []);
    assert.deepEqual(sortGalleryImages(undefined), []);
  });

  test('the boat’s photos (main first, then position), the model’s, the marina’s last — whatever the array order', () => {
    const images = [marina(30, 2000), own(10, 2), model(20, 1000), own(11, 0), marina(31, 2001), own(12, 1, true)];

    assert.deepEqual(ids(sortGalleryImages(images)), [12, 11, 10, 20, 30, 31]);
    // The input is not reordered.
    assert.deepEqual(ids(images), [30, 10, 20, 11, 31, 12]);
  });

  test('a marina photo never leads: no hero, and the gallery and lightbox show none when it would', () => {
    // The helper sorts them (the same code on all seven sites); the boat's picture is none.
    assert.deepEqual(ids(sortGalleryImages([marina(31, 2001), marina(30, 2000)])), [30, 31]);
    assert.equal(heroImage([marina(31, 2001), marina(30, 2000)]), undefined);
    // A boat with only its layout keeps it first (as today), the marina after it.
    assert.deepEqual(ids(sortGalleryImages([marina(30, 2000), layoutImage(40, 5, true)])), [40, 30]);
    // A layout ranks with the boat's own photos, main first then position (My
    // bookings gets the images with their layouts, as before the kinds).
    assert.deepEqual(
      ids(sortGalleryImages([model(20, 1000), layoutImage(40, 1), own(10, 2), own(11, 0)])),
      [11, 40, 10, 20]
    );

    ['src/components/Gallery/Gallery.tsx', 'src/components/Gallery/Lightbox/Lightbox.tsx'].forEach(path => {
      const src = readSrc(path);

      assert.match(src, /const sorted = sortGalleryImages\(images \|\| yacht\?\.yachtImages\);/u, path);
      assert.match(src, /sorted\[0\] && isMarinaImage\(sorted\[0\]\) \? \[\] : sorted/u, path);
    });
  });

  test('the hero: the boat’s own photo (main first, then the lowest position), else its model’s', () => {
    assert.equal(heroImage([own(1, 0), own(2, 1, true), marina(3, 2000)])?.id, 2);
    assert.equal(heroImage([own(1, 3), own(2, 1), own(4, 1)])?.id, 2);
    assert.equal(heroImage([marina(3, 2000), model(5, 1001), model(6, 1000, true), layoutImage(7, 0, true)])?.id, 6);
    // A model photo marked main never beats the boat's own photo.
    assert.equal(heroImage([model(6, 1000, true), own(1, 4)])?.id, 1);
  });

  test('never a layout or a marina photo — even one marked main; none when the boat has no photo', () => {
    assert.equal(heroImage([layoutImage(7, 0, true), marina(3, 2000, { mainImage: true })]), undefined);
    assert.equal(heroImage([marina(3, 2000, { mainImage: true })]), undefined);
    assert.equal(heroImage([]), undefined);
    assert.equal(heroImage(null), undefined);
  });
});

describe('image kinds: splitLayoutImages / withLayoutImagesApart', () => {
  test('a boat without a photo of its own: model photos lead, the layout goes to its block, the marina last', () => {
    const images = [layoutImage(40, 0), model(20, 1000, true), model(21, 1001), marina(30, 2000)];
    const { photos, layouts } = splitLayoutImages(images);

    assert.deepEqual(ids(photos), [20, 21, 30]);
    assert.deepEqual(ids(layouts), [40]);
    assert.ok(photos.every(p => images.includes(p)));

    const apart = withLayoutImagesApart(yacht(images));

    assert.deepEqual(ids(apart.yacht.yachtImages), [20, 21, 30]);
    assert.deepEqual(ids(apart.layoutImages), [40]);
    assert.equal(heroImage(apart.yacht.yachtImages)?.id, 20);
  });

  test('the main image is a layout: "main" goes to the boat’s photo, never to a marina photo', () => {
    const images = [marina(30, 2000), layoutImage(40, 0, true), own(10, 3), own(11, 1)];
    const snapshot = structuredClone(images);
    const { photos } = splitLayoutImages(images);

    assert.deepEqual(
      photos.map(i => [i.id, i.mainImage]),
      [
        [30, false],
        [10, false],
        [11, true],
      ]
    );
    assert.deepEqual(images, snapshot);
  });

  test('a marina photo marked main (it never should be): "main" moves to the boat’s photo', () => {
    const images = [own(10, 0), marina(30, 2000, { mainImage: true })];
    const snapshot = structuredClone(images);
    const { photos, layouts } = splitLayoutImages(images);

    assert.deepEqual(
      photos.map(i => [i.id, i.mainImage]),
      [
        [10, true],
        [30, false],
      ]
    );
    assert.deepEqual(layouts, []);
    assert.deepEqual(images, snapshot);
    assert.deepEqual(
      withLayoutImagesApart(yacht(images)).yacht.yachtImages.map(i => i.mainImage),
      [true, false]
    );
  });

  test('photos and model or marina photos without a layout: the list as it came', () => {
    const images = [own(10, 0, true), own(11, 1), marina(30, 2000)];
    const boat = yacht(images);

    assert.equal(splitLayoutImages(images).photos, images);
    assert.equal(withLayoutImagesApart(boat).yacht, boat);
    assert.deepEqual(withLayoutImagesApart(boat).layoutImages, []);
  });

  test('only a layout and marina photos: the layout stays in the gallery (first), not main, no block, no hero', () => {
    const images = [marina(30, 2000), layoutImage(40, 0, true)];
    const snapshot = structuredClone(images);
    const boat = yacht(images);
    const apart = withLayoutImagesApart(boat);

    // The main layout loses the flag on a copy (nothing stands for the boat).
    assert.notEqual(apart.yacht, boat);
    assert.deepEqual(images, snapshot);
    assert.deepEqual(apart.layoutImages, []);
    assert.deepEqual(
      sortGalleryImages(apart.yacht.yachtImages).map(i => [i.id, i.mainImage]),
      [
        [40, false],
        [30, false],
      ]
    );
    assert.equal(heroImage(apart.yacht.yachtImages), undefined);
  });

  test('no main image at all: the hero becomes main on a copy; no image list comes back as it is', () => {
    const images = [own(10, 2), own(11, 1), marina(30, 2000)];
    const { photos } = splitLayoutImages(images);

    assert.deepEqual(
      photos.map(i => [i.id, i.mainImage]),
      [
        [10, false],
        [11, true],
        [30, false],
      ]
    );
    assert.ok(images.every(i => !i.mainImage));

    const empty = yacht(null);

    assert.equal(withLayoutImagesApart(empty).yacht, empty);
    assert.deepEqual(withLayoutImagesApart(empty).layoutImages, []);
  });
});

describe('image kinds: the marina photo’s credit', () => {
  test('caption, credit, and the source page as the link', () => {
    assert.deepEqual(marinaCaption(marina(30, 2000)), {
      caption: 'ACI Marina Split',
      credit: 'Foto: ACI Marina Split',
      href: MARINA_URL,
    });
    assert.deepEqual(
      marinaCaption(marina(30, 2000, { caption: '  Marina Kaštela ', credit: ' Foto: Marina Kaštela ' })),
      {
        caption: 'Marina Kaštela',
        credit: 'Foto: Marina Kaštela',
        href: MARINA_URL,
      }
    );
  });

  test('a link only to an http(s) page, and only on a credit', () => {
    ['javascript:alert(1)', 'data:text/html,x', 'ftp://example.com/a.jpg', 'not a url', '', '   ', null].forEach(
      sourceUrl => assert.equal(marinaCaption(marina(30, 2000, { sourceUrl }))?.href, null, String(sourceUrl))
    );
    assert.equal(
      marinaCaption(marina(30, 2000, { sourceUrl: 'http://marina.example/' }))?.href,
      'http://marina.example/'
    );
    assert.deepEqual(marinaCaption(marina(30, 2000, { credit: null })), {
      caption: 'ACI Marina Split',
      credit: '',
      href: null,
    });
  });

  test('nothing for any other picture, or a marina photo with neither text', () => {
    assert.equal(marinaCaption(own(10, 0)), null);
    assert.equal(marinaCaption({ ...own(10, 0), caption: 'X', credit: 'Y', sourceUrl: MARINA_URL }), null);
    assert.equal(marinaCaption(model(20, 1000)), null);
    assert.equal(marinaCaption(marina(30, 2000, { caption: ' ', credit: null })), null);
    assert.equal(marinaCaption(null), null);
  });

  test('the caption line: "caption · credit", the credit linked (nofollow noopener, new tab)', () => {
    ['tile', 'lightbox'].forEach(placement => {
      const html = render(createElement(PhotoCredit, { credit: marinaCaption(marina(30, 2000)), placement }));

      assert.match(html, /^<span[^>]*>ACI Marina Split · <a [^>]*>Foto: ACI Marina Split<\/a><\/span>$/u, placement);
      assert.match(html, new RegExp(`href="${MARINA_URL}"`, 'u'));
      assert.match(html, /target="_blank"/u);
      assert.match(html, /rel="nofollow noopener"/u);
    });

    const plain = render(
      createElement(PhotoCredit, {
        credit: marinaCaption(marina(30, 2000, { sourceUrl: null })),
        placement: 'tile',
      })
    );

    assert.match(plain, /^<span[^>]*>ACI Marina Split · Foto: ACI Marina Split<\/span>$/u);
  });
});

describe('image kinds: the gallery', () => {
  const tiles = html =>
    imgTags(html).map(tag => [Number(/\/public\/image\/(\d+)/.exec(tag)?.[1]), /alt="([^"]*)"/.exec(tag)?.[1]]);

  test('the boat’s photos, then the marina’s with the marina as alt text and its credit on the tile', () => {
    const images = [marina(31, 2001), own(10, 1), marina(30, 2000), own(11, 0, true)];
    const html = render(createElement(Gallery, { yacht: withLayoutImagesApart(yacht(images)).yacht }));

    assert.deepEqual(tiles(html), [
      [11, 'Lagoon 55 The Moon - First Class — photo 1'],
      [10, 'Lagoon 55 The Moon - First Class — photo 2'],
      [30, 'ACI Marina Split'],
      [31, 'ACI Marina Split'],
    ]);
    // One caption line per marina tile, none on the boat's photos.
    assert.equal(html.match(/ACI Marina Split · <a /gu)?.length, 2);
    assert.equal(html.match(/rel="nofollow noopener"/gu)?.length, 2);
  });

  test('model photos name the model only, never the boat', () => {
    const images = [layoutImage(40, 0), model(20, 1000, true), model(21, 1001), marina(30, 2000)];
    const html = render(createElement(Gallery, { yacht: withLayoutImagesApart(yacht(images)).yacht }));

    assert.deepEqual(tiles(html), [
      [20, 'Lagoon 55 — photo 1'],
      [21, 'Lagoon 55 — photo 2'],
      [30, 'ACI Marina Split'],
    ]);
    assert.doesNotMatch(html, /The Moon/u);

    LOCALES.forEach(locale => {
      const localized = render(createElement(Gallery, { yacht: withLayoutImagesApart(yacht(images)).yacht }), locale);
      const template = readJson(`messages/${locale}/common.json`).photoAlt;

      assert.equal(tiles(localized)[0][1], template.replace('{label}', 'Lagoon 55').replace('{n}', '1'), locale);
    });
  });

  test('My bookings (images only): a model photo names the model passed in, not "Yacht"', () => {
    const images = [model(20, 1000, true), model(21, 1001)];
    const html = render(
      createElement(Gallery, {
        images,
        photoName: 'Lagoon 55 The Moon',
        modelPhotoName: 'Lagoon 55',
        maxDisplayedImages: 3,
      })
    );

    assert.deepEqual(tiles(html), [
      [20, 'Lagoon 55 — photo 1'],
      [21, 'Lagoon 55 — photo 2'],
    ]);
    assert.doesNotMatch(html, /The Moon|Yacht/u);

    const section = readSrc(
      'src/views/MyBookings/ReservationDetails/ReservationContent/ReservationHeroSection/ReservationHeroSection.tsx'
    );

    assert.match(section, /<Gallery[\s\S]*?modelPhotoName=\{modelName\}/u);
  });

  test('a marina photo without a caption: its credit as the alt text, never an empty alt', () => {
    const html = render(
      createElement(Gallery, {
        yacht: yacht([
          own(10, 0, true),
          marina(30, 2000, { caption: null }),
          marina(31, 2001, { caption: ' ', credit: null }),
        ]),
      })
    );

    assert.deepEqual(tiles(html).slice(1), [
      [30, 'Foto: ACI Marina Split'],
      [31, ''],
    ]);
  });

  test('nothing but marina photos: no tile (no marina photo as the boat’s picture)', () => {
    const html = render(
      createElement(Gallery, { yacht: withLayoutImagesApart(yacht([marina(30, 2000), marina(31, 2001)])).yacht })
    );

    assert.deepEqual(imgTags(html), []);
  });

  test('the model name for the alt text: manufacturer and model, never the boat’s name', () => {
    assert.equal(
      yachtModelPhotoName({ manufacturerName: 'Lagoon', modelName: 'Lagoon 55', name: 'The Moon' }),
      'Lagoon 55'
    );
    assert.equal(
      yachtModelPhotoName({ manufacturerName: 'Fountaine Pajot', modelName: 'Elba 45', name: 'KARINA' }),
      'Fountaine Pajot Elba 45'
    );
    assert.equal(yachtModelPhotoName({ manufacturerName: 'Bavaria', modelName: ' ', name: 'Anna' }), '');
    assert.equal(yachtModelPhotoName(undefined), '');
  });

  test('the lightbox: the gallery’s order, the same alt texts, the caption line on a marina photo', () => {
    const lightbox = readSrc('src/components/Gallery/Lightbox/Lightbox.tsx');

    assert.match(lightbox, /sortGalleryImages\(images \|\| yacht\?\.yachtImages\)/u);
    assert.match(lightbox, /galleryPhotoAlt\(image, index, \{ boat: photoName, model: modelPhotoName \}/u);
    assert.match(lightbox, /\{credit && <PhotoCredit credit=\{credit\} placement="lightbox" \/>\}/u);
    // A marina photo sits on the slide's bottom edge, under its caption line.
    assert.match(lightbox, /className=\{cx\(styles\.image, \{ \[styles\.imageBottom\]: Boolean\(credit\) \}\)\}/u);
    assert.match(
      readSrc('src/components/Gallery/Lightbox/Lightbox.module.scss'),
      /\.imageBottom \{\s*object-position: center bottom;\s*\}/u
    );
    // The favourite in the lightbox: the hero, never a layout or a marina photo.
    assert.match(lightbox, /mainImageId: heroImage\(yachtImages\)\?\.id \|\| 0/u);
    assert.doesNotMatch(lightbox, /\.find\(el => el\.mainImage\)/u);
  });
});

describe('image kinds: share, favourite, inquiry and booking take the hero', () => {
  test('never `mainImage` read straight off the images', () => {
    [
      'src/views/Boat/BoatHeroSection/BoatHeroSection.tsx',
      'src/views/Boat/BoatHeroSection/BoatShareModal/BoatShareModal.tsx',
      'src/views/Boat/BoatContentSection/BoatInquiryModal/BoatInquiryModal.tsx',
      'src/utils/hooks/useReservation.tsx',
      'src/utils/hooks/useYachtPdfDownload.tsx',
    ].forEach(path => {
      const src = readSrc(path);

      assert.match(src, /heroImage\(/u, path);
      assert.doesNotMatch(src, /yachtImages\.(find|filter)\([^)]*mainImage/u, path);
      assert.doesNotMatch(src, /yachtImages\[0\]/u, path);
    });
  });

  const bookingHero = images => {
    const messages = Object.fromEntries(
      readdirSync(`${ROOT}messages/en`)
        .filter(file => file.endsWith('.json'))
        .map(file => [file.replace(/\.json$/u, ''), readJson(`messages/en/${file}`)])
    );

    return renderToStaticMarkup(
      createElement(
        NextIntlClientProvider,
        { locale: 'en', messages, timeZone: 'UTC' },
        createElement(BookingHero, {
          reservationData: {
            name: 'The Moon',
            model: 'Lagoon 55',
            locationFrom: { id: '', name: '', countryCode: 'HR' },
            mainImage: heroImage(images),
            yachtImages: images,
            charterType: [],
            dateTo: '',
          },
        })
      )
    );
  };
  const alts = html =>
    imgTags(html).map(tag => [Number(/\/public\/image\/(\d+)/.exec(tag)?.[1]), /alt="([^"]*)"/.exec(tag)?.[1]]);

  test('the booking hero: the main photo, thumbnails without a layout or a marina photo', () => {
    const images = [own(10, 0, true), marina(30, 2000), own(11, 1), layoutImage(40, 2), model(20, 1000)];

    assert.deepEqual(srcIds(bookingHero(images)), [10, 11, 20]);
  });

  test('the booking hero: a model photo names the model only, never the boat', () => {
    // The boat's own photos with a model photo in the strip.
    assert.deepEqual(alts(bookingHero([own(10, 0, true), model(20, 1000)])), [
      [10, 'Lagoon 55 The Moon'],
      [20, 'Lagoon 55'],
    ]);

    // No photo of its own: the main picture and the strip are the model's.
    const html = bookingHero([model(20, 1000, true), model(21, 1001), marina(30, 2000)]);

    assert.deepEqual(alts(html), [
      [20, 'Lagoon 55'],
      [21, 'Lagoon 55'],
    ]);
    // The boat's name stays in its title, never on a picture of another boat.
    assert.ok(imgTags(html).every(tag => !tag.includes('The Moon')));
  });

  test('the share card: a model photo names the model only', () => {
    const share = readSrc('src/views/Boat/BoatHeroSection/BoatShareModal/BoatShareModal.tsx');

    assert.match(
      share,
      /label: isModelSampleImage\(mainImage\)\s*\? yacht\.model\s*: yachtLabel\(yacht\.model, toTitleCase\(yacht\.name\), ' '\)/u
    );
  });
});

describe('image kinds: the PDF brochure leaves the marina out', () => {
  const pdfYacht = yachtImages => ({
    ...yacht(yachtImages),
    amenities: [],
    offers: [],
    location: { name: 'Split', countryCode: 'HR' },
  });
  const texts = element => {
    const out = [];
    const walk = node => {
      if (!node || typeof node !== 'object') return;

      [node.props?.children].flat(Infinity).forEach(child => {
        if (typeof child === 'string' || typeof child === 'number') out.push(child);
        else walk(child);
      });
    };

    walk(element);

    return out.join('');
  };

  test('"all N photos" counts the boat’s and the model’s photos, not the marina’s', () => {
    const doc = YachtPDF({
      yacht: pdfYacht([own(10, 0, true), own(11, 1), model(20, 1000), marina(30, 2000), marina(31, 2001)]),
      offer: null,
      pageUrl: 'https://www.boat4you.com/boat/lagoon-55-the-moon-first-class-12663',
      heroSrc: 'data:image/jpeg;base64,hero',
      gallerySrcs: [],
      qrDataUrl: 'data:image/png;base64,qr',
      baseUrl: 'https://www.boat4you.com',
      generatedDate: '16 October 2026',
      locale: 'en',
      capacityFmt: () => '',
      amenityLabels: {},
    });

    assert.match(texts(doc), /all 3 photos/u);
  });

  test('the hook: the cover is the hero, the grid in gallery order, no marina photo', () => {
    const hook = readSrc('src/utils/hooks/useYachtPdfDownload.tsx');

    assert.match(
      hook,
      /const photos = sortGalleryImages\(yacht\.yachtImages\)\.filter\(image => !isMarinaImage\(image\)\);/u
    );
    assert.match(hook, /const mainImageId = \(heroImage\(photos\) \?\? photos\[0\]\)\?\.id;/u);
    assert.match(hook, /const galleryIds = photos\s*\.filter\(i => i\.id !== mainImageId\)\s*\.slice\(0, 4\)/u);
    assert.equal(countGalleryPhotos([own(10, 0), marina(30, 2000), model(20, 1000), layoutImage(40, 1)]), 3);
    assert.equal(countGalleryPhotos(null), 0);
    assert.match(
      readSrc('src/components/YachtPDF/YachtPDF.tsx'),
      /all \{countGalleryPhotos\(yacht\.yachtImages\)\} photos/u
    );
  });
});
