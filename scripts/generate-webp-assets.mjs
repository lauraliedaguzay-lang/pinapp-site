import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '..', 'assets', 'images');
const MIN = 100 * 1024;

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png'));
for (const f of files) {
  const p = path.join(dir, f);
  const st = fs.statSync(p);
  if (st.size < MIN) continue;
  const out = path.join(dir, f.replace(/\.png$/i, '.webp'));
  await sharp(p).webp({ quality: 86 }).toFile(out);
  console.log('webp', f, '→', path.basename(out), Math.round(st.size / 1024) + 'KB →', Math.round(fs.statSync(out).size / 1024) + 'KB');
}
console.log('done');
