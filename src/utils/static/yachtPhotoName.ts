import { YachtModel } from '@/models/yacht.model';
import { toTitleCase, yachtLabel } from '@/utils/static/toTitleCase';

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
export const yachtPhotoName = (
  yacht: Pick<YachtModel, 'manufacturerName' | 'modelName' | 'name'> | null | undefined
): string => {
  const manufacturerPrefix =
    yacht?.manufacturerName && !yacht.modelName?.toLowerCase().startsWith(yacht.manufacturerName.toLowerCase())
      ? yacht.manufacturerName
      : undefined;

  return [manufacturerPrefix, yachtLabel(yacht?.modelName, toTitleCase(yacht?.name), ' ')].filter(Boolean).join(' ');
};
