import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

/**
 * Génère des images locales WebP (pas d’URLs externes) pour les démos sectorielles.
 * Objectif: supprimer toute dépendance à Unsplash et combler les `hero-*.webp` manquants.
 *
 * Sortie: /assets/images/demo-pack/{secteur}/...
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'assets', 'images', 'demo-pack');

/** Palette “Pinapp” (teal/violet + accents biolume). */
const PAL = {
  teal: '#00E5CC',
  violet: '#7B4FE8',
  blue: '#4FC3F7',
  green: '#39E075',
  white: '#FFFFFF',
};

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function seeded(seedStr) {
  // xorshift32 basé sur hash FNV-1a
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

function svgHero({ w, h, seed, accentA, accentB, label, motif }) {
  // Génération SVG déterministe + conversion via Python (cairosvg + PIL).
  const rnd = seeded(seed);

  const orbCount = Math.max(7, Math.round((w * h) / 180000));
  const orbs = [];
  for (let i = 0; i < orbCount; i++) {
    const x = Math.round(rnd() * w);
    const y = Math.round(rnd() * h);
    const r = Math.round((Math.min(w, h) * (0.12 + rnd() * 0.22)) / 1);
    const c = rnd() > 0.55 ? accentA : accentB;
    const id = `o${i}`;
    orbs.push(
      `<radialGradient id="${id}" cx="${x}" cy="${y}" r="${r}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${c}" stop-opacity="0.16"/>
        <stop offset="38%" stop-color="${c}" stop-opacity="0.06"/>
        <stop offset="100%" stop-color="${c}" stop-opacity="0"/>
      </radialGradient>
      <rect x="0" y="0" width="${w}" height="${h}" fill="url(#${id})"/>`,
    );
  }

  // Carte verre (simple, sans texte vectorisé)
  const pad = Math.round(Math.min(w, h) * 0.06);
  const cardW = Math.round(w * 0.56);
  const cardH = Math.round(h * 0.26);
  const x0 = pad;
  const y0 = h - pad - cardH;
  const rCard = Math.round(Math.min(w, h) * 0.04);

  // Texte: laissé en <text> (rendu OK via cairosvg), fallback sans polices.
  const font1 = Math.max(18, Math.round(h * 0.045));
  const font2 = Math.max(14, Math.round(h * 0.03));

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
    <linearGradient id="accent" x1="${x0}" y1="${y0 + cardH}" x2="${x0 + Math.round(cardW * 0.42)}" y2="${
      y0 + cardH
    }" gradientUnits="userSpaceOnUse">
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
    <rect x="${x0}" y="${y0}" width="${cardW}" height="${Math.round(cardH * 0.45)}" rx="${rCard}" fill="url(#spec)" opacity="0.9"/>
    <text x="${x0 + Math.round(pad * 0.7)}" y="${y0 + Math.round(cardH * 0.42)}"
      fill="#FFFFFF" opacity="0.78" font-size="${font1}" font-family="system-ui, -apple-system, Segoe UI, Arial" font-weight="600">${label}</text>
    <text x="${x0 + Math.round(pad * 0.7)}" y="${y0 + Math.round(cardH * 0.68)}"
      fill="#FFFFFF" opacity="0.55" font-size="${font2}" font-family="system-ui, -apple-system, Segoe UI, Arial" font-weight="400">${motif}</text>
    <path d="M ${x0 + Math.round(pad * 0.7)} ${y0 + Math.round(cardH * 0.84)} H ${
      x0 + Math.round(pad * 0.7) + Math.round(cardW * 0.42)
    }"
      stroke="url(#accent)" stroke-width="${Math.max(2, Math.round(h * 0.006))}" stroke-linecap="round"/>
  </g>
</svg>`;
}

function svgToWebp(svgString, outPath, width) {
  // Conversion dans un seul process Python (cairosvg → png, puis PIL → webp)
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

const SECTEURS = [
  {
    key: 'artisan',
    label: 'Artisan / BTP',
    motif: 'Devis · chantier · suivi',
    a: PAL.teal,
    b: PAL.violet,
  },
  {
    key: 'restaurant',
    label: 'Restaurant',
    motif: 'Menus · réservations · service',
    a: '#C41E3A',
    b: PAL.teal,
  },
  { key: 'coach', label: 'Coach', motif: 'Offres · séances · clarté', a: PAL.violet, b: PAL.teal },
  {
    key: 'avocat',
    label: 'Avocat',
    motif: 'Dossiers · rendez-vous · confiance',
    a: '#C9A96E',
    b: PAL.teal,
  },
  {
    key: 'estheticienne',
    label: 'Beauté',
    motif: 'Réservation · soins · calme',
    a: '#C9748F',
    b: PAL.violet,
  },
  {
    key: 'barbier',
    label: 'Barbershop',
    motif: 'Rendez-vous · services · style',
    a: '#C9A96E',
    b: PAL.violet,
  },
  {
    key: 'coiffeur',
    label: 'Coiffeur',
    motif: 'Créneaux · prestations · avis',
    a: PAL.teal,
    b: '#2D6A4F',
  },
  {
    key: 'boulangerie',
    label: 'Boulangerie',
    motif: 'Commandes · horaires · produits',
    a: '#E8A044',
    b: PAL.teal,
  },
  {
    key: 'cils',
    label: 'Extensions de cils',
    motif: 'Créneaux · avant/après · soin',
    a: '#F4A0B0',
    b: PAL.violet,
  },
  {
    key: 'ongles',
    label: 'Ongles',
    motif: 'Nail art · réservation · galerie',
    a: '#F4A0B0',
    b: PAL.teal,
  },
  {
    key: 'trainer',
    label: 'Coach sportif',
    motif: 'Programmes · suivi · résultats',
    a: PAL.green,
    b: PAL.teal,
  },
  {
    key: 'tatoueuse',
    label: 'Tatouage',
    motif: 'Flash · hygiène · projets',
    a: PAL.violet,
    b: PAL.blue,
  },
  {
    key: 'sur-mesure',
    label: 'Sur mesure',
    motif: 'Identité · parcours · conversion',
    a: PAL.teal,
    b: PAL.violet,
  },
];

async function main() {
  ensureDir(outDir);
  for (const s of SECTEURS) {
    const dir = path.join(outDir, s.key);
    ensureDir(dir);

    // Hero desktop + mobile
    const heroDesktopSvg = svgHero({
      w: 1600,
      h: 900,
      seed: `pinapp-${s.key}-hero-desktop`,
      accentA: s.a,
      accentB: s.b,
      label: s.label,
      motif: s.motif,
    });
    const heroMobileSvg = svgHero({
      w: 1000,
      h: 1400,
      seed: `pinapp-${s.key}-hero-mobile`,
      accentA: s.a,
      accentB: s.b,
      label: s.label,
      motif: s.motif,
    });

    svgToWebp(heroDesktopSvg, path.join(dir, 'hero-desktop.webp'), 1600);
    svgToWebp(heroMobileSvg, path.join(dir, 'hero-mobile.webp'), 1000);

    // Compat: fichiers attendus par demo-photo-packs.js (assets/images/demo-<k>-hero.webp)
    svgToWebp(heroDesktopSvg, path.join(root, 'assets', 'images', `demo-${s.key}-hero.webp`), 1600);

    // Vignettes galerie (6)
    for (let i = 1; i <= 6; i++) {
      const galSvg = svgHero({
        w: 1200,
        h: 900,
        seed: `pinapp-${s.key}-gal-${i}`,
        accentA: s.a,
        accentB: s.b,
        label: `${s.label}`,
        motif: `Vignette ${i}`,
      });
      svgToWebp(galSvg, path.join(dir, `gal-${i}.webp`), 1200);
    }

    // “preuve” petite
    const proofSvg = svgHero({
      w: 800,
      h: 600,
      seed: `pinapp-${s.key}-proof`,
      accentA: s.a,
      accentB: s.b,
      label: s.label,
      motif: 'Extrait de démonstration',
    });
    svgToWebp(proofSvg, path.join(dir, `proof.webp`), 800);
  }

  // Compat: certains sites démo référencent photoHero=hero-*.webp (barbier/coiffeur/boulangerie)
  for (const key of ['barbier', 'coiffeur', 'boulangerie']) {
    const s = SECTEURS.find((x) => x.key === key);
    if (!s) continue;
    const svg = svgHero({
      w: 1600,
      h: 900,
      seed: `pinapp-${s.key}-root-hero`,
      accentA: s.a,
      accentB: s.b,
      label: s.label,
      motif: s.motif,
    });
    svgToWebp(svg, path.join(root, 'assets', 'images', `hero-${key}.webp`), 1600);
  }

  console.log('demo-pack: generated in', outDir);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
