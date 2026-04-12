/**
 * Remplace le bloc .nav-links du tiroir mobile par la liste complète des liens pertinents,
 * avec préfixe relatif selon la profondeur du fichier HTML.
 * Usage : node tools/sync-hamburger-menu.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const SKIP_DIRS = new Set([
  'node_modules',
  'demo',
  'admin',
  'docs',
  'tools',
  '_site',
  '.git',
  '.cursor',
]);

const SKIP_FILES = new Set(['index.legacy.html', 'refonte-nav-tabbar-extract.html']);

const ROUTES = [
  ['index.html', 'Accueil'],
  ['offres/index.html', 'Offres'],
  ['comment-ca-marche/index.html', 'Comment &ccedil;a marche'],
  ['pourquoi-pinapp/index.html', 'Pourquoi Pinapp'],
  ['confiance/index.html', 'Confiance'],
  ['expertise-ia/index.html', 'Expertise IA'],
  ['formation-gratuite/index.html', 'Guide offert'],
  ['offres/formation/index.html', 'Formations payantes'],
  ['realisations/index.html', 'R&eacute;alisations'],
  ['a-propos/index.html', '&Agrave; propos'],
  ['faq/index.html', 'FAQ'],
  ['auralis/index.html', 'Auralis'],
  ['univers/index.html', 'Univers'],
  ['votre-projet/index.html', 'Votre projet'],
  ['client/index.html', 'Espace client'],
];

function relPrefix(fileDir) {
  const norm = String(fileDir).replace(/\\/g, '/');
  if (!norm || norm === '.') return '';
  const parts = norm.split('/').filter((s) => s && s !== '.');
  if (parts.length === 0) return '';
  return parts.map(() => '../').join('');
}

function buildDrawerNavLinksFixed(p) {
  const lines = ['        <div class="nav-links">'];
  for (const [href, label] of ROUTES) {
    lines.push(
      `          <a href="${p}${href}" class="nav-link" style="font-size: 14px; opacity: 0.8">${label}</a>`,
    );
  }
  lines.push(
    `          <a href="${p}diagnostic/index.html" class="btn btn-primary" style="font-size: 13px; padding: 10px 20px"`,
  );
  lines.push(`            >Diagnostic offert &mdash; par &eacute;crit</a>`);
  lines.push(`        </div>`);
  return lines.join('\n');
}

const DRAWER_NAV_REGEX =
  /<div class="mobile-drawer-panel">[\s\S]*?<button type="button" id="drawerClose"[^>]*>[\s\S]*?<\/button>\s*<div class="nav-links">[\s\S]*?<\/div>/;

/** Ancien tiroir : bouton × puis 3 liens hors .nav-links puis .nav-links (client, legal, dashboard). */
const DRAWER_ALT_PREFIX_REGEX =
  /<button type="button" id="drawerClose" aria-label="Fermer le menu">×<\/button>\s*<a href="\.\.\/pourquoi-pinapp\/index\.html">Pourquoi Pinapp<\/a>\s*<a href="\.\.\/comment-ca-marche\/index\.html">Comment ça marche<\/a>\s*<a href="\.\.\/offres\/index\.html">Offres<\/a>\s*<div class="nav-links">[\s\S]*?<\/div>/;

/** Page Univers : liens bruts sans .nav-links. */
const DRAWER_UNIVERS_REGEX =
  /(<button type="button" id="drawerClose" aria-label="Fermer le menu">\s*<svg[\s\S]*?<\/svg>\s*<\/button>)\s*<a href="\.\.\/auralis\/index\.html">Auralis<\/a>\s*<a href="index\.html"[^>]*>Univers<\/a>\s*<a href="\.\.\/offres\/index\.html">Offres<\/a>\s*<a href="\.\.\/realisations\/index\.html">Réalisations<\/a>\s*<a href="\.\.\/a-propos\/index\.html">À propos<\/a>\s*<a href="\.\.\/faq\/index\.html">FAQ<\/a>\s*<a href="\.\.\/diagnostic\/index\.html" class="btn btn-primary"[^>]*>Démarrer ma demande<\/a>/;

function walkHtmlFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walkHtmlFiles(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

const files = walkHtmlFiles(root).filter((f) => {
  const base = path.basename(f);
  if (SKIP_FILES.has(base)) return false;
  const rel = path.relative(root, f).replace(/\\/g, '/');
  if (rel.startsWith('demo/') || rel.startsWith('admin/') || rel.startsWith('docs/')) return false;
  return true;
});

let updated = 0;
let skipped = 0;

for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  if (!text.includes('class="mobile-drawer-panel"') || !text.includes('id="drawerClose"')) {
    skipped++;
    continue;
  }
  const relDir = path.dirname(path.relative(root, file));
  const p = relPrefix(relDir);

  const mStd = text.match(DRAWER_NAV_REGEX);
  const mAlt = text.match(DRAWER_ALT_PREFIX_REGEX);
  const mUniv = text.match(DRAWER_UNIVERS_REGEX);

  if (mStd) {
    const head = mStd[0].split(/<div class="nav-links">/)[0].replace(/\s+$/, '');
    text = text.replace(DRAWER_NAV_REGEX, head + '\n' + buildDrawerNavLinksFixed(p));
    fs.writeFileSync(file, text, 'utf8');
    updated++;
    continue;
  }
  if (mAlt) {
    const repl =
      '<button type="button" id="drawerClose" aria-label="Fermer le menu">×</button>\n' + buildDrawerNavLinksFixed(p);
    text = text.replace(DRAWER_ALT_PREFIX_REGEX, repl);
    fs.writeFileSync(file, text, 'utf8');
    updated++;
    continue;
  }
  if (mUniv) {
    text = text.replace(DRAWER_UNIVERS_REGEX, mUniv[1] + '\n' + buildDrawerNavLinksFixed(p));
    fs.writeFileSync(file, text, 'utf8');
    updated++;
    continue;
  }

  console.warn('No match (pattern):', path.relative(root, file));
  skipped++;
}

console.log(`Hamburger menu synced: ${updated} files, skipped ${skipped}.`);
