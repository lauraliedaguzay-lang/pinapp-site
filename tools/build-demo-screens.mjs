/**
 * Captures hero des démos (viewport 1400×875) → voyage-v9/assets/demo-screens/*.webp
 * Usage : BASE_URL=https://pinapp.fr node tools/build-demo-screens.mjs
 * Défaut BASE_URL : https://pinapp.fr
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

const shots = [
  { slug: 'esthetique', file: 'esthetique.webp' },
  { slug: 'avocat', file: 'avocat.webp' },
];

async function capture(page, urlPath, outFile) {
  const url = `${BASE}${urlPath}`;
  const tmpPng = outFile.replace(/\.webp$/i, '.tmp.png');
  await page.setViewportSize({ width: 1400, height: 875 });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 800));
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

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    for (const { slug, file } of shots) {
      const out = path.join(outDir, file);
      await capture(page, `/demo/${slug}/`, out);
    }
  } finally {
    await browser.close();
  }
  console.log('[build-demo-screens] OK');
}

main().catch((e) => {
  console.error('[build-demo-screens] FAIL', e);
  process.exit(1);
});
