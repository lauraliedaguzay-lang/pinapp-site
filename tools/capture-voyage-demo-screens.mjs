/**
 * Captures des pages démo (Chrome headless) → WebP dans voyage-v9/assets/demo-screens/
 *
 * Prérequis : depuis la racine du dépôt, lancer un serveur statique, ex. :
 *   python3 -m http.server 9876 --bind 127.0.0.1
 * Puis :
 *   PINAPP_DEMO_BASE=http://127.0.0.1:9876 node tools/capture-voyage-demo-screens.mjs
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'voyage-v9/assets/demo-screens');
const base = (process.env.PINAPP_DEMO_BASE || 'http://127.0.0.1:9876').replace(/\/$/, '');
mkdirSync(outDir, { recursive: true });

function capture(urlPath, pngOut, budgetMs) {
  const url = base + urlPath;
  const r = spawnSync(
    'google-chrome',
    [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--user-data-dir=/tmp/ch-voyage-demo-cap',
      '--window-size=1600,1000',
      `--screenshot=${pngOut}`,
      `--virtual-time-budget=${budgetMs}`,
      url
    ],
    { encoding: 'utf8', timeout: 120000 }
  );
  if (r.status !== 0) {
    console.error('chrome exit', r.status, r.stderr?.slice?.(0, 400));
    return false;
  }
  return existsSync(pngOut);
}

async function toWebp(pngPath, webpPath) {
  await sharp(pngPath)
    .resize(1400, null, { withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(webpPath);
  unlinkSync(pngPath);
}

const demos = [
  { id: 'atelier-rivage', path: '/demo/atelier-rivage/', budget: 22000 },
  { id: 'restaurant', path: '/demo/restaurant/', budget: 25000 },
  { id: 'maison-solene', path: '/demo/esthetique/', budget: 22000 },
  { id: 'studio-lena', path: '/demo/extensions-cils/', budget: 22000 }
];

for (const d of demos) {
  const png = join(outDir, `${d.id}-raw.png`);
  console.log('capture', d.id, d.path);
  if (!capture(d.path, png, d.budget)) process.exitCode = 1;
  else await toWebp(png, join(outDir, `${d.id}.webp`));
}

console.log('done →', outDir);
