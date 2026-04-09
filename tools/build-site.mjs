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

function walkFiles(dir, cb) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(p, cb);
    else cb(p);
  }
}

function patchHtmlArtifacts() {
  // Conformité build GitHub Pages: éviter les 404 sur assets legacy.
  // - logo: pinapp-logo.png -> pinapp-logo.svg
  // - preload font: inter-var.woff2 absent du repo => retirer
  // - fonds Pandora: versions png/webp non livrées => utiliser svg
  const repl = [
    [/assets\/images\/pinapp-logo\.png/g, 'assets/images/pinapp-logo.svg'],
    [/\/assets\/images\/pinapp-logo\.png/g, '/assets/images/pinapp-logo.svg'],
    [/src="([^"]*?)pinapp-logo\.png"/g, 'src="$1pinapp-logo.svg"'],
    [/href="([^"]*?)assets\/fonts\/inter-var\.woff2"[^>]*>\s*/g, ''],
    [/bg-dark-pandora-apple\.(webp|png)/g, 'bg-dark-pandora-apple.svg'],
    [/bg-light-pandora-apple\.(webp|png)/g, 'bg-light-pandora-apple.svg'],
  ];

  walkFiles(dest, (p) => {
    if (!p.endsWith('.html')) return;
    let s = fs.readFileSync(p, 'utf8');
    const before = s;
    for (const [re, r] of repl) s = s.replace(re, r);
    if (s !== before) fs.writeFileSync(p, s);
  });
}

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

patchHtmlArtifacts();

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
