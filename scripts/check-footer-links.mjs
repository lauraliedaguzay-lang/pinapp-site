import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SKIP = new Set(['node_modules', '.git', '_site']);
const SKIP_PREFIX = ['tools/html-includes/', 'pinapp-site-vitrine/'];
const SKIP_FILE = /index\.(backup|tdah-backup)|\.backup\./i;

const NEED = [
  '/faq/',
  '/offres/',
  '/realisations/',
  '/auralis/',
  '/diagnostic/',
  'mentions-legales',
  '/legal/cgv',
  'confidentialite',
  '>accueil</a',
];

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    const rel = path.relative(ROOT, full).replace(/\\/g, '/');
    if (ent.isDirectory()) {
      if (SKIP.has(ent.name)) continue;
      walk(full, acc);
    } else if (ent.name.endsWith('.html')) {
      if (SKIP_FILE.test(rel)) continue;
      if (SKIP_PREFIX.some((p) => rel.startsWith(p))) continue;
      acc.push(rel);
    }
  }
  return acc;
}

const bad = [];
for (const f of walk(ROOT)) {
  if (f.startsWith('tools/') || f.startsWith('storyboard/')) continue;
  const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const i = t.toLowerCase().indexOf('<footer');
  if (i < 0) continue;
  const foot = t.slice(i, i + 15000).toLowerCase();
  if (!NEED.every((k) => foot.includes(k))) bad.push(f);
}
console.log('Sans liens footer complets:', bad.length);
bad.forEach((x) => console.log(x));
