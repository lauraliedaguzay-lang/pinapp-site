/**
 * Génère public/og-oriane.jpg (1200×630) depuis un SVG (Sharp rasterise le SVG).
 * Pas de Playwright : rendu stable en CI / headless.
 */
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', 'public', 'og-oriane.jpg');

const dots = Array.from({ length: 30 }, (_, i) => {
  const x = 80 + (i * 37) % 1040;
  const y = 80 + ((i * 73) % 470);
  const r = 2 + (i % 5);
  const o = 0.35 + (i % 8) * 0.06;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#D4A574" fill-opacity="${o}"/>`;
}).join('\n  ');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EDE3D6"/>
      <stop offset="55%" stop-color="#F7F1EA"/>
      <stop offset="100%" stop-color="#E8C5C0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  ${dots}
  <text x="600" y="200" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="26" fill="#B0884F" letter-spacing="0.12em">PARFUMERIE NICHE · BORDEAUX 2026</text>
  <text x="600" y="330" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="76" fill="#1A1614">MAISON ORIANE</text>
  <text x="600" y="420" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#4A413A" letter-spacing="0.08em">TROIS FRAGRANCES POUR TROIS AUBES</text>
</svg>`;

const buf = await sharp(Buffer.from(svg)).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
writeFileSync(out, buf);
const meta = await sharp(out).metadata();
console.log('Wrote', out, meta.width, 'x', meta.height, 'bytes', buf.length);
