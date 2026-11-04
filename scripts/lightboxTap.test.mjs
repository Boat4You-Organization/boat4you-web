/**
 * The lightbox on a tap or click (4.11.2026): outside the photo closes the gallery (Mario: most sites close on a click
 * beside the picture, ours only had the arrow); on a touch screen a tap on the photo shows the next one. People tapped
 * the photo and the invisible arrow strip over it and nothing happened: 32 dead taps of 59 on the Boat page in three days.
 *
 *   yarn test:lightbox
 */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import './tsLoader.mjs';

const { onContainedPhoto, tapAction } = await import('@/components/Gallery/Lightbox/lightboxTap');

describe('tapAction', () => {
  test('outside the photo closes, whatever the pointer', () => {
    assert.equal(tapAction(false, 'touch', false), 'close');
    assert.equal(tapAction(false, 'mouse', true), 'close');
  });

  test('a touch tap on a photo that is not the last one advances', () => {
    assert.equal(tapAction(true, 'touch', false), 'next');
  });

  test('the last photo stays, and a mouse or pen click on a photo does nothing', () => {
    assert.equal(tapAction(true, 'touch', true), 'none');
    assert.equal(tapAction(true, 'mouse', false), 'none');
    assert.equal(tapAction(true, 'pen', false), 'none');
  });
});

describe('onContainedPhoto (object-fit: contain inside the image box)', () => {
  // A 16:9 photo in a 360×600 box: drawn 360×202.5, from y = 198.75 to 401.25.
  const box = { left: 0, top: 100, width: 360, height: 600 };
  const natural = { width: 1920, height: 1080 };

  test('a point on the drawn photo', () => {
    assert.equal(onContainedPhoto(box, natural, 180, 400), true);
  });

  test('a point in the letterbox above or below the photo is outside', () => {
    assert.equal(onContainedPhoto(box, natural, 180, 150), false);
    assert.equal(onContainedPhoto(box, natural, 180, 650), false);
  });

  test('a portrait photo leaves pillarboxes left and right', () => {
    // 1080×1920 in 360×600: drawn 337.5×600, from x = 11.25 to 348.75.
    assert.equal(onContainedPhoto(box, { width: 1080, height: 1920 }, 5, 400), false);
    assert.equal(onContainedPhoto(box, { width: 1080, height: 1920 }, 180, 400), true);
  });

  test('no natural size yet (still loading) counts as on the photo', () => {
    assert.equal(onContainedPhoto(box, { width: 0, height: 0 }, 180, 150), true);
  });
});
