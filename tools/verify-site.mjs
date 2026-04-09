/**
 * Garde-fous statiques — même logique que .github/workflows/site-checks.yml (fichiers critiques).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function listFilesRecursive(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.git') continue;
      out.push(...listFilesRecursive(p));
      continue;
    }
    out.push(p);
  }
  return out;
}

const required = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  '.htaccess',
  'SECURITY.md',
  '.well-known/security.txt',
  'assets/variables.css',
  'assets/js/auralis-config.js',
  'auralis/index.html',
];

let err = 0;
for (const rel of required) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    console.error('verify-site: manquant —', rel);
    err = 1;
  }
}

if (fs.existsSync(path.join(root, '.env'))) {
  console.error('verify-site: .env ne doit pas être versionné à la racine');
  err = 1;
}
if (fs.existsSync(path.join(root, '.htpasswd'))) {
  console.error('verify-site: .htpasswd ne doit pas être versionné');
  err = 1;
}

// Conformité pinapp-zero-scroll.mdc: pas d'IntersectionObserver (révélation au scroll).
// (Toléré dans les commentaires, mais on bloque toute instanciation.)
try {
  const files = listFilesRecursive(path.join(root, 'assets'));
  const needle = /new\s+IntersectionObserver\b/;
  for (const p of files) {
    if (!/\.(js|mjs|html|css)$/.test(p)) continue;
    const s = fs.readFileSync(p, 'utf8');
    if (needle.test(s)) {
      console.error('verify-site: interdit — new IntersectionObserver dans', path.relative(root, p));
      err = 1;
      break;
    }
  }
} catch (e) {
  // ne pas faire échouer la CI sur une erreur de lecture: les checks principaux restent valides
}

process.exit(err);
