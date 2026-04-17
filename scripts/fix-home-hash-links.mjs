import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === '.git') continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (ent.name.endsWith('.html')) out.push(full);
  }
  return out;
}

let n = 0;
for (const full of walk(ROOT)) {
  let s = fs.readFileSync(full, 'utf8');
  const orig = s;
  s = s.split('href="/#offres"').join('href="/offres/"');
  s = s.split('href="/#portfolio"').join('href="/demo/"');
  if (s !== orig) {
    fs.writeFileSync(full, s, 'utf8');
    n++;
  }
}
console.log('fix-home-hash-links:', n, 'files');
