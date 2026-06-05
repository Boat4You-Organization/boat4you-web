const BROWSER_MATCHERS: ReadonlyArray<[RegExp, string]> = [
  [/Edg\//, 'Edge'],
  [/OPR\/|Opera/, 'Opera'],
  [/Chrome\//, 'Chrome'],
  [/Safari\//, 'Safari'],
  [/Firefox\//, 'Firefox'],
];

const OS_MATCHERS: ReadonlyArray<[RegExp, string]> = [
  [/iPhone|iPad/, 'iOS'],
  [/Android/, 'Android'],
  [/Mac OS X/, 'macOS'],
  [/Windows/, 'Windows'],
  [/Linux/, 'Linux'],
];

const matchLabel = (ua: string, matchers: ReadonlyArray<[RegExp, string]>, fallback: string): string => {
  const hit = matchers.find(([pattern]) => pattern.test(ua));

  return hit ? hit[1] : fallback;
};

export const parseUserAgent = (ua?: string | null): string => {
  if (!ua) return 'Unknown device';

  const browser = matchLabel(ua, BROWSER_MATCHERS, 'Browser');
  const os = matchLabel(ua, OS_MATCHERS, '');

  return os ? `${browser} · ${os}` : browser;
};
