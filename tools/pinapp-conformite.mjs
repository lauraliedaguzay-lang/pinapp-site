/**
 * Conformité SEO / accessibilité de base : viewport-fit, canonical pinapp.fr,
 * lien d'évitement, id sur <main> si manquant.
 * Exclut tools/ (fragments), node_modules, _site, .git.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const SKIP_DIR = new Set(['node_modules', '_site', '.git', 'tools']);

function relPath(abs) {
  return path.relative(ROOT, abs).replace(/\\/g, '/');
}

function shouldProcess(rel) {
  if (!rel.endsWith('.html')) return false;
  const seg = rel.split('/');
  for (const s of seg) {
    if (SKIP_DIR.has(s)) return false;
  }
  return true;
}

function toCanonical(rel) {
  if (rel === 'index.html') return 'https://pinapp.fr/';
  if (rel.endsWith('/index.html')) {
    const dir = rel.slice(0, -'/index.html'.length);
    return 'https://pinapp.fr/' + (dir ? dir + '/' : '');
  }
  return 'https://pinapp.fr/' + rel;
}

function fixViewport(html) {
  return html.replace(
    /<meta\s+name=["']viewport["']\s+content=["']([^"']*)["'](\s*\/?)>/gi,
    (full, c, closing) => {
      if (/viewport-fit\s*=\s*cover/i.test(c)) return full;
      const trimmed = c.trim();
      const newc = trimmed.includes(',')
        ? `${trimmed}, viewport-fit=cover`
        : `${trimmed}, viewport-fit=cover`;
      return `<meta name="viewport" content="${newc}"${closing}>`;
    },
  );
}

function ensureCanonical(html, url) {
  if (/\srel=["']canonical["']/i.test(html)) return html;
  const line = `    <link rel="canonical" href="${url}" />\n`;
  const ch = html.match(/<meta\s+charset=[^>]+\/?>/i);
  if (ch) {
    const i = html.indexOf(ch[0]) + ch[0].length;
    return html.slice(0, i) + '\n' + line + html.slice(i);
  }
  const he = html.indexOf('</head>');
  if (he !== -1) return html.slice(0, he) + line + html.slice(he);
  return html;
}

function ensureMainId(html) {
  if (/\bid=["']main["']/i.test(html) || /\bid=["']contenu-principal["']/i.test(html)) return html;
  let replaced = false;
  return html.replace(/<main([^>]*)>/gi, (full, attrs) => {
    if (replaced) return full;
    if (/\bid\s*=/i.test(attrs)) {
      replaced = true;
      return full;
    }
    replaced = true;
    const a = (attrs || '').trim();
    return '<main id="main"' + (a ? ' ' + a : '') + '>';
  });
}

function detectMainAnchor(html) {
  const m = html.match(/<main[^>]*\bid=["']([^"']+)["']/i);
  if (m) return m[1];
  if (/\bid=["']main["']/i.test(html)) return 'main';
  if (/\bid=["']contenu-principal["']/i.test(html)) return 'contenu-principal';
  return null;
}

function ensureSkip(html, anchor) {
  if (!anchor) return html;
  if (/class=["'][^"']*skip-link/i.test(html)) return html;
  if (
    new RegExp('href=["\']#' + anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '["\']', 'i').test(
      html,
    )
  )
    return html;
  if (/Aller au contenu/i.test(html) && /skip-link|skiplink/i.test(html)) return html;
  const bm = html.match(/<body[^>]*>/i);
  if (!bm) return html;
  const insert = `\n    <a class="skip-link" href="#${anchor}">Aller au contenu</a>\n`;
  const idx = bm.index + bm[0].length;
  return html.slice(0, idx) + insert + html.slice(idx);
}

function patchSpecial(rel, html) {
  if (rel === 'formations/index.html' && !/id=["']contenu-principal["']/i.test(html)) {
    html = html.replace('<p>', '<p id="contenu-principal">');
  }
  return html;
}

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIR.has(ent.name)) continue;
      walk(p, out);
    } else if (ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
let updated = 0;
for (const abs of files) {
  const rel = relPath(abs);
  if (!shouldProcess(rel)) continue;
  let html = fs.readFileSync(abs, 'utf8');
  const orig = html;
  html = patchSpecial(rel, html);
  html = fixViewport(html);
  html = ensureCanonical(html, toCanonical(rel));
  html = ensureMainId(html);
  const anchor = detectMainAnchor(html);
  html = ensureSkip(html, anchor);
  if (html !== orig) {
    fs.writeFileSync(abs, html, 'utf8');
    updated++;
    console.log('pinapp-conformite:', rel);
  }
}
console.log('pinapp-conformite: fichiers modifiés:', updated);
