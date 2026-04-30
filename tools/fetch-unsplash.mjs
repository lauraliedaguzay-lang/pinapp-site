/**
 * Télécharge des visuels Unsplash (hotlink images.unsplash.com), resize WebP via sharp.
 * Usage : node tools/fetch-unsplash.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'voyage-v9', 'assets', 'photos');
fs.mkdirSync(outDir, { recursive: true });

/** Photo IDs Unsplash (images libres de droits) + sujets proches des keywords demandés */
const jobs = [
  ['studio-micha-banner.webp', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1920&q=85&auto=format&fit=max'],
  ['studio-artistes-hero.webp', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=85&auto=format&fit=max'],
  ['cadeaux-ia-souvenir-1.webp', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920&q=85&auto=format&fit=max'],
  ['cadeaux-ia-souvenir-2.webp', 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=1920&q=85&auto=format&fit=max'],
  ['histoire-bordeaux.webp', 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1920&q=85&auto=format&fit=max'],
  ['histoire-duo-laptop.webp', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=85&auto=format&fit=max'],
];

async function run() {
  for (const [filename, url] of jobs) {
    const dest = path.join(outDir, filename);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${filename}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf)
      .resize(1600, 1000, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(dest);
    console.log('OK', filename, '→', dest);
  }
  console.log('fetch-unsplash: terminé.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
