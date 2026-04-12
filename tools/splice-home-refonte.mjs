/**
 * Remplace le corps principal de la home (après le hero) par le fragment refonte.
 * Usage : node tools/splice-home-refonte.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const fragmentPath = path.join(__dirname, 'home-refonte-body-fragment.html');

const END_MARK = '    </main>';

let html = fs.readFileSync(indexPath, 'utf8');
const anchor = html.indexOf("<!-- PREUVE PAR L'EXEMPLE");
if (anchor === -1) {
  console.error('Ancre PREUVE introuvable.');
  process.exit(1);
}
const start = html.lastIndexOf('<div class="section-separator"', anchor);
if (start === -1) {
  console.error('section-separator avant PREUVE introuvable.');
  process.exit(1);
}
const end = html.indexOf(END_MARK);
if (end === -1 || end <= start) {
  console.error('Fin </main> introuvable ou ordre invalide.', { start, end });
  process.exit(1);
}

const fragment = fs.readFileSync(fragmentPath, 'utf8');
const before = html.slice(0, start);
const after = html.slice(end);
const next = before + fragment + '\n' + after;
fs.writeFileSync(indexPath, next, 'utf8');
console.log('OK — index.html mis à jour (fragment inséré).');
