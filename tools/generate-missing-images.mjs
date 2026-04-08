import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

/**
 * Pinapp — generate-missing-images.mjs
 *
 * Objectif : zéro image “cassée”.
 * - Scanne le repo pour trouver des références à `/assets/images/...` (HTML/CSS/JS)
 * - Si le fichier référencé n’existe pas, génère un WebP abstrait premium (sans contenu réel)
 *
 * Notes :
 * - Génération volontairement abstraite (pas de visage / pas de marque tierce).
 * - Les WebP générés sont des placeholders “haut de gamme”, pensés pour être remplacés plus tard si besoin.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const imagesRoot = path.join(root, 'assets', 'images');

const SCAN_EXTS = new Set(['.html', '.css', '.js']);
const IGNORE_DIRS = new Set(['node_modules', '.git', '_site']);

const REFS_RE = /assets\/images\/[^"'()\s>]+?\.(?:webp|png|jpg|jpeg|svg)/g;

function walk(dir, out) {
  const ents = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of ents) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (IGNORE_DIRS.has(ent.name)) continue;
      walk(p, out);
      continue;
    }
    const ext = path.extname(ent.name).toLowerCase();
    if (!SCAN_EXTS.has(ext)) continue;
    out.push(p);
  }
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function seeded(seedStr) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619);
  let x = h >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

function svgAbstract({ w, h, seed, accentA, accentB, label }) {
  const rnd = seeded(seed);
  const orbCount = Math.max(7, Math.round((w * h) / 180000));
  const orbs = [];
  for (let i = 0; i < orbCount; i++) {
    const x = Math.round(rnd() * w);
    const y = Math.round(rnd() * h);
    const r = Math.round(Math.min(w, h) * (0.12 + rnd() * 0.22));
    const c = rnd() > 0.55 ? accentA : accentB;
    const id = `o${i}`;
    orbs.push(
      `<radialGradient id="${id}" cx="${x}" cy="${y}" r="${r}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${c}" stop-opacity="0.18"/>
        <stop offset="38%" stop-color="${c}" stop-opacity="0.07"/>
        <stop offset="100%" stop-color="${c}" stop-opacity="0"/>
      </radialGradient>
      <rect x="0" y="0" width="${w}" height="${h}" fill="url(#${id})"/>`,
    );
  }

  const pad = Math.round(Math.min(w, h) * 0.06);
  const cardW = Math.round(w * 0.56);
  const cardH = Math.round(h * 0.22);
  const x0 = pad;
  const y0 = h - pad - cardH;
  const rCard = Math.round(Math.min(w, h) * 0.04);

  const font1 = Math.max(18, Math.round(h * 0.04));
  const font2 = Math.max(13, Math.round(h * 0.028));

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${w}" y2="${h}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#050A14"/>
      <stop offset="60%" stop-color="#070B18"/>
      <stop offset="100%" stop-color="#02040B"/>
    </linearGradient>
    <filter id="grain" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="
        1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0
        0 0 0 0.18 0"/>
    </filter>
    <linearGradient id="spec" x1="0" y1="${y0}" x2="0" y2="${y0 + cardH}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="accent" x1="${x0}" y1="${y0 + cardH}" x2="${x0 + Math.round(cardW * 0.42)}" y2="${y0 + cardH}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${accentA}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${accentB}" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${w}" height="${h}" fill="url(#bg)"/>
  ${orbs.join('\n')}
  <rect x="0" y="0" width="${w}" height="${h}" filter="url(#grain)" opacity="0.35"/>
  <g>
    <rect x="${x0}" y="${y0}" width="${cardW}" height="${cardH}" rx="${rCard}" fill="#FFFFFF" opacity="0.06"/>
    <rect x="${x0}" y="${y0}" width="${cardW}" height="${cardH}" rx="${rCard}" fill="none" stroke="#FFFFFF" stroke-opacity="0.14" stroke-width="1"/>
    <rect x="${x0}" y="${y0}" width="${cardW}" height="${Math.round(cardH * 0.48)}" rx="${rCard}" fill="url(#spec)" opacity="0.9"/>
    <text x="${x0 + Math.round(pad * 0.7)}" y="${y0 + Math.round(cardH * 0.44)}"
      fill="#FFFFFF" opacity="0.78" font-size="${font1}" font-family="system-ui, -apple-system, Segoe UI, Arial" font-weight="600">${label}</text>
    <text x="${x0 + Math.round(pad * 0.7)}" y="${y0 + Math.round(cardH * 0.7)}"
      fill="#FFFFFF" opacity="0.55" font-size="${font2}" font-family="system-ui, -apple-system, Segoe UI, Arial" font-weight="400">Visuel généré — à remplacer si besoin</text>
    <path d="M ${x0 + Math.round(pad * 0.7)} ${y0 + Math.round(cardH * 0.86)} H ${x0 + Math.round(pad * 0.7) + Math.round(cardW * 0.42)}"
      stroke="url(#accent)" stroke-width="${Math.max(2, Math.round(h * 0.006))}" stroke-linecap="round"/>
  </g>
</svg>`;
}

function svgToWebp(svgString, outPath, width) {
  const py = `
import sys, io
from PIL import Image
import cairosvg
svg = sys.stdin.buffer.read()
png = cairosvg.svg2png(bytestring=svg, output_width=${Number(width)})
im = Image.open(io.BytesIO(png)).convert("RGBA")
im.save(${JSON.stringify(outPath)}, "WEBP", quality=82, method=6)
`;
  execFileSync('python3', ['-c', py], { input: Buffer.from(svgString, 'utf8') });
}

function pickPalette(relPath) {
  const p = relPath.toLowerCase();
  // Teal/violet par défaut, variantes selon mots clés
  if (p.includes('jour') || p.includes('light'))
    return { a: '#E8A044', b: '#00E5CC', label: 'Pinapp — Jour' };
  if (p.includes('nuit') || p.includes('dark'))
    return { a: '#00E5CC', b: '#7B4FE8', label: 'Pinapp — Nuit' };
  if (p.includes('avocat')) return { a: '#C9A96E', b: '#00E5CC', label: 'Démo — Avocat' };
  if (p.includes('restaurant') || p.includes('boulangerie'))
    return { a: '#C4622D', b: '#00E5CC', label: 'Démo — Commerce' };
  if (p.includes('coach') || p.includes('trainer'))
    return { a: '#7B4FE8', b: '#00E5CC', label: 'Démo — Services' };
  return { a: '#00E5CC', b: '#7B4FE8', label: 'Pinapp' };
}

function main() {
  const files = [];
  walk(root, files);

  const refs = [];
  for (const f of files) {
    let s;
    try {
      s = fs.readFileSync(f, 'utf8');
    } catch {
      continue;
    }
    let m;
    while ((m = REFS_RE.exec(s))) refs.push(m[0]);
  }

  const uniqueRefs = uniq(refs);
  const missing = uniqueRefs.filter((rel) => !fs.existsSync(path.join(root, rel)));

  if (!missing.length) {
    console.log('generate-missing-images: OK — aucune image manquante.');
    return;
  }

  ensureDir(imagesRoot);
  console.log(`generate-missing-images: ${missing.length} image(s) manquante(s). Génération…`);

  for (const rel of missing) {
    const abs = path.join(root, rel);
    const dir = path.dirname(abs);
    ensureDir(dir);

    // On génère uniquement en .webp (si référence .png/.jpg/.svg manquante, on crée un .webp “équivalent” + on duplique si nécessaire)
    const { a, b, label } = pickPalette(rel);
    const seed = rel;
    const w = 1600;
    const h = 1000;
    const svg = svgAbstract({ w, h, seed, accentA: a, accentB: b, label });

    // Si la ref n’est pas webp, on crée quand même un webp à côté, puis un “shim” vide n’est pas utile => mieux vaut créer le format demandé si c’est webp
    const outWebp = abs.endsWith('.webp') ? abs : abs.replace(path.extname(abs), '.webp');
    svgToWebp(svg, outWebp, 1600);

    // Si la ref attendait exactement .webp => OK. Sinon, on crée aussi un fichier du format demandé si c’est .png/.jpg via conversion.
    if (!abs.endsWith('.webp')) {
      const py2 = `
import sys
from PIL import Image
im = Image.open(${JSON.stringify(outWebp)}).convert("RGBA")
out = ${JSON.stringify(abs)}
ext = out.split('.')[-1].lower()
if ext in ('png',):
  im.save(out, "PNG", optimize=True)
elif ext in ('jpg','jpeg'):
  im.convert("RGB").save(out, "JPEG", quality=88, optimize=True, progressive=True)
else:
  # svg: on écrit un SVG source à côté plutôt que tenter un faux .svg bitmap
  open(out, 'wb').write(${JSON.stringify(Buffer.from(svg, 'utf8').toString('latin1'))}.encode('latin1'))
`;
      execFileSync('python3', ['-c', py2], { stdio: 'ignore' });
    }

    console.log('generated:', rel);
  }
}

main();
