#!/usr/bin/env node
/**
 * تست‌های مرورگری — فاز ۷.
 *
 *   node tests/run.mjs                     روی http://127.0.0.1:3000
 *   BASE=https://example.ir node run.mjs   روی سرور واقعی
 *
 * لازم است سرور بالا باشد و `WH_COOKIE` مقدار کوکی‌ی دروازه را داشته باشد
 * (وگرنه اسکریپت خودش با `WH_TOKEN` کوکی می‌گیرد).
 *
 * پنج دسته:
 *   ۱. مسیر     — هر گزینه‌ی هر برگه، در مرورگر واقعی
 *   ۲. دستگاه   — چهار اندازه، بدون سرریز افقی
 *   ۳. دسترس‌پذیری — axe، ناوبری با Tab، focus قابل‌مشاهده
 *   ۴. کارایی   — وب‌وایتالز
 *   ۵. شبکه     — صفر درخواست به دامنه‌ی خارجی
 */

import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');
const axeSource = readFileSync(axePath, 'utf8');

const BASE = process.env.BASE ?? 'http://127.0.0.1:3000';
const ORIGIN = new URL(BASE).origin;
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const green = (s) => `[32m${s}[0m`;
const red = (s) => `[31m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;
const bold = (s) => `[1m${s}[0m`;

const failures = [];
const notes = [];
function check(ok, label, detail = '') {
  console.log(`  ${ok ? green('✓') : red('✗')} ${label}${detail ? dim(' — ' + detail) : ''}`);
  if (!ok) failures.push(label + (detail ? ` (${detail})` : ''));
}

// ---------------------------------------------------------------------------
// کوکی دروازه
// ---------------------------------------------------------------------------
async function getCookie() {
  if (process.env.WH_COOKIE) return process.env.WH_COOKIE.trim();
  const token = process.env.WH_TOKEN;
  if (!token) throw new Error('نه WH_COOKIE داده شده نه WH_TOKEN.');
  const res = await fetch(`${BASE}/api/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  const raw = res.headers.get('set-cookie') ?? '';
  const match = raw.match(/wh_access=([^;]+)/);
  if (!match) throw new Error(`کوکی از /api/verify نیامد (وضعیت ${res.status}).`);
  return match[1];
}

const COOKIE = await getCookie();
const browser = await chromium.launch({ executablePath: CHROME });

async function newCtx(options = {}) {
  const ctx = await browser.newContext(options);
  await ctx.addCookies([
    {
      name: 'wh_access',
      value: COOKIE,
      domain: new URL(BASE).hostname,
      path: '/',
      httpOnly: true,
      secure: BASE.startsWith('https'),
    },
  ]);
  return ctx;
}

/**
 * منتظر می‌ماند تا React واقعاً hydrate شود.
 *
 * بدون این، اولین ناوبری در حالت dev (که کامپایل هم می‌کند) کلیک را روی
 * دکمه‌ای می‌زند که هنوز هندلر ندارد و تست بی‌دلیل قرمز می‌شود. معیارش وجود
 * یک دکمه‌ی فعال است، نه یک `waitForTimeout` دلبخواهی.
 */
async function waitReady(page) {
  await page
    .locator('main button:not([disabled]), main ul li button')
    .first()
    .waitFor({ state: 'visible', timeout: 30000 })
    .catch(() => {});
  // یک فریم فرصت بده تا hydration تمام شود
  await page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
  );
}

/** یک تعامل باز را تا رسیدن به دکمه‌ی پیشروی جلو می‌برد. */
async function resolveInteraction(page, optionIndex) {
  for (let step = 0; step < 40; step += 1) {
    const next = page.getByRole('button', { name: 'برگه‌ی بعد', exact: true });
    const cont = page.getByRole('button', { name: 'ادامه', exact: true });
    if ((await next.count()) || (await cont.count())) return true;

    const submit = page.getByRole('button', { name: 'ثبت در پرونده', exact: true });
    if ((await submit.count()) && (await submit.first().isEnabled())) {
      await submit.first().click();
      await page.waitForTimeout(220);
      continue;
    }

    // split: کارت min-h-11، کشو min-h-24
    const buckets = page.locator('main ul li button.min-h-24');
    if (await buckets.count()) {
      const cardSel = 'main ul li button.min-h-11:not([disabled])';
      const before = await page.locator(cardSel).count();
      if (before > 0) {
        await page.locator(cardSel).first().click();
        await page.waitForTimeout(150);
        for (let b = 0; b < (await buckets.count()); b += 1) {
          if (!(await buckets.nth(b).isEnabled())) continue;
          await buckets.nth(b).click();
          await page.waitForTimeout(180);
          if ((await page.locator(cardSel).count()) < before) break;
          await page.locator(cardSel).first().click();
          await page.waitForTimeout(150);
        }
        continue;
      }
    }

    const opts = page.locator('main ul li button:not([disabled])');
    const n = await opts.count();
    if (n > 0) {
      await opts.nth(Math.min(optionIndex, n - 1)).click();
      await page.waitForTimeout(260);
      optionIndex = 0;
      continue;
    }
    return false;
  }
  return false;
}

// ---------------------------------------------------------------------------
// ۱. تست مسیر — هر گزینه‌ی هر برگه
// ---------------------------------------------------------------------------
console.log(bold('\n۱. تست مسیر — هر گزینه‌ی هر برگه در مرورگر واقعی\n'));
{
  const ctx = await newCtx({ viewport: { width: 420, height: 950 } });
  const page = await ctx.newPage();
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') pageErrors.push(m.text());
  });

  const stages = [];
  for (let i = 0; i < 28; i += 1) stages.push(`p${String(i).padStart(2, '0')}`);

  let exercised = 0;
  const stuck = [];

  for (const [index, id] of stages.entries()) {
    await page.goto(`${BASE}/story/${id}`, { waitUntil: 'domcontentloaded' });
    await waitReady(page);

    const optionCount = await page.locator('main ul li button').count();
    const isLast = index === stages.length - 1;
    // هر گزینه یک بار: چون موتور خطی است، همین پوشش کامل است.
    const tries = Math.max(1, optionCount);

    for (let choice = 0; choice < tries; choice += 1) {
      await page.goto(`${BASE}/story/${id}`, { waitUntil: 'domcontentloaded' });
      await waitReady(page);
      const reached = await resolveInteraction(page, choice);
      exercised += 1;

      if (isLast) continue; // آخرین برگه «بعدی» ندارد و همین درست است
      if (!reached) {
        stuck.push(`${id} گزینه‌ی ${choice + 1}`);
        continue;
      }
      const next = page.getByRole('button', { name: 'برگه‌ی بعد', exact: true });
      if (await next.count()) {
        await next.first().click();
        await page
          .waitForURL((u) => !u.pathname.endsWith(`/${id}`), { timeout: 15000 })
          .catch(() => {});
        if (page.url().endsWith(`/${id}`)) stuck.push(`${id} گزینه‌ی ${choice + 1}: پیشروی نکرد`);
      }
    }
  }

  check(
    stuck.length === 0,
    `هر ${exercised} گزینه به برگه‌ی بعد رسید`,
    stuck.slice(0, 3).join('، '),
  );
  check(
    pageErrors.length === 0,
    'هیچ خطای کنسول یا استثنای صفحه نیست',
    pageErrors.slice(0, 2).join(' | '),
  );
  await ctx.close();
}

// ---------------------------------------------------------------------------
// ۲. تست دستگاه
// ---------------------------------------------------------------------------
console.log(bold('\n۲. تست دستگاه — سرریز افقی و هدف لمسی\n'));
const DEVICES = [
  { name: 'iPhone SE', width: 375, height: 667, dsf: 2, mobile: true },
  { name: 'iPhone 15', width: 393, height: 852, dsf: 3, mobile: true },
  { name: 'Android 360px', width: 360, height: 800, dsf: 3, mobile: true },
  { name: 'دسکتاپ ۱۴۴۰', width: 1440, height: 900, dsf: 1, mobile: false },
];
{
  for (const device of DEVICES) {
    const ctx = await newCtx({
      viewport: { width: device.width, height: device.height },
      deviceScaleFactor: device.dsf,
      isMobile: device.mobile,
      hasTouch: device.mobile,
    });
    const page = await ctx.newPage();
    let worstOverflow = 0;
    let smallTargets = 0;

    for (const path of [
      '/gate',
      '/story/p00',
      '/story/p13',
      '/story/p15',
      '/story/p26',
      '/story/p27',
      '/about-this',
      '/museum',
      '/replay',
    ]) {
      await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(400);
      const r = await page.evaluate(() => {
        const el = document.documentElement;
        const overflow = el.scrollWidth - el.clientWidth;
        let tooSmall = 0;
        for (const node of document.querySelectorAll(
          'button, a, [role="button"], [role="switch"]',
        )) {
          const box = node.getBoundingClientRect();
          if (box.width === 0 && box.height === 0) continue;
          if (box.height < 24 || box.width < 24) tooSmall += 1;
        }
        return { overflow, tooSmall };
      });
      worstOverflow = Math.max(worstOverflow, r.overflow);
      smallTargets += r.tooSmall;
    }

    check(
      worstOverflow <= 0,
      `${device.name} (${device.width}px) — بدون سرریز افقی`,
      `بیشینه ${worstOverflow}px`,
    );
    // معیار ۲٫۵٫۸ WCAG 2.2 (سطح AA). قبلاً فقط یادداشت بود و برای همین وقتی
    // پیوند «موزه» با پهنای ۲۴px اضافه شد، تست سبز ماند. حالا واقعاً می‌شکند.
    check(
      smallTargets === 0,
      `${device.name} — هیچ هدف لمسی زیر ۲۴px نیست`,
      `${smallTargets} مورد`,
    );
    await ctx.close();
  }
}

// ---------------------------------------------------------------------------
// ۳. دسترس‌پذیری
// ---------------------------------------------------------------------------
console.log(bold('\n۳. دسترس‌پذیری — axe، Tab، focus\n'));
{
  const ctx = await newCtx({ viewport: { width: 420, height: 950 } });
  const page = await ctx.newPage();
  const allViolations = [];

  for (const path of [
    '/gate',
    '/story/p00',
    '/story/p05',
    '/story/p13',
    '/story/p15',
    '/story/p26',
    '/story/p27',
    '/about-this',
    '/expired',
    '/museum',
    '/replay',
  ]) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(450);
    await page.evaluate(axeSource);
    const result = await page.evaluate(async () => {
      return await axe.run(document, {
        resultTypes: ['violations'],
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
      });
    });
    for (const v of result.violations) {
      allViolations.push({ path, id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help });
    }
  }

  const critical = allViolations.filter((v) => v.impact === 'critical');
  const serious = allViolations.filter((v) => v.impact === 'serious');
  check(
    critical.length === 0,
    'axe — هیچ خطای critical نیست',
    critical.map((v) => v.id).join('، '),
  );
  check(
    serious.length === 0,
    'axe — هیچ خطای serious نیست',
    serious.map((v) => `${v.path}:${v.id}`).join('، '),
  );
  if (allViolations.length > 0) {
    for (const v of allViolations)
      notes.push(`axe ${v.impact}: ${v.id} در ${v.path} (${v.nodes} گره) — ${v.help}`);
  }

  // ناوبری با Tab روی یک برگه‌ی تعاملی
  await page.goto(`${BASE}/story/p05`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(450);
  const interactiveCount = await page.locator('main button:not([disabled]), main a[href]').count();
  const seen = new Set();
  let focusVisibleEverywhere = true;
  for (let i = 0; i < interactiveCount + 6; i += 1) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      const outline = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
      const ring = style.boxShadow !== 'none';
      return {
        tag: el.tagName,
        text: (el.textContent ?? '').trim().slice(0, 24),
        visible: outline || ring,
      };
    });
    if (info === null) continue;
    seen.add(info.tag + '|' + info.text);
    if (!info.visible) focusVisibleEverywhere = false;
  }
  check(
    seen.size >= interactiveCount,
    `با Tab به هر ${interactiveCount} عنصر تعاملی می‌رسیم`,
    `${seen.size} رسید`,
  );
  check(focusVisibleEverywhere, 'حلقه‌ی focus روی همه‌ی عناصر دیده می‌شود');

  // برچسب روی تعامل‌های غیرمتنی
  await page.goto(`${BASE}/story/p15`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(450);
  const unlabelled = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('button, [role="button"], [role="switch"]')) {
      const text = (el.textContent ?? '').trim();
      const label =
        el.getAttribute('aria-label') ??
        el.getAttribute('aria-labelledby') ??
        el.getAttribute('title');
      if (text === '' && !label) out.push(el.outerHTML.slice(0, 60));
    }
    return out;
  });
  check(
    unlabelled.length === 0,
    'هر تعامل بدون متن، aria-label دارد',
    unlabelled.slice(0, 2).join(' | '),
  );

  await ctx.close();
}

// ---------------------------------------------------------------------------
// ۴. کارایی
// ---------------------------------------------------------------------------
console.log(bold('\n۴. کارایی — وب‌وایتالز\n'));
{
  const ctx = await newCtx({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  // LCP و CLS فقط از طریق PerformanceObserver با buffered در دسترس‌اند؛
  // getEntriesByType برای largest-contentful-paint آرایه‌ی خالی می‌دهد.
  await page.addInitScript(() => {
    window.__lcp = 0;
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__lcp = Math.max(window.__lcp, e.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(`${BASE}/story/p00`, { waitUntil: 'load' });
  await page.waitForTimeout(3000);

  const vitals = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    const cls = window.__cls ?? 0;
    let transferred = 0;
    for (const r of performance.getEntriesByType('resource')) transferred += r.transferSize || 0;
    return {
      fcp: fcp ? Math.round(fcp.startTime) : null,
      lcp: window.__lcp ? Math.round(window.__lcp) : null,
      domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
      cls: Number(cls.toFixed(4)),
      requests: performance.getEntriesByType('resource').length,
      transferredKB: Math.round((transferred + (nav?.transferSize ?? 0)) / 1024),
    };
  });

  check(vitals.fcp !== null && vitals.fcp < 1800, `FCP زیر ۱۸۰۰ms`, `${vitals.fcp}ms`);
  check(vitals.lcp !== null && vitals.lcp < 2500, `LCP زیر ۲۵۰۰ms`, `${vitals.lcp}ms`);
  check(vitals.cls < 0.1, `CLS زیر ۰٫۱`, String(vitals.cls));
  notes.push(
    `payload: ${vitals.transferredKB}KB در ${vitals.requests} درخواست · DCL ${vitals.domContentLoaded}ms`,
  );
  await ctx.close();
}

// ---------------------------------------------------------------------------
// ۵. شبکه‌ی ایران
// ---------------------------------------------------------------------------
console.log(bold('\n۵. شبکه — صفر درخواست خارجی\n'));
{
  const ctx = await newCtx({ viewport: { width: 393, height: 852 } });
  const external = [];
  const origins = new Set();
  ctx.on('request', (req) => {
    const url = req.url();
    if (/^(data|blob|about):/.test(url)) return;
    try {
      const o = new URL(url).origin;
      origins.add(o);
      if (o !== ORIGIN) external.push(`${req.method()} ${url}`);
    } catch {
      /* نادیده */
    }
  });
  const page = await ctx.newPage();
  for (const path of [
    '/gate',
    '/story/p00',
    '/story/p05',
    '/story/p15',
    '/story/p26',
    '/story/p27',
    '/about-this',
    '/museum',
    '/replay',
  ]) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(250);
  }
  check(
    external.length === 0,
    'هیچ درخواستی به دامنه‌ی خارجی نرفت',
    external.slice(0, 3).join(' | '),
  );
  notes.push(`origin های تماس‌گرفته: ${[...origins].join('، ')}`);
  await ctx.close();
}

await browser.close();

// ---------------------------------------------------------------------------
console.log('');
if (notes.length > 0) {
  console.log(dim('یادداشت‌ها:'));
  for (const note of notes) console.log(dim(`  · ${note}`));
  console.log('');
}

if (failures.length > 0) {
  console.log(red(`${failures.length} تست شکست خورد:`));
  for (const f of failures) console.log(red(`  ✗ ${f}`));
  console.log('');
  process.exit(1);
}
console.log(green('همه‌ی تست‌های مرورگری سبز.\n'));
