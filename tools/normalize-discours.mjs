import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function listHtmlFiles(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      // Skip deps/build artifacts
      if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist' || e.name === '_site') continue;
      out.push(...listHtmlFiles(p));
    } else if (e.isFile() && e.name.endsWith('.html')) {
      out.push(p);
    }
  }
  return out;
}

function normalize(html) {
  let out = html;

  // Cahier des charges : pas de terminologie "mode jour/nuit" visible.
  // Sur certaines pages "custom", l'aria-label legacy est encore présent.
  out = out.replace(/\baria-label=(["'])Passer en mode (jour|nuit)\1/gi, 'aria-label=$1Changer le thème$1');
  out = out.replace(/\btitle=(["'])Passer en mode (jour|nuit)\1/gi, 'title=$1Changer le thème$1');

  // Copy : éviter "Pinapp enchaîne" → "Pinapp prépare" (promesse officielle).
  out = out.replace(/Pinapp\s+encha[iî]ne/gi, 'Pinapp prépare');

  return out;
}

const files = listHtmlFiles(root);
let updated = 0;
for (const p of files) {
  const before = fs.readFileSync(p, 'utf8');
  const after = normalize(before);
  if (after !== before) {
    fs.writeFileSync(p, after, 'utf8');
    updated++;
  }
}

console.log(`Normalized discours: ${updated}/${files.length} files updated`);

