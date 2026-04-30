/**
 * Captures hero des démos (viewport 1400×875) → voyage-v9/assets/demo-screens/*.webp
 * PR5 : waitForSelector hero + délai 2,5 s (intro / voile) ; coach.html inclus ; 2 essais par URL.
 *
 * Usage : BASE_URL=https://pinapp.fr node tools/build-demo-screens.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'voyage-v9', 'assets', 'demo-screens');

const BASE = (process.env.BASE_URL || 'https://pinapp.fr').replace(/\/$/, '');

/** Sélecteurs union : première occurrence visible = zone hero prête */
const HERO_SEL = '.demo-hero, main#main.hero, #top, section.hero';

const shots = [
  { path: '/demo/esthetique/', file: 'esthetique.webp' },
  { path: '/demo/avocat/', file: 'avocat.webp' },
  { path: '/demo/coach.html', file: 'coach.webp' },
];

async function captureOnce(page, urlPath, outFile) {
  const url = `${BASE}${urlPath}`;
  const tmpPng = outFile.replace(/\.webp$/i, '.tmp.png');
  await page.setViewportSize({ width: 1400, height: 875 });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  try {
    await page.locator(HERO_SEL).first().waitFor({ state: 'visible', timeout: 8000 });
  } catch {
    console.warn('[build-demo-screens] hero wait timeout → fallback 5s', urlPath);
    await new Promise((r) => setTimeout(r, 5000));
  }
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({
    path: tmpPng,
    type: 'png',
    clip: { x: 0, y: 0, width: 1400, height: 875 },
  });
  await sharp(tmpPng).webp({ quality: 80 }).toFile(outFile);
  fs.rmSync(tmpPng, { force: true });
  const st = fs.statSync(outFile);
  console.log('[build-demo-screens]', url, '→', path.relative(root, outFile), st.size, 'B');
}

async function captureWithRetries(page, shot) {
  const out = path.join(outDir, shot.file);
  let lastErr;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await captureOnce(page, shot.path, out);
      return;
    } catch (e) {
      lastErr = e;
      console.warn('[build-demo-screens] attempt', attempt, 'failed:', shot.path, e && e.message);
    }
  }
  throw lastErr || new Error('capture failed: ' + shot.path);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    for (const shot of shots) {
      await captureWithRetries(page, shot);
    }
  } finally {
    await browser.close();
  }
  console.log('[build-demo-screens] OK');
}

main().catch((e) => {
  console.error('[build-demo-screens] FAIL — après 2 essais par URL, fallback manuel possible (voir DÉCISION 5 PR5)', e);
  process.exit(1);
});
