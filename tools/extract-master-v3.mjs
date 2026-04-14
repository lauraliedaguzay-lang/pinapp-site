/**
 * Extrait CSS + JS du correctif master v3 (.ps1) sans PowerShell (here-strings).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = path.join(process.env.USERPROFILE || '', 'Downloads', 'pinapp-correctif-master-v3.ps1');
const ps1 = fs.readFileSync(src, 'utf8');

function skipNl(s, i) {
  let p = i;
  if (s[p] === '\r') p++;
  if (s[p] === '\n') p++;
  return p;
}

function extractAfterHereOpen(marker) {
  const idx = ps1.indexOf(marker);
  if (idx < 0) throw new Error('Marker introuvable: ' + marker);
  let p = idx + marker.length;
  p = skipNl(ps1, p);
  const end = ps1.indexOf("\n'@", p);
  if (end < 0) throw new Error('Fermeture @ manquante après ' + marker);
  return ps1.slice(p, end);
}

const css = extractAfterHereOpen("$css = @'");
const js = extractAfterHereOpen("$js = @'");

fs.mkdirSync(path.join(root, 'assets', 'css'), { recursive: true });
fs.mkdirSync(path.join(root, 'assets', 'js'), { recursive: true });
fs.writeFileSync(path.join(root, 'assets', 'css', 'pinapp-master-v3.css'), css, 'utf8');
fs.writeFileSync(path.join(root, 'assets', 'js', 'pinapp-master-v3.js'), js, 'utf8');

console.log('OK:', path.join(root, 'assets', 'css', 'pinapp-master-v3.css'));
console.log('OK:', path.join(root, 'assets', 'js', 'pinapp-master-v3.js'));
