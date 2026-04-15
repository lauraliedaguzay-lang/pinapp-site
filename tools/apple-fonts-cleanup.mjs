/**
 * Retire preloads woff2 Clash/Inter, liens Google Fonts / Bunny,
 * et remplace les font-family inline Clash par la pile Apple.
 * Usage : node tools/apple-fonts-cleanup.mjs (depuis la racine pinapp-site)
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SKIP = new Set(['node_modules', '_site', '.git']);

const APPLE_INLINE =
  "font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

function walkHtml(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.name.startsWith('.')) continue;
    const p = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (SKIP.has(name.name)) continue;
      walkHtml(p, out);
    } else if (name.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function cleanHtml(raw) {
  let c = raw;
  c = c.replace(/\r\n/g, '\n');
  // Preloads self-hosted (ligne entière, avec ou sans saut de ligne initial)
  c = c.replace(
    /<link rel="preload" href="[^"]*(?:ClashDisplay|Inter-Regular|inter-var)[^"]*"[^>]*>\s*/gi,
    '',
  );
  c = c.replace(
    /<link rel="preload" href="\.\.\/assets\/fonts\/(?:ClashDisplay|Inter)[^"]*"[^>]*>\s*/gi,
    '',
  );
  // Google Fonts
  c = c.replace(
    /\n[ \t]*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"[^>]*>\s*/gi,
    '\n',
  );
  c = c.replace(
    /\n[ \t]*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com"[^>]*>\s*/gi,
    '\n',
  );
  c = c.replace(
    /\n[ \t]*<link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]*Inter[^"]*" rel="stylesheet"[^>]*>\s*/gi,
    '\n',
  );
  // Bunny (Inter, Bebas, Syne, etc.)
  c = c.replace(
    /\n[ \t]*<link rel="preconnect" href="https:\/\/fonts\.bunny\.net"[^>]*>\s*/gi,
    '\n',
  );
  c = c.replace(
    /\n[ \t]*<link rel="stylesheet" href="https:\/\/fonts\.bunny\.net\/css[^"]*"[^>]*>\s*/gi,
    '\n',
  );
  // Inline Clash
  c = c.replace(/font-family:\s*'Clash Display',\s*sans-serif/gi, APPLE_INLINE);
  c = c.replace(/font-family:\s*"Clash Display",\s*sans-serif/gi, APPLE_INLINE);
  c = c.replace(
    /font-family:\s*'Inter',\s*system-ui,\s*sans-serif/gi,
    "font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  );
  c = c.replace(
    /font-family="Jost,sans-serif"/gi,
    'font-family="system-ui,-apple-system,sans-serif"',
  );
  c = c.replace(
    /font-family:\s*Jost,\s*sans-serif/gi,
    'font-family: -apple-system, BlinkMacSystemFont, sans-serif',
  );
  c = c.replace(
    /font-family:\s*'Bebas Neue',\s*sans-serif/gi,
    "font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
  );
  c = c.replace(
    /font-family:\s*Georgia,\s*'Times New Roman',\s*serif/gi,
    "font-family: ui-serif, 'Iowan Old Style', 'Apple Garamond', 'Times New Roman', serif",
  );
  c = c.replace(
    /font-family:\s*Georgia,\s*serif/gi,
    "font-family: ui-serif, 'Iowan Old Style', 'Apple Garamond', serif",
  );
  c = c.replace(
    /font-family:Georgia,serif/gi,
    "font-family:ui-serif,'Iowan Old Style','Apple Garamond',serif",
  );
  c = c.replace(/typo:\s*'Inter'/g, "typo: 'SF Pro'");
  c = c.replace(/typo:\s*'Georgia'/g, "typo: 'New York'");
  return c;
}

const APPLE_SANS = `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif`;
const APPLE_DISPLAY = `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif`;
const APPLE_SERIF = `ui-serif, 'Iowan Old Style', 'Apple Garamond', 'Times New Roman', serif`;

const CSS_FILES = [
  'assets/css/home-2026.css',
  'assets/css/offres.css',
  'assets/css/deploy-harmonise.css',
  'assets/css/pinapp-cosmos-v1.css',
  'assets/css/refonte-conformite.css',
  'assets/css/demo-sector.css',
  'assets/css/univers.css',
  'assets/css/refonte-home.css',
  'demo/demo-hero.css',
  'assets/css/demo-tatoueuse.css',
  'assets/grid.css',
];

function cleanCss(raw) {
  let c = raw;
  c = c.replace(
    /font-family:\s*'Clash Display',\s*system-ui,\s*sans-serif;/g,
    `font-family: ${APPLE_DISPLAY};`,
  );
  c = c.replace(/font-family:\s*Inter,\s*system-ui,\s*sans-serif;/g, `font-family: ${APPLE_SANS};`);
  c = c.replace(
    /font-family:\s*Georgia,\s*'Times New Roman',\s*serif;/g,
    `font-family: ${APPLE_SERIF};`,
  );
  c = c.replace(/font-family:\s*Georgia,\s*serif;/g, `font-family: ${APPLE_SERIF};`);
  c = c.replace(
    /--font-serif:\s*Georgia,\s*'Times New Roman',\s*Times,\s*serif;/g,
    `--font-serif: ${APPLE_SERIF};`,
  );
  c = c.replace(/font-family:\s*Inter,\s*system-ui,\s*sans-serif;/g, `font-family: ${APPLE_SANS};`);
  // Demo tatoueuse
  c = c.replace(
    /font-family:\s*'Syne',\s*system-ui,\s*sans-serif;/g,
    `font-family: ${APPLE_DISPLAY};`,
  );
  c = c.replace(/font-family:\s*'Bebas Neue',\s*sans-serif;/g, `font-family: ${APPLE_DISPLAY};`);
  return c;
}

let htmlChanged = 0;
for (const f of walkHtml(ROOT)) {
  const raw = fs.readFileSync(f, 'utf8');
  const next = cleanHtml(raw);
  if (next !== raw) {
    fs.writeFileSync(f, next);
    htmlChanged++;
  }
}

let cssChanged = 0;
for (const rel of CSS_FILES) {
  const f = path.join(ROOT, rel);
  if (!fs.existsSync(f)) continue;
  const raw = fs.readFileSync(f, 'utf8');
  const next = cleanCss(raw);
  if (next !== raw) {
    fs.writeFileSync(f, next);
    cssChanged++;
  }
}

console.log(`apple-fonts-cleanup: ${htmlChanged} HTML, ${cssChanged} CSS modifiés.`);
