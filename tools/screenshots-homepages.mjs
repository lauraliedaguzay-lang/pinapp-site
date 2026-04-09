/**
 * PINAPP — capture screenshots of all homepages (demos + main).
 *
 * Usage:
 *   node tools/screenshots-homepages.mjs --base http://127.0.0.1:4173 --out screenshots
 *
 * Notes:
 * - Uses Playwright (Chromium) to render pages and take full-page screenshots.
 * - Demos rely on absolute /assets paths, so we run via local HTTP.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

function argValue(flag, fallback) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  const next = process.argv[idx + 1];
  if (!next || next.startsWith('--')) return fallback;
  return next;
}

function slugFromPath(p) {
  return p.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '__') || 'home';
}

async function main() {
  const base = argValue('--base', 'http://127.0.0.1:4173');
  const outRel = argValue('--out', 'screenshots');
  const outDir = path.resolve(process.cwd(), outRel);

  await fs.mkdir(outDir, { recursive: true });

  const demoDir = path.resolve(process.cwd(), 'demo');
  const demoEntries = await fs.readdir(demoDir, { withFileTypes: true });
  const demoSlugs = demoEntries.filter((d) => d.isDirectory()).map((d) => d.name).sort();

  const targets = [
    { urlPath: '/', name: 'index' },
    ...demoSlugs.map((s) => ({ urlPath: `/demo/${s}/`, name: `demo__${s}` }))
  ];

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  // Give fonts/network a short window; keep it deterministic.
  page.setDefaultTimeout(45_000);

  for (const t of targets) {
    const url = base.replace(/\/$/, '') + t.urlPath;
    await page.goto(url, { waitUntil: 'networkidle' });

    // Let the hero background settle (avoid capturing during initial paint).
    await page.waitForTimeout(700);

    // Try to hide any cookie banner if present (best-effort).
    await page.evaluate(() => {
      const b = document.getElementById('cookie-banner');
      if (b) b.style.display = 'none';
    });

    const fileName = `${t.name}__${slugFromPath(t.urlPath)}.png`;
    const filePath = path.join(outDir, fileName);
    await page.screenshot({ path: filePath, fullPage: true });
    // eslint-disable-next-line no-console
    console.log('[screenshot]', fileName);
  }

  await page.close();
  await browser.close();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

