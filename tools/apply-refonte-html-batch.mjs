/**
 * Thème dark par défaut + id scroll-bar sur les HTML (hors _site / node_modules).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['_site', 'node_modules', '.git']);

const PAT_A =
  /(\s*)var t = localStorage\.getItem\('pinapp-theme'\) \|\| localStorage\.getItem\('pinapp-mode'\);\s*\r?\n\s*var d = window\.matchMedia\('\(prefers-color-scheme:dark\)'\)\.matches;\s*\r?\n\s*var m = t === 'light' \|\| t === 'jour' \? 'jour' : t === 'dark' \|\| t === 'nuit' \? 'nuit' : d \? 'nuit' : 'jour';/g;

const REP_A = `$1var t = localStorage.getItem('pinapp-theme') || localStorage.getItem('pinapp-mode');
$1var m = t === 'light' || t === 'jour' ? 'jour' : t === 'dark' || t === 'nuit' ? 'nuit' : 'nuit';`;

const PAT_B =
  /(\s*)var s = localStorage\.getItem\('pinapp-theme'\);\s*\r?\n\s*var d = window\.matchMedia\('\(prefers-color-scheme:dark\)'\)\.matches;\s*\r?\n\s*var m = s \|\| \(d \? 'nuit' : 'jour'\);\s*\r?\n\s*var t = m === 'nuit' \? 'dark' : 'light';\s*\r?\n\s*document\.documentElement\.setAttribute\('data-mode', m\);\s*\r?\n\s*document\.documentElement\.setAttribute\('data-theme', t\);/g;

const REP_B = `$1var t0 = localStorage.getItem('pinapp-theme') || localStorage.getItem('pinapp-mode');
$1var m = t0 === 'light' || t0 === 'jour' ? 'jour' : t0 === 'dark' || t0 === 'nuit' ? 'nuit' : 'nuit';
$1document.documentElement.setAttribute('data-mode', m);
$1document.documentElement.setAttribute('data-theme', m === 'jour' ? 'light' : 'dark');`;

const PAT_C =
  /(\s*)var s = localStorage\.getItem\('pinapp-theme'\);\s*\r?\n\s*var d = window\.matchMedia\('\(prefers-color-scheme:dark\)'\)\.matches;\s*\r?\n\s*var m = s \|\| \(d \? 'nuit' : 'jour'\);\s*\r?\n\s*document\.documentElement\.setAttribute\('data-mode', m\);\s*\r?\n\s*document\.documentElement\.setAttribute\('data-theme', m === 'jour' \? 'light' : 'dark'\);/g;

const REP_C = REP_B;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

let n = 0;
for (const f of walk(ROOT)) {
  let text = fs.readFileSync(f, 'utf8');
  const orig = text;
  text = text.replace(PAT_A, REP_A);
  text = text.replace(PAT_B, REP_B);
  text = text.replace(PAT_C, REP_C);
  text = text.replace(/id="scrollProgress"/g, 'id="scroll-bar"');
  if (text !== orig) {
    fs.writeFileSync(f, text, 'utf8');
    n++;
    console.log('updated', path.relative(ROOT, f));
  }
}
console.log('files updated:', n);
