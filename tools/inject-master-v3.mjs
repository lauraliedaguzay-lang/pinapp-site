/**
 * Injecte pinapp-master-v3.css (avant </head>) et .js (avant </body>) comme le script PS.
 * Exclut _site et node_modules. Corrige viewport + Je -> Nous.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function walkHtml(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name === '_site' || name.name === 'node_modules' || name.name === '.git') continue;
      walkHtml(p, out);
    } else if (name.name.endsWith('.html')) {
      out.push(p);
    }
  }
  return out;
}

function prefixFor(htmlPath) {
  const rel = path.relative(root, path.dirname(htmlPath));
  if (!rel || rel === '.') return '/';
  const depth = rel.split(path.sep).filter(Boolean).length;
  return '../'.repeat(depth);
}

let updated = 0;
for (const file of walkHtml(root)) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  const pref = prefixFor(file);

  if (!content.includes('pinapp-master-v3.css')) {
    content = content.replace(
      /<\/head>/i,
      `  <link rel="stylesheet" href="${pref}assets/css/pinapp-master-v3.css"/>\n</head>`,
    );
    changed = true;
  }
  if (!content.includes('pinapp-master-v3.js')) {
    content = content.replace(
      /<\/body>/i,
      `  <script src="${pref}assets/js/pinapp-master-v3.js" defer></script>\n</body>`,
    );
    changed = true;
  }
  if (!content.includes('viewport-fit=cover')) {
    content = content.replace(
      /width=device-width,\s*initial-scale=1\.0"/g,
      'width=device-width, initial-scale=1.0, viewport-fit=cover"',
    );
    changed = true;
  }
  const next = content
    .replace(/Je connecte vos outils\./g, 'Nous connectons vos outils.')
    .replace(/Je livre/g, 'Nous livrons');
  if (next !== content) {
    content = next;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    updated++;
  }
}

console.log('inject-master-v3:', updated, 'fichiers HTML modifiés');
