/**
 * Ajoute le lien « Auralis » dans les blocs nav avant « Univers » (une passe).
 * Relancer peut dupliquer le lien — ne pas exécuter deux fois.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function walkHtml(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const rxStandard =
  /^(\s*)<a href="((?:\.\.\/)+|)univers\/index\.html" class="nav-link" style="font-size:14px;opacity:0.8;">Univers<\/a>$/gm;
const rxDrawerPlain =
  /^(\s*)<a href="((?:\.\.\/)+|)univers\/index\.html" class="nav-link">Univers<\/a>$/gm;
const rxUniversCurrent =
  /^(\s*)<a href="index\.html" class="nav-link" style="font-size:14px;color:var\(--accent-teal\);">Univers<\/a>$/gm;
const rxUniversDrawerTeal =
  /^(\s*)<a href="index\.html" style="color:var\(--accent-teal\);">Univers<\/a>$/gm;

function patch(content, filePath) {
  let out = content;
  let n = 0;

  out = out.replace(rxStandard, (full, indent, prefix) => {
    if (full.includes('auralis/index.html')) return full;
    n++;
    return `${indent}<a href="${prefix}auralis/index.html" class="nav-link" style="font-size:14px;opacity:0.8;">Auralis</a>\n${full}`;
  });

  out = out.replace(rxDrawerPlain, (full, indent, prefix) => {
    n++;
    return `${indent}<a href="${prefix}auralis/index.html" class="nav-link">Auralis</a>\n${full}`;
  });

  out = out.replace(rxUniversCurrent, (full, indent) => {
    n++;
    return `${indent}<a href="../auralis/index.html" class="nav-link" style="font-size:14px;opacity:0.8;">Auralis</a>\n${full}`;
  });

  out = out.replace(rxUniversDrawerTeal, (full, indent) => {
    n++;
    return `${indent}<a href="../auralis/index.html">Auralis</a>\n${full}`;
  });

  if (n > 0) console.log(path.relative(root, filePath), n, 'insert(s)');
  return out;
}

const files = walkHtml(root);
let changed = 0;
for (const f of files) {
  const before = fs.readFileSync(f, 'utf8');
  const after = patch(before, f);
  if (after !== before) {
    fs.writeFileSync(f, after, 'utf8');
    changed++;
  }
}
console.log('Done. Files modified:', changed);
