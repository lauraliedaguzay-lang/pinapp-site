/**
 * Garde-fous statiques — même logique que .github/workflows/site-checks.yml (fichiers critiques).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const required = [
  'pinapp.ps1',
  'index.html',
  'CNAME',
  'robots.txt',
  'sitemap.xml',
  '.htaccess',
  'SECURITY.md',
  '.well-known/security.txt',
  'assets/variables.css',
  'assets/css/pinapp-ux-premium.css',
  'assets/css/pinapp-apple-polish.css',
  'assets/js/pinapp-universal.js',
  'engagements/charge-mentale.html',
  'assets/images/og-pinapp-share.png',
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

const cnamePath = path.join(root, 'CNAME');
if (fs.existsSync(cnamePath)) {
  const cname = fs.readFileSync(cnamePath, 'utf8').trim();
  if (cname !== 'pinapp.fr') {
    console.error(
      'verify-site: CNAME doit contenir exactement pinapp.fr (ligne unique), trouvé :',
      JSON.stringify(cname),
    );
    err = 1;
  }
}

process.exit(err);
