/**
 * Blog YouTube facades (src/utils/static/blogVideo.ts, 15.11.2026): the editor's placeholder and a pasted YouTube
 * iframe both become a click-to-load facade (no iframe, no youtube.com request in the HTML), and only a placeholder
 * with an upload date yields a VideoObject.
 *
 *   yarn test:blog-video
 */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  blogVideoFacades,
  blogVideosIn,
  buildBlogVideoObjects,
  nocookieEmbedUrl,
} from '../src/utils/static/blogVideo.ts';
import { serializeJsonLd } from '../src/utils/static/jsonLd.ts';

const PLACEHOLDER =
  '<p>Intro</p><div class="b4y-video" data-yt="S2Uqg1va_pI" data-title="Croatia | I Hear It&#8217;s Beautiful ft. John Malkovich" ' +
  'data-description="The Croatian National Tourist Board&#8217;s film" data-upload="2026-06-13" data-duration="PT6M21S" ' +
  'data-credit="Croatian National Tourist Board"></div><p>Outro</p>';

describe('blogVideoFacades', () => {
  test('the placeholder becomes a facade with thumbnail, button and credit', () => {
    const html = blogVideoFacades(PLACEHOLDER);

    assert.match(html, /<div class="b4y-yt" data-yt-id="S2Uqg1va_pI"/);
    assert.match(
      html,
      /<button type="button" class="b4y-yt__play" aria-label="Play video: Croatia \| I Hear It&#8217;s/
    );
    assert.match(html, /src="\/yt-thumb\/S2Uqg1va_pI\.jpg"/);
    assert.doesNotMatch(html, /ytimg/);
    assert.match(html, /<p class="b4y-yt__credit">Video: Croatian National Tourist Board<\/p>/);
    assert.match(html, /^<p>Intro<\/p>.*<p>Outro<\/p>$/s);
    assert.doesNotMatch(html, /<iframe|b4y-video/);
  });

  test('a pasted YouTube iframe never reaches the page as an iframe', () => {
    const html = blogVideoFacades(
      '<figure><iframe width="560" height="315" src="https://www.youtube.com/embed/eQSMz3IkKAY?si=x" title="Sequel" allowfullscreen></iframe></figure>'
    );

    assert.equal(html.includes('<iframe'), false, 'iframe replaced by the facade');
    assert.match(html, /data-yt-id="eQSMz3IkKAY" data-yt-title="Sequel"/);
  });

  test('an invalid id is dropped, other iframes are left alone', () => {
    assert.equal(blogVideoFacades('<div class="b4y-video" data-yt="bad"></div>'), '');
    const vimeo = '<iframe src="https://player.vimeo.com/video/1"></iframe>';

    assert.equal(blogVideoFacades(vimeo), vimeo);
  });

  test('an apostrophe inside a double-quoted title is kept', () => {
    const html = blogVideoFacades(
      '<div class="b4y-video" data-yt="S2Uqg1va_pI" data-title="Croatia | I Hear It\'s Beautiful"></div>'
    );

    assert.match(html, /data-yt-title="Croatia \| I Hear It's Beautiful"/);
  });

  test('quotes in a title cannot break out of the attribute', () => {
    // WordPress encodes < and > inside attributes; a double quote can still arrive inside single quotes.
    const html = blogVideoFacades('<div class="b4y-video" data-yt="S2Uqg1va_pI" data-title=\'A "b" &lt;c&gt;\'></div>');

    assert.match(html, /data-yt-title="A &quot;b&quot; &lt;c&gt;"/);
  });
});

describe('buildBlogVideoObjects', () => {
  test('a placeholder with an upload date gives a VideoObject', () => {
    const [video] = buildBlogVideoObjects(blogVideoFacades(PLACEHOLDER));

    assert.deepEqual(video, {
      '@type': 'VideoObject',
      name: 'Croatia | I Hear It\u2019s Beautiful ft. John Malkovich',
      description: 'The Croatian National Tourist Board\u2019s film',
      thumbnailUrl: ['https://i.ytimg.com/vi/S2Uqg1va_pI/hqdefault.jpg'],
      uploadDate: '2026-06-13',
      duration: 'PT6M21S',
      embedUrl: 'https://www.youtube.com/embed/S2Uqg1va_pI',
      creator: { '@type': 'Organization', name: 'Croatian National Tourist Board' },
    });
  });

  test('a bare iframe gets no VideoObject (no invented upload date)', () => {
    const html = blogVideoFacades(
      '<iframe src="https://www.youtube-nocookie.com/embed/eQSMz3IkKAY" title="x"></iframe>'
    );

    assert.equal(blogVideosIn(html).length, 1);
    assert.deepEqual(buildBlogVideoObjects(html), []);
  });
});

test('the player URL is youtube-nocookie with autoplay', () => {
  assert.equal(
    nocookieEmbedUrl('S2Uqg1va_pI'),
    'https://www.youtube-nocookie.com/embed/S2Uqg1va_pI?autoplay=1&rel=0&playsinline=1'
  );
  assert.equal(
    nocookieEmbedUrl('S2Uqg1va_pI', 42),
    'https://www.youtube-nocookie.com/embed/S2Uqg1va_pI?autoplay=1&rel=0&playsinline=1&start=42'
  );
});

describe('review fixes 15.11.', () => {
  test('an entity-encoded </script> in a title is escaped in the page JSON-LD', () => {
    const html = blogVideoFacades(
      '<div class="b4y-video" data-yt="S2Uqg1va_pI" data-title="x&lt;/script&gt;&lt;img src=x onerror=alert(1)&gt;" data-upload="2026-06-13"></div>'
    );
    const [video] = buildBlogVideoObjects(html);

    assert.equal(video.name, 'x</script><img src=x onerror=alert(1)>');
    assert.doesNotMatch(serializeJsonLd({ video: [video] }), /<\/script/i);
  });

  test('a mistyped numeric entity does not throw', () => {
    const html = blogVideoFacades(
      '<div class="b4y-video" data-yt="S2Uqg1va_pI" data-title="a &#99999999; b &#xD800;" data-upload="2026-06-13"></div>'
    );

    assert.equal(buildBlogVideoObjects(html)[0].name, 'a &#99999999; b &#xD800;');
  });

  test('playlist and live embeds are left as they are; start is kept', () => {
    const playlist = '<iframe src="https://www.youtube.com/embed/videoseries?list=PL123" title="p"></iframe>';
    const live = '<iframe src="https://www.youtube.com/embed/live_stream?channel=UC1" title="l"></iframe>';

    assert.equal(blogVideoFacades(playlist), playlist);
    assert.equal(blogVideoFacades(live), live);
    assert.match(
      blogVideoFacades('<iframe src="https://www.youtube.com/embed/S2Uqg1va_pI?start=95" title="s"></iframe>'),
      /data-yt-start="95"/
    );
  });

  test('an impossible upload date gives no VideoObject', () => {
    const html = blogVideoFacades(
      '<div class="b4y-video" data-yt="S2Uqg1va_pI" data-title="t" data-upload="2026-13-45"></div>'
    );

    assert.deepEqual(buildBlogVideoObjects(html), []);
  });

  test('data-yt inside another attribute value is ignored; class must be the exact token', () => {
    const html = blogVideoFacades(
      '<div class="b4y-video" title="see data-yt=\'aaaaaaaaaaa\'" data-yt="S2Uqg1va_pI" data-title="t"></div>'
    );

    assert.match(html, /data-yt-id="S2Uqg1va_pI"/);
    const wrapper = '<div class="b4y-video-wrapper" data-yt="S2Uqg1va_pI"></div>';

    assert.equal(blogVideoFacades(wrapper), wrapper);
  });
});
