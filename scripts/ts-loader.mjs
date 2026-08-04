/**
 * لودر کوچک ESM تا اسکریپت‌های Node بتوانند مستقیم فایل‌های `content/*.ts` را
 * import کنند، بدون build و بدون وابستگی اضافه.
 *
 * دو کار می‌کند و بس:
 *   ۱. مسیر بدون پسوند را به `.ts` (یا `index.ts`) می‌رساند.
 *   ۲. `@/...` را به ریشه‌ی مخزن نگاشت می‌کند، مثل `paths` در tsconfig.
 *
 * حذف تایپ‌ها کار خود Node است (type stripping، از نسخه‌ی ۲۲٫۱۸ به بعد پیش‌فرض).
 */

import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve as resolvePath } from 'node:path';

const repoRoot = resolvePath(dirname(fileURLToPath(import.meta.url)), '..');

function firstExisting(base) {
  for (const candidate of [`${base}.ts`, `${base}.tsx`, join(base, 'index.ts')]) {
    if (existsSync(candidate)) return candidate;
  }
  return undefined;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const target = firstExisting(join(repoRoot, specifier.slice(2)));
    if (target !== undefined) return { url: pathToFileURL(target).href, shortCircuit: true };
  }

  if (specifier.startsWith('.') && context.parentURL !== undefined) {
    const parentDir = dirname(fileURLToPath(context.parentURL));
    const target = firstExisting(resolvePath(parentDir, specifier));
    if (target !== undefined) return { url: pathToFileURL(target).href, shortCircuit: true };
  }

  return nextResolve(specifier, context);
}
