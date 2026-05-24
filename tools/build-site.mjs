/**
 * Artefact publiable _site/ — mêmes exclusions que l’ancien rsync CI (sans outils / .github).
 * Puis injection optionnelle AURALIS_APP_URL (voir inject-auralis-env.mjs).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { injectAuralisAppUrl } from './inject-auralis-env.mjs';
import { injectAutomationConfig } from './inject-automation-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dest = path.join(root, '_site');

/** Charge .env + pinapp-automation.env (sans dépendance) — ne remplace pas les variables déjà définies. */
function loadDotEnvFiles() {
  for (const name of ['.env', 'pinapp-automation.env']) {
    const p = path.join(root, name);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split(/\n/)) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq < 1) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}
loadDotEnvFiles();

const excludeTop = new Set([
  '.git',
  '.github',
  'node_modules',
  '_site',
  'tools',
  'pinapp.ps1',
  '.cursor',
  '.cursorrules',
  '.gitattributes',
  '.env',
  'pinapp-automation.env',
  '.htpasswd',
  'dist',
  // Projet Mémoire & Présence abandonné : conservé dans le dépôt, jamais publié sur le site.
  'memoire-et-presence',
]);

// Fichiers M&P imbriqués dans des dossiers partagés : gardés dans le dépôt, exclus du site publié.
const excludePathRel = new Set([
  'storyboard/memoire-presence-guide-micha.html',
  'assets/css/mp-v6.css',
  'n8n-workflows/06-mp-contact-entrant.json',
  'n8n-workflows/W5-mp-contact.json',
  'n8n-workflows/W10-mp-micha-telegram-approval.json',
]);

function copyTree(srcDir, rel = '') {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const e of entries) {
    if (rel === '' && excludeTop.has(e.name)) continue;
    const from = path.join(srcDir, e.name);
    const r = path.join(rel, e.name);
    if (excludePathRel.has(r.split(path.sep).join('/'))) continue;
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

/**
 * Promote voyage-v9/ HTML to _site root (legacy home) when racine is still l’ancienne DA.
 * Si index.html racine est déjà la home AVALON (voyage-sunmetalon), ne pas écraser.
 * _site/voyage-v9/ reste (miroir + assets pour pages qui y pointent encore).
 */
function promoteVoyageV9(siteDir) {
  const rootIndex = path.join(siteDir, 'index.html');
  if (fs.existsSync(rootIndex)) {
    const raw = fs.readFileSync(rootIndex, 'utf8');
    if (raw.includes('voyage-sunmetalon') || raw.includes('#bgstage')) {
      console.log(
        '[promoteVoyageV9] skip — racine déjà home AVALON (voyage-sunmetalon), pas de promotion v9',
      );
      return;
    }
  }

  const v9Dir = path.join(siteDir, 'voyage-v9');
  if (!fs.existsSync(v9Dir)) {
    console.log('[promoteVoyageV9] voyage-v9/ absent dans _site, skip');
    return;
  }

  const backups = [
    ['index.html', 'index-legacy.html'],
    ['histoire.html', 'histoire-legacy.html'],
  ];
  for (const [from, to] of backups) {
    const src = path.join(siteDir, from);
    const dst = path.join(siteDir, to);
    if (fs.existsSync(src)) {
      if (fs.existsSync(dst)) fs.rmSync(dst, { force: true });
      fs.renameSync(src, dst);
      console.log('[promoteVoyageV9] backup', from, '→', to);
    }
  }

  function rewritePromotedHtml(raw) {
    let content = raw;
    content = content.replace(/https:\/\/pinapp\.fr\/voyage-v9\//g, 'https://pinapp.fr/');
    /* Images / logo JSON-LD : après remplacement ci-dessus ils pointent vers /assets/ racine alors que les fichiers sont sous /voyage-v9/assets/ */
    content = content.replace(/https:\/\/pinapp\.fr\/assets\//g, 'https://pinapp.fr/voyage-v9/assets/');
    content = content.replace(/pinapp-voyage-v9-build/g, 'pinapp-home-build');
    /* Chemins relatifs assets/ → voyage-v9/assets/ (fichiers réels restent sous _site/voyage-v9/) */
    const assetReplacers = [
      [/url\('assets\//g, "url('voyage-v9/assets/"],
      [/url\("assets\//g, 'url("voyage-v9/assets/'],
      [/url\(assets\//g, 'url(voyage-v9/assets/'],
      [/"assets\//g, '"voyage-v9/assets/'],
      [/'assets\//g, "'voyage-v9/assets/"],
    ];
    for (const [re, rep] of assetReplacers) {
      content = content.replace(re, rep);
    }
    return content;
  }

  const filesToPromote = ['index.html', 'histoire.html'];
  for (const f of filesToPromote) {
    const src = path.join(v9Dir, f);
    const dst = path.join(siteDir, f);
    if (!fs.existsSync(src)) continue;
    const out = rewritePromotedHtml(fs.readFileSync(src, 'utf8'));
    fs.writeFileSync(dst, out, 'utf8');
    console.log('[promoteVoyageV9] promoted', f, '→ racine _site (', out.length, 'octets)');
  }
  console.log('[promoteVoyageV9] OK — / sert le HTML voyage-v9 ; assets sous /voyage-v9/assets/');
}

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });
copyTree(root);
fs.writeFileSync(path.join(dest, '.nojekyll'), '');

const cfg = path.join(dest, 'assets/js/auralis-config.js');
if (fs.existsSync(cfg)) {
  injectAuralisAppUrl(cfg);
}

const auto = injectAutomationConfig(dest);
if (auto.configUrl || auto.flags || auto.tally) {
  console.log(
    'build-site: automatisations →',
    [
      auto.configUrl && 'webhooks n8n',
      auto.flags && 'feature flags',
      auto.tally && 'Tally diagnostic',
    ]
      .filter(Boolean)
      .join(', ') || '(rien)',
  );
}

promoteVoyageV9(dest);

if (!fs.existsSync(path.join(dest, 'index.html'))) {
  console.error('build-site: index.html manquant dans _site');
  process.exit(1);
}
if (!fs.existsSync(path.join(dest, 'assets/variables.css'))) {
  console.error('build-site: assets/variables.css manquant dans _site');
  process.exit(1);
}

const cnameDest = path.join(dest, 'CNAME');
if (!fs.existsSync(cnameDest)) {
  console.error('build-site: CNAME manquant dans _site (domaine personnalise GitHub Pages)');
  process.exit(1);
}
const cnameBody = fs.readFileSync(cnameDest, 'utf8').trim();
if (cnameBody !== 'pinapp.fr') {
  console.error('build-site: _site/CNAME doit etre pinapp.fr, trouve :', JSON.stringify(cnameBody));
  process.exit(1);
}

console.log('build-site: OK →', dest);
