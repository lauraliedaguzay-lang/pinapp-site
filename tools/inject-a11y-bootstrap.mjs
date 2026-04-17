/**
 * Insère le script pinapp-a11y-bootstrap.js avant pinapp-master-v3.js (chemin relatif ou absolu).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TAG = '<script src="/assets/js/pinapp-a11y-bootstrap.js" defer></script>';

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (/node_modules|^_site$|^\.git$/.test(name.name)) continue;
      walk(p, out);
    } else if (name.isFile() && name.name.endsWith('.html')) out.push(p);
  }
  return out;
}

let n = 0;
for (const file of walk(root)) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  if (/^emails\//.test(rel) || /^tools\/html-includes\//.test(rel)) continue;
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes('pinapp-a11y-bootstrap.js')) continue;
  const re = /([\t ]*)<script([^>]*pinapp-master-v3\.js[^>]*)><\/script>/;
  if (!re.test(s)) continue;
  s = s.replace(re, '$1' + TAG + '\n$1<script$2></script>');
  fs.writeFileSync(file, s, 'utf8');
  n++;
}
console.log('Fichiers mis à jour :', n);
