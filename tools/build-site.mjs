/**
 * Artefact publiable _site/ — mêmes exclusions que l’ancien rsync CI (sans outils / .github).
 * Puis injection optionnelle AURALIS_APP_URL (voir inject-auralis-env.mjs).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { injectAuralisAppUrl } from './inject-auralis-env.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dest = path.join(root, '_site');

/** Charge .env à la racine (sans dépendance) — ne remplace pas les variables déjà définies. */
function loadDotEnv() {
  const p = path.join(root, '.env');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq < 1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}
loadDotEnv();

const excludeTop = new Set([
  '.git',
  '.github',
  'node_modules',
  '_site',
  'tools',
  '.cursor',
  '.cursorrules',
  '.gitattributes',
  '.env',
  '.htpasswd',
  'dist',
]);

function copyTree(srcDir, rel = '') {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const e of entries) {
    if (rel === '' && excludeTop.has(e.name)) continue;
    const from = path.join(srcDir, e.name);
    const r = path.join(rel, e.name);
    const to = path.join(dest, r);
    if (e.isDirectory()) {
      fs.mkdirSync(to, { recursive: true });
      copyTree(from, r);
    } else {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
    }
  }
}

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });
copyTree(root);
fs.writeFileSync(path.join(dest, '.nojekyll'), '');

const cfg = path.join(dest, 'assets/js/auralis-config.js');
if (fs.existsSync(cfg)) {
  injectAuralisAppUrl(cfg);
}

if (!fs.existsSync(path.join(dest, 'index.html'))) {
  console.error('build-site: index.html manquant dans _site');
  process.exit(1);
}
if (!fs.existsSync(path.join(dest, 'assets/variables.css'))) {
  console.error('build-site: assets/variables.css manquant dans _site');
  process.exit(1);
}

console.log('build-site: OK →', dest);
