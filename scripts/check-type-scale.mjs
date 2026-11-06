#!/usr/bin/env node
// Fails when a font size outside the site type scale is written in the code (src/styles/mixins/_type.scss).
// Scale: 12 14 16 18 22 28 36 62. 20 is the boat page's price (src/views/Boat/boatType.ts) and an icon size (a flag,
// a chevron, an amenity icon), nowhere else. Not checked: the PDFs, SVG icons and the logged-in / checkout flows (Booking, MyBookings, Trip, Review, Profile, Auth), which
// are brought onto the scale in a separate pass. Usage: node scripts/check-type-scale.mjs [--list]
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SCALE = new Set([12, 14, 16, 18, 22, 28, 36, 62]);
// 20 passes on the boat page and on a line (or under a selector) that sizes an icon.
const ICON = /icon|chevron|flag/i;
const allows20 = (rel, line, selector) => rel.startsWith('src/views/Boat/') || ICON.test(line) || ICON.test(selector);
const SKIP =
  /PDF|\/SvgIcons\/|\/views\/Booking\/|\/views\/MyBookings\/|\/views\/Trip\/|\/app\/trip\/|\/views\/Review\/|\/views\/Profile\/|\/components\/Auth\/|\/views\/Payment|\/views\/Home\/HeroSection\//;
const PATTERNS = [
  /font-size:\s*rem-calc\((\d+(?:\.\d+)?)\)/g,
  /font-size:\s*(\d+(?:\.\d+)?)px/g,
  /fontSize\s*:\s*['"](\d+(?:\.\d+)?)px['"]/g,
  /fontSize\s*:\s*(\d+(?:\.\d+)?)\s*(?=[,}\n])/g,
  /fontSize=\{(\d+(?:\.\d+)?)\}/g,
];
// rem / em sizes (`fontSize: '0.62rem'`, `font-size: 0.875rem`), counted at 16 px.
const REM = [/font-size:\s*(\d*\.?\d+)r?em\b/g, /fontSize\s*:\s*['"](\d*\.?\d+)r?em['"]/g];
// A responsive size, `fontSize: { xs: 18, md: 22 }` or the prop `fontSize={{ xs: 18, md: cond ? 36 : 62 }}`: every
// number in the object is a size.
const OBJ = /fontSize\s*(?::|=\{)\s*\{([^}]*)\}/g;
const OBJ_VAL = /(?<![\w.])(\d+(?:\.\d+)?)(?![\w.])/g;

const walk = dir =>
  readdirSync(dir).flatMap(name => {
    const path = join(dir, name);

    if (statSync(path).isDirectory()) return walk(path);

    return /\.(scss|tsx|ts)$/.test(name) ? [path] : [];
  });

const offScale = [];

walk(join(ROOT, 'src')).forEach(path => {
  const rel = relative(ROOT, path);

  if (SKIP.test(`/${rel}`)) return;

  const lines = readFileSync(path, 'utf8').split('\n');
  let selector = '';

  lines.forEach((line, i) => {
    if (path.endsWith('.scss') && /\{\s*$/.test(line)) selector = line;

    const values = PATTERNS.flatMap(re => [...line.matchAll(re)].map(m => Number(m[1])));

    [...line.matchAll(OBJ)].forEach(m => values.push(...[...m[1].matchAll(OBJ_VAL)].map(v => Number(v[1]))));
    REM.forEach(re => [...line.matchAll(re)].forEach(m => values.push(Number(m[1]) * 16)));
    values
      .filter(v => !SCALE.has(v) && !(v === 20 && allows20(rel, line, selector)))
      .forEach(v => offScale.push(`${rel}:${i + 1}: ${v}px`));
  });
});

if (offScale.length) {
  console.error(
    `check-type-scale: ${offScale.length} font size(s) outside the scale 12 14 16 18 22 28 36 62 (20: boat price, icons):`
  );
  offScale.forEach(line => console.error(`  ${line}`));
  process.exit(1);
}

console.log('check-type-scale: OK (every font size is on the site scale)');
