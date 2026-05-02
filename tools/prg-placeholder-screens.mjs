/**
 * One-off PR-G FIX 9: placeholder audit screenshots (studio-micha, cadeaux-ia).
 * Run: node tools/prg-placeholder-screens.mjs
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'docs', 'prg-placeholder-audit');

const pages = [
  { path: 'studio-micha/index.html', name: 'studio-micha' },
  { path: 'cadeaux-ia/index.html', name: 'cadeaux-ia' },
];

function fileUrl(rel) {
  const abs = join(root, rel).replace(/\\/g, '/');
  return `file:///${abs}`;
}

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  for (const { path: rel, name } of pages) {
    const url = fileUrl(rel);
    for (const [w, h, tag] of [
      [1280, 800, 'desktop-1280'],
      [390, 844, 'mobile-390'],
    ]) {
      const page = await browser.newPage({ viewport: { width: w, height: h } });
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(800);
      const png = join(outDir, `${name}-${tag}.png`);
      await page.screenshot({ path: png, fullPage: true });
      await page.close();
      console.log('wrote', png);
    }
  }
} finally {
  await browser.close();
}
