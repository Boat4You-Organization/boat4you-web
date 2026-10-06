/**
 * Module hooks that let `node --test` import the app's TypeScript / TSX
 * source as the bundler sees it: `@/` = src/, extensionless and directory
 * imports, type-only imports elided (TypeScript's own transpiler — Node's
 * type stripping keeps `import { SomeInterface }` and then fails), JSON as a
 * default export, style modules as an empty object.
 *
 *   import './tsLoader.mjs';   // first import of a test file
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const SRC = fileURLToPath(new URL('../src/', import.meta.url));
const EXTENSIONS = ['.ts', '.tsx', '/index.ts', '/index.tsx'];

const probe = base => {
  if (existsSync(base) && statSync(base).isFile()) return base;

  const hit = EXTENSIONS.map(ext => `${base}${ext}`).find(path => existsSync(path));

  return hit ?? null;
};

registerHooks({
  resolve: (specifier, context, nextResolve) => {
    const fromSrc = context.parentURL?.startsWith(pathToFileURL(SRC).href);
    let base = null;

    if (specifier.startsWith('@/')) base = `${SRC}${specifier.slice(2)}`;
    else if (fromSrc && /^\.\.?\//.test(specifier)) base = fileURLToPath(new URL(specifier, context.parentURL));

    const path = base && probe(base);

    return path ? { url: pathToFileURL(path).href, shortCircuit: true } : nextResolve(specifier, context);
  },
  load: (url, context, nextLoad) => {
    if (!url.startsWith('file:')) return nextLoad(url, context);

    const path = fileURLToPath(url);

    if (/\.(s?css)$/.test(path)) return { format: 'module', source: 'export default {};', shortCircuit: true };

    if (path.endsWith('.json')) {
      return { format: 'module', source: `export default ${readFileSync(path, 'utf8')};`, shortCircuit: true };
    }

    if (/\.tsx?$/.test(path)) {
      const { outputText } = ts.transpileModule(readFileSync(path, 'utf8'), {
        fileName: path,
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
          jsx: ts.JsxEmit.ReactJSX,
          esModuleInterop: true,
        },
      });

      return { format: 'module', source: outputText, shortCircuit: true };
    }

    return nextLoad(url, context);
  },
});
