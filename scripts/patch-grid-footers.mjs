import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const FILES = [
  'votre-projet/index.html',
  'realisations/index.html',
  'pourquoi-pinapp/index.html',
  'offres/systeme-complet/index.html',
  'offres/starter/index.html',
  'offres/sites/index.html',
  'offres/automatisation/index.html',
  'formation-gratuite/index.html',
  'expertise-ia/index.html',
  'confiance/index.html',
  'comment-ca-marche/index.html',
  'auralis/index.html',
];

const OLD = `          aria-label="Liens footer">
          <a href="https://linkedin.com/in/lauralie-daguzay-4a4542197/" rel="noopener noreferrer" target="_blank"
            >LinkedIn</a
          >
          <a href="mailto:lauralie.daguzay@pinapp.fr">Contact</a>
          <a href="../legal/mentions-legales.html">Mentions légales</a>
          <a href="../legal/cgv.html">CGV</a>
          <a href="../legal/confidentialite.html">Confidentialité</a>
        </nav>`;

const NEW = `          aria-label="Liens footer">
          <a href="../index.html">Accueil</a>
          <a href="../offres/index.html">Offres</a>
          <a href="../realisations/index.html">Réalisations</a>
          <a href="../auralis/index.html">Auralis</a>
          <a href="../diagnostic/index.html">Diagnostic</a>
          <a href="../faq/index.html">FAQ</a>
          <a href="../legal/mentions-legales.html">Mentions légales</a>
          <a href="../legal/cgv.html">CGV</a>
          <a href="../legal/confidentialite.html">Confidentialité</a>
          <a href="https://linkedin.com/in/lauralie-daguzay-4a4542197/" rel="noopener noreferrer" target="_blank"
            >LinkedIn</a
          >
          <a href="mailto:lauralie.daguzay@pinapp.fr">Contact</a>
        </nav>`;

for (const rel of FILES) {
  const abs = path.join(ROOT, rel);
  let t = fs.readFileSync(abs, 'utf8');
  if (!t.includes(OLD)) {
    console.warn('Pattern absent:', rel);
    continue;
  }
  t = t.replace(OLD, NEW);
  fs.writeFileSync(abs, t, 'utf8');
  console.log('OK', rel);
}
