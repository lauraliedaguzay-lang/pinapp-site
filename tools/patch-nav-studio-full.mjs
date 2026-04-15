/**
 * Ajoute les liens Studio manquants (réalisations accessibles + tout le parcours)
 * dans les menus Pinapp Inc. : dropdown desktop + tiroir mobile.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const EXTRA_14 = `              <a href="/pourquoi-pinapp/">Pourquoi Pinapp</a>
              <a href="/comment-ca-marche/">Comment ça marche</a>
              <a href="/votre-projet/">Votre projet</a>
              <a href="/confiance/">Confiance</a>
              <a href="/faq/">FAQ</a>
              <a href="/expertise-ia/">IA &amp; systèmes</a>
              <a href="/formation-gratuite/">Formation IA gratuite</a>
              <a href="/univers/">Univers créatif</a>
              <a href="/client/">Espace client</a>`;

const EXTRA_10 = `          <a href="/pourquoi-pinapp/">Pourquoi Pinapp</a>
          <a href="/comment-ca-marche/">Comment ça marche</a>
          <a href="/votre-projet/">Votre projet</a>
          <a href="/confiance/">Confiance</a>
          <a href="/faq/">FAQ</a>
          <a href="/expertise-ia/">IA &amp; systèmes</a>
          <a href="/formation-gratuite/">Formation IA gratuite</a>
          <a href="/univers/">Univers créatif</a>
          <a href="/client/">Espace client</a>`;

const MARK = '<!-- pinapp-nav-studio-extra -->';
if (EXTRA_14.includes(MARK)) throw new Error('marker collision');

const dropRe =
  /(              <a href="\/a-propos\/">Notre studio<\/a>)\n(            <\/div>\n          <\/li>\n          <li class="nav__item">\n            <a class="nav__link" href="\/auralis\/[\s\S]*?>)/g;

const drawerRichRe =
  /(          <a href="\/a-propos\/">Notre studio<\/a>)\n(        <\/div>\n        <div class="nav__drawer-section">\n          <span class="nav__drawer-label">Auralis RH<\/span>)/g;

const drawerCompactRe =
  /(          <a href="\/offres\/formation\/">Formations<\/a>)\n(        <\/div>\n        <div class="nav__drawer-section">\n          <span class="nav__drawer-label">Auralis RH<\/span>)/g;

const richDrawerFiles = new Set(['index.html', 'offres/index.html', 'diagnostic/index.html']);

const compactDrawerFiles = new Set([
  'a-propos/index.html',
  'engagements/index.html',
  'memoire-et-presence/index.html',
  'offres/formation/index.html',
  'legal/cgv.html',
  'legal/confidentialite.html',
  'legal/mentions.html',
]);

const allNavFiles = new Set([...richDrawerFiles, ...compactDrawerFiles]);

function patchFile(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    console.warn('skip missing', rel);
    return false;
  }
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes(MARK)) return false;
  const orig = s;

  s = s.replace(dropRe, (_, g1, g2) => `${g1}\n${MARK}\n${EXTRA_14}\n${g2}`);

  if (richDrawerFiles.has(rel)) {
    s = s.replace(drawerRichRe, (_, g1, g2) => `${g1}\n${EXTRA_10}\n${g2}`);
  }
  if (compactDrawerFiles.has(rel)) {
    s = s.replace(
      drawerCompactRe,
      (_, g1, g2) => `${g1}\n          <a href="/a-propos/">Notre studio</a>\n${EXTRA_10}\n${g2}`,
    );
  }

  if (s !== orig) {
    fs.writeFileSync(p, s, 'utf8');
    console.log('patched', rel);
    return true;
  }
  return false;
}

let n = 0;
for (const rel of allNavFiles) {
  if (patchFile(rel)) n++;
}
console.log('patch-nav-studio-full: fichiers mis a jour:', n);
