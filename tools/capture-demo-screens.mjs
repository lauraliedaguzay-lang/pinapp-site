import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from '@playwright/test';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const DEMO_DIR = path.join(root, 'demo');
const OUT_DIR = path.join(root, 'assets', 'images', 'demo-screens');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function listDemoSlugs() {
  const entries = fs.readdirSync(DEMO_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function ffmpegToWebp(pngPath, webpPath, width) {
  // Lossy WebP tuned for marketing thumbs; keep sizes sane.
  const args = [
    '-y',
    '-i',
    pngPath,
    '-vf',
    `scale=${width}:-1:flags=lanczos`,
    '-vcodec',
    'libwebp',
    '-quality',
    '82',
    '-compression_level',
    '6',
    '-preset',
    'photo',
    webpPath,
  ];
  const r = spawnSync('ffmpeg', args, { stdio: 'pipe' });
  if (r.status !== 0) {
    const msg = (r.stderr || r.stdout || '').toString().slice(0, 1000);
    throw new Error(`ffmpeg failed for ${path.basename(pngPath)}: ${msg}`);
  }
}

async function captureOne(page, slug) {
  const target = `file://${path.join(DEMO_DIR, slug, 'index.html')}`;

  const base = path.join(OUT_DIR, `demo-${slug}`);
  const tmpWeb = base + '__web.png';
  const tmpMobile = base + '__mobile.png';

  // Web capture.
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(target, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
  await page.screenshot({ path: tmpWeb, fullPage: false });

  // Mobile capture.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(target, { waitUntil: 'load' });
  await page.waitForTimeout(650);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
  await page.screenshot({ path: tmpMobile, fullPage: false });

  const outWeb = base + '__web.webp';
  const outMobile = base + '__mobile.webp';
  ffmpegToWebp(tmpWeb, outWeb, 1200);
  ffmpegToWebp(tmpMobile, outMobile, 900);

  fs.unlinkSync(tmpWeb);
  fs.unlinkSync(tmpMobile);
}

async function main() {
  ensureDir(OUT_DIR);

  const slugs = listDemoSlugs();
  if (slugs.length === 0) {
    console.log('No demos found.');
    return;
  }

  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  const failures = [];
  for (const slug of slugs) {
    try {
      await captureOne(page, slug);
      process.stdout.write(`✓ ${slug}\n`);
    } catch (e) {
      failures.push({ slug, err: String(e && e.message ? e.message : e) });
      process.stdout.write(`✗ ${slug}\n`);
    }
  }

  await browser.close();

  if (failures.length) {
    console.error('\nFailures:');
    failures.forEach((f) => console.error(`- ${f.slug}: ${f.err}`));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
