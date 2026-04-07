/**
 * Garde-fous statiques — même logique que .github/workflows/site-checks.yml (fichiers critiques).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

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

process.exit(err);
