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

  // Cahier des charges : un seul CTA primaire par page.
  // Le bandeau cookies ne doit pas utiliser .btn-primary (sinon il "compte" comme CTA primaire).
  // Supporte les deux ordres d'attributs (id avant class ou l'inverse).
  out = out.replace(/(<button\b[^>]*\bid=(["'])cookieAccept\2[^>]*?)\bclass=(["'])btn\s+btn-primary\3/gi, '$1class=$3btn btn-secondary$3');
  out = out.replace(/(<button\b[^>]*\bclass=(["'])btn\s+btn-primary\2[^>]*?)\bid=(["'])cookieAccept\3/gi, (m) => m.replace(/class=(["'])btn\s+btn-primary\1/i, 'class=$1btn btn-secondary$1'));

  // Pré-déploiement (règle admin) : SIRET visible en footer sur chaque page.
  // Sans numéro tant qu’il n’existe pas : afficher la mention "en cours".
  out = out.replace(
    /(Pinapp(?:\s+Studio)?\s+©\s+2026)(<\/p>|<\/span>)/gi,
    'Pinapp Studio © 2026 · SIRET : en cours d’immatriculation$2'
  );

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

