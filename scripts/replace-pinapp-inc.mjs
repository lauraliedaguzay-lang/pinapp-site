import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

/** Ne pas toucher à la page mentions légales (entité juridique). */
function skipFile(rel) {
  return rel === 'legal/mentions-legales.html';
}

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === '.git') continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (/\.(html|json)$/i.test(ent.name)) out.push(full);
  }
  return out;
}

let n = 0;
for (const full of walk(ROOT)) {
  const rel = path.relative(ROOT, full).split(path.sep).join('/');
  if (skipFile(rel)) continue;
  let s = fs.readFileSync(full, 'utf8');
  const orig = s;
  s = s.replace(/PINAPP INC\./g, 'PINAPP');
  s = s.replace(/Pinapp Inc\./g, 'Pinapp');
  if (s !== orig) {
    fs.writeFileSync(full, s, 'utf8');
    n++;
  }
}
console.log('replace-pinapp-inc: files updated', n);
