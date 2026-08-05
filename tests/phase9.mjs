#!/usr/bin/env node
/**
 * تست فاز ۹ — موزه و پخش دوباره.
 *
 *   WH_TOKEN=… node tests/phase9.mjs
 *
 * می‌سنجد که موزه و پخش دوباره واقعاً **از روی بازی کردن** پر می‌شوند، نه از
 * روی داده‌ی دستی: چند برگه بازی می‌شود، دو تخم‌مرغ پیدا می‌شود، و بعد هر دو
 * صفحه بررسی می‌شوند.
 */

import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://127.0.0.1:3000';
const ORIGIN = new URL(BASE).origin;
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const green = (s) => `[32m${s}[0m`;
const red = (s) => `[31m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

const failures = [];
function check(ok, label, detail = '') {
  console.log(`  ${ok ? green('✓') : red('✗')} ${label}${detail ? dim(' — ' + detail) : ''}`);
  if (!ok) failures.push(label);
}

const res = await fetch(`${BASE}/api/verify`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: process.env.WH_TOKEN }),
});
const COOKIE = (res.headers.get('set-cookie') ?? '').match(/wh_access=([^;]+)/)?.[1];
if (!COOKIE) throw new Error(`کوکی نیامد (${res.status})`);

const browser = await chromium.launch({ executablePath: CHROME });
const ctx = await browser.newContext({ viewport: { width: 420, height: 950 } });
await ctx.addCookies([
  {
    name: 'wh_access',
    value: COOKIE,
    domain: new URL(BASE).hostname,
    path: '/',
    httpOnly: true,
    secure: false,
  },
]);

const external = [];
ctx.on('request', (r) => {
  const u = r.url();
  if (/^(data|blob|about):/.test(u)) return;
  try {
    if (new URL(u).origin !== ORIGIN) external.push(u);
  } catch {
    /* نادیده */
  }
});

const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});

const state = () =>
  page.evaluate(() => JSON.parse(localStorage.getItem('wolf-hedgehog-v2') ?? '{}').state ?? {});

console.log('\nفاز ۹ — موزه و پخش دوباره\n');

// --- ۱. موزه‌ی خالی ---
await page.goto(`${BASE}/museum`, { waitUntil: 'networkidle' });
const emptyText = await page.locator('main').innerText();
check(emptyText.includes('موزه‌ی خاطرات'), 'موزه بالا می‌آید');
check(
  emptyText.includes('هنوز پیدا نشده'),
  'چیزهای پیدانشده به‌جای لو دادن، جای خالی نشان می‌دهند',
);
check(!emptyText.includes('گل‌سر'), 'نام چیز مخفی قبل از پیدا شدن لو نمی‌رود');

// --- ۲. بازی کردن دو برگه ---
await page.goto(`${BASE}/story/p01`, { waitUntil: 'networkidle' });
await page.locator('main ul li button').first().click();
await page.waitForTimeout(500);
await page.getByRole('button', { name: 'برگه‌ی بعد', exact: true }).first().click();
await page.waitForTimeout(700);
await page.locator('main ul li button').first().click();
await page.waitForTimeout(500);

const afterPlay = await state();
check(
  Object.keys(afterPlay.seenOptions ?? {}).length >= 2,
  'seenOptions با بازی کردن پر می‌شود',
  JSON.stringify(afterPlay.seenOptions),
);

// --- ۳. انتخاب دوم روی همان برگه، انباشته شود نه بازنویسی ---
const stageId = Object.keys(afterPlay.seenOptions)[0];
await page.goto(`${BASE}/story/${stageId}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const opts = page.locator('main ul li button');
if ((await opts.count()) > 1) {
  await opts.nth(1).click();
  await page.waitForTimeout(500);
}
const afterSecond = await state();
check(
  (afterSecond.seenOptions[stageId] ?? []).length > (afterPlay.seenOptions[stageId] ?? []).length,
  'انتخاب دوم روی همان برگه انباشته می‌شود، نه بازنویسی',
  `${(afterPlay.seenOptions[stageId] ?? []).length} → ${(afterSecond.seenOptions[stageId] ?? []).length}`,
);

// --- ۴. تخم‌مرغ نازو ---
await page.goto(`${BASE}/story/p00`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const panda = page.locator('svg[aria-label="نازو"]');
for (let i = 0; i < 5; i += 1) {
  await panda.first().click({ force: true });
  await page.waitForTimeout(110);
}
await page.waitForTimeout(500);
check(((await state()).foundEggs ?? []).includes('nazoo-secret'), 'تخم‌مرغ نازو ماندگار ثبت شد');

// --- ۵. گل‌سر ---
await page.goto(`${BASE}/story/p15`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.locator('[aria-label="یک چیز کوچک لای درخت‌ها"]').first().click({ force: true });
await page.waitForTimeout(500);
check(((await state()).foundEggs ?? []).includes('hairclip'), 'گل‌سر ماندگار ثبت شد');

// --- ۶. ماندگاری بعد از رفرش ---
await page.reload({ waitUntil: 'networkidle' });
const persisted = await state();
check(
  (persisted.foundEggs ?? []).length === 2,
  'تخم‌مرغ‌ها بعد از رفرش می‌مانند',
  JSON.stringify(persisted.foundEggs),
);

// --- ۷. موزه بعد از پیدا کردن ---
await page.goto(`${BASE}/museum`, { waitUntil: 'networkidle' });
const fullText = await page.locator('main').innerText();
check(fullText.includes('گل‌سر'), 'موزه گل‌سر پیداشده را نشان می‌دهد');
check(fullText.includes('جمله‌ی مخفی نازو'), 'موزه جمله‌ی مخفی را نشان می‌دهد');
check(fullText.includes('نقشه‌ی جنگل'), 'موزه محل پیدا شدن را بعد از کشف می‌گوید');

// --- ۸. پخش دوباره ---
await page.goto(`${BASE}/replay`, { waitUntil: 'networkidle' });
const replayText = await page.locator('main').innerText();
check(replayText.includes('واکنش این پرونده'), 'پخش دوباره شمارش کل را می‌گوید');
check(/دفتر ۱/.test(replayText), 'برگه‌ها زیر دفترها گروه‌بندی شده‌اند');
const links = await page.locator('main a[href^="/story/"]').count();
check(links >= 28, 'به هر ۲۸ برگه لینک می‌دهد', `${links} لینک`);

// لینک واقعاً کار می‌کند؟
await page.locator('main a[href^="/story/"]').first().click();
await page.waitForTimeout(900);
check(/\/story\/p\d\d/.test(page.url()), 'لینک پخش دوباره به برگه می‌رود', page.url());

// --- ۹. شبکه ---
check(
  external.length === 0,
  'موزه و پخش دوباره هیچ درخواست خارجی ندارند',
  external.slice(0, 2).join(' '),
);
check(errors.length === 0, 'بدون خطای کنسول', errors.slice(0, 2).join(' | '));

await browser.close();

console.log('');
if (failures.length > 0) {
  console.log(red(`${failures.length} تست شکست خورد.`));
  process.exit(1);
}
console.log(green('فاز ۹ سبز.\n'));
