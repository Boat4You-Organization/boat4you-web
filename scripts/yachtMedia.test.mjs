/**
 * Our own media on any boat (owner 17.10.2026, gulet Allure 11769: "ubaci i
 * crew profile na allure tako da ga imamo na svim stranicama"). The detail
 * payload gains `videoUrl` (the admin's YouTube or Vimeo link, else the
 * custom boat's customDetails.videoUrl) and `crewProfileUrl` (the crew-profile
 * PDF on the API, else null); our own photos come as `kind` PARTNER, so the
 * gallery needs nothing new.
 *
 *   - the video: a Video tab right before FAQ on a partner boat that has one
 *     (none without); YouTube through youtube-nocookie.com as before, Vimeo
 *     through Vimeo's player without tracking, lazy, 16:9, named
 *     "<boat> — Video" in the page's language;
 *   - the crew profile: "Crew profile (PDF)" next to the brochure PDF in the
 *     title row, a crew icon among the photo's round actions on a phone,
 *     opened in a new tab; nothing without one, nor for a link that is not
 *     https;
 *   - no VideoObject JSON-LD: Google needs an uploadDate the payload does not
 *     carry (an item without it is invalid in Search Console).
 *
 * scripts/fixtures/allure-11769-2026-10-17.json is the boat's detail payload
 * of that day, before the backend sends the two fields (offers and services
 * left out).
 *
 *   yarn test:media
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { ThemeProvider } from '@mui/material/styles';
import { NextIntlClientProvider } from 'next-intl';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import './tsLoader.mjs';

// next/image and next/dynamic are CommonJS (their default export does not
// survive an ESM import outside Next), no app router is mounted outside Next,
// and the FAQ's server actions are never called by a server render.
registerHooks({
  resolve: (specifier, context, nextResolve) => {
    if (specifier === 'next/image') {
      return { url: new URL('./stubs/next-image.mjs', import.meta.url).href, shortCircuit: true };
    }

    if (specifier === 'next/dynamic') {
      return { url: new URL('./stubs/next-dynamic.mjs', import.meta.url).href, shortCircuit: true };
    }

    if (specifier === 'next/navigation') {
      return { url: new URL('./stubs/next-navigation.mjs', import.meta.url).href, shortCircuit: true };
    }

    if (specifier === 'server-only') return { url: 'data:text/javascript,export {};', shortCircuit: true };

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
const allMessages = locale =>
  Object.fromEntries(
    readdirSync(`${ROOT}messages/${locale}`)
      .filter(file => file.endsWith('.json'))
      .map(file => [file.slice(0, -'.json'.length), readJson(`messages/${locale}/${file}`)])
  );

const { default: theme } = await import('@/styles/themes');
const { singleBoatTabs, singleBoatTabsFor, singleBoatVideoTabs, singleCustomBoatTabs } =
  await import('@/config/tabs.config');
const { default: getYouTubeEmbedUrl } = await import('@/utils/static/getYoutubeEmbedUrlUtils');
const { withoutPartnerIds } = await import('@/utils/static/partnerIds');
const { withLayoutImagesApart } = await import('@/utils/static/yachtLayout');
const { crewProfileHref, getVideoEmbedUrl, yachtVideoUrl } = await import('@/utils/static/yachtMedia');
const { default: VideoTab } = await import('@/views/Boat/BoatContentSection/VideoTab/VideoTab');
const { default: BoatContentSection } = await import('@/views/Boat/BoatContentSection/BoatContentSection');
const { default: BoatHeroSection } = await import('@/views/Boat/BoatHeroSection/BoatHeroSection');

const render = (element, locale = 'en') =>
  renderToStaticMarkup(
    createElement(
      ThemeProvider,
      { theme },
      createElement(NextIntlClientProvider, { locale, messages: allMessages(locale), timeZone: 'UTC' }, element)
    )
  );

const VIMEO = 'https://vimeo.com/982130882';
const VIMEO_PLAYER = 'https://player.vimeo.com/video/982130882?dnt=1&title=0&byline=0&portrait=0';
const CREW_PDF = 'https://api.boat4you.com/public/yachts/11769/crew-profile.pdf';
const YOUTUBE = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const YOUTUBE_PLAYER = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1';

// Gulet Allure as the API sends it today, and with the two new fields.
const { yacht: allureToday } = readJson('scripts/fixtures/allure-11769-2026-10-17.json');
const allure = { ...allureToday, videoUrl: VIMEO, crewProfileUrl: CREW_PDF };
const allureWithout = { ...allureToday, videoUrl: null, crewProfileUrl: null };
// A custom boat with the YouTube showreel the admin pasted (before 17.10.2026).
const idila = {
  id: 9001,
  slug: 'beneteau-oceanis-35-1-idila-9001',
  name: 'IDILA ',
  manufacturerName: 'Beneteau',
  modelName: 'Oceanis 35.1',
  model: 'Oceanis 35.1',
  custom: true,
  customDetails: { videoUrl: YOUTUBE },
};

const LABELS = {
  en: 'Crew profile (PDF)',
  hr: 'Profil posade (PDF)',
  de: 'Crew-Profil (PDF)',
  fr: "Profil de l'équipage (PDF)",
  it: "Profilo dell'equipaggio (PDF)",
  es: 'Perfil de la tripulación (PDF)',
  pt: 'Perfil da tripulação (PDF)',
  nl: 'Bemanningsprofiel (PDF)',
  pl: 'Profil załogi (PDF)',
};
const escapeHtml = text => text.replace(/&/gu, '&amp;').replace(/'/gu, '&#x27;');
const iframes = html => html.match(/<iframe [^>]*>/gu) ?? [];
const attr = (tag, name) => new RegExp(`\\s${name}="([^"]*)"`, 'u').exec(tag)?.[1];
const crewLinks = html => html.match(/<a [^>]*crew-profile\.pdf[^>]*>[\s\S]*?<\/a>/gu) ?? [];
const tabLabels = html => [...html.matchAll(/<button[^>]*role="tab"[^>]*>([^<]*)</gu)].map(m => m[1]);
// The two icons' first path (SvgIcons/Download.tsx, SvgIcons/Crew.tsx).
const DOWNLOAD_ICON = 'd="M12 3a1 1 0 0 1 1 1v9.586';
const CREW_ICON = 'd="M11.299 1.287a1 1 0 0 1 1.402 0';

describe('yachtVideoUrl / getVideoEmbedUrl', () => {
  test('our own video first, else the custom boat’s, else none (blank counts as none)', () => {
    assert.equal(yachtVideoUrl(allure), VIMEO);
    assert.equal(yachtVideoUrl({ videoUrl: VIMEO, customDetails: { videoUrl: YOUTUBE } }), VIMEO);
    assert.equal(yachtVideoUrl({ videoUrl: null, customDetails: { videoUrl: YOUTUBE } }), YOUTUBE);
    assert.equal(yachtVideoUrl({ videoUrl: '  ', customDetails: { videoUrl: YOUTUBE } }), YOUTUBE);
    assert.equal(yachtVideoUrl(allureToday), null);
    assert.equal(yachtVideoUrl(allureWithout), null);
    assert.equal(yachtVideoUrl({ customDetails: { videoUrl: '' } }), null);
    assert.equal(yachtVideoUrl(null), null);
  });

  test('Vimeo: vimeo.com/<id> and player.vimeo.com/video/<id> → the player without tracking, title, byline, portrait', () => {
    [
      VIMEO,
      'https://www.vimeo.com/982130882',
      'https://vimeo.com/982130882?share=copy',
      'https://player.vimeo.com/video/982130882',
      'https://player.vimeo.com/video/982130882?badge=0&autopause=0',
      ` ${VIMEO} `,
    ].forEach(url => assert.equal(getVideoEmbedUrl(url), VIMEO_PLAYER, url));
  });

  test('an unlisted Vimeo video keeps its hash', () => {
    assert.equal(getVideoEmbedUrl('https://vimeo.com/982130882/0a1b2c3d4e'), `${VIMEO_PLAYER}&h=0a1b2c3d4e`);
    assert.equal(
      getVideoEmbedUrl('https://player.vimeo.com/video/982130882?h=0a1b2c3d4e&badge=0'),
      `${VIMEO_PLAYER}&h=0a1b2c3d4e`
    );
  });

  test('YouTube exactly as before (youtube-nocookie.com); anything else untouched as before', () => {
    [YOUTUBE, 'https://youtu.be/dQw4w9WgXcQ', 'https://www.youtube.com/embed/dQw4w9WgXcQ'].forEach(url => {
      assert.equal(getVideoEmbedUrl(url), YOUTUBE_PLAYER, url);
      assert.equal(getVideoEmbedUrl(url), getYouTubeEmbedUrl(url), url);
    });
    ['https://vimeo.com/channels/staffpicks/123', 'https://notvimeo.com/982130882'].forEach(url =>
      assert.equal(getVideoEmbedUrl(url), getYouTubeEmbedUrl(url), url)
    );
  });
});

describe('crewProfileHref', () => {
  test('the API’s https URL, else none', () => {
    assert.equal(crewProfileHref(allure), CREW_PDF);
    assert.equal(crewProfileHref({ crewProfileUrl: ` ${CREW_PDF} ` }), CREW_PDF);
    assert.equal(crewProfileHref(allureToday), null);
    assert.equal(crewProfileHref(allureWithout), null);
    [
      '',
      'data:application/pdf;base64,JVBERi0=',
      'http://api.boat4you.com/x.pdf',
      '/public/yachts/11769/crew-profile.pdf',
    ].forEach(url => assert.equal(crewProfileHref({ crewProfileUrl: url }), null, url));
  });

  test('the fields reach the client components: not partner ids, kept by the layout split', () => {
    const { yacht: client, layoutImages } = withLayoutImagesApart(withoutPartnerIds(allure));

    // Allure's partner layout drawing is taken out, so the yacht is a copy.
    assert.equal(layoutImages.length, 1);
    assert.notEqual(client, allure);
    assert.equal(client.videoUrl, VIMEO);
    assert.equal(client.crewProfileUrl, CREW_PDF);
  });

  test('every locale has the label, without emoji', () => {
    LOCALES.forEach(locale => {
      const label = readJson(`messages/${locale}/common.json`).crewProfilePdf;

      assert.equal(label, LABELS[locale], locale);
      assert.doesNotMatch(label, /[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/u, locale);
    });
  });
});

describe('the boat page’s tabs', () => {
  test('a partner boat with a video: Video right before FAQ; without: as before', () => {
    assert.deepEqual(
      [...singleBoatTabsFor(allure)],
      ['details', 'ammenities', 'availability', 'extras', 'video', 'faq']
    );
    assert.equal(singleBoatTabsFor(allure), singleBoatVideoTabs);
    assert.equal(singleBoatTabsFor(allureToday), singleBoatTabs);
    assert.equal(singleBoatTabsFor(allureWithout), singleBoatTabs);
    assert.equal(singleBoatTabsFor(idila), singleCustomBoatTabs);
    assert.equal(singleBoatTabsFor({ ...idila, customDetails: {} }), singleCustomBoatTabs);
  });

  test('Allure with the video: the tab bar names Video, the section embeds the Vimeo player', () => {
    LOCALES.forEach(locale => {
      const html = render(createElement(BoatContentSection, { yacht: allure, yachtFaq: [] }), locale);
      const common = readJson(`messages/${locale}/common.json`);

      assert.deepEqual(
        tabLabels(html),
        singleBoatVideoTabs.map(tab => escapeHtml(common[tab])),
        locale
      );
      assert.equal(iframes(html).length, 1, locale);
      assert.equal(attr(iframes(html)[0], 'src'), escapeHtml(VIMEO_PLAYER), locale);
      assert.match(html, /id="section-5"/u, locale);
    });
  });

  test('without a video: no Video tab, no player', () => {
    [allureToday, allureWithout].forEach(yacht => {
      const html = render(createElement(BoatContentSection, { yacht, yachtFaq: [] }));

      assert.deepEqual(tabLabels(html), ['Details', 'Amenities', 'Availability', 'Extras', 'FAQ']);
      assert.deepEqual(iframes(html), []);
    });
  });
});

describe('the video block (VideoTab)', () => {
  test('Vimeo: the player, lazy, named "<boat> — Video" in the page’s language', () => {
    LOCALES.forEach(locale => {
      const [iframe, ...more] = iframes(render(createElement(VideoTab, { yacht: allure }), locale));
      const word = readJson(`messages/${locale}/common.json`).video;

      assert.deepEqual(more, [], locale);
      assert.match(attr(iframe, 'src'), /^https:\/\/player\.vimeo\.com\/video\/982130882\?/u, locale);
      assert.equal(attr(iframe, 'src'), escapeHtml(VIMEO_PLAYER), locale);
      assert.equal(attr(iframe, 'loading'), 'lazy', locale);
      assert.equal(attr(iframe, 'title'), `Gulet Allure — ${word}`, locale);
      assert.ok(iframe.includes('allowFullScreen'), locale);
    });
  });

  test('YouTube (a custom boat’s showreel): unchanged', () => {
    const [iframe] = iframes(render(createElement(VideoTab, { yacht: idila }), 'fr'));

    assert.equal(attr(iframe, 'src'), escapeHtml(YOUTUBE_PLAYER));
    assert.equal(attr(iframe, 'title'), 'Beneteau Oceanis 35.1 Idila — Vidéo');
    assert.equal(attr(iframe, 'sandbox'), 'allow-scripts allow-same-origin allow-presentation');
  });

  test('no video: nothing at all', () => {
    assert.equal(render(createElement(VideoTab, { yacht: allureToday })), '');
    assert.equal(render(createElement(VideoTab, { yacht: allureWithout })), '');
    assert.equal(render(createElement(VideoTab, { yacht: { ...idila, customDetails: {} } })), '');
  });

  test('16:9 at every width, no fixed height', () => {
    const scss = readSrc('src/views/Boat/BoatContentSection/VideoTab/VideoTab.module.scss');

    assert.match(scss, /\.videoContainer \{[^}]*aspect-ratio: 16 \/ 9;/u);
    assert.doesNotMatch(scss, /height: rem-calc/u);
  });
});

describe('the crew-profile action (BoatHeroSection)', () => {
  test('Allure: next to the brochure PDF and on the photo, a new tab, in every locale', () => {
    LOCALES.forEach(locale => {
      const html = render(createElement(BoatHeroSection, { yacht: allure }), locale);
      const [desktop, phone, ...more] = crewLinks(html);
      const label = escapeHtml(LABELS[locale]);
      const common = readJson(`messages/${locale}/common.json`);
      const at = text => html.indexOf(`${escapeHtml(text)}</button>`);

      assert.deepEqual(more, [], locale);
      [desktop, phone].forEach(link => {
        assert.equal(attr(link, 'href'), CREW_PDF, locale);
        assert.equal(attr(link, 'target'), '_blank', locale);
        assert.equal(attr(link, 'rel'), 'noopener', locale);
      });
      // The labelled button: the download icon and the label.
      assert.ok(desktop.includes(DOWNLOAD_ICON), locale);
      assert.ok(desktop.includes(`${label}</a>`), `${locale}: ${desktop}`);
      // On the photo: the crew's cap, named for screen readers.
      assert.equal(attr(phone, 'aria-label'), label, locale);
      assert.ok(phone.includes(CREW_ICON), locale);
      // Right after the brochure PDF, before Share.
      assert.ok(at(common.pdfDownload) > -1, locale);
      assert.ok(at(common.pdfDownload) < html.indexOf(desktop), locale);
      assert.ok(html.indexOf(desktop) < at(common.share), locale);
    });
  });

  test('no crew profile (or a link that is not https): no action', () => {
    [allureToday, allureWithout, { ...allure, crewProfileUrl: 'data:application/pdf;base64,JVBERi0=' }].forEach(
      yacht => {
        const html = render(createElement(BoatHeroSection, { yacht }));

        assert.deepEqual(crewLinks(html), []);
        assert.ok(!html.includes('Crew profile'));
        assert.ok(!html.includes(CREW_ICON));
      }
    );
  });
});

describe('no VideoObject JSON-LD', () => {
  test('the boat page’s structured data has none (no uploadDate in the payload)', () => {
    assert.doesNotMatch(readSrc('src/app/[locale]/(search)/boat/[slug]/page.tsx'), /VideoObject/u);
  });
});
