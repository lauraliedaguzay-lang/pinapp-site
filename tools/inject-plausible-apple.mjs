/**
 * Insère Plausible (sans cookies) + apple-touch-icon Pinapp avant </head>
 * sur tous les .html (hors node_modules, _site, .git).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PLAUSIBLE =
  '    <script defer data-domain="pinapp.fr" src="https://plausible.io/js/script.js"></script>\n';
const APPLE = '    <link rel="apple-touch-icon" href="/assets/images/pinapp-icon.png" />\n';

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (['node_modules', '_site', '.git'].includes(ent.name)) continue;
      walk(p, acc);
    } else if (ent.isFile() && ent.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

let files = 0;
let touched = 0;

for (const file of walk(root)) {
  files++;
  let t = fs.readFileSync(file, 'utf8');
  if (!/<head[\s>]/i.test(t)) continue;
  const lower = t.toLowerCase();
  const idx = lower.lastIndexOf('</head>');
  if (idx < 0) continue;

  let insert = '';
  if (!t.includes('plausible.io/js/script')) insert += PLAUSIBLE;

  const hasPinappApple = /rel\s*=\s*["']apple-touch-icon["'][^>]*pinapp-icon\.png/i.test(t);
  if (!hasPinappApple) insert += APPLE;

  if (!insert) continue;

  t = t.slice(0, idx) + insert + t.slice(idx);
  fs.writeFileSync(file, t, 'utf8');
  touched++;
}

console.log('HTML files scanned:', files, '| patched:', touched);
