/**
 * What a tap or click in the lightbox does (4.11.2026). Outside the photo it closes the gallery (most sites close on a
 * click beside the picture; ours only had the arrow). On a touch screen a tap on the photo shows the next one: people
 * tapped the photo, and the invisible arrow strip over it, expecting something to happen (32 of 59 taps on the Boat
 * page were dead in three days). A mouse or pen click on the photo keeps the arrows and the wheel; the last photo has
 * nothing to advance to.
 */
export type TapAction = 'close' | 'next' | 'none';

export const tapAction = (onPhoto: boolean, pointerType: string, isEnd: boolean): TapAction => {
  if (!onPhoto) return 'close';

  return pointerType === 'touch' && !isEnd ? 'next' : 'none';
};

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Size {
  width: number;
  height: number;
}

/**
 * Whether the viewport point (x, y) lies on the picture an `object-fit: contain` image draws inside its box — the
 * letterbox or pillarbox around it is not the photo. A photo without a natural size yet counts as the photo.
 */
export const onContainedPhoto = (box: Box, natural: Size, x: number, y: number): boolean => {
  if (natural.width <= 0 || natural.height <= 0 || box.width <= 0 || box.height <= 0) return true;

  const scale = Math.min(box.width / natural.width, box.height / natural.height);
  const w = natural.width * scale;
  const h = natural.height * scale;
  const left = box.left + (box.width - w) / 2;
  const top = box.top + (box.height - h) / 2;

  return x >= left && x <= left + w && y >= top && y <= top + h;
};
