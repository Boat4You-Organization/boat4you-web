import { YachtModel } from '@/models/yacht.model';
import { toTitleCase, yachtLabel } from '@/utils/static/toTitleCase';

type PhotoNameFields = Pick<YachtModel, 'manufacturerName' | 'modelName' | 'name'>;

// The manufacturer, unless the model already starts with it ("Lagoon 46").
const manufacturerPrefix = (yacht: PhotoNameFields | null | undefined): string | undefined =>
  yacht?.manufacturerName && !yacht.modelName?.toLowerCase().startsWith(yacht.manufacturerName.toLowerCase())
    ? yacht.manufacturerName
    : undefined;

/**
 * The boat as its photos' alt text names it: "Fountaine Pajot Elba 45 Karina"
 * ("{label} — photo 3", common.photoAlt) instead of the old "Image slide
 * 236378" or "Gallery image 236378" (an internal id says nothing to Google
 * Images or a screen reader). Partners often bake the brand into the model
 * ("Lagoon 46"), so the manufacturer is skipped when the model already starts
 * with it ("Lagoon Lagoon 46"); the name only when it adds to the model ("MY
 * Custom Anthea", not "… Anthea Anthea"), title-cased like the H1. A charter
 * operator delivered as the manufacturer is blanked where the payload is
 * fetched (getSingleYacth, operatorNames.ts).
 */
export const yachtPhotoName = (yacht: PhotoNameFields | null | undefined): string =>
  [manufacturerPrefix(yacht), yachtLabel(yacht?.modelName, toTitleCase(yacht?.name), ' ')].filter(Boolean).join(' ');

/**
 * The model as a model photo's alt text names it ("Fountaine Pajot Elba 45 —
 * photo 1"): a photo of another boat of the same model (yachtLayout.ts,
 * MODEL_SAMPLE) never carries this boat's name. Empty without a model.
 */
export const yachtModelPhotoName = (yacht: PhotoNameFields | null | undefined): string => {
  const model = yacht?.modelName?.trim();

  return model ? [manufacturerPrefix(yacht), model].filter(Boolean).join(' ') : '';
};
