import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const demoDir = path.join(root, 'demo');

function walkDemoIndexFiles() {
  const out = [];
  const entries = fs.readdirSync(demoDir, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const p = path.join(demoDir, e.name, 'index.html');
    if (fs.existsSync(p)) out.push(p);
  }
  return out.sort();
}

function normalizeOne(html) {
  let out = html;

  // 1) Démos: ne jamais dépendre du thème Pinapp global (localStorage pinapp-theme).
  // Supprime le script inline en tête de <head> qui force data-mode/data-theme.
  out = out.replace(
    /\s*<script>\s*\(function\s*\(\)\s*\{[\s\S]*?localStorage\.getItem\('pinapp-theme'\)[\s\S]*?\}\)\(\);\s*<\/script>\s*/i,
    '\n',
  );

  // 2) Démos: ne pas précharger les backgrounds Pandora Pinapp (spécifiques vitrine).
  out = out.replace(
    /\s*<link\s+rel="preload"\s+as="image"\s+href="..\/..\/assets\/images\/bg-(?:dark|light)-pandora-apple\.(?:png|webp)"[^>]*>\s*/gi,
    '\n',
  );

  // 3) Démos sectorielles: elles doivent charger uniquement demo-sector.css (+ scripts demo).
  // Retire les surcouches Pinapp globales importées à tort.
  const demoCssRemove = [
    '../../assets/css/pandora-dance.css',
    '../../assets/css/ios-glass.css',
    '../../assets/css/apple-finish.css',
    '../../assets/css/pinapp-modern-biolume.css',
  ];
  for (const href of demoCssRemove) {
    out = out.replace(
      new RegExp(
        `\\s*<link[^>]+href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>\\s*`,
        'g',
      ),
      '\n',
    );
  }

  // 4) Retire les scripts Pinapp décoratifs importés à tort dans les démos sectorielles.
  const demoJsRemove = [
    '../../assets/js/pandora-night.js',
    '../../assets/js/particles.js',
    '../../assets/js/cursor.js',
    '../../assets/js/intelligence.js',
    '../../assets/js/scroll-cinema.js',
    '../../assets/js/bio-particles.js',
  ];
  for (const src of demoJsRemove) {
    out = out.replace(
      new RegExp(
        `\\s*<script[^>]+src="${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>\\s*<\\/script>\\s*`,
        'g',
      ),
      '\n',
    );
  }

  // 5) Nettoyage: évite les lignes collées (observé sur demo/tatoueuse après normalisation).
  out = out.replace(/<\/link>\s*<link/g, '</link>\n    <link');
  out = out.replace(/<\/svg><link/g, '</svg>\n    <link');

  // 6) Démo tatoueuse: enlever toute import police externe (doit rester autonome).
  out = out.replace(/\s*<link[^>]+href="https:\/\/fonts\.bunny\.net\/css\?[^"]+"[^>]*>\s*/gi, '\n');

  return out;
}

function main() {
  const files = walkDemoIndexFiles();
  let updated = 0;
  for (const f of files) {
    const before = fs.readFileSync(f, 'utf8');
    const after = normalizeOne(before);
    if (after !== before) {
      fs.writeFileSync(f, after);
      updated++;
    }
  }
  process.stdout.write(`normalize-demos-theme: updated ${updated} file(s)\n`);
}

main();
