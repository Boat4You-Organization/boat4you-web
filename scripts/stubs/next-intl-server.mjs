/**
 * `next-intl/server` outside Next for `node --test`: getTranslations reads
 * the repo's messages (messages/<locale>/<namespace>.json) and returns
 * next-intl's own translator, the same ICU engine the pages run.
 */
import { createTranslator } from 'next-intl';
import { existsSync, readFileSync } from 'node:fs';

const ROOT = new URL('../../', import.meta.url).pathname;

export const getTranslations = async (options = {}) => {
  const { locale = 'en', namespace } = typeof options === 'string' ? { namespace: options } : options;
  const root = namespace?.split('.')[0];
  const path = `${ROOT}messages/${locale}/${root}.json`;
  const messages = root && existsSync(path) ? { [root]: JSON.parse(readFileSync(path, 'utf8')) } : {};

  return createTranslator({ locale, messages, namespace });
};

export const setRequestLocale = () => {};
