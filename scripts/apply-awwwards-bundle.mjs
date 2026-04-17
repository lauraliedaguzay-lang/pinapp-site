/**
 * Injecte curseur + feuille pp-awwwards + vendor (local) + effets sur toutes les pages HTML,
 * sauf auralis/, legal/, emails/.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const SKIP_RE =
  /([/\\]auralis[/\\])|([/\\]legal[/\\])|([/\\]emails[/\\])|lead-magnet-auralis\.html|index\.(backup|tdah-backup|legacy)|index-home-2026-archived/i;

const CURSOR =
  '<div class="pp-cursor-dot" aria-hidden="true"></div>\n<div class="pp-cursor-circle" aria-hidden="true"></div>\n';

const LINK = '<link rel="stylesheet" href="/assets/css/pp-awwwards.css?v=20260416" />\n';

const SCRIPTS =
  '<script src="/assets/vendor/gsap.min.js?v=3.12.5" defer></script>\n' +
  '<script src="/assets/vendor/ScrollTrigger.min.js?v=3.12.5" defer></script>\n' +
  '<script src="/assets/vendor/lenis.min.js?v=1.1.18" defer></script>\n' +
  '<script src="/assets/js/pp-awwwards-effects.js?v=20260416" defer></script>\n';

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === '_site') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function patch(content, rel) {
  if (!content.includes('</body>')) return null;
  if (content.includes('pp-awwwards-effects.js')) return null;

  let out = content;

  if (!out.includes('pp-cursor-dot')) {
    out = out.replace(/<body([^>]*)>/i, (m, attrs) => `<body${attrs}>\n${CURSOR}`);
  }

  if (!out.includes('pp-awwwards.css')) {
    out = out.replace(/<\/head>/i, `${LINK}</head>`);
  }

  if (!out.includes('pp-awwwards-effects.js')) {
    out = out.replace(/<\/body>/i, `${SCRIPTS}</body>`);
  }

  return out === content ? null : out;
}

const files = walk(ROOT);
let n = 0;
let err = 0;
for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (SKIP_RE.test(file)) continue;
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const next = patch(raw, rel);
    if (next) {
      fs.writeFileSync(file, next, 'utf8');
      n++;
      console.log('patched', rel);
    }
  } catch (e) {
    err++;
    console.error('skip', rel, e && e.message);
  }
}
console.log('done, patched', n, 'files, errors', err);
