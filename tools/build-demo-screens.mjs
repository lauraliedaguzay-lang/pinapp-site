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

const ONLY = (() => {
  const arg = process.argv.find((a) => a.startsWith('--only='));
  if (!arg) return null;
  const raw = arg.slice('--only='.length).trim();
  if (!raw) return null;
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );
})();

/**
 * Catalogue complet /demo/ (15) → 15 captures.
 * delayMs = buffer après networkidle / hero visible (intros / particules).
 */
const shots = [
  // Tier 1 / Premium
  { path: '/demo/atelier-rivage/', file: 'atelier-rivage.webp', delayMs: 2500 },
  { path: '/demo/sur-mesure/', file: 'sur-mesure.webp', delayMs: 4000 },

  // Tier 2 / Standard
  { path: '/demo/restaurant/', file: 'restaurant.webp', delayMs: 2500 },
  { path: '/demo/avocat/', file: 'avocat.webp', delayMs: 2500 },
  { path: '/demo/coach.html', file: 'coach.webp', delayMs: 2500 },

  // Beauté
  { path: '/demo/esthetique/', file: 'esthetique.webp', delayMs: 2500 },
  { path: '/demo/estheticienne/', file: 'estheticienne.webp', delayMs: 3000 },
  { path: '/demo/cils/', file: 'cils.webp', delayMs: 3000 },
  { path: '/demo/extensions-cils/', file: 'extensions-cils.webp', delayMs: 3000 },
  { path: '/demo/ongles/', file: 'ongles.webp', delayMs: 3000 },
  { path: '/demo/coiffeur/', file: 'coiffeur.webp', delayMs: 3000 },
  { path: '/demo/tatoueuse/', file: 'tatoueuse.webp', delayMs: 3000 },
  { path: '/demo/barbier/', file: 'barbier.webp', delayMs: 3000 },

  // Artisanat
  { path: '/demo/artisan/', file: 'artisan.webp', delayMs: 3000 },
  { path: '/demo/trainer/', file: 'trainer.webp', delayMs: 3000 },
];

function getSlug(urlPath) {
  // ex: /demo/esthetique/ → esthetique ; /demo/coach.html → coach.html
  return urlPath.replace(/^\/+/, '').replace(/^demo\//, '').replace(/\/+$/, '');
}

async function waitDefault(page, urlPath, shot) {
  try {
    await page.locator(HERO_SEL).first().waitFor({ state: 'visible', timeout: 8000 });
  } catch {
    console.warn('[build-demo-screens] hero wait timeout → fallback 5s', urlPath);
    await page.waitForTimeout(5000);
  }
  await page.waitForTimeout(Math.max(0, shot?.delayMs ?? 2500));
}

const waitStrategies = {
  esthetique: async (page) => {
    await page.waitForLoadState('networkidle');
    // intro Solène ~5-6s : on tente de détecter un contenu stable, sinon on temporise.
    try {
      await page
        .locator('[data-hero-loaded="true"], .hero-content, .hero-solene-final, .hero, header.hero')
        .first()
        .waitFor({ state: 'visible', timeout: 8000 });
    } catch {
      await page.waitForTimeout(7000);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
  },

  'coach.html': async (page) => {
    await page.waitForLoadState('networkidle');
    // coach.html : on tente de "passer" l’intro si un contrôle existe.
    try {
      const skip = page
        .locator('button:has-text("Passer"), a:has-text("Aller au contenu"), [data-skip-intro]')
        .first();
      if (await skip.count()) {
        await skip.click({ timeout: 1500 });
        await page.waitForTimeout(1500);
      } else {
        await page.waitForTimeout(8000);
      }
    } catch {
      await page.waitForTimeout(8000);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
  },
};

function minLuminanceForSlug(slug) {
  // Certaines démos sont volontairement très sombres : on évite les faux négatifs.
  if (slug === 'coach.html') return 15;
  return 30;
}

async function screenshotWithLuminanceCheck(page, urlPath) {
  const clip = { x: 0, y: 0, width: 1400, height: 875 };
  const slug = getSlug(urlPath);
  const minLum = minLuminanceForSlug(slug);

  const shot1 = await page.screenshot({ type: 'png', clip });
  const stats1 = await sharp(shot1).stats();
  const lum1 =
    stats1.channels.reduce((s, c) => s + c.mean, 0) / Math.max(1, stats1.channels.length);

  if (lum1 >= minLum) return { buf: shot1, lum: lum1, retried: false };

  console.warn(
    `[build-demo-screens] screenshot semble noir (luminance ${lum1.toFixed(
      1,
    )}) → retry +3s ${urlPath}`,
  );
  await page.waitForTimeout(3000);

  const shot2 = await page.screenshot({ type: 'png', clip });
  const stats2 = await sharp(shot2).stats();
  const lum2 =
    stats2.channels.reduce((s, c) => s + c.mean, 0) / Math.max(1, stats2.channels.length);

  return { buf: lum2 >= lum1 ? shot2 : shot1, lum: Math.max(lum1, lum2), retried: true };
}

async function captureOnce(page, shot) {
  const urlPath = shot.path;
  const outFile = path.join(outDir, shot.file);
  const url = `${BASE}${urlPath}`;
  await page.setViewportSize({ width: 1400, height: 875 });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

  const slug = getSlug(urlPath);
  const strat = waitStrategies[slug] || waitDefault;
  await strat(page, urlPath, shot);

  const { buf, lum } = await screenshotWithLuminanceCheck(page, urlPath);
  const minLum = minLuminanceForSlug(slug);
  if (lum < minLum) {
    // Ne pas écrire de capture corrompue ; laisser le retry remonter.
    throw new Error(`screenshot trop sombre (luminance ${lum.toFixed(1)})`);
  }

  await sharp(buf).webp({ quality: 80 }).toFile(outFile);
  const st = fs.statSync(outFile);
  console.log('[build-demo-screens]', url, '→', path.relative(root, outFile), st.size, 'B');
}

async function captureWithRetries(page, shot) {
  let lastErr;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await captureOnce(page, shot);
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
      const slug = getSlug(shot.path);
      if (ONLY && !ONLY.has(slug) && !ONLY.has(shot.file)) continue;
      await captureWithRetries(page, shot);
    }
  } finally {
    await browser.close();
  }
  console.log('[build-demo-screens] OK');
}

main().catch((e) => {
  console.error(
    '[build-demo-screens] FAIL — après 2 essais par URL, capture manuelle possible (DevTools: “Capture node screenshot”, puis conversion WebP via sharp).',
    e,
  );
  process.exit(1);
});
