// The part of sanitize-html's API that lib/sanitizeWpHtml.ts uses (typed here instead of adding @types/sanitize-html).
declare module 'sanitize-html' {
  interface Attributes {
    [name: string]: string;
  }

  interface Transformed {
    tagName: string;
    attribs: Attributes;
  }

  interface Options {
    allowedTags?: string[] | false;
    allowedAttributes?: Record<string, string[]> | false;
    allowedSchemes?: string[];
    allowedSchemesByTag?: Record<string, string[]>;
    allowProtocolRelative?: boolean;
    allowedIframeHostnames?: string[];
    allowIframeRelativeUrls?: boolean;
    disallowedTagsMode?: 'discard' | 'escape' | 'recursiveEscape' | 'completelyDiscard';
    exclusiveFilter?: (frame: { tag: string; attribs: Attributes; text: string }) => boolean;
    transformTags?: Record<string, string | ((tagName: string, attribs: Attributes) => Transformed)>;
  }

  function sanitizeHtml(dirty: string, options?: Options): string;

  export default sanitizeHtml;
}
