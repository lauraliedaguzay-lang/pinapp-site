/**
 * Injecte pinapp-fix-mobile.css avant </head> sur toutes les pages HTML (hors _site, node_modules).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const skipDirs = new Set(['node_modules', '_site', '.git', 'dist']);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith('.html') && ent.name !== '404.html') out.push(p);
  }
  return out;
}

function prefixFor(file) {
  const rel = path.relative(root, path.dirname(file));
  const depth = rel === '' ? 0 : rel.split(path.sep).length;
  return depth === 0 ? '/' : '../'.repeat(depth);
}

let n = 0;
for (const file of walk(root)) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('pinapp-fix-mobile.css')) continue;
  const pre = prefixFor(file);
  const href = `${pre}assets/css/pinapp-fix-mobile.css`.replace(/\/\//g, '/').replace(':/', '://');
  const link = `  <link rel="stylesheet" href="${href}"/>\n`;
  if (!html.includes('</head>')) continue;
  html = html.replace('</head>', `${link}</head>`);
  html = html.replace(
    /width=device-width,\s*initial-scale=1\.0"/g,
    'width=device-width, initial-scale=1.0, viewport-fit=cover"',
  );
  html = html.replace(
    /width=device-width,\s*initial-scale=1\.0'/g,
    "width=device-width, initial-scale=1.0, viewport-fit=cover'",
  );
  fs.writeFileSync(file, html, 'utf8');
  n++;
}
console.log(`inject-pinapp-fix-mobile: ${n} fichier(s) mis à jour`);
